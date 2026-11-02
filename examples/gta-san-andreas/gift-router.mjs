/**
 * GTA San Andreas LIVE gift router.
 *
 * Converts normalized ttl-live gift events into small JSON commands.
 * This is the event-routing layer only; a game-side CLEO/AML adapter must
 * consume the commands before they can change the running GTA process.
 *
 * Usage from a Node listener:
 *   import { routeGift } from './gift-router.mjs';
 *   live.on('gift', event => {
 *     const command = routeGift(event);
 *     if (command) process.stdout.write(JSON.stringify(command) + '\\n');
 *   });
 */

const ACTIONS = new Map([
  ['rose', { action: 'wanted_level', level: 2 }],
  ['heart', { action: 'spawn_vehicle', model: 'police' }],
  ['gift', { action: 'spawn_enemies', count: 2 }],
  ['lion', { action: 'spawn_enemies', count: 5 }],
  ['diamond', { action: 'special_event', event: 'wanted_level_max' }],
]);

/**
 * @param {object} event normalized ttl-live GiftEvent
 * @returns {object|null} command envelope, or null for an ignored event
 */
export function routeGift(event) {
  if (!event || event.type !== 'gift' || typeof event.giftName !== 'string') return null;

  // Count a streak only once, at its final message.
  if (event.streakable && !event.repeatEnd) return null;

  const key = event.giftName.trim().toLowerCase();
  const mapped = ACTIONS.get(key);
  if (!mapped) return null;

  const repeat = Math.max(1, Math.min(Number(event.repeatCount) || 1, 10));
  return {
    source: 'tiktok-live',
    type: 'gta-command',
    gift: event.giftName,
    giftId: String(event.giftId ?? ''),
    sender: event.user?.uniqueId ?? 'unknown',
    count: repeat,
    ...mapped,
    issuedAt: Date.now(),
  };
}

export const supportedGiftNames = Object.freeze([...ACTIONS.keys()]);
