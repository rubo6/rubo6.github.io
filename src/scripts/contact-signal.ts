/**
 * "Send a signal" contact dialog (ContactSignal.astro, ADR-0012).
 *
 *  - Opens a native <dialog> (top layer, focus trapped by the browser, Escape closes) with an
 *    opening animation and a mirrored closing one (`.is-open` / `.is-leaving`).
 *  - The moment the dialog opens, a Web Worker starts solving the proof-of-work challenge from
 *    /api/contact/challenge, so by the time the visitor finishes typing the token is ready.
 *  - Submit posts multipart/form-data to /api/contact (same origin) and swaps the form for the
 *    "signal received" state. Every error maps to a translated, generic message.
 *  - No third-party code, no innerHTML: nodes are built with DOM APIs; strings come from a JSON island.
 */
import { solve } from '@/lib/pow';
import { onReady } from './lifecycle';
import { readJson } from './sky';

interface Strings {
  verifying: string;
  sending: string;
  invalid: string;
  files: string;
  rate: string;
  challenge: string;
  network: string;
  send: string;
  doneBody: string;
  remove: string;
}

interface Challenge {
  v: 1;
  salt: string;
  iat: number;
  bits: number;
  sig: string;
}

const LIMITS = { files: 3, fileBytes: 4 * 1024 * 1024, totalBytes: 6 * 1024 * 1024 } as const;
const EXT = /\.(pdf|docx|png|jpe?g|txt)$/i;
const CHALLENGE_MAX_AGE_S = 13 * 60; // the Worker accepts 15 min; refresh before that
// The Worker refuses solutions younger than 3 s (a script's pace, not a person's). With whole-second
// timestamps on both sides, 4 s measured from the challenge's arrival guarantees acceptance.
const MIN_AGE_MS = 4000;
const LEAVE_MS = 340;

const reduced = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = (): boolean => window.matchMedia('(pointer: coarse)').matches;

function formatBytes(n: number): string {
  return n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(n / 1024)} KB`;
}

function solveInWorker(
  salt: string,
  bits: number,
  onProgress: (hashes: number) => void,
): Promise<number> {
  return new Promise((resolve, reject) => {
    let worker: Worker;
    try {
      worker = new Worker(new URL('./pow.worker.ts', import.meta.url), { type: 'module' });
    } catch {
      solve(salt, bits, { onProgress }).then(resolve, reject);
      return;
    }
    const fallback = () => {
      worker.terminate();
      solve(salt, bits, { onProgress }).then(resolve, reject);
    };
    worker.addEventListener('message', (e: MessageEvent) => {
      const data = e.data as { type: string; hashes?: number; nonce?: number };
      if (data.type === 'progress') onProgress(data.hashes ?? 0);
      else if (data.type === 'done') {
        worker.terminate();
        resolve(data.nonce ?? 0);
      } else fallback();
    });
    worker.addEventListener('error', fallback);
    worker.postMessage({ salt, bits });
  });
}

function mount(dialog: HTMLDialogElement): void {
  const strings = readJson<Strings>('signal-strings');
  const glass = dialog.querySelector<HTMLElement>('.glass');
  const form = dialog.querySelector<HTMLFormElement>('[data-signal-form]');
  const done = dialog.querySelector<HTMLElement>('[data-signal-done]');
  const doneBody = dialog.querySelector<HTMLElement>('[data-signal-done-body]');
  const status = dialog.querySelector<HTMLElement>('[data-signal-status]');
  const submit = dialog.querySelector<HTMLButtonElement>('[data-signal-submit]');
  const fileInput = dialog.querySelector<HTMLInputElement>('[data-signal-file-input]');
  const fileList = dialog.querySelector<HTMLUListElement>('[data-signal-files]');
  const message = dialog.querySelector<HTMLTextAreaElement>('textarea[name="message"]');
  const counter = dialog.querySelector<HTMLElement>('[data-signal-count]');
  if (!strings || !glass || !form || !done || !status || !submit || !fileInput || !fileList) return;

  let opener: HTMLElement | null = null;
  let closing = false;
  let selected: File[] = [];
  let progress = 0;
  let powBits = 17;
  interface PowEntry {
    promise: Promise<string>;
    /** Client clock, seconds, when the challenge was requested (for the 13-minute refresh). */
    iat: number;
    /** Client clock, ms, when the challenge arrived (the Worker's own timestamp is not later). */
    issuedMs: number;
  }
  let pow: PowEntry | null = null;

  // ---- proof of work: start early, verify late -------------------------------------------------
  const startPow = (): PowEntry => {
    const entry: PowEntry = {
      promise: Promise.resolve(''),
      iat: Math.floor(Date.now() / 1000),
      issuedMs: Date.now(),
    };
    entry.promise = (async () => {
      const res = await fetch('/api/contact/challenge', { credentials: 'omit' });
      if (!res.ok) throw new Error('challenge');
      const body = (await res.json()) as { ok: boolean; challenge: Challenge };
      entry.issuedMs = Date.now();
      const c = body.challenge;
      powBits = c.bits;
      const nonce = await solveInWorker(c.salt, c.bits, (h) => (progress = h));
      return JSON.stringify({ ...c, nonce });
    })();
    entry.promise.catch(() => {
      /* handled at submit time: a failed challenge is re-fetched */
    });
    pow = entry;
    return entry;
  };
  const getPow = async (): Promise<string> => {
    const now = Math.floor(Date.now() / 1000);
    if (!pow || now - pow.iat > CHALLENGE_MAX_AGE_S) startPow();
    let entry = pow!;
    let token: string;
    try {
      token = await entry.promise;
    } catch {
      entry = startPow();
      token = await entry.promise;
    }
    const age = Date.now() - entry.issuedMs;
    if (age < MIN_AGE_MS) await new Promise<void>((r) => window.setTimeout(r, MIN_AGE_MS - age));
    return token;
  };

  // ---- status line ------------------------------------------------------------------------------
  const setStatus = (text: string, isError = false) => {
    status.textContent = text;
    status.classList.toggle('is-error', isError);
  };
  const setBusy = (busy: boolean) => {
    submit.disabled = busy;
    form.setAttribute('aria-busy', String(busy));
  };

  // ---- attachments ------------------------------------------------------------------------------
  const filesValid = (): boolean =>
    selected.length <= LIMITS.files &&
    selected.every((f) => f.size <= LIMITS.fileBytes && EXT.test(f.name)) &&
    selected.reduce((a, f) => a + f.size, 0) <= LIMITS.totalBytes;

  const renderFiles = () => {
    fileList.replaceChildren();
    for (const file of selected) {
      const li = document.createElement('li');
      const name = document.createElement('span');
      name.className = 'file-name';
      name.textContent = file.name;
      const size = document.createElement('span');
      size.className = 'file-size mono';
      size.textContent = formatBytes(file.size);
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'file-remove';
      remove.textContent = strings.remove;
      remove.setAttribute('aria-label', `${strings.remove}: ${file.name}`);
      remove.addEventListener('click', () => {
        selected = selected.filter((f) => f !== file);
        renderFiles();
        setStatus(filesValid() ? '' : strings.files, !filesValid());
      });
      li.append(name, size, remove);
      fileList.append(li);
    }
    fileList.hidden = selected.length === 0;
  };
  fileInput.addEventListener('change', () => {
    selected = [...selected, ...Array.from(fileInput.files ?? [])].slice(0, LIMITS.files + 1);
    fileInput.value = '';
    renderFiles();
    setStatus(filesValid() ? '' : strings.files, !filesValid());
  });

  // ---- character counter ------------------------------------------------------------------------
  if (message && counter) {
    const max = message.maxLength > 0 ? message.maxLength : 5000;
    const update = () => (counter.textContent = `${message.value.length} / ${max}`);
    message.addEventListener('input', update);
    update();
  }

  // ---- open / close -----------------------------------------------------------------------------
  const open = (from: HTMLElement | null) => {
    if (dialog.open) return;
    opener = from;
    closing = false;
    dialog.classList.remove('is-leaving');
    dialog.showModal();
    dialog.classList.add('is-open');
    document.documentElement.classList.add('signal-open');
    if (!pow) startPow();
    // Phones: focusing an input would pop the keyboard over the message; let the visitor tap.
    if (!coarse()) form.querySelector<HTMLInputElement>('input[name="name"]')?.focus();
  };
  const finishClose = () => {
    dialog.classList.remove('is-open', 'is-leaving');
    dialog.close();
    closing = false;
  };
  const close = () => {
    if (!dialog.open || closing) return;
    closing = true;
    if (reduced()) {
      finishClose();
      return;
    }
    dialog.classList.add('is-leaving');
    let finished = false;
    const end = () => {
      if (finished) return;
      finished = true;
      finishClose();
    };
    glass.addEventListener('animationend', end, { once: true });
    window.setTimeout(end, LEAVE_MS + 60);
  };
  dialog.addEventListener('cancel', (e) => {
    e.preventDefault(); // Escape: animate instead of vanishing
    close();
  });
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close(); // the dialog box itself has no padding: this is the backdrop
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('signal-open');
    form.classList.remove('was-submitted');
    if (!done.hidden) {
      done.hidden = true;
      form.hidden = false;
      form.reset();
      selected = [];
      renderFiles();
      setStatus('');
    }
    opener?.focus();
  });
  dialog
    .querySelectorAll<HTMLElement>('[data-signal-close]')
    .forEach((b) => b.addEventListener('click', close));
  document.querySelectorAll<HTMLElement>('[data-signal-open]:not([data-bound])').forEach((b) => {
    b.dataset.bound = '1';
    b.addEventListener('click', () => open(b));
  });

  // ---- submit -----------------------------------------------------------------------------------
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    form.classList.add('was-submitted');
    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus(strings.invalid, true);
      return;
    }
    if (!filesValid()) {
      setStatus(strings.files, true);
      return;
    }
    setBusy(true);
    setStatus(strings.verifying);
    const expected = 2 ** powBits;
    const ticker = window.setInterval(() => {
      const pct = Math.min(95, Math.round((progress / expected) * 100));
      setStatus(`${strings.verifying} ${pct} %`);
    }, 400);
    try {
      const token = await getPow();
      window.clearInterval(ticker);
      setStatus(strings.sending);
      const data = new FormData();
      for (const key of ['name', 'email', 'subject', 'message', 'website'] as const) {
        const field = form.elements.namedItem(key) as HTMLInputElement | HTMLTextAreaElement | null;
        data.set(key, field?.value ?? '');
      }
      for (const file of selected) data.append('files', file, file.name);
      data.set('pow', token);
      data.set('locale', document.documentElement.lang);

      const res = await fetch('/api/contact', { method: 'POST', body: data, credentials: 'omit' });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; code?: string };
      if (res.ok && body.ok) {
        const email = (form.elements.namedItem('email') as HTMLInputElement | null)?.value ?? '';
        if (doneBody) doneBody.textContent = strings.doneBody.replace('{email}', email);
        form.hidden = true;
        done.hidden = false;
        setStatus('');
        pow = null;
        done.querySelector<HTMLElement>('[data-signal-close]')?.focus();
        return;
      }
      if (res.status === 429) setStatus(strings.rate, true);
      else if (body.code === 'files') setStatus(strings.files, true);
      else if (body.code === 'invalid') setStatus(strings.invalid, true);
      else if (body.code === 'challenge') {
        pow = null;
        startPow();
        setStatus(strings.challenge, true);
      } else setStatus(strings.send, true);
    } catch {
      window.clearInterval(ticker);
      setStatus(strings.network, true);
    } finally {
      setBusy(false);
    }
  });
}

function init(): void {
  document
    .querySelectorAll<HTMLDialogElement>('dialog[data-signal]:not([data-bound])')
    .forEach((d) => {
      d.dataset.bound = '1';
      mount(d);
    });
}

onReady(init);
