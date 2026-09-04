---
title: 'WhisperFlow: why I built voice dictation that never leaves my machine'
key: whisperflow-dictado-sin-nube
locale: en
date: '2026-09-04'
summary: 'I wanted the convenience of cloud dictation without giving away my voice. WhisperFlow is the result: offline push-to-talk for Windows with two swappable speech engines, a native orb overlay and a threat model written before the code.'
area: computing
semester: 'Summer 2026'
courses: ['Personal project']
tags: ['WhisperFlow', 'speech recognition', 'ONNX', 'privacy', 'Win32', 'Python', 'projects']
featured: true
---

I dictate a lot. Messages, notes, the answers this page was built from. Commercial dictation tools are excellent and carry a price that is not in the subscription: your voice travels to a server. I wanted the same without the trip, and since it did not exist the way I wanted it, I built it.

## What it is

Hold a key, speak, release, and the text appears in the application in front of you. Everything happens on the laptop: audio capture at 16 kHz, on-device speech recognition, a small post-processing step (personal dictionary, snippets, spacing and capitalization) and text injection through the clipboard or synthetic keystrokes. Zero network at runtime, no account, no telemetry. Audio and text live in memory and vanish when the dictation ends.

## The technical decisions

**Two swappable engines.** The default is NVIDIA's Parakeet TDT 0.6B in quantized ONNX format, which runs at about twice real time on a laptop CPU; the automatic fallback is faster-whisper. I measured both with my own voice before deciding; the benchmark, not the model's fame, chose.

**A native orb.** The visual indicator is a layered Win32 window with per-pixel transparency, rendered with NumPy, that reacts to voice level and never steals focus. I discarded a WebView because it does not give real transparency and adds attack surface.

**A frozen interpreter.** The bundle ships its own hash-verified Python 3.12 so it does not depend on whatever Python the machine has. Models and binaries are SHA-256 verified at start-up.

**Threat model first.** Before the first line I wrote down what must never happen: audio persisted, dictated text logged, dictated text executed as a command. Those invariants live in the configuration schema and lint watches over them. The Bátiz's test-engineering course and ITAM's ethics seminar are both on that list.

## What I take with me

That privacy is an architecture decision, not a settings checkbox. That measuring beats assuming, also when choosing a speech model. And that building your own tool teaches you more about the problem than using the best one on the market. Code, documentation and models are published on my GitHub.
