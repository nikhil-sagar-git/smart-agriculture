import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Chatbot.css";

export default function Chatbot() {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello Farmer! 🌱 I'm your AI Farming Assistant. I can help you with crop recommendations, fertilizer, plant diseases, weather, soil, and general farming questions.",
      sender: "bot",
    },
  ]);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // =====================================================
  // SEND MESSAGE TO AI BACKEND
  // =====================================================

  const handleSend = async () => {
    const userMessage = input.trim();

    if (!userMessage || loading) return;

    // Add user message immediately
    const newUserMessage = {
      id: Date.now(),
      text: userMessage,
      sender: "user",
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message: userMessage,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to connect to chatbot server");
      }

      const data = await response.json();

      // Expected backend response:
      //
      // {
      //   "reply": "Rice is suitable...",
      //   "tool": "crop_recommendation"
      // }

      const botMessage = {
        id: Date.now() + 1,
        text:
          data.reply ||
          "Sorry, I couldn't generate a response.",
        sender: "bot",
        tool: data.tool || null,
      };

      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error("Chatbot error:", error);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text:
            "⚠️ I couldn't connect to the AI server. Please make sure the chatbot backend is running.",
          sender: "bot",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // ENTER KEY
  // =====================================================

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // =====================================================
  // QUICK QUESTIONS
  // =====================================================

  const quickQuestions = [
    "Which crop is suitable for my soil?",
    "How can I improve soil fertility?",
    "What fertilizer should I use?",
    "My plant leaves are turning yellow",
    "What is the importance of soil pH?",
    "What weather conditions are good for farming?",
  ];

  const handleQuickQuestion = (question) => {
    setInput(question);
  };

  // =====================================================
  // TOOL NAVIGATION
  // =====================================================

  const handleToolNavigation = (tool) => {
    if (tool === "crop_recommendation") {
      navigate("/crop");
    }

    if (tool === "fertilizer_recommendation") {
      navigate("/fertilizer");
    }

    if (tool === "disease_detection") {
      navigate("/disease");
    }
  };

  return (
    <div className="ai-chat-page">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <div className="chat-navbar">

        <div className="brand-section">

          <div className="ai-logo">
            🌱
          </div>

          <div>
            <h2>AGRIHUB AI</h2>

            <span className="online-status">
              <span className="status-dot"></span>
              AI Farming Assistant
            </span>
          </div>

        </div>

        <button
          className="dashboard-button"
          onClick={() => navigate("/")}
        >
          Dashboard
        </button>

      </div>


      {/* =================================================
          MAIN CHAT AREA
      ================================================= */}

      <div className="chat-wrapper">

        <div className="chat-card">

          {/* HEADER */}

          <div className="chat-header">

            <div className="assistant-avatar">
              🤖
            </div>

            <div>

              <h3>
                Smart Agriculture Assistant
              </h3>

              <p>
                Ask me anything about farming
              </p>

            </div>

          </div>


          {/* =================================================
              MESSAGES
          ================================================= */}

          <div className="messages-container">

            {messages.map((msg) => (

              <div
                key={msg.id}
                className={
                  msg.sender === "user"
                    ? "message-row user-row"
                    : "message-row bot-row"
                }
              >

                {msg.sender === "bot" && (
                  <div className="message-avatar">
                    🤖
                  </div>
                )}

                <div
                  className={
                    msg.sender === "user"
                      ? "message user-message"
                      : "message bot-message"
                  }
                >

                  <p>
                    {msg.text}
                  </p>

                  {/* TOOL ACTION */}

                  {msg.tool && (
                    <button
                      className="tool-button"
                      onClick={() =>
                        handleToolNavigation(msg.tool)
                      }
                    >
                      Open AGRIHUB Tool →
                    </button>
                  )}

                </div>

                {msg.sender === "user" && (
                  <div className="message-avatar user-avatar">
                    👨‍🌾
                  </div>
                )}

              </div>

            ))}


            {/* =================================================
                TYPING INDICATOR
            ================================================= */}

            {loading && (

              <div className="message-row bot-row">

                <div className="message-avatar">
                  🤖
                </div>

                <div className="message bot-message typing">

                  <span></span>
                  <span></span>
                  <span></span>

                </div>

              </div>

            )}

            <div ref={messagesEndRef} />

          </div>


          {/* =================================================
              QUICK QUESTIONS
          ================================================= */}

          <div className="quick-section">

            <p>
              Try asking:
            </p>

            <div className="quick-buttons">

              {quickQuestions.map(
                (question, index) => (

                  <button
                    key={index}
                    onClick={() =>
                      handleQuickQuestion(question)
                    }
                  >
                    {question}
                  </button>

                )
              )}

            </div>

          </div>


          {/* =================================================
              INPUT
          ================================================= */}

          <div className="input-section">

            <input
              type="text"
              placeholder="Ask your farming question..."
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={handleKeyDown}
              disabled={loading}
            />

            <button
              className="send-button"
              onClick={handleSend}
              disabled={
                loading || !input.trim()
              }
            >

              {loading ? "..." : "➤"}

            </button>

          </div>


          {/* FOOTER */}

          <div className="chat-footer">

            <span>
              🌱 AI-powered agricultural assistance
            </span>

            <span>
              RAG • ML • Weather • AI
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}