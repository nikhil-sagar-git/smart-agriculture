// import { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";

// export default function Register() {
//   const [form, setForm] = useState({ username: "", email: "", password: "" });
//   const [otp, setOtp] = useState("");
//   const [timer, setTimer] = useState(0);
//   const [message, setMessage] = useState("");

//   const backendURL = "https://smart-agriculture-node.onrender.com";
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (timer > 0) {
//       const i = setInterval(() => setTimer(timer - 1), 1000);
//       return () => clearInterval(i);
//     }
//   }, [timer]);

//   const sendOTP = async () => {
//     const res = await fetch(`${backendURL}/sendotp`, {
//       method: "POST",
//       headers: {"Content-Type": "application/json"},
//       body: JSON.stringify({ email: form.email })
//     });

//     if (res.ok) {
//       setTimer(60);
//       setMessage("OTP sent");
//     }
//   };

//   const verifyAndRegister = async (e) => {
//     e.preventDefault();

//     const verify = await fetch(`${backendURL}/verify`, {
//       method: "POST",
//       headers: {"Content-Type": "application/json"},
//       body: JSON.stringify({ email: form.email, otp })
//     });

//     if (!verify.ok) {
//       setMessage("Invalid OTP");
//       return;
//     }

//     const reg = await fetch(`${backendURL}/register`, {
//       method: "POST",
//       headers: {"Content-Type": "application/json"},
//       body: JSON.stringify(form)
//     });

//     if (reg.ok) {
//       navigate("/login");
//     } else {
//       setMessage("Registration failed");
//     }
//   };

//   return (
//     <div className="container">
//       <form onSubmit={verifyAndRegister} className="card">
//         <h2>Register</h2>

//         <input placeholder="Username" onChange={e => setForm({...form, username:e.target.value})}/>
//         <input placeholder="Email" onChange={e => setForm({...form, email:e.target.value})}/>

//         <button type="button" onClick={sendOTP} disabled={timer>0}>
//           {timer>0 ? `Wait ${timer}s` : "Send OTP"}
//         </button>

//         <input placeholder="Enter OTP" onChange={e => setOtp(e.target.value)}/>

//         <input type="password" placeholder="Password" onChange={e => setForm({...form, password:e.target.value})}/>

//         <button>Register</button>

//         <p>{message}</p>
//         <Link to="/login">Login</Link>
//       </form>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [message, setMessage] = useState("");

  const backendURL = "https://smart-agriculture-node.onrender.com";
  const navigate = useNavigate();

  // ================= TIMER FIX =================
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // ================= SEND OTP =================
  const sendOTP = async () => {
    if (!form.email) {
      setMessage("❌ Please enter email first");
      return;
    }

    try {
      const res = await fetch(`${backendURL}/sendotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "❌ OTP failed to send");
        return;
      }

      setTimer(60);
      setMessage(data.message);

    } catch (err) {
      setMessage("❌ Server error while sending OTP");
    }
  };

  // ================= VERIFY + REGISTER =================
  const verifyAndRegister = async (e) => {
    e.preventDefault();

    if (!otp) {
      setMessage("❌ Enter OTP");
      return;
    }

    try {
      // STEP 1: VERIFY OTP
      const verify = await fetch(`${backendURL}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          otp
        })
      });

      const verifyData = await verify.json();

      if (!verify.ok) {
        setMessage(verifyData.message || "❌ Invalid OTP");
        return;
      }

      // STEP 2: REGISTER USER
      const reg = await fetch(`${backendURL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const regData = await reg.json();

      if (!reg.ok) {
        setMessage(regData.message || "❌ Registration failed");
        return;
      }

      setMessage("✅ Registered successfully");
      navigate("/login");

    } catch (err) {
      setMessage("❌ Server error");
    }
  };

  return (
    <div className="container">
      <form onSubmit={verifyAndRegister} className="card">

        <h2>Register</h2>

        {/* USERNAME */}
        <input
          placeholder="Username"
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        {/* EMAIL */}
        <input
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* SEND OTP BUTTON */}
        <button
          type="button"
          onClick={sendOTP}
          disabled={timer > 0}
        >
          {timer > 0 ? `Wait ${timer}s` : "Send OTP"}
        </button>

        {/* OTP INPUT */}
        <input
          placeholder="Enter OTP"
          onChange={(e) => setOtp(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {/* REGISTER BUTTON */}
        <button type="submit">Register</button>

        {/* MESSAGE */}
        <p>{message}</p>

        <Link to="/login">Login</Link>
      </form>
    </div>
  );
}