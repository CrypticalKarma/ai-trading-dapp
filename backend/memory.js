// Simple in-memory storage for conversation history
const conversationMemory = new Map(); // key: userID/sessionID, value: array of messages

export function getConversation(userId) {
  if (!conversationMemory.has(userId)) conversationMemory.set(userId, []);
  return conversationMemory.get(userId);
}

export function addMessage(userId, role, content) {
  const convo = getConversation(userId);
  convo.push({ role, content });
}
