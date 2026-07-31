import * as msgRepo from "./messages.repository.js";
import * as channelRepo from "./channels.repository.js";

export async function getChannelMessages(db, channelId, opts) {
  return msgRepo.getMessagesByChannel(db, channelId, opts);
}

export async function getConversationMessages(db, conversationId, opts) {
  return msgRepo.getMessagesByConversation(db, conversationId, opts);
}

export async function getThreadMessages(db, parentId) {
  return msgRepo.getThreadReplies(db, parentId);
}

export async function sendMessage(db, data, userId) {
  const convId = data.channelId || data.conversationId;
  if (convId) {
    const isMember = await channelRepo.isChannelMember(db, convId, userId);
    if (!isMember) throw new Error("NOT_CHANNEL_MEMBER");
  }
  return msgRepo.createMessageRecord(db, { ...data, conversationId: convId, senderId: userId });
}

export async function editMessage(db, messageId, content, userId) {
  const msg = await msgRepo.getMessageById(db, messageId);
  if (!msg) throw new Error("MESSAGE_NOT_FOUND");
  if (msg.senderId !== userId) throw new Error("NOT_MESSAGE_AUTHOR");
  return msgRepo.updateMessageContent(db, messageId, content);
}

export async function deleteMessage(db, messageId, userId) {
  const msg = await msgRepo.getMessageById(db, messageId);
  if (!msg) throw new Error("MESSAGE_NOT_FOUND");
  if (msg.senderId !== userId) throw new Error("NOT_MESSAGE_AUTHOR");
  return msgRepo.softDeleteMessage(db, messageId);
}

export async function getMessage(db, messageId) {
  return msgRepo.getMessageWithReactions(db, messageId);
}
