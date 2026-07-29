import * as channelRepo from "./channels.repository.js";

export async function listChannels(db) {
  return channelRepo.getChannels(db);
}

export async function listMyChannels(db, userId) {
  return channelRepo.getChannelsForUser(db, userId);
}

export async function getChannel(db, channelId) {
  return channelRepo.getChannelById(db, channelId);
}

export async function createChannel(db, data, userId) {
  const existing = await channelRepo.getChannelByName(db, data.name);
  if (existing) {
    throw new Error("CHANNEL_NAME_TAKEN");
  }
  const channel = await channelRepo.createChannelRecord(db, { ...data, createdBy: userId });
  await channelRepo.addChannelMember(db, channel.id, userId);
  return channel;
}

export async function updateChannel(db, channelId, data) {
  const updated = await channelRepo.updateChannelRecord(db, channelId, data);
  if (!updated) throw new Error("CHANNEL_NOT_FOUND");
  return updated;
}

export async function archiveChannel(db, channelId) {
  const archived = await channelRepo.archiveChannel(db, channelId);
  if (!archived) throw new Error("CHANNEL_NOT_FOUND");
  return archived;
}

export async function joinChannel(db, channelId, userId) {
  const channel = await channelRepo.getChannelById(db, channelId);
  if (!channel) throw new Error("CHANNEL_NOT_FOUND");
  const alreadyMember = await channelRepo.isChannelMember(db, channelId, userId);
  if (alreadyMember) return { alreadyMember: true, channel };
  await channelRepo.addChannelMember(db, channelId, userId);
  return { alreadyMember: false, channel };
}

export async function leaveChannel(db, channelId, userId) {
  await channelRepo.removeChannelMember(db, channelId, userId);
}

export async function getMembers(db, channelId) {
  return channelRepo.getChannelMembers(db, channelId);
}

export async function isMember(db, channelId, userId) {
  return channelRepo.isChannelMember(db, channelId, userId);
}
