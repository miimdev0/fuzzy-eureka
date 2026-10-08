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

To get an Android `.apk`, deploy the site over HTTPS (for example GitHub Pages) and open its URL on [PWABuilder](https://www.pwabuilder.com/), which generates an APK package from the live site.
