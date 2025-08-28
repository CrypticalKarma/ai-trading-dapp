document.addEventListener("DOMContentLoaded", () => {
  const chatContainer = document.getElementById("chatContainer");
  const chatInput = document.getElementById("userQuestion");
  const sendBtn = document.getElementById("sendBtn");

  // Store messages locally for display
  let chatHistory = [];

  function addMessage(role, text) {
    chatHistory.push({ role, text });
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${role}`;
    messageDiv.innerText = text;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
    return messageDiv;
  }

  async function sendMessage() {
    const userQuestion = chatInput.value.trim();
    if (!userQuestion) return;

    // Show user message
    addMessage("user", userQuestion);
    chatInput.value = "";

    // Typing indicator
    const typingDiv = addMessage("assistant", "Mentor is typing...");

    try {
      const response = await fetch("http://localhost:3000/api/analyze", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-user-id": localStorage.getItem("userId") || ""
        },
        body: JSON.stringify({ userQuestion })
      });

      const data = await response.json();

      // Save userId for future requests
      if (data.userId) localStorage.setItem("userId", data.userId);

      typingDiv.innerText = data.result || "AI did not return a response.";
    } catch (err) {
      typingDiv.innerText = `Error: ${err.message}`;
      console.error(err);
    }
  }

  // Send button
  sendBtn.addEventListener("click", sendMessage);

  // Enter key to send, Shift+Enter for new line
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Auto-resize textarea
  chatInput.addEventListener("input", () => {
    chatInput.style.height = "auto";
    chatInput.style.height = chatInput.scrollHeight + "px";
  });
});
