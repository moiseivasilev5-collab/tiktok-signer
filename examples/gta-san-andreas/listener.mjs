#!/usr/bin/env node
/**
 * Connects to a public TikTok LIVE room and emits routed GTA commands as JSON lines.
 *
 * Build first from packages/tiktok-live:
 *   npm install
 *   npm run build
 *
 * Then from the repository root:
 *   node examples/gta-san-andreas/listener.mjs @creator
 *
 * The output is only a command stream. It does not inject commands into GTA.
 */
import { TikTokLive } from "../../packages/tiktok-live/dist/index.js";
import { routeGift } from "./gift-router.mjs";

const creator = process.argv[2];
if (!creator) {
  console.error("Usage: node examples/gta-san-andreas/listener.mjs @creator");
  process.exit(2);
}

const live = new TikTokLive(creator, { fetchGifts: true });

live.on("gift", (event) => {
  const command = routeGift(event);
  if (command) {
    process.stdout.write(JSON.stringify(command) + "\n");
  }
});

live.on("error", (error) => {
  console.error("[TikTok LIVE]", error instanceof Error ? error.message : String(error));
});

try {
  const state = await live.connect();
  console.error("[TikTok LIVE] connected:", JSON.stringify(state));
} catch (error) {
  console.error("[TikTok LIVE] connection failed:", error instanceof Error ? error.message : String(error));
  live.disconnect();
  process.exitCode = 1;
}

const shutdown = () => {
  live.disconnect();
  process.exit();
};
process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
