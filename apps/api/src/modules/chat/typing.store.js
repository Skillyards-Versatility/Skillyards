const typingUsers = new Map();

const TYPING_TTL = 4000;

export function recordTyping(conversationId, userId) {
  typingUsers.set(`${conversationId}:${userId}`, Date.now());
}

export function getTypingUserIds(conversationId) {
  const now = Date.now();
  const ids = [];
  for (const [key, ts] of typingUsers) {
    const [cid, uid] = key.split(":");
    if (cid === conversationId && now - ts < TYPING_TTL) {
      ids.push(uid);
    }
  }
  for (const [key, ts] of typingUsers) {
    if (now - ts > TYPING_TTL * 2) typingUsers.delete(key);
  }
  return ids;
}
