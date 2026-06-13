import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    if (form.email==="agriproadmin@gmail.com" && form.password==="admin123")
    {
      localStorage.setItem("token", "admin123");
      localStorage.setItem("role", "admin");
      navigate("/admin");
    }

    const res = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("useremail", data.user.email);
      localStorage.setItem("token", "user123");   // ✅ ADD THIS
      localStorage.setItem("role", "user");
      navigate("/dashboard");
    } else {
      setMsg(data.message);
    }
  };

  return (
    <div className="container">
      <form onSubmit={login} className="card">
        <h2>Login</h2>

        <input placeholder="Email" onChange={e => setForm({...form, email:e.target.value})}/>
        <input type="password" placeholder="Password" onChange={e => setForm({...form, password:e.target.value})}/>

        <button>Login</button>
        <p>{msg}</p>

        <Link to="/register">Register</Link>
      </form>
    </div>
  );
}