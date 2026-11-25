
import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Sprout,
  Bot,
  Plus,
  LayoutDashboard,
  ScanLine,
  FlaskConical,
  Droplets,
  ArrowUp,
  ArrowUpRight,
  Sparkles,
  Copy,
  Check,
  Trash2,
  Menu,
  X,
  AlertCircle,
  User,
  Leaf
} from "lucide-react";

import "./Chatbot.css";

const API_URL =
  "https://smart-agriculture-python3.onrender.com/chat";

const suggestions = [
  {
    title: "Crop Cultivation",
    question: "How do I choose the best crop for my soil?",
    icon: Sprout,
    color: "green"
  },
  {
    title: "Soil Nutrition",
    question: "How can I improve soil fertility?",
    icon: FlaskConical,
    color: "orange"
  },
  {
    title: "Plant Health",
    question: "How can I prevent common plant diseases?",
    icon: ScanLine,
    color: "purple"
  },
  {
    title: "Water Management",
    question: "How can farmers save water during irrigation?",
    icon: Droplets,
    color: "blue"
  }
];

const navigation = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard
  },
  {
    name: "AI Assistant",
    path: "/chatbot",
    icon: Bot
  },
  {
    name: "Crop Recommendation",
    path: "/crop",
    icon: Sprout
  },
  {
    name: "Disease Detection",
    path: "/disease",
    icon: ScanLine
  },
  {
    name: "Fertilizer Recommendation",
    path: "/fertilizer",
    icon: FlaskConical
  }
];

export default function Chatbot() {

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const messagesRef = useRef(null);
  const inputRef = useRef(null);
  const copyTimerRef = useRef(null);
  const sendingRef = useRef(false);

  const username =
    localStorage.getItem("username")?.trim() || "Farmer";

  const email =
    localStorage.getItem("useremail") || "";

  const initials = username
    .split(/\s+/)
    .slice(0, 2)
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase();

  // ================= AUTO SCROLL =================

  useEffect(() => {

    if (messagesRef.current) {
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: "smooth"
      });
    }

  }, [messages, loading]);

  // ================= AUTO RESIZE INPUT =================

  useEffect(() => {

    if (inputRef.current) {

      inputRef.current.style.height = "auto";

      inputRef.current.style.height =
        Math.min(inputRef.current.scrollHeight, 150) + "px";

    }

  }, [input]);

  useEffect(() => {

    return () => clearTimeout(copyTimerRef.current);

  }, []);

  // ================= SEND MESSAGE =================

  const handleSend = async (e) => {

    e?.preventDefault();

    const question = input.trim();

    if (!question || sendingRef.current) return;

    sendingRef.current = true;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: question
      }
    ]);

    setInput("");
    setError("");
    setLoading(true);

    try {

      const res = await fetch(API_URL, {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          message: question
        })

      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.error) {

        throw new Error(
          data.error ||
          data.message ||
          "Unable to get a response from the server."
        );

      }

      const reply =
        data.response ||
        data.reply ||
        data.answer ||
        data.message;

      if (typeof reply !== "string" || !reply.trim()) {

        throw new Error(
          "The server returned an empty or invalid response."
        );

      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply
        }
      ]);

    } catch (err) {

      console.error("Chatbot error:", err);

      setError(
        err.message ||
        "Unable to connect. Please try again."
      );

    } finally {

      sendingRef.current = false;
      setLoading(false);

    }

  };

  // ================= NEW CHAT =================

  const handleClearChat = () => {

    if (sendingRef.current) return;

    clearTimeout(copyTimerRef.current);

    setMessages([]);
    setInput("");
    setError("");
    setCopiedIndex(null);
    setSidebarOpen(false);

    inputRef.current?.focus();

  };

  // ================= COPY RESPONSE =================

  const handleCopy = async (content, index) => {

    try {

      await navigator.clipboard.writeText(content);

      setCopiedIndex(index);

      clearTimeout(copyTimerRef.current);

      copyTimerRef.current = setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);

    } catch (err) {

      setError("Unable to copy the response.");

    }

  };

  // ================= KEYBOARD HANDLING =================

  const handleKeyDown = (e) => {

    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      !e.nativeEvent.isComposing
    ) {

      e.preventDefault();

      handleSend();

    }

  };

  // ================= SUGGESTED QUESTIONS =================

  const selectQuestion = (question) => {

    setInput(question);

    inputRef.current?.focus();

  };

  return (

    <div className="agc-page">

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (

        <button
          type="button"
          className="agc-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />

      )}

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`agc-sidebar ${
          sidebarOpen ? "agc-sidebar-open" : ""
        }`}
      >

        <div className="agc-sidebar-header">

          <Link to="/dashboard" className="agc-logo">

            <div className="agc-logo-icon">
              <Sprout size={27} />
            </div>

            <div>
              <h2>AgriMind <span>AI</span></h2>
              <small>SMART AGRICULTURE</small>
            </div>

          </Link>

          <button
            type="button"
            className="agc-close-menu"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>

        </div>

        {/* NEW CHAT BUTTON */}

        <button
          type="button"
          className="agc-new-chat"
          onClick={handleClearChat}
          disabled={loading}
        >

          <Plus size={21} />

          <span>New Chat</span>

        </button>

        {/* NAVIGATION */}

        <div className="agc-nav-section">

          <p className="agc-nav-label">WORKSPACE</p>

          <nav className="agc-nav">

            {navigation.map((item) => {

              const Icon = item.icon;

              return (

                <NavLink
                  key={item.path}
                  to={item.path}
                  end
                  className={({ isActive }) =>
                    `agc-nav-link ${
                      isActive ? "agc-active" : ""
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >

                  <Icon size={19} />

                  <span>{item.name}</span>

                </NavLink>

              );

            })}

          </nav>

        </div>

        {/* SIDEBAR BOTTOM */}

        <div className="agc-sidebar-bottom">

          <div className="agc-ai-info">

            <div className="agc-ai-info-icon">
              <Sparkles size={22} />
            </div>

            <h4>Powered by AI</h4>

            <p>
              Intelligent agricultural guidance
              for smarter farming decisions.
            </p>

            <div className="agc-model-label">

              <span className="agc-model-dot"></span>

              AI Agriculture Assistant

            </div>

          </div>

          <Link to="/profile" className="agc-profile">

            <div className="agc-profile-avatar">
              {initials}
            </div>

            <div className="agc-profile-info">

              <strong>{username}</strong>

              <small>{email || "Farmer Account"}</small>

            </div>

            <User size={18} />

          </Link>

        </div>

      </aside>

      {/* ================= MAIN CHAT AREA ================= */}

      <main className="agc-main">

        {/* CHAT HEADER */}

        <header className="agc-header">

          <div className="agc-header-left">

            <button
              type="button"
              className="agc-menu-button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              aria-expanded={sidebarOpen}
            >
              <Menu size={24} />
            </button>

            <div className="agc-header-avatar">
              <Bot size={26} />
            </div>

            <div className="agc-header-title">

              <h2>AgriMind Assistant</h2>

              <p>AI-powered agriculture guidance</p>

            </div>

          </div>

          <div className="agc-header-right">

            <span className="agc-ai-badge">
              <Sparkles size={14} />
              AI Assistant
            </span>

            <button
              type="button"
              className="agc-clear-button"
              onClick={handleClearChat}
              disabled={loading}
              aria-label="Clear chat"
              title="Clear chat"
            >

              <Trash2 size={18} />

              <span>Clear Chat</span>

            </button>

          </div>

        </header>

        {/* ================= MESSAGES ================= */}

        <div
          className="agc-messages"
          ref={messagesRef}
        >

          {messages.length === 0 ? (

            /* ================= WELCOME SCREEN ================= */

            <section className="agc-welcome">

              <div className="agc-welcome-icon">

                <Sprout size={45} strokeWidth={1.7} />

                <span className="agc-welcome-sparkle">
                  <Sparkles size={17} />
                </span>

              </div>

              <div className="agc-welcome-badge">

                <Sparkles size={14} />

                YOUR INTELLIGENT FARMING COMPANION

              </div>

              <h1>
                How can I help you <span>grow?</span>
              </h1>

              <p className="agc-welcome-description">

                Welcome to Smart Agriculture Assistant.
                Ask me about crops, fertilizers, soil health,
                plant diseases and farming practices.

              </p>

              <div className="agc-suggestions">

                {suggestions.map((item) => {

                  const Icon = item.icon;

                  return (

                    <button
                      type="button"
                      key={item.title}
                      className={`agc-suggestion ${item.color}`}
                      onClick={() =>
                        selectQuestion(item.question)
                      }
                    >

                      <div className="agc-suggestion-top">

                        <div className="agc-suggestion-icon">
                          <Icon size={23} />
                        </div>

                        <ArrowUpRight
                          size={19}
                          className="agc-suggestion-arrow"
                        />

                      </div>

                      <h3>{item.title}</h3>

                      <p>{item.question}</p>

                    </button>

                  );

                })}

              </div>

              <div className="agc-welcome-footer">

                <Leaf size={16} />

                Growing smarter, together.

              </div>

            </section>

          ) : (

            /* ================= CONVERSATION ================= */

            <div
              className="agc-conversation"
              role="log"
              aria-live="polite"
            >

              {messages.map((msg, index) => (

                <div
                  key={index}
                  className={`agc-message ${
                    msg.role === "user"
                      ? "agc-user-message"
                      : "agc-assistant-message"
                  }`}
                >

                  <div className="agc-message-avatar">

                    {msg.role === "assistant"
                      ? <Sprout size={23} />
                      : <User size={21} />}

                  </div>

                  <div className="agc-message-body">

                    <div className="agc-message-role">

                      {msg.role === "assistant"
                        ? "AgriMind Assistant"
                        : "You"}

                    </div>

                    <div className="agc-message-content">

                      {msg.role === "assistant" ? (

                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                        >
                          {msg.content}
                        </ReactMarkdown>

                      ) : (

                        <p>{msg.content}</p>

                      )}

                    </div>

                    {msg.role === "assistant" && (

                      <div className="agc-message-actions">

                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(msg.content, index)
                          }
                          aria-label="Copy response"
                        >

                          {copiedIndex === index ? (

                            <>
                              <Check size={16} />
                              Copied
                            </>

                          ) : (

                            <>
                              <Copy size={16} />
                              Copy
                            </>

                          )}

                        </button>

                      </div>

                    )}

                  </div>

                </div>

              ))}

              {/* ================= LOADING ================= */}

              {loading && (

                <div className="agc-message agc-assistant-message">

                  <div className="agc-message-avatar">
                    <Sprout size={23} />
                  </div>

                  <div className="agc-message-body">

                    <div className="agc-message-role">
                      AgriMind Assistant
                    </div>

                    <div className="agc-thinking">

                      <div className="agc-typing">

                        <span></span>
                        <span></span>
                        <span></span>

                      </div>

                      <small>Thinking...</small>

                    </div>

                  </div>

                </div>

              )}

            </div>

          )}

        </div>

        {/* ================= INPUT SECTION ================= */}

        <div className="agc-composer">

          <div className="agc-composer-inner">

            {error && (

              <div className="agc-error" role="alert">

                <AlertCircle size={19} />

                <p>{error}</p>

                <button
                  type="button"
                  onClick={() => setError("")}
                  aria-label="Dismiss error"
                >
                  <X size={18} />
                </button>

              </div>

            )}

            <form
              className="agc-input-form"
              onSubmit={handleSend}
            >

              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about agriculture..."
                aria-label="Your agriculture question"
                disabled={loading}
              />

              <div className="agc-input-toolbar">

                <div className="agc-input-label">

                  <Sparkles size={16} />

                  <span>Agriculture AI</span>

                </div>

                <div className="agc-send-area">

                  <small>Enter to send</small>

                  <button
                    type="submit"
                    className="agc-send-button"
                    disabled={loading || !input.trim()}
                    aria-label="Send message"
                  >

                    {loading ? (

                      <span className="agc-spinner"></span>

                    ) : (

                      <ArrowUp size={23} />

                    )}

                  </button>

                </div>

              </div>

            </form>

            <p className="agc-disclaimer">

              AgriMind AI can make mistakes. Verify important
              farming decisions with a local agricultural expert.

            </p>

          </div>

        </div>

      </main>

    </div>

  );

}
