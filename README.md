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
