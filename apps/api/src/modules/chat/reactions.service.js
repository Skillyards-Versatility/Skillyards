import * as reactRepo from "./reactions.repository.js";
import * as msgRepo from "./messages.repository.js";

export async function addReaction(db, messageId, userId, emoji) {
  const msg = await msgRepo.getMessageById(db, messageId);
  if (!msg) throw new Error("MESSAGE_NOT_FOUND");
  return reactRepo.addReaction(db, messageId, userId, emoji);
}

export async function removeReaction(db, messageId, userId, emoji) {
  await reactRepo.removeReaction(db, messageId, userId, emoji);
}

export async function getReactions(db, messageId) {
  return reactRepo.getReactionsForMessage(db, messageId);
}
