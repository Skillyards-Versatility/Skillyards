import * as convRepo from "./conversations.repository.js";

export async function listConversations(db, userId) {
  return convRepo.getUserConversations(db, userId);
}

export async function getConversation(db, conversationId) {
  return convRepo.getConversationById(db, conversationId);
}

export async function createDirectConversation(db, userId, otherUserId) {
  const existing = await convRepo.findDirectConversation(db, userId, otherUserId);
  if (existing) return existing;
  const conv = await convRepo.createConversationRecord(db, {
    type: "direct",
    createdBy: userId,
  });
  await convRepo.addParticipants(db, conv.id, [userId, otherUserId]);
  return conv;
}

export async function createGroupConversation(db, data, userId) {
  const allParticipants = [userId, ...data.participantIds.filter((id) => id !== userId)];
  const conv = await convRepo.createConversationRecord(db, {
    type: "group",
    name: data.name || null,
    createdBy: userId,
  });
  await convRepo.addParticipants(db, conv.id, allParticipants);
  return conv;
}

export async function getConversationParticipants(db, conversationId) {
  return convRepo.getConversationParticipants(db, conversationId);
}
