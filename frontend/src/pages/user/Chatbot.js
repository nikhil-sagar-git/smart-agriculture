
import { useEffect, useRef, useState } from "react";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const SUGGESTIONS = [
  {
    icon: "🌱",
    title: "Crop recommendation",
    text: "What soil information do you need to recommend a crop?"
  },
  {
    icon: "🧪",
    title: "Fertilizer advice",
    text: "What information is required for fertilizer recommendation?"
  },
  {
    icon: "🌾",
    title: "Soil health",
    text: "Why are nitrogen, phosphorus and potassium important?"
  },
  {
    icon: "💧",
    title: "Water management",
    text: "Give me general tips to manage irrigation for crops."
  }
];

export default function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: "Hello! I'm your Smart Agriculture Assistant. 🌿\n\nI can answer farming questions and help you use your crop and fertilizer recommendation models. What would you like to know?"
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const nextId = useRef(2);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end"
    });
  }, [messages, loading]);

  async function sendMessage(text = input) {
    const question = text.trim();

    if (!question || loading) return;

    setError("");

    const userMessage = {
      id: nextId.current++,
      role: "user",
      text: question
    };

    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: question
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "The chatbot request failed."
        );
      }

      setMessages((previous) => [
        ...previous,
        {
          id: nextId.current++,
          role: "assistant",
          text: data.reply || "I couldn't generate a response."
        }
      ]);
    } catch (err) {
      setError(
        err.message ||
        "Unable to connect to the Flask server. Please try again."
      );
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage();
  }

  function clearChat() {
    if (loading) return;

    setMessages([
      {
        id: nextId.current++,
        role: "assistant",
        text: "Your conversation has been cleared. What agriculture question can I help with?"
      }
    ]);

    setError("");
    setInput("");
  }

  return (
    <main className="agri-page">
      <section className="agri-chat">
        {/* Header */}
        <header className="agri-header">
          <div className="agri-brand">
            <div className="agri-logo">🌱</div>

            <div>
              <h1>Agri Assistant</h1>
              <p>
                <span className="status-dot" />
                Smart AI Agriculture
              </p>
            </div>
          </div>

          <button
            type="button"
            className="clear-button"
            onClick={clearChat}
            disabled={loading}
            title="Clear conversation"
          >
            <span aria-hidden="true">↻</span>
            <span>Clear chat</span>
          </button>
        </header>

        {/* Capabilities */}
        <div className="agri-capabilities">
          <span>🌾 Crop guidance</span>
          <span>🧪 Fertilizer advice</span>
          <span>💬 Farming questions</span>
        </div>

        {/* Messages */}
        <section
          className="agri-messages"
          aria-label="Chat messages"
          aria-live="polite"
        >
          {messages.length === 1 && (
            <div className="welcome-section">
              <div className="welcome-icon">🌿</div>

              <h2>How can I help your farm?</h2>

              <p>
                Ask a question or select a topic below to get started.
              </p>

              <div className="suggestion-grid">
                {SUGGESTIONS.map((item) => (
                  <button
                    type="button"
                    className="suggestion-card"
                    key={item.title}
                    onClick={() => sendMessage(item.text)}
                    disabled={loading}
                  >
                    <span className="suggestion-icon">
                      {item.icon}
                    </span>
                    <span className="suggestion-title">
                      {item.title}
                    </span>
                    <span className="suggestion-text">
                      {item.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <article
              key={message.id}
              className={`chat-message ${message.role}`}
            >
              <div className="message-avatar">
                {message.role === "user" ? "👤" : "🌱"}
              </div>

              <div className="message-content">
                <span className="message-author">
                  {message.role === "user"
                    ? "You"
                    : "Agri Assistant"}
                </span>

                <div className="message-bubble">
                  <p>{message.text}</p>
                </div>
              </div>
            </article>
          ))}

          {loading && (
            <article className="chat-message assistant">
              <div className="message-avatar">🌱</div>

              <div className="message-content">
                <span className="message-author">
                  Agri Assistant
                </span>

                <div className="message-bubble typing-bubble">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-label">
                    Thinking...
                  </span>
                </div>
              </div>
            </article>
          )}

          {error && (
            <div className="chat-error" role="alert">
              <span>⚠️ {error}</span>

              <button
                type="button"
                onClick={() => sendMessage(
                  [...messages]
                    .reverse()
                    .find((item) => item.role === "user")?.text || ""
                )}
                disabled={loading}
              >
                Retry
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </section>

        {/* Input */}
        <footer className="agri-footer">
          <form
            className="agri-input-form"
            onSubmit={handleSubmit}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about crops, fertilizers or farming..."
              aria-label="Type your agriculture question"
              disabled={loading}
              maxLength={5000}
            />

            <button
              type="submit"
              className="send-button"
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              <span>Send</span>
              <span aria-hidden="true">➤</span>
            </button>
          </form>

          <p className="agri-disclaimer">
            AI responses can be inaccurate. Verify important
            agricultural decisions with a qualified expert.
          </p>
        </footer>
      </section>
    </main>
  );
}
