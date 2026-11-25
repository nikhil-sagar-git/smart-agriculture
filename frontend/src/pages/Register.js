
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Sprout,
  User,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Info,
  Loader2,
  ScanLine,
  Bot,
  KeyRound
} from "lucide-react";

import "./Register.css";

const backendURL =
  "https://smart-agriculture-node.onrender.com";

export default function Register() {

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const [sendingOTP, setSendingOTP] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");

  const navigate = useNavigate();

  const backgroundImage =
    `${process.env.PUBLIC_URL}/images/agriculture-hero.jpg`;

  // OTP countdown
  useEffect(() => {
    if (timer <= 0) return;

    const timeout = setTimeout(() => {
      setTimer((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearTimeout(timeout);
  }, [timer]);

  // Redirect after successful registration
  useEffect(() => {
    if (!registered) return;

    const timeout = setTimeout(() => {
      navigate("/login");
    }, 1500);

    return () => clearTimeout(timeout);
  }, [registered, navigate]);

  // Display messages
  const notify = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);
  };

  // Validate email
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Update input values
  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    if (name === "email") {
      setOtp("");
      setOtpEmail("");
    }

    setMessage("");
  };

  // Password strength indicator
  const passwordStrength = [
    form.password.length >= 8,
    /[A-Z]/.test(form.password),
    /[a-z]/.test(form.password),
    /[0-9]/.test(form.password),
    /[^A-Za-z0-9]/.test(form.password)
  ].filter(Boolean).length;

  const strengthLabel =
    passwordStrength <= 2
      ? "Weak"
      : passwordStrength <= 4
      ? "Medium"
      : "Strong";

  const strengthClass =
    strengthLabel.toLowerCase();

  const busy = sendingOTP || registering || registered;

  // ================= SEND OTP =================

  const sendOTP = async () => {

    if (busy || timer > 0) return;

    const email = form.email.trim();

    if (!isValidEmail(email)) {
      notify("Please enter a valid email address.", "error");
      return;
    }

    setSendingOTP(true);
    notify("Sending verification code...", "info");

    try {

      const response = await fetch(
        `${backendURL}/sendotp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email })
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        notify(
          data.message || "Unable to send OTP. Please try again.",
          "error"
        );
        return;
      }

      setOtp("");
      setOtpEmail(email);
      setTimer(60);

      notify(
        "Verification code sent successfully. Check your email.",
        "success"
      );

    } catch (err) {

      console.error(err);

      notify(
        "Unable to connect to the server. Please try again.",
        "error"
      );

    } finally {

      setSendingOTP(false);

    }
  };

  // ================= REGISTER =================

  const register = async (e) => {

    e.preventDefault();

    if (busy) return;

    const username = form.username.trim();
    const email = form.email.trim();

    if (!username || !email || !otp || !form.password) {
      notify("Please complete all fields.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      notify("Please enter a valid email address.", "error");
      return;
    }

    if (otpEmail !== email) {
      notify(
        "Please request an OTP for this email address.",
        "error"
      );
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      notify("Please enter the 6-digit OTP.", "error");
      return;
    }

    setRegistering(true);
    notify("Verifying your account...", "info");

    try {

      // Verify OTP
      const verify = await fetch(
        `${backendURL}/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            otp
          })
        }
      );

      const verifyData =
        await verify.json().catch(() => ({}));

      if (!verify.ok) {

        notify(
          verifyData.message || "Invalid or expired OTP.",
          "error"
        );

        return;
      }

      notify("Creating your account...", "info");

      // Register user
      const response = await fetch(
        `${backendURL}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username,
            email,
            password: form.password
          })
        }
      );

      const data =
        await response.json().catch(() => ({}));

      if (!response.ok) {

        notify(
          data.message || "Registration failed.",
          "error"
        );

        return;
      }

      setRegistered(true);

      notify(
        "Registration successful! Redirecting to login...",
        "success"
      );

    } catch (err) {

      console.error(err);

      notify(
        "Server connection failed. Please try again.",
        "error"
      );

    } finally {

      setRegistering(false);

    }
  };

  return (

    <div className="agr-register">

      {/* LEFT SIDE - BRANDING */}

      <aside
        className="agr-register-visual"
        style={{
          backgroundImage: `url("${backgroundImage}")`
        }}
      >

        <div className="agr-register-overlay"></div>

        <div className="agr-register-visual-content">

          <Link to="/" className="agr-register-logo">

            <div className="agr-register-logo-icon">
              <Sprout size={30} />
            </div>

            <span>
              AgriMind <strong>AI</strong>
            </span>

          </Link>

          <div className="agr-register-intro">

            <div className="agr-register-badge">
              <Sprout size={16} />
              THE FUTURE OF AGRICULTURE
            </div>

            <h1>
              Your journey to
              <br />
              <span>smarter farming</span>
              <br />
              starts here.
            </h1>

            <p>
              Discover the power of artificial intelligence
              and make informed agricultural decisions
              with AgriMind AI.
            </p>

            <div className="agr-register-benefits">

              <div className="agr-register-benefit">
                <div><Sprout size={22} /></div>
                <span>Intelligent crop recommendations</span>
              </div>

              <div className="agr-register-benefit">
                <div><ScanLine size={22} /></div>
                <span>AI-powered plant disease detection</span>
              </div>

              <div className="agr-register-benefit">
                <div><Bot size={22} /></div>
                <span>Personal agriculture assistant</span>
              </div>

              <div className="agr-register-benefit">
                <div><ShieldCheck size={22} /></div>
                <span>Email verification</span>
              </div>

            </div>

          </div>

          <div className="agr-register-copyright">
            © {new Date().getFullYear()} AgriMind AI.
            Built for a greener future.
          </div>

        </div>

      </aside>

      {/* RIGHT SIDE - REGISTRATION FORM */}

      <main className="agr-register-main">

        <Link to="/" className="agr-register-back">
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="agr-register-form-wrapper">

          <div className="agr-register-heading">

            <div className="agr-register-heading-icon">
              <Sprout size={30} />
            </div>

            <span className="agr-register-eyebrow">
              JOIN AGRIMIND AI
            </span>

            <h2>Create your account</h2>

            <p>
              Start your journey towards intelligent agriculture.
            </p>

          </div>

          <form
            className="agr-register-form"
            onSubmit={register}
          >

            {/* Username */}

            <div className="agr-register-field">

              <label htmlFor="reg-username">
                Username
              </label>

              <div className="agr-register-input">

                <User size={19} />

                <input
                  id="reg-username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                  disabled={busy}
                  required
                />

              </div>

            </div>

            {/* Email */}

            <div className="agr-register-field">

              <label htmlFor="reg-email">
                Email address
              </label>

              <div className="agr-register-input">

                <Mail size={19} />

                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  disabled={busy}
                  required
                />

              </div>

            </div>

            {/* Send OTP */}

            <button
              type="button"
              className="agr-register-otp-btn"
              onClick={sendOTP}
              disabled={busy || timer > 0}
            >

              {sendingOTP ? (
                <>
                  <Loader2
                    size={18}
                    className="agr-register-spinner"
                  />
                  Sending verification code...
                </>
              ) : timer > 0 ? (
                <>
                  <Mail size={18} />
                  Resend OTP in {timer}s
                </>
              ) : (
                <>
                  <Mail size={18} />
                  {otpEmail ? "Resend OTP" : "Send verification code"}
                </>
              )}

            </button>

            {/* OTP */}

            <div className="agr-register-field">

              <label htmlFor="reg-otp">
                Verification code
              </label>

              <div className="agr-register-input agr-register-otp-input">

                <KeyRound size={19} />

                <input
                  id="reg-otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  maxLength={6}
                  onChange={(e) =>
                    setOtp(
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                  disabled={busy}
                  required
                />

                {otp.length === 6 && (
                  <CheckCircle2
                    size={20}
                    className="agr-register-check"
                  />
                )}

              </div>

              <small className="agr-register-help">
                Enter the verification code sent to your email.
              </small>

            </div>

            {/* Password */}

            <div className="agr-register-field">

              <label htmlFor="reg-password">
                Password
              </label>

              <div className="agr-register-input">

                <LockKeyhole size={19} />

                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  disabled={busy}
                  required
                />

                <button
                  type="button"
                  className="agr-register-eye"
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
                    ? <EyeOff size={19} />
                    : <Eye size={19} />}
                </button>

              </div>

              {/* Password strength */}

              {form.password && (

                <div className="agr-register-strength">

                  <div className="agr-register-strength-bars">

                    {[1, 2, 3, 4, 5].map((level) => (

                      <span
                        key={level}
                        className={
                          level <= passwordStrength
                            ? strengthClass
                            : ""
                        }
                      />

                    ))}

                  </div>

                  <small>
                    Password strength:{" "}
                    <strong className={strengthClass}>
                      {strengthLabel}
                    </strong>
                  </small>

                </div>

              )}

            </div>

            {/* Status message */}

            {message && (

              <div
                className={`agr-register-message ${messageType}`}
                role={messageType === "error" ? "alert" : "status"}
              >

                {messageType === "success" ? (
                  <CheckCircle2 size={20} />
                ) : messageType === "error" ? (
                  <AlertCircle size={20} />
                ) : (
                  <Info size={20} />
                )}

                <span>{message}</span>

              </div>

            )}

            {/* Register button */}

            <button
              type="submit"
              className="agr-register-submit"
              disabled={busy}
            >

              {registered ? (
                <>
                  <CheckCircle2 size={21} />
                  Account Created
                </>
              ) : registering ? (
                <>
                  <Loader2
                    size={21}
                    className="agr-register-spinner"
                  />
                  Creating your account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={20} />
                </>
              )}

            </button>

          </form>

          {/* Login link */}

          <div className="agr-register-login">

            Already have an account?{" "}

            <Link to="/login">
              Sign in
            </Link>

          </div>

          <div className="agr-register-security">

            <ShieldCheck size={16} />

            <span>
              Your account uses email verification.
            </span>

          </div>

        </div>

      </main>

    </div>

  );
}
