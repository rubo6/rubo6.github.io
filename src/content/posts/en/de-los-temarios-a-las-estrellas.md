---
title: 'From syllabi to stars: how I mapped my skills to their sources'
key: de-los-temarios-a-las-estrellas
locale: en
date: '2026-09-05'
summary: 'Every star in the skills section now carries a provenance: the course, job or project behind it. How I rebuilt the official programmes of Bátiz and ITAM, and what I decided not to claim.'
area: computing
tags: ['skills', 'syllabi', 'ITAM', 'Bátiz', 'transparency', 'this site']
featured: true
---

A skills list is easy to write and hard to believe. "Python, SQL, machine learning" says nothing about where or how much. I wanted the skills constellation on this site to be verifiable: hover a star and see the course, job or project that holds it up.

## The official programmes exist, you just have to find them

The programme I studied at Bátiz (Técnico en Programación, Plan 2008) is still published by CECyT 9 itself: twenty-one official syllabi for the professional track, with competencies, units and hours. Things I vaguely remembered as "we did testing" are there by name: white-box and black-box test-case design, **JUnit**, regression and stress testing; the full UML diagram set; XP, Scrum and the Crystal family; SOAP, WSDL and UDDI; symmetric and public-key cryptography, SSL/TLS, Kerberos, IPsec; PSP, CMMI, COCOMO.

At ITAM the source is the Plan B bulletin from the Registrar plus the syllabi each department publishes on its own: Statistics (all in R), Mathematics, Computer Science (some dated 2009, with Java as the language), General Studies. Economics and Languages publish nothing, so there I only claim the course name.

## What I decided to claim, and what not

- A skill enters the constellation only if a passed course, a job or a public project backs it. The tooltip says which.
- Levels for academic skills are deliberately conservative: "productive" or "strong", never "expert". Expert is reserved for what I do every day at work.
- If the official programme does not name a language, I do not invent one. The Bátiz object-oriented programming syllabus speaks of "programming tools"; Java only appears in the bibliography. I mark it as inferred.
- Courses in progress are labelled in progress.

## Why this matters to a data person

It is the same principle I apply to a warehouse table: every column should be able to explain where it came from. Data without lineage is an opinion. So is a skill without a source.

## What I take with me

Documenting provenance changes what you dare to say, and that is a good thing. And curricula, read years later, tell a more coherent story than memory does: testing, security and quality were there since high school; statistics, parallel computing and causality came later, and all three ended up in the same place: building data systems that can be verified.
