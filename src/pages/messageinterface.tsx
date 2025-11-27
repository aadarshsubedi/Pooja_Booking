import React, { useState, useRef, useEffect } from "react";
import "./MessageInterface.css";

interface Message {
  id: string;
  text: string;
  sender: "user" | "pandit";
  timestamp: Date;
}

interface MessageInterfaceProps {
  onBack: () => void;
}

const MessageInterface: React.FC<MessageInterfaceProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Namaste! How can I help you today?",
      sender: "pandit",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");

    // Simulate pandit response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: "I understand your question. Let me help you with that...",
        sender: "pandit",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
    }, 1500);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="message-container">
      {/* Header - Pandit info top-left */}
      <div className="message-header">
        <div className="pandit-info">
          <div className="pandit-name">Pandit Ram Tripathi</div>
          <div className="pandit-status">Online</div>
        </div>
      </div>

      {/* Messages */}
      <div className="message-list" ref={scrollRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-item ${msg.sender === "user" ? "user" : "pandit"}`}
          >
            <div className="message-text">{msg.text}</div>
            <div className="message-time">
              {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Input + Back Button */}
      <div className="message-input-container">
        <button onClick={onBack} className="back-button-small">
          Back
        </button>
        <input
          type="text"
          placeholder="Type your message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          className="message-input"
        />
        <button onClick={handleSend} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageInterface;
