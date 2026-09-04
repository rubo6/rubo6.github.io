---
name: web-accessibility
description: Implement web accessibility (a11y) standards following WCAG 2.1 guidelines. Use when building UI components, running accessibility audits, implementing forms, modals, navigation with accessible behavior.
tags: [accessibility, a11y, WCAG, ARIA, semantic-HTML, screen-reader]
---

# Web Accessibility Skill

## When to use

- Building new UI components
- Running accessibility audits
- Implementing forms, modals, navigation
- Ensuring WCAG AA conformance

## Core Rules (WCAG 2.1 AA)

### Semantic HTML

- Use semantic elements: nav, main, article, section, aside, header, footer
- Headings in logical order (h1 > h2 > h3), never skip levels
- Use button for actions, a for navigation
- Lists for groups of items (ul/ol/li)

### ARIA

- Prefer semantic HTML over ARIA whenever possible
- aria-label for elements without visible text
- aria-expanded for toggles (dropdowns, accordions)
- aria-live="polite" for dynamic content updates
- aria-hidden="true" for decorative elements
- role attributes only when semantic HTML insufficient

### Keyboard Navigation

- All interactive elements focusable with Tab
- Enter/Space activates buttons and links
- Escape closes modals and dropdowns
- Arrow keys navigate within components (tabs, menus)
- Visible focus indicator on ALL focusable elements (min 2px outline)
- No keyboard traps (user can always Tab away)

### Color & Contrast

- Text contrast ratio min 4.5:1 (AA) for normal text
- Large text (18px+ bold or 24px+) min 3:1
- Non-text elements min 3:1 contrast
- Never use color alone to convey information
- Test with grayscale filter

### Forms

- Every input has associated label (for/id or aria-label)
- Error messages linked to inputs with aria-describedby
- Required fields marked with aria-required="true"
- Group related inputs with fieldset/legend
- Autocomplete attributes where applicable

### Images & Media

- All img elements have alt text (empty alt="" for decorative)
- Complex images have long descriptions
- Videos have captions/subtitles
- Audio has transcripts

### Motion & Animation

- Respect prefers-reduced-motion media query
- No auto-playing animations longer than 5 seconds
- Provide pause/stop controls for moving content
- Avoid flashing content (max 3 flashes/second)

### Responsive & Touch

- Touch targets minimum 44x44px
- Content readable at 200% zoom
- No horizontal scrolling at 320px viewport
- Text resizable without loss of functionality

## Testing Checklist

- [ ] Tab through entire page - logical order?
- [ ] All interactive elements have focus styles?
- [ ] Screen reader announces content correctly?
- [ ] Color contrast passes 4.5:1?
- [ ] All images have appropriate alt text?
- [ ] Forms have proper labels and error handling?
- [ ] Works at 200% zoom?
- [ ] prefers-reduced-motion respected?
- [ ] Touch targets 44x44px minimum?

## Tools

- axe-core (automated testing)
- Lighthouse (Chrome DevTools audit)
- WAVE (browser extension)
- NVDA / VoiceOver (screen reader testing)
- Colour Contrast Analyser
