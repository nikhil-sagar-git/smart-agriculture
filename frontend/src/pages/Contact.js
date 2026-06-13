import { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div>
      <div className="navbar">
        <h2>AgriMind AI</h2>
        <div>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h2>Contact Us</h2>

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <textarea
            name="message"
            placeholder="Message"
            value={form.message}
            onChange={handleChange}
            required
          />

          <button className="btn">Send</button>
        </form>
      </div>
    </div>
  );
}