---
title: WhisperFlow — offline voice dictation for Windows
key: whisperflow
locale: en
nebula: personal
summary: 'Local, offline, private push-to-talk dictation for Windows 11 (ES/EN): global hotkey, on-device speech recognition, text injected into the focused app.'
role: Author
period: { start: '2026-07-15', end: null }
stack: [Python 3.12, ONNX Runtime, Parakeet TDT, faster-whisper, Win32 API (ctypes), pytest, ruff]
highlights:
  - 'Zero network at runtime — no account, no telemetry, audio and text live only in RAM'
  - 'Two swappable speech engines with automatic fallback; the default runs ~2× faster than real time on a laptop CPU'
  - 'Native Win32 layered overlay ("orb") with per-pixel transparency rendered with NumPy'
  - 'Push-to-talk and toggle hotkey, hands-free mode with local voice-activity detection'
  - 'Personal dictionary, snippets, auto-spacing and capitalisation aware of the text before the cursor'
  - 'Portable bundle with frozen interpreter, SBOM, licence inventory and SHA-256 integrity check at start-up'
  - 'Threat model documented; dictated text is never executed as a command, enforced by lint'
repo: rubo6/whisperflow
featured: true
order: 5
---

I wanted the feel of cloud dictation tools without sending a single byte of my voice anywhere. WhisperFlow is
the result: hold a key, speak, release, and the text lands in the app you were using. Everything happens on the
machine: capture at 16 kHz, on-device speech recognition, a small post-processing pipeline, and injection through
the clipboard or synthetic keystrokes with a safe preview fallback.

The engineering I am proudest of is the boring part: a written threat model, invariants forced by the config
schema (audio is never persisted, dictated text is never logged), a frozen Python runtime so it does not depend on
whatever Python the host has, integrity checks on models and binaries, and a test suite around the state machine
that coordinates the hotkey thread, the audio callback and the per-dictation worker.

I dictated the answers that shaped this website with it.
