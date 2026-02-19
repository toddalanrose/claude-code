import { useState, useRef, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatView({
  messages,
  date,
}: {
  messages: Message[];
  date: string;
}) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const addMessage = useMutation(api.conversations.addMessage);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    await addMessage({
      date,
      message: { role: "user", content: text, timestamp: Date.now() },
    });
  };

  return (
    <>
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`message message-${m.role}`}>
            {m.content}
            <div className="message-time">{formatTime(m.timestamp)}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-bar">
        <input
          className="chat-input"
          placeholder="Ask Nova..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button className="send-btn" disabled={!input.trim()} onClick={send}>
          &uarr;
        </button>
      </div>
    </>
  );
}
