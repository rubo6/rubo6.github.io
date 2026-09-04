---
title: 'ECOBOX AI: coordinating a computer-vision project with students'
key: ecobox-ai-coordinar-investigacion
locale: en
date: '2025-12-10'
summary: 'At DataLab ITAM I led the technical execution of ECOBOX AI, a computer-vision system for classifying waste. The technical part was as expected; the hard part was coordinating research with people who have exams.'
area: datascience
semester: '2025'
courses: ['DataLab ITAM · Research Manager']
tags:
  [
    'computer vision',
    'image classification',
    'DataLab',
    'coordination',
    'documentation',
    'sustainability',
    'projects',
  ]
featured: true
---

DataLab is ITAM's student data-science community. During 2025 I was its Research Manager, and the main project in my charge was **ECOBOX AI**: a computer-vision system that classifies waste into recycling categories from an image, meant to be installed in a smart bin.

## The technical problem

Image classification with imbalanced classes and photos taken in real conditions: variable lighting, dirty or deformed objects, unhelpful backgrounds. The pipeline is the classic one of modern vision: a labelled dataset, data augmentation, a pretrained convolutional model fine-tuned to our classes, and an evaluation that looks at the full confusion matrix rather than accuracy alone, because confusing glass with plastic does not cost the same as confusing cardboard with paper.

The technical part was as expected. What I did not expect was everything else.

## Coordinating research with students

A student team has a property no professional team has: everyone disappears during exam week, at the same time. Coordinating the project meant accepting that reality and designing around it.

- **Planning in short milestones**, aligned to the academic calendar, instead of an annual plan that breaks in October.
- **Documentation as a product**: every technical decision, every experiment and every dataset with its card, somewhere a new person could join and contribute in their first week. In a team with semester turnover, documentation is not an extra: it is the only thing that survives.
- **Small, verifiable tasks**, so someone with three free hours could close something complete.
- **Meetings that end in decisions**, and decisions written down.

## What I take with me

That coordinating research is a different skill from doing research, and the two need each other. That documentation is the infrastructure of continuity. And that working on a problem with environmental impact, even at the scale of one bin, gives the team a reason to come back after exams.
