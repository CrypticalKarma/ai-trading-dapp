// frontend/script.js

document.addEventListener("DOMContentLoaded", () => {
  const chatInput = document.getElementById("userQuestion");
  const sendBtn = document.getElementById("sendBtn");
  const outputDiv = document.getElementById("output");

  sendBtn.addEventListener("click", async () => {
    const userQuestion = chatInput.value.trim();
    if (!userQuestion) return;

    outputDiv.innerText = "Thinking...";

    try {
      const response = await fetch("http://localhost:3000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userQuestion }) // only send question
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      outputDiv.innerText = data.result || "AI did not return a response.";

      chatInput.value = ""; // clear input after sending
    } catch (err) {
      outputDiv.innerText = `Error calling backend: ${err.message}`;
      console.error(err);
    }
  });
});
