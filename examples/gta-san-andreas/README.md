# TikTok LIVE → GTA San Andreas command stream

This example connects the repository's Node TikTok LIVE client to the GTA gift router.
It prints one JSON command per recognized gift. It does **not** modify or control a running GTA
process; a version-compatible in-game mod/adapter is still required for that final step.

## Prepare

Use Node.js 22 or newer.

```sh
cd packages/tiktok-live
npm install
npm run build
cd ../..
```

## Listen to a LIVE room

```sh
node examples/gta-san-andreas/listener.mjs @creator
```

Replace `@creator` with the public TikTok handle that is currently LIVE. The listener writes
status and errors to stderr and JSON commands to stdout, so stdout can be piped to a future
adapter without mixing status messages into the command stream.

## Check the router offline

```sh
node --test examples/gta-san-andreas/gift-router.test.mjs
```

## Current actions

| Gift name | Routed command |
| --- | --- |
| Rose | `wanted_level`, level 2 |
| Heart | `spawn_vehicle`, police |
| Gift | `spawn_enemies`, count 2 |
| Lion | `spawn_enemies`, count 5 |
| Diamond | `special_event`, maximum wanted level |

Only these names are mapped at present. Gift names are matched case-insensitively; unknown gifts
are ignored. Streakable gifts are emitted only at their final update, and repeat counts are capped
at 10.

## Important compatibility boundary

The user's installed game is reported as GTA San Andreas Android 2.11.277 on Android 16.
This repository currently has no verified CLEO/AML plugin or native game-side adapter for that
specific build. Do not install old CLEO packages or copy arbitrary mod files into the game.
Until a compatible adapter is identified and tested, the commands from this example are only
observable JSON output and cannot spawn police, vehicles, or NPCs inside GTA.
