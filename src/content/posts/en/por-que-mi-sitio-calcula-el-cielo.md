---
title: 'Why this site computes the real sky over Mexico City'
key: por-que-mi-sitio-calcula-el-cielo
locale: en
date: '2026-09-03'
summary: 'The sky on the home page is not a decorative animation: it is the sky above Mexico City at the moment you open the page, computed with sidereal time and a change of coordinates. Here is the mathematics, and why the degree made it easy.'
area: astronomy
tags: ['astronomy', 'sidereal time', 'coordinates', 'spherical trigonometry', 'TypeScript', 'tests']
featured: true
---

Astronomy is my main hobby, and when I redesigned this site I wanted the sky on the home page to be true. Not a texture of random stars, but the stars that are above Mexico City right now. It turned out to be a second-term exercise disguised as a project.

## The problem

A star catalogue gives you each star in equatorial coordinates: right ascension and declination, which are like longitude and latitude but fixed to the sky, not to the Earth. To draw them on a screen I need horizontal coordinates: altitude above the horizon and azimuth, which depend on where you are and what time it is. The Earth rotates, so the conversion changes every second.

## Step one: the sky's clock

The time that matters is not civil time but **sidereal time**: the angle the Earth has rotated relative to the stars. It is computed from the Julian date with a polynomial in Julian centuries since the year 2000 and corrected with the observer's longitude. The formula is from Jean Meeus, _Astronomical Algorithms_, and I wrote it in TypeScript in under twenty lines.

## Step two: the change of coordinates

From local sidereal time and right ascension you get each star's hour angle. Then it is spherical trigonometry: the sine of the altitude is a sum of products of sines and cosines of declination, latitude and hour angle. The azimuth comes from a two-argument arctangent. It is literally Vector Geometry and Calculus III: rotations and changes of basis.

## Step three: projecting to the screen

I use a **stereographic projection centred on the zenith**: the sky is a dome and I flatten it like a polar map, north up and east on the left, which is how it looks when you look up. Each star's radius depends on its magnitude on a logarithmic scale, and the twinkle is generated with a deterministic hash of the star's name, not random numbers, so the same star always twinkles the same way.

## Step four: proving it is right

This is where the degree weighed in. I did not want "it looks fine"; I wanted proofs. The library has seventeen unit tests that compare against worked examples from Meeus's book, against the position of Venus from Washington one afternoon in 1987, and against known new and full moons. If I change a formula and get it wrong, the build fails before it reaches the site.

## Why it matters

Because it is the same discipline I apply to a data pipeline: a formula, an explicit assumption, a test that checks it. The sky on the home page is my way of saying that astronomy is not only what I look at through the telescope; it is also how I like to work.
