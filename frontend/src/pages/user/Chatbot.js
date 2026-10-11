import { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! Welcome to Smart Agriculture Assistant. Ask me about crops, fertilizers, soil health, and farming practices.",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);

  // =====================================
  // AUTO SCROLL TO LATEST MESSAGE
  // =====================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // =====================================
  // SEND MESSAGE TO BACKEND
  // =====================================

  const handleSend = async (e) => {
    if (e) e.preventDefault();

    const question = input.trim();

    if (!question || loading) {
      return;
    }

    // Show user's message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: question,
      },
    ]);

    setInput("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://smart-agriculture-python3.onrender.com/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: question,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(
          data.error || "Unable to get a response from the server."
        );
      }

      // Support common response field names
      const reply =
        data.response ||
        data.reply ||
        data.answer ||
        data.message;

      if (!reply) {
        throw new Error(
          "The server returned an empty response."
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
        },
      ]);
    } catch (err) {
      console.error("Chatbot error:", err);

      setError(
        err.message ||
          "Server error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // CLEAR CHAT
  // =====================================

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! Welcome to Smart Agriculture Assistant. Ask me about crops, fertilizers, soil health, and farming practices.",
      },
    ]);

    setInput("");
    setError("");
  };

  // =====================================
  // SUGGESTED QUESTIONS
  // =====================================

  const suggestions = [
    "How can I improve soil fertility?",
    "Which fertilizer is useful for rice?",
    "How do I choose a crop for my soil?",
    "How can farmers save water?",
  ];

  return (
    <div className="chatbot-page">

      {/* =====================================
          NAVBAR
      ===================================== */}

      <div className="chatbot-navbar">
        <div className="chatbot-brand">
          <span className="chatbot-brand-icon">🌱</span>

          <div>
            <h2>Smart Agriculture</h2>
            <p>AI Farming Assistant</p>
          </div>
        </div>

        <button
          type="button"
          className="chatbot-clear-btn"
          onClick={handleClearChat}
          disabled={loading}
        >
          Clear Chat
        </button>
      </div>

      {/* =====================================
          CHAT CONTAINER
      ===================================== */}

      <div className="chatbot-container">

        {/* HEADER */}

        <div className="chatbot-header">
          <div className="chatbot-avatar">🌿</div>

          <div>
            <h3>Agri Assistant</h3>
            <p>
              Ask questions about agriculture and farming
            </p>
          </div>

          <span className="chatbot-status">
            AI
          </span>
        </div>

        {/* =====================================
            SUGGESTED QUESTIONS
        ===================================== */}

        <div className="chatbot-suggestions">
          <h4>Suggested Questions</h4>

          <div className="suggestion-list">
            {suggestions.map((question, index) => (
              <button
                type="button"
                className="suggestion-btn"
                key={index}
                disabled={loading}
                onClick={() => {
                  setInput(question);
                }}
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* =====================================
            MESSAGES
        ===================================== */}

        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div
              className={`chat-message ${
                msg.role === "user"
                  ? "user-message"
                  : "assistant-message"
              }`}
              key={index}
            >
              {msg.role === "assistant" && (
                <div className="message-avatar">
                  🌱
                </div>
              )}

              <div className="message-content">
                <span className="message-role">
                  {msg.role === "user"
                    ? "You"
                    : "Agri Assistant"}
                </span>

                <p>{msg.content}</p>
              </div>
            </div>
          ))}

          {/* LOADING INDICATOR */}

          {loading && (
            <div className="chat-message assistant-message">
              <div className="message-avatar">
                🌱
              </div>

              <div className="message-content">
                <span className="message-role">
                  Agri Assistant
                </span>

                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* =====================================
            ERROR MESSAGE
        ===================================== */}

        {error && (
          <div className="chatbot-error">
            <p>{error}</p>

            <button
              type="button"
              onClick={() => setError("")}
            >
              Dismiss
            </button>
          </div>
        )}

        

<form
  className="chatbot-input-area"
  onSubmit={handleSend}
>
  <input
    className="chatbot-text-input"
    type="text"
    value={input}
    placeholder="Ask your agriculture question..."
    onChange={(e) => setInput(e.target.value)}
    disabled={loading}
    autoComplete="off"
  />

  <button
    type="submit"
    className="chatbot-send-btn"
    disabled={loading || !input.trim()}
  >
    {loading ? "Sending..." : "Send ➤"}
  </button>
</form>


        <p className="chatbot-disclaimer">
          AI-generated advice may not always be accurate.
          Verify important farming decisions with a local
          agricultural expert.
        </p>

      </div>
    </div>
  );
}
