import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Chatbot() {

  const navigate = useNavigate();

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([

    {
      text:
      "Hello Farmer Ask me about crops, fertilizer, diseases and farming tips.",
      sender: "bot"
    }

  ]);

  // ==========================================
  // SEND MESSAGE
  // ==========================================

  const handleSend = () => {

    if (!input) return;

    let reply =
      "Sorry, I don't understand that question.";

    const userText =
      input.toLowerCase();

    // ==========================================
    // FERTILIZER PREDICTION
    // ==========================================

    if (

      userText.includes("fertilizer") ||
      userText.includes("nitrogen") ||
      userText.includes("phosphorous") ||
      userText.includes("potassium")

    ) {

      reply =
        "Go to Fertilizer Prediction page for fertilizer recommendation.";

      setTimeout(() => {

        navigate("/fertilizer");

      }, 2000);
    }

    // ==========================================
    // CROP PREDICTION
    // ==========================================

    else if (

      userText.includes("crop") ||
      userText.includes("best crop") ||
      userText.includes("which crop")

    ) {

      reply =
        "Go to Crop Recommendation page for crop prediction.";

      setTimeout(() => {

        navigate("/crop");

      }, 2000);
    }

    // ==========================================
    // DISEASE DETECTION
    // ==========================================

    else if (

      userText.includes("disease") ||
      userText.includes("leaf") ||
      userText.includes("yellow leaves") ||
      userText.includes("spots")

    ) {

      reply =
        "Go to Disease Detection page to upload leaf image.";

      setTimeout(() => {

        navigate("/disease");

      }, 2000);
    }

    // ==========================================
    // PH QUESTIONS
    // ==========================================

    else if (

      userText.includes("ph")

    ) {

      reply =
        "Ideal soil pH for most crops is between 6 and 7.5.";
    }

    // ==========================================
    // RAINFALL QUESTIONS
    // ==========================================

    else if (

      userText.includes("rainfall")

    ) {

      reply =
        "Rainfall is important for crop growth and recommendation.";
    }

    // ==========================================
    // TEMPERATURE QUESTIONS
    // ==========================================

    else if (

      userText.includes("temperature")

    ) {

      reply =
        "Temperature affects crop growth and fertilizer efficiency.";
    }

    // ==========================================
    // MOISTURE QUESTIONS
    // ==========================================

    else if (

      userText.includes("moisture")

    ) {

      reply =
        "Soil moisture helps determine irrigation and fertilizer usage.";
    }

    // ==========================================
    // GREETINGS
    // ==========================================

    else if (

      userText.includes("hello") ||
      userText.includes("hi")

    ) {

      reply =
        "Hello How can I help you today?";
    }

    // ==========================================
    // THANK YOU
    // ==========================================

    else if (

      userText.includes("thank")

    ) {

      reply =
        "You're welcome";
    }

    // ==========================================
    // UPDATE CHAT
    // ==========================================

    setMessages([

      ...messages,

      {
        text: input,
        sender: "user"
      },

      {
        text: reply,
        sender: "bot"
      }

    ]);

    setInput("");
  };

  // ==========================================
  // UI
  // ==========================================

  return (

    <div>

      {/* NAVBAR */}

      <div className="navbar">

        <h2>
          AI Farming Chatbot
        </h2>

      </div>

      {/* CHAT CONTAINER */}

      <div
        className="container"
        style={{
          maxWidth: "700px",
          margin: "30px auto"
        }}
      >

        <h1>
          Ask Farming Questions
        </h1>

        {/* CHAT BOX */}

        <div
          style={{

            border: "1px solid #ccc",

            padding: "15px",

            height: "400px",

            overflowY: "scroll",

            borderRadius: "10px",

            backgroundColor: "#f9f9f9",

            marginBottom: "15px"

          }}
        >

          {
            messages.map((msg, index) => (

              <div
                key={index}

                style={{

                  textAlign:
                  msg.sender === "user"
                  ? "right"
                  : "left",

                  margin: "10px"

                }}
              >

                <span

                  style={{

                    background:
                    msg.sender === "user"
                    ? "#2e7d32"
                    : "#e0e0e0",

                    color:
                    msg.sender === "user"
                    ? "white"
                    : "black",

                    padding: "10px 15px",

                    borderRadius: "15px",

                    display: "inline-block",

                    maxWidth: "70%",

                    wordWrap: "break-word"

                  }}
                >

                  {msg.text}

                </span>

              </div>
            ))
          }

        </div>

        {/* INPUT AREA */}

        <div
          style={{
            display: "flex",
            gap: "10px"
          }}
        >

          <input

            type="text"

            placeholder="Ask something about farming..."

            value={input}

            onChange={(e) =>
              setInput(e.target.value)
            }

            style={{
              flex: 1
            }}

          />

          <button
            className="btn"
            onClick={handleSend}
          >

            Send

          </button>

        </div>

      </div>

    </div>
  );
}