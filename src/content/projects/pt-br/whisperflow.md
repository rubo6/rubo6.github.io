---
title: WhisperFlow — ditado por voz offline para Windows
key: whisperflow
locale: pt-br
nebula: personal
summary: 'Ditado push-to-talk local, offline e privado para Windows 11 (ES/EN): atalho global, reconhecimento de voz no dispositivo e texto inserido no app em foco.'
role: Autor
period: { start: '2026-07-15', end: null }
stack: [Python 3.12, ONNX Runtime, Parakeet TDT, faster-whisper, Win32 API (ctypes), pytest, ruff]
highlights:
  - 'Zero rede em runtime: sem conta, sem telemetria; áudio e texto vivem só na RAM'
  - 'Dois motores de voz intercambiáveis com fallback automático; o padrão roda ~2× mais rápido que o tempo real na CPU de um laptop'
  - 'Overlay nativo Win32 em camadas ("orbe") com transparência por pixel renderizado com NumPy'
  - 'Atalho push-to-talk e toggle, modo mãos livres com detecção local de atividade de voz'
  - 'Dicionário pessoal, snippets, auto-espaçamento e maiúsculas que leem o texto antes do cursor'
  - 'Pacote portátil com interpretador congelado, SBOM, inventário de licenças e verificação SHA-256 na inicialização'
  - 'Threat model documentado; o texto ditado nunca é executado como comando, e o lint garante isso'
repo: rubo6/whisperflow
featured: true
order: 5
---

Eu queria a experiência das ferramentas de ditado na nuvem sem enviar um único byte da minha voz para lugar
nenhum. O WhisperFlow é o resultado: você segura uma tecla, fala, solta, e o texto aparece no app que estava
usando. Tudo acontece na máquina: captura a 16 kHz, reconhecimento de voz local, um pequeno pipeline de
pós-processamento e injeção via área de transferência ou teclas sintéticas, com uma pré-visualização segura como
fallback.

A parte em que mais capricho coloquei é o encanamento: um threat model escrito, invariantes impostas pelo esquema de
configuração (o áudio nunca é persistido, o texto ditado nunca é registrado em log), um runtime Python congelado
para não depender do Python da máquina, verificação de integridade de modelos e binários, e uma suíte de testes em
torno da máquina de estados que coordena a thread do atalho, o callback de áudio e o worker por ditado.

Foi com esta ferramenta que ditei as respostas que deram forma a este site.
