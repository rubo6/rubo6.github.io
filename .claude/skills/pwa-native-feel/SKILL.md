---
name: pwa-native-feel
# Adapted for rubo6.dev from a team skill: examples renamed to this project. The site is static Astro; apply the CSS/touch/safe-area/perf sections, the service-worker section only if offline support is ever added.
description: Make vanilla web apps (HTML/CSS/JS) look and feel native on mobile browsers without any framework. Use when implementing PWA features, manifest.json, service workers, mobile-first CSS, touch gestures, safe-area handling, iOS Safari quirks, Android Chrome optimizations, offline caching, mobile performance, or platform-specific adaptations. Also activate when the user mentions app feel, native feel, mobile optimization, installable web app, home screen, splash screen, standalone mode, swipe gesture, pull-to-refresh, or wants their web app to behave like a native app — even if they don't say "PWA" explicitly.
---

# PWA Native Feel — Make Vanilla Web Apps Feel Like Native Apps

This skill covers everything needed to make a plain HTML/CSS/JS web application feel indistinguishable from a native app when installed on iOS or Android. No React Native, no Expo, no Capacitor, no framework — just web standards and careful attention to platform behavior.

The core insight: native feel comes from three things — no browser chrome (standalone mode), native-matching motion and touch response, and respecting platform conventions (safe areas, status bar, gestures). Get these right and users forget they're in a browser.

---

## 1. PWA Foundation — manifest.json

The web app manifest tells the OS how to install and display your app. Every field matters for native feel.

### Complete manifest.json

```json
{
  "name": "Rubo · Observatory",
  "short_name": "Rubo",
  "description": "Personal observatory of Eduardo Rubén Bernal Puente",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "any",
  "theme_color": "#0b1026",
  "background_color": "#0b1026",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    {
      "src": "/icons/icon-maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/home.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ],
  "categories": ["portfolio", "education"],
  "lang": "en",
  "dir": "ltr"
}
```

**Key decisions:**

- `display: standalone` removes browser UI — this is non-negotiable for native feel
- `theme_color` must match your app's header/status bar color
- `background_color` is shown during the splash screen loading phase — match your app's background to avoid a flash
- `scope` limits navigation — pages outside scope open in the browser, which breaks the illusion
- Include both regular and `maskable` icons — Android adaptive icons crop to circles/squircles, and without a maskable icon your logo gets awkwardly clipped
- `orientation: any` unless your app truly only works in portrait

### HTML Head Tags

```html
<!-- PWA manifest -->
<link rel="manifest" href="/manifest.json" />

<!-- iOS doesn't fully support manifest, so these meta tags fill the gaps -->
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="Rubo" />

<!-- Theme color for Android Chrome address bar -->
<meta name="theme-color" content="#1a1a2e" media="(prefers-color-scheme: dark)" />
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />

<!-- iOS icons (Safari ignores manifest icons) -->
<link rel="apple-touch-icon" href="/icons/icon-180.png" />

<!-- Viewport — critical for mobile -->
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

<!-- Disable phone number detection (iOS auto-links numbers) -->
<meta name="format-detection" content="telephone=no" />
```

**Why `viewport-fit=cover`:** This tells the browser your app handles safe areas (notch, home indicator) itself. Without it, iOS adds white padding around your app in standalone mode — instantly breaking the native illusion.

**Why `black-translucent` status bar:** It lets your app's background color extend behind the status bar, creating a seamless full-screen look. The alternative (`default` or `black`) creates a visible status bar boundary.

### iOS Splash Screens

iOS requires specific `apple-touch-startup-image` links for splash screens. Without them, users see a white screen during app launch.

```html
<!-- iPhone 15 Pro Max (430x932 @3x) -->
<link
  rel="apple-touch-startup-image"
  href="/splash/splash-1290x2796.png"
  media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)"
/>

<!-- iPhone 14/15 (390x844 @3x) -->
<link
  rel="apple-touch-startup-image"
  href="/splash/splash-1170x2532.png"
  media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)"
/>

<!-- iPhone SE (375x667 @2x) -->
<link
  rel="apple-touch-startup-image"
  href="/splash/splash-750x1334.png"
  media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
/>
```

Generate splash images programmatically: centered logo on `background_color` at the exact pixel dimensions. A build script with sharp or canvas is ideal — manually creating 10+ splash variants is error-prone.

---

## 2. Service Worker — Offline & Cache

A service worker is what makes your app work offline and load instantly on repeat visits. The strategy depends on your content type.

### Registration

```javascript
// Register at the end of your main JS, not in <head>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .catch((err) => console.warn('SW registration failed:', err));
  });
}
```

Register on `load`, not `DOMContentLoaded` — service worker installation fetches cache assets, and you don't want that competing with the page's initial resource loading.

### Service Worker Strategy

Use **cache-first** for static assets (HTML, CSS, JS, images, fonts) and **network-first** for data (CSV files, API responses). This gives instant loads for the app shell while keeping data fresh.

```javascript
const CACHE_NAME = 'observatory-v1';
const STATIC_ASSETS = [
  '/',
  '/dashboard.html',
  '/css/variables.css',
  '/css/base.css',
  '/css/components.css',
  '/js/utils.js',
  '/js/data-loader.js',
  '/icons/icon-192.png',
];

// Install: pre-cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

// Fetch: cache-first for static, network-first for data
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Data files: network-first
  if (url.pathname.startsWith('/data/') || url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request)),
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
```

### Cache Versioning

When you deploy updates, increment `CACHE_NAME` (e.g., `observatory-v2`). The activate handler cleans old caches automatically. For seamless updates, notify users:

```javascript
// In your main JS — detect when a new SW is waiting
navigator.serviceWorker?.addEventListener('controllerchange', () => {
  // New version active — optionally show a "Updated! Tap to reload" toast
});
```

---

## 3. CSS Native Feel

These CSS properties eliminate the subtle visual cues that scream "this is a website" on mobile.

### Safe Areas (Notch & Home Indicator)

```css
/* Apply safe areas to your app shell, not to body */
.main-content {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* Fixed bottom nav needs safe area too */
.bottom-nav {
  padding-bottom: env(safe-area-inset-bottom);
  /* The nav's own padding PLUS the safe area */
  padding-bottom: calc(0.5rem + env(safe-area-inset-bottom));
}

/* Fixed header behind status bar */
.app-header {
  padding-top: calc(0.75rem + env(safe-area-inset-top));
}
```

`env(safe-area-inset-*)` only works when `viewport-fit=cover` is set in the viewport meta tag. Without it, these values are always 0.

### Removing Web Feel

```css
/* Remove tap highlight — web's blue flash doesn't exist in native apps */
* {
  -webkit-tap-highlight-color: transparent;
}

/* Prevent text selection on UI elements (not on content) */
.nav,
.button,
.tab-bar,
.card-header {
  -webkit-user-select: none;
  user-select: none;
}

/* Prevent iOS callout (the "Copy/Look Up" popup) on interactive elements */
.interactive-element {
  -webkit-touch-callout: none;
}

/* Contain overscroll — prevents the "rubber band" bounce revealing the page behind */
html,
body {
  overscroll-behavior: none;
}

/* For scrollable sub-containers, contain within them */
.scroll-container {
  overscroll-behavior: contain;
  overflow-y: auto;
}

/* Momentum scrolling on iOS (older versions need this explicitly) */
.scroll-container {
  -webkit-overflow-scrolling: touch;
}

/* Prevent iOS from zooming on input focus — font-size must be >= 16px */
input,
select,
textarea {
  font-size: 16px;
}
```

### Sticky Headers (Native App Bar Feel)

```css
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  /* Glassmorphism for depth — native apps often blur content behind headers */
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  background: rgba(var(--bg-rgb), 0.8);
}
```

### Native-Style Scrolling

```css
/* Snap scrolling for tab-like horizontal navigation */
.tab-scroll {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
}
.tab-scroll::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}
.tab-scroll > .tab-item {
  scroll-snap-align: start;
  flex-shrink: 0;
}

/* Vertical list with pull-to-refresh space */
.list-container {
  overflow-y: auto;
  overscroll-behavior-y: contain;
  scroll-behavior: smooth;
}
```

### Glassmorphism (Real Native Blur)

```css
.glass-panel {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-lg, 16px);
}

/* Dark theme variant */
[data-theme='dark'] .glass-panel {
  background: rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.08);
}
```

---

## 4. Touch & Gestures

Native apps respond to touch differently than websites. These patterns close the gap.

### Touch Feedback (Haptic-Like)

```css
/* Scale-down on press — mimics iOS button press behavior */
.touchable {
  transition:
    transform 0.1s ease,
    opacity 0.1s ease;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.touchable:active {
  transform: scale(0.97);
  opacity: 0.7;
}

/* For cards and larger elements — subtler feedback */
.card.touchable:active {
  transform: scale(0.98);
  opacity: 0.85;
}
```

### Swipe Navigation

```javascript
function enableSwipeNavigation(element, { onSwipeLeft, onSwipeRight, threshold = 50 }) {
  let startX = 0;
  let startY = 0;
  let tracking = false;

  element.addEventListener(
    'touchstart',
    (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      tracking = true;
    },
    { passive: true },
  );

  element.addEventListener(
    'touchend',
    (e) => {
      if (!tracking) return;
      tracking = false;

      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;

      // Only trigger if horizontal movement > vertical (not a scroll)
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
        if (dx > 0 && onSwipeRight) onSwipeRight();
        if (dx < 0 && onSwipeLeft) onSwipeLeft();
      }
    },
    { passive: true },
  );
}

// Usage: swipe between dashboard tabs
enableSwipeNavigation(document.querySelector('.tab-content'), {
  onSwipeLeft: () => activateNextTab(),
  onSwipeRight: () => activatePrevTab(),
});
```

### Pull-to-Refresh

```javascript
function enablePullToRefresh(container, { onRefresh, threshold = 80 }) {
  let startY = 0;
  let pulling = false;
  const indicator = document.createElement('div');
  indicator.className = 'pull-indicator';
  indicator.textContent = '↓ Pull to refresh';
  container.prepend(indicator);

  container.addEventListener(
    'touchstart',
    (e) => {
      if (container.scrollTop === 0) {
        startY = e.touches[0].clientY;
        pulling = true;
      }
    },
    { passive: true },
  );

  container.addEventListener(
    'touchmove',
    (e) => {
      if (!pulling) return;
      const dy = e.touches[0].clientY - startY;
      if (dy > 0 && dy < threshold * 2) {
        indicator.style.transform = `translateY(${Math.min(dy * 0.5, threshold)}px)`;
        indicator.style.opacity = Math.min(dy / threshold, 1);
        if (dy > threshold) indicator.textContent = '↑ Release to refresh';
      }
    },
    { passive: true },
  );

  container.addEventListener(
    'touchend',
    () => {
      if (!pulling) return;
      pulling = false;
      const currentY = parseFloat(indicator.style.transform.match(/[\d.]+/)?.[0] || 0);
      indicator.style.transform = 'translateY(0)';
      indicator.style.opacity = '0';
      indicator.textContent = '↓ Pull to refresh';
      if (currentY >= threshold * 0.5) onRefresh();
    },
    { passive: true },
  );
}
```

```css
.pull-indicator {
  text-align: center;
  padding: 1rem;
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  transform: translateY(0);
  opacity: 0;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
  pointer-events: none;
}
```

### Long Press Context Menu

```javascript
function enableLongPress(element, { onLongPress, duration = 500 }) {
  let timer = null;
  let moved = false;

  element.addEventListener(
    'touchstart',
    (e) => {
      moved = false;
      timer = setTimeout(() => {
        if (!moved) onLongPress(e);
      }, duration);
    },
    { passive: true },
  );

  element.addEventListener('touchmove', () => {
    moved = true;
    clearTimeout(timer);
  });
  element.addEventListener('touchend', () => clearTimeout(timer));
  element.addEventListener('touchcancel', () => clearTimeout(timer));
}
```

### Debounce Double-Tap

```javascript
function preventDoubleTap(button, handler, delay = 300) {
  let lastTap = 0;
  button.addEventListener('click', (e) => {
    const now = Date.now();
    if (now - lastTap < delay) {
      e.preventDefault();
      return;
    }
    lastTap = now;
    handler(e);
  });
}
```

---

## 5. Mobile Performance

Native apps feel fast because they never show loading states for UI chrome. Match this by pre-rendering your shell and lazy-loading content.

### GPU-Accelerated Animations

```css
/* Promote elements that will animate to their own compositor layer */
.will-animate {
  will-change: transform, opacity;
  /* Remove will-change after animation completes to free GPU memory */
}

/* Only animate transform and opacity — anything else triggers layout/paint */
.slide-in {
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* iOS spring-like easing for native feel */
.spring-transition {
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

### Layout Containment

```css
/* Isolate components so changes don't trigger full-page reflow */
.card,
.list-item,
.section {
  contain: layout style paint;
}

/* Lazy render off-screen content */
.below-fold-section {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px; /* estimated height */
}
```

### Lazy Loading with IntersectionObserver

```javascript
const lazyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.dataset.src) {
          el.src = el.dataset.src;
          el.removeAttribute('data-src');
        }
        lazyObserver.unobserve(el);
      }
    });
  },
  { rootMargin: '200px' },
); // Start loading 200px before visible

document.querySelectorAll('[data-src]').forEach((el) => lazyObserver.observe(el));
```

### Page Prefetching

```javascript
// Prefetch likely next pages when idle
function prefetchOnIdle(urls) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      urls.forEach((url) => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
      });
    });
  }
}

// On the home page, prefetch the CV and the first project page
prefetchOnIdle(['/cv/', '/projects/whisperflow/']);
```

### Smooth Scroll with rAF

```javascript
// Throttle scroll handlers to animation frames
function onScrollThrottled(callback) {
  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          callback();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true },
  );
}
```

---

## 6. Platform-Specific Adaptations

### iOS Safari Standalone Mode

```javascript
// Detect if running as installed PWA
const isStandalone =
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

// In standalone mode, handle navigation differently (no back button)
if (isStandalone) {
  // Add a back button to your header
  document
    .querySelector('.app-header')
    .insertAdjacentHTML(
      'afterbegin',
      '<button class="back-btn touchable" onclick="history.back()" aria-label="Back">←</button>',
    );
}
```

**iOS quirks to handle:**

- No `beforeinstallprompt` event — iOS users must use Share > Add to Home Screen. Guide them with a custom install banner
- Status bar style only applies in standalone mode
- `100vh` includes the Safari toolbar — use `100dvh` (dynamic viewport height) or `window.innerHeight`
- `position: fixed` can glitch when the keyboard opens — use `position: sticky` or `visualViewport` API

```css
/* Fix iOS 100vh issue */
.full-height {
  height: 100dvh; /* dynamic viewport height */
}

/* Fallback for older browsers */
@supports not (height: 100dvh) {
  .full-height {
    height: -webkit-fill-available;
  }
}
```

### Android Chrome

```javascript
// Install prompt — Android shows this automatically, but you can customize timing
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Show your custom install button/banner
  document.querySelector('.install-banner').hidden = false;
});

document.querySelector('.install-btn')?.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const result = await deferredPrompt.userChoice;
  deferredPrompt = null;
  document.querySelector('.install-banner').hidden = true;
});
```

**Android theme-color:** Chrome colors the address bar and task switcher using `theme-color`. Update it dynamically when switching themes:

```javascript
function updateThemeColor(color) {
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
}

// On theme change
document.addEventListener('themechange', (e) => {
  updateThemeColor(e.detail.theme === 'dark' ? '#1a1a2e' : '#ffffff');
});
```

### Dark Mode & Reduced Motion

```css
/* System dark mode detection */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    /* Apply dark tokens when no explicit theme is set */
    --color-bg: #1a1a2e;
    --color-text: #e0e0e0;
  }
}

/* Respect reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  .pull-indicator,
  .slide-in,
  .spring-transition {
    transition: none !important;
  }
}
```

---

## 7. Testing Checklist

Before marking PWA work as complete, verify against these targets.

### Device Viewports

| Device             | Width x Height | Pixel Ratio | Test Priority      |
| ------------------ | -------------- | ----------- | ------------------ |
| iPhone SE          | 375 x 667      | 2x          | High (smallest)    |
| iPhone 14/15       | 390 x 844      | 3x          | High (most common) |
| iPhone 15 Pro Max  | 430 x 932      | 3x          | Medium             |
| Pixel 7            | 412 x 915      | 2.625x      | High (Android ref) |
| Samsung Galaxy S23 | 360 x 780      | 3x          | Medium             |
| iPad Mini          | 744 x 1133     | 2x          | Low (tablet)       |

### Functional Tests

- [ ] **Manifest**: `manifest.json` validates (Chrome DevTools > Application > Manifest)
- [ ] **Install**: App can be installed on both iOS (Share > Add to Home) and Android (install prompt)
- [ ] **Standalone**: App opens without browser chrome after install
- [ ] **Splash**: Splash screen shows during launch (not white flash)
- [ ] **Offline**: Core pages load when airplane mode is on
- [ ] **Service worker**: Registered and caching assets (DevTools > Application > Service Workers)
- [ ] **Safe areas**: Content doesn't overlap with notch or home indicator
- [ ] **Status bar**: Content shows behind status bar on iOS (black-translucent)

### Visual & Interaction Tests

- [ ] **Touch targets**: All interactive elements are at minimum 44x44px (Apple HIG)
- [ ] **Touch feedback**: Buttons/cards show press state (scale/opacity)
- [ ] **No tap highlight**: Blue/gray flash on tap is eliminated
- [ ] **No zoom on input**: Font sizes are >= 16px on all inputs
- [ ] **Overscroll**: No rubber-band bounce beyond app boundaries
- [ ] **Scroll**: Lists scroll with momentum (smooth, native-feeling)
- [ ] **Orientation**: App works in both portrait and landscape
- [ ] **Font scaling**: Layout doesn't break when system font size is set to largest

### Performance Tests

- [ ] **First paint**: Under 1.5s on 4G connection
- [ ] **Animations**: 60fps — no jank (Chrome DevTools > Performance)
- [ ] **will-change**: Used only during animations, not permanently
- [ ] **Layout shifts**: CLS < 0.1 (Lighthouse)
- [ ] **No scroll jank**: Scroll handlers use `passive: true` and rAF throttling

### Platform-Specific

- [ ] **iOS**: `100dvh` or `-webkit-fill-available` used instead of `100vh`
- [ ] **iOS**: Keyboard doesn't break fixed positioning
- [ ] **iOS**: Apple touch icon shows correctly on home screen
- [ ] **Android**: `theme-color` updates correctly with theme changes
- [ ] **Android**: Install prompt appears and works
- [ ] **Dark mode**: `prefers-color-scheme: dark` works correctly
- [ ] **Reduced motion**: All animations disabled when `prefers-reduced-motion: reduce`

---

## 8. Implementation Order

When adding PWA native feel to an existing vanilla web app, follow this order — each step builds on the previous and can be tested independently.

### Phase 1: Foundation (30 min)

1. Create `manifest.json` with icons
2. Add all meta tags to HTML `<head>`
3. Create and register a basic service worker
4. Test: app installs and opens in standalone mode

### Phase 2: CSS Polish (1-2 hours)

1. Add safe area padding
2. Remove web-feel (tap highlight, overscroll, text selection on UI)
3. Add sticky header with backdrop-filter
4. Add touch feedback (`:active` states)
5. Fix `100vh` with `100dvh`
6. Test: app looks native, no browser artifacts

### Phase 3: Touch (1-2 hours)

1. Add swipe navigation between key pages/tabs
2. Add pull-to-refresh on data-heavy pages
3. Add double-tap prevention on buttons
4. Test: interactions feel responsive and intentional

### Phase 4: Performance (1 hour)

1. Add `contain` to cards and list items
2. Add `content-visibility: auto` to below-fold sections
3. Add lazy loading for images
4. Add page prefetching
5. Test: Lighthouse mobile score > 90

### Phase 5: Platform Polish (1 hour)

1. Handle iOS standalone quirks (back button, keyboard)
2. Add Android install prompt
3. Add dynamic theme-color
4. Add reduced-motion support
5. Generate iOS splash screens
6. Test: feels native on both iOS and Android

---

## 9. Quick Reference — CSS Properties Cheat Sheet

```css
/* === COPY-PASTE NATIVE FEEL BASELINE === */

/* Remove web artifacts */
* {
  -webkit-tap-highlight-color: transparent;
}
html,
body {
  overscroll-behavior: none;
}
input,
select,
textarea {
  font-size: 16px;
}

/* Safe areas */
.app-shell {
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom)
    env(safe-area-inset-left);
}

/* Full height without iOS toolbar issue */
.full-screen {
  height: 100dvh;
}

/* Native-like touch */
.touchable:active {
  transform: scale(0.97);
  opacity: 0.7;
}

/* Sticky glass header */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
}

/* Smooth scrolling container */
.scroll-list {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
}

/* Performance containment */
.card {
  contain: layout style paint;
}

/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
