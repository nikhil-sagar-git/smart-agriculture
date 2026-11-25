
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  Sprout,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ScanLine,
  CloudSun,
  Bot,
  Loader2,
  AlertCircle,
  CheckCircle2,
  UserPlus
} from "lucide-react";

import "./Login.css";

const backendURL =
  "https://smart-agriculture-node.onrender.com";

export default function Login() {

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [msg, setMsg] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Image from public/images folder
  const backgroundImage =
    `${process.env.PUBLIC_URL}/images/agriculture-hero.jpg`;

  // Handle input changes
  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    setMsg("");
  };

  // ================= LOGIN =================

  const login = async (e) => {

    e.preventDefault();

    if (loading) return;

    if (!form.email.trim() || !form.password) {

      setMessageType("error");
      setMsg("Please enter your email and password.");

      return;
    }

    setLoading(true);
    setMsg("");

    try {

      const res = await fetch(
        `${backendURL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: form.email.trim(),
            password: form.password
          })
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {

        setMessageType("error");

        setMsg(
          data.message ||
          "Invalid email or password."
        );

        return;
      }

      if (!data.user) {

        setMessageType("error");
        setMsg("Invalid server response.");

        return;
      }

      // Clear previous authentication information
      localStorage.removeItem("username");
      localStorage.removeItem("useremail");
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      // Store user information
      localStorage.setItem(
        "username",
        data.user.username || ""
      );

      localStorage.setItem(
        "useremail",
        data.user.email || form.email.trim()
      );

      // Prefer the actual token returned by the backend.
      // Legacy fallback only for existing frontend compatibility.
      localStorage.setItem(
        "token",
        data.token || "user123"
      );

      const role =
        data.user.role || data.role || "user";

      localStorage.setItem("role", role);

      setMessageType("success");
      setMsg("Login successful!");

      // Redirect according to backend-provided role
      if (role === "admin") {

        navigate("/admin", { replace: true });

      } else {

        navigate("/dashboard", { replace: true });

      }

    } catch (err) {

      console.error("Login error:", err);

      setMessageType("error");

      setMsg(
        "Unable to connect to the server. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="agr-login-page">

      {/* LEFT SIDE - AGRICULTURE BRANDING */}

      <aside
        className="agr-login-visual"
        style={{
          backgroundImage: `url("${backgroundImage}")`
        }}
      >

        <div className="agr-login-overlay"></div>

        <div className="agr-login-visual-content">

          {/* Logo */}

          <Link to="/" className="agr-login-logo">

            <div className="agr-login-logo-icon">
              <Sprout size={30} />
            </div>

            <span>
              AgriMind <strong>AI</strong>
            </span>

          </Link>

          {/* Introduction */}

          <div className="agr-login-intro">

            <div className="agr-login-badge">

              <span className="agr-login-pulse"></span>

              INTELLIGENT AGRICULTURE

            </div>

            <h1>

              Smarter decisions.

              <br />

              <span>Better harvests.</span>

            </h1>

            <p>

              Your intelligent agriculture companion.
              Harness the power of artificial intelligence
              to grow smarter and farm better.

            </p>

            {/* Feature highlights */}

            <div className="agr-login-benefits">

              <div className="agr-login-benefit">

                <div>
                  <Sprout size={22} />
                </div>

                <span>Intelligent crop recommendations</span>

              </div>

              <div className="agr-login-benefit">

                <div>
                  <ScanLine size={22} />
                </div>

                <span>AI-powered disease detection</span>

              </div>

              <div className="agr-login-benefit">

                <div>
                  <CloudSun size={22} />
                </div>

                <span>Weather intelligence</span>

              </div>

              <div className="agr-login-benefit">

                <div>
                  <Bot size={22} />
                </div>

                <span>Personal AI farming assistant</span>

              </div>

            </div>

          </div>

          {/* Copyright */}

          <div className="agr-login-copyright">

            © {new Date().getFullYear()} AgriMind AI.
            Built for a greener future.

          </div>

        </div>

      </aside>

      {/* RIGHT SIDE - LOGIN FORM */}

      <main className="agr-login-main">

        <Link to="/" className="agr-login-back">

          <ArrowLeft size={18} />

          Back to Home

        </Link>

        <div className="agr-login-wrapper">

          {/* Heading */}

          <div className="agr-login-heading">

            <div className="agr-login-heading-icon">

              <Sprout size={32} />

            </div>

            <span className="agr-login-eyebrow">

              WELCOME BACK

            </span>

            <h2>Sign in to your account</h2>

            <p>

              Continue your journey towards smarter farming.

            </p>

          </div>

          {/* Login form */}

          <form
            className="agr-login-form"
            onSubmit={login}
          >

            {/* Email */}

            <div className="agr-login-field">

              <label htmlFor="login-email">

                Email address

              </label>

              <div className="agr-login-input">

                <Mail size={20} />

                <input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  disabled={loading}
                  required
                />

              </div>

            </div>

            {/* Password */}

            <div className="agr-login-field">

              <label htmlFor="login-password">

                Password

              </label>

              <div className="agr-login-input">

                <LockKeyhole size={20} />

                <input
                  id="login-password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  disabled={loading}
                  required
                />

                <button
                  type="button"
                  className="agr-login-eye"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  aria-pressed={showPassword}
                >

                  {showPassword
                    ? <EyeOff size={20} />
                    : <Eye size={20} />}

                </button>

              </div>

            </div>

            {/* Status message */}

            {msg && (

              <div
                className={`agr-login-message ${messageType}`}
                role={
                  messageType === "error"
                    ? "alert"
                    : "status"
                }
              >

                {messageType === "success" ? (

                  <CheckCircle2 size={20} />

                ) : (

                  <AlertCircle size={20} />

                )}

                <span>{msg}</span>

              </div>

            )}

            {/* Login button */}

            <button
              type="submit"
              className="agr-login-submit"
              disabled={loading}
            >

              {loading ? (

                <>

                  <Loader2
                    size={21}
                    className="agr-login-spinner"
                  />

                  Signing in...

                </>

              ) : (

                <>

                  Sign In

                  <ArrowRight size={20} />

                </>

              )}

            </button>

          </form>

          {/* Divider */}

          <div className="agr-login-divider">

            <span></span>

            <p>New to AgriMind AI?</p>

            <span></span>

          </div>

          {/* Register button */}

          <Link
            to="/register"
            className="agr-login-register-btn"
          >

            <UserPlus size={20} />

            Create an Account

          </Link>

          {/* Bottom information */}

          <div className="agr-login-bottom">

            <Sprout size={16} />

            <span>

              Growing a smarter and greener future together.

            </span>

          </div>

        </div>

      </main>

    </div>

  );

}
