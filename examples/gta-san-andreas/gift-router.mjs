/**
 * GTA San Andreas LIVE gift router.
 *
 * Converts normalized ttl-live GiftEvent objects into JSON-line commands.
 * This is NOT a GTA process controller: a compatible in-game mod/bridge must
 * consume these commands before they can change the running game.
 */

const ACTIONS = new Map([
  ["rose", { action: "wanted_level", level: 2 }],
  ["heart", { action: "spawn_vehicle", model: "police" }],
  ["gift", { action: "spawn_enemies", count: 2 }],
  ["lion", { action: "spawn_enemies", count: 5 }],
  ["diamond", { action: "special_event", event: "wanted_level_max" }],
]);

const ALIASES = new Map([
  ["rose", "rose"],
  ["red rose", "rose"],
  ["heart", "heart"],
  ["heart me", "heart"],
  ["gift", "gift"],
  ["lion", "lion"],
  ["diamond", "diamond"],
]);

function normalizeGiftName(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * @param {object} event normalized ttl-live GiftEvent
 * @returns {object|null} command envelope, or null for an ignored event
 */
export function routeGift(event) {
  if (!event || event.type !== "gift" || typeof event.giftName !== "string") return null;

  // Ignore intermediate streak updates; the final update carries the total.
  if (event.streakable && !event.repeatEnd) return null;

  const normalizedName = normalizeGiftName(event.giftName);
  const key = ALIASES.get(normalizedName) ?? normalizedName;
  const mapped = ACTIONS.get(key);
  if (!mapped) return null;

  const repeat = Math.max(1, Math.min(Number(event.repeatCount) || 1, 10));
  return {
    source: "tiktok-live",
    type: "gta-command",
    gift: event.giftName,
    giftId: String(event.giftId ?? ""),
    sender: event.user?.uniqueId || event.user?.nickname || "unknown",
    count: repeat,
    ...mapped,
    issuedAt: Date.now(),
  };
}

export const supportedGiftNames = Object.freeze([...ACTIONS.keys()]);
