import { Link } from "react-router-dom";
import "../../App.css";

export default function Dashboard() {
  return (
    <div>
      {/* Navbar */}
      <div className="navbar">
        <h2>AgriMind AI - Dashboard</h2>
        <div>
          <Link to="/profile">Profile</Link>
          <Link to="/login" onClick={() => localStorage.clear()}>
            Logout
          </Link>
        </div>
      </div>

      <div className="container">
        <h1>Welcome to Dashboard 🌱</h1>
        <p>Select a feature to continue</p>

        {/* Cards */}
        <div>
          <Link to="/disease">
            <div className="card">
              <h3>Disease Detection</h3>
              <p>Upload plant images and detect diseases</p>
            </div>
          </Link>

          <Link to="/crop">
            <div className="card">
              <h3>Crop Recommendation</h3>
              <p>Get best crops based on soil & weather</p>
            </div>
          </Link>

          <Link to="/fertilizer">
            <div className="card">
              <h3>Fertilizer Recommendation</h3>
              <p>Find best fertilizer for your crop</p>
            </div>
          </Link>

          <Link to="/chatbot">
            <div className="card">
              <h3>AI Chatbot</h3>
              <p>Ask farming questions instantly</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}