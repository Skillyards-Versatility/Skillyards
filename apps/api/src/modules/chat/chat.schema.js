import { z } from "zod";

export const createChannelSchema = z.object({
  name: z.string().trim().min(1, "Channel name is required").max(80),
  description: z.string().trim().max(500).optional(),
  type: z.enum(["public", "private", "team"]).default("public"),
  team: z.string().trim().optional(),
});

export const updateChannelSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  description: z.string().trim().max(500).optional(),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(10000),
  channelId: z.string().uuid().optional(),
  conversationId: z.string().uuid().optional(),
  parentId: z.string().uuid().optional().nullable(),
  type: z.enum(["text", "image", "file", "system"]).default("text"),
  fileKey: z.string().optional().nullable(),
  fileType: z.string().optional().nullable(),
  fileName: z.string().optional().nullable(),
});

export const editMessageSchema = z.object({
  content: z.string().min(1).max(10000),
});

export const addReactionSchema = z.object({
  emoji: z.string().min(1).max(50),
});

export const createConversationSchema = z.object({
  type: z.enum(["direct", "group"]).default("direct"),
  name: z.string().trim().max(100).optional(),
  participantIds: z.array(z.string().uuid()).min(1, "At least one participant required"),
});

export function validateCreateChannel(data) {
  return createChannelSchema.safeParse(data);
}

export function validateUpdateChannel(data) {
  return updateChannelSchema.safeParse(data);
}

export function validateSendMessage(data) {
  return sendMessageSchema.safeParse(data);
}

export function validateEditMessage(data) {
  return editMessageSchema.safeParse(data);
}

export function validateAddReaction(data) {
  return addReactionSchema.safeParse(data);
}

export function validateCreateConversation(data) {
  return createConversationSchema.safeParse(data);
}
