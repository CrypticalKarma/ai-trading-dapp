import { useState, useEffect } from "react";

export default function AIChat({ aiReply }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplayedText("");
    const speed = 35; // ms per character
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + aiReply[i]);
      i++;
      if (i >= aiReply.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [aiReply]);

  return (
    <div className="ai-message">
      {displayedText}
      <span className="cursor">|</span>
    </div>
  );
}
