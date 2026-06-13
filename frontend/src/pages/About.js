import { Link } from "react-router-dom";
import "../App.css";

export default function About() {
  return (
    <div>
      <div className="navbar">
        <h2>AgriMind AI</h2>
        <div>
          <Link to="/">Home</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>

      <div className="container">
        <h1>About AgriMind AI</h1>

        <p>
          AgriMind AI is a smart agriculture platform that helps farmers using
          Machine Learning, Deep Learning, and NLP.
        </p>

        <h3>Features:</h3>
        <ul>
          <li>Disease Detection</li>
          <li>Crop Recommendation</li>
          <li>Fertilizer Suggestion</li>
          <li>AI Chatbot</li>
        </ul>

        <h3>Technologies:</h3>
        <ul>
          <li>React</li>
          <li>Node.js</li>
          <li>MongoDB</li>
          <li>TensorFlow</li>
        </ul>
      </div>
    </div>
  );
}