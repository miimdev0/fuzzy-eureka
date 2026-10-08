# fuzzy-eureka

## Portfolio website

A static, single-page portfolio lives in [`portfolio/`](portfolio/).

- Open `portfolio/index.html` directly in a browser, or serve it locally:
  `cd portfolio && python3 -m http.server 8080`
- Edit your name, text, links and project cards in `portfolio/index.html`.
- Colors and layout live in `portfolio/styles.css`.

### Installable app (PWA)

The site is a Progressive Web App: it has a web app manifest (`manifest.webmanifest`), a service worker (`sw.js`) for offline use, and app icons in `icons/`.

- On Android (Chrome) or desktop Chrome/Edge, use the browser's "Install app" option.
- On iPhone (Safari), use Share → "Add to Home Screen".
- To change the cached files, bump `CACHE_VERSION` in `sw.js`.

### Android APK

The workflow `.github/workflows/build-apk.yml` wraps the site in a Capacitor Android app and builds a debug APK. It runs on every push to this branch that changes `portfolio/`, or manually from the **Actions** tab.

- Download the `portfolio-apk` artifact from the workflow run and install `app-debug.apk` on an Android device (you may need to allow installs from unknown sources).
- The APK bundles a snapshot of `portfolio/` at build time. Rebuild after changing the site.
- The APK is debug-signed. For a Play Store release, a proper signing keystore is needed.


## Animated portfolio (HTML/CSS/JS only)

`animated-portfolio/` contains an animated single-page portfolio built with plain HTML, CSS and vanilla JavaScript (no frameworks).

- Preview: open `animated-portfolio/index.html` in a browser.
- Features: intro loader, custom cursor, rotating role text, staggered letter reveals, marquee, filterable project grid with 3D tilt and spotlight, count-up stats, scroll-driven word highlight, and a reduced-motion fallback.
- Edit your name, projects and links in `animated-portfolio/index.html`.

The workflow `.github/workflows/build-animated-portfolio.yml` validates the source, minifies the JS and CSS, checks that the output contains only `.html`, `.css` and `.js` files, and uploads the result as the `animated-portfolio-site` artifact.

## Mobile portfolio (HTML/CSS/JS only)

`mobile-portfolio/` is a mobile-first version of the animated portfolio, built with plain HTML, CSS and JavaScript.

- Full-screen menu with a circular reveal, sticky bottom navigation that highlights the current section, a horizontal swipe carousel for projects, and tap-to-open service accordions.
- Built by the same workflow: `dist/` holds the desktop site and `dist/mobile/` holds the mobile site.
