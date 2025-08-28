import fs from "fs";
import path from "path";

const MEMORY_FILE = path.resolve("./ai_memory.json");

/**
 * Load memory from file (chat history + facts about user)
 */
export function loadMemory() {
  if (!fs.existsSync(MEMORY_FILE)) {
    return { messages: [] };
  }
  try {
    const raw = fs.readFileSync(MEMORY_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error loading memory:", err);
    return { messages: [] };
  }
}

/**
 * Save memory to file
 */
export function saveMemory(memory) {
  try {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving memory:", err);
  }
}
