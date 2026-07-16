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
  const [sendingOTP, setSendingOTP] = useState(false);
  const [registering, setRegistering] = useState(false);

  const backendURL = "https://smart-agriculture-node.onrender.com";
  const navigate = useNavigate();

  // Countdown Timer
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // ================= SEND OTP =================

  const sendOTP = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
      setMessage("Enter a valid email.");
      return;
    }

    setSendingOTP(true);
    setMessage("Sending OTP...");

    try {
      const res = await fetch(`${backendURL}/sendotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: form.email
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to send OTP");
        return;
      }

      setTimer(60);
      setMessage("OTP sent successfully");

    } catch (err) {
      console.log(err);
      setMessage("Server error");
    } finally {
      setSendingOTP(false);
    }
  };

  // ================= REGISTER =================

  const verifyAndRegister = async (e) => {
    e.preventDefault();

    if (!form.username) {
      setMessage("Enter username");
      return;
    }

    if (!form.email) {
      setMessage("Enter email");
      return;
    }

    if (!otp) {
      setMessage("Enter OTP");
      return;
    }

    if (!form.password) {
      setMessage("Enter password");
      return;
    }

    setRegistering(true);

    try {
      // Verify OTP
      const verify = await fetch(`${backendURL}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: form.email,
          otp
        })
      });

      const verifyData = await verify.json();

      if (!verify.ok) {
        setMessage(verifyData.message);
        return;
      }

      // Register
      const register = await fetch(`${backendURL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const registerData = await register.json();

      if (!register.ok) {
        setMessage(registerData.message);
        return;
      }

      setMessage("Registration Successful");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.log(err);
      setMessage("Server Error");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="container">
      <form className="card" onSubmit={verifyAndRegister}>

        <h2>Register</h2>

        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <button
          type="button"
          onClick={sendOTP}
          disabled={sendingOTP || timer > 0}
        >
          {sendingOTP
            ? "Sending..."
            : timer > 0
            ? `Wait ${timer}s`
            : "Send OTP"}
        </button>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          type="submit"
          disabled={registering}
        >
          {registering ? "Registering..." : "Register"}
        </button>

        {message && (
          <p>{message}</p>
        )}

        <p>
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>

      </form>
    </div>
  );
}