import test from "node:test";
import assert from "node:assert/strict";
import { routeGift } from "./gift-router.mjs";

const gift = (overrides = {}) => ({
  type: "gift",
  giftName: "Rose",
  giftId: "5655",
  repeatCount: 1,
  repeatEnd: true,
  streakable: false,
  user: { uniqueId: "viewer1", nickname: "Viewer" },
  ...overrides,
});

test("routes a normalized Rose gift to a two-star wanted level", () => {
  const command = routeGift(gift());
  assert.equal(command.action, "wanted_level");
  assert.equal(command.level, 2);
  assert.equal(command.sender, "viewer1");
});

test("ignores intermediate streak updates", () => {
  assert.equal(routeGift(gift({ streakable: true, repeatEnd: false })), null);
});

test("uses the final streak count and caps it", () => {
  const command = routeGift(gift({ streakable: true, repeatEnd: true, repeatCount: 99 }));
  assert.equal(command.count, 10);
});

test("ignores unrelated event types and unknown gifts", () => {
  assert.equal(routeGift({ ...gift(), type: "chat" }), null);
  assert.equal(routeGift(gift({ giftName: "Unknown gift" })), null);
});

test("accepts known names case-insensitively", () => {
  assert.equal(routeGift(gift({ giftName: "LION" })).action, "spawn_enemies");
});
