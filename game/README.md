# MOISEY LIVE — mobile 3D runner

A first playable mobile-browser prototype for the MOISEY LIVE TikTok gift-controlled game.

## Play locally
Open `index.html` from a static web server. The game uses Three.js from jsDelivr, so an internet connection is required. It is designed for a phone in portrait or landscape.

## Controls
- Swipe left/right or use the on-screen arrows to change lanes.
- Swipe up / arrow up to jump.
- Swipe down / arrow down to slide.
- Tap **СТАРТИРАЙ ИГРАТА** to begin.
- The gift buttons in the start panel are local test events.

## Gift bridge contract
The page can listen to a WebSocket URL supplied as a query parameter named `bridge`, for example `?bridge=wss://your-host.example/live`.

It expects JSON messages such as:
```json
{"type":"gift","giftName":"Rose"}
```
Supported demo mappings:
- Rose: temporary turbo + points
- Heart: temporary shield
- GG: bonus points
- Lion: clears current obstacles + bonus points

**Important:** the game page is a playable prototype. It does not yet connect itself to TikTok. The existing `packages/tiktok-live` listener / Rust transport must be run on a reachable host and adapted to publish authorized gift events to the WebSocket bridge. A phone browser cannot host that always-on backend reliably by itself. Do not put TikTok session cookies or secrets in this page.

## Deploy
The GitHub Actions workflow `.github/workflows/deploy-game.yml` publishes this folder to GitHub Pages when Pages is enabled for the repository with **GitHub Actions** as the deployment source.
