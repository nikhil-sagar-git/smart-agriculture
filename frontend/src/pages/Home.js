import { Link } from "react-router-dom";
import "../App.css";

export default function Home() {
  return (
    <div>
      <div className="navbar">
        <h2>AgriMind AI</h2>
        <div>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login">Login</Link>
        </div>
      </div>

      <div className="container">
        <h1>Smart Agriculture with AI 🌱</h1>
        <p>AI-based crop, disease, and fertilizer solutions for farmers.</p>

        <Link to="/register">
          <button className="btn">Get Started</button>
        </Link>

        <Link to="/about">
          <button className="btn btn-outline">Learn More</button>
        </Link>
      </div>

      <div className="container">
        <div className="card">
          <h3>Disease Detection</h3>
          <p>Upload plant images and detect diseases.</p>
        </div>

        <div className="card">
          <h3>Crop Recommendation</h3>
          <p>Get best crop suggestions.</p>
        </div>

        <div className="card">
          <h3>AI Chatbot</h3>
          <p>Ask farming questions instantly.</p>
        </div>
      </div>
    </div>
  );
}