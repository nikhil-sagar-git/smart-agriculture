
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  Sprout,
  LayoutDashboard,
  ScanLine,
  FlaskConical,
  Bot,
  User,
  Mail,
  Shield,
  LogOut,
  Menu,
  X,
  ArrowUpRight,
  Leaf,
  Sparkles,
  Copy,
  Check,
  ArrowRight
} from "lucide-react";

import "./Profile.css";

const navigation = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Crop Recommendation", path: "/crop", icon: Sprout },
  { name: "Disease Detection", path: "/disease", icon: ScanLine },
  { name: "Fertilizer Recommendation", path: "/fertilizer", icon: FlaskConical },
  { name: "AI Assistant", path: "/chatbot", icon: Bot },
  { name: "My Profile", path: "/profile", icon: User }
];

const quickAccess = [
  {
    title: "Crop Recommendation",
    description: "Discover suitable crops for your soil.",
    path: "/crop",
    icon: Sprout,
    color: "green"
  },
  {
    title: "Fertilizer Recommendation",
    description: "Analyze your soil nutrition requirements.",
    path: "/fertilizer",
    icon: FlaskConical,
    color: "orange"
  },
  {
    title: "Disease Detection",
    description: "Identify potential plant diseases.",
    path: "/disease",
    icon: ScanLine,
    color: "purple"
  },
  {
    title: "AI Assistant",
    description: "Get intelligent agriculture guidance.",
    path: "/chatbot",
    icon: Bot,
    color: "blue"
  }
];

export default function Profile() {

  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  const username =
    localStorage.getItem("username")?.trim() || "Farmer";

  const email =
    localStorage.getItem("useremail") || "";

  const role =
    localStorage.getItem("role") || "user";

  const initials = username
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

  const heroImage =
    `${process.env.PUBLIC_URL}/images/agriculture-hero.jpg`;

  // ================= LOGOUT =================

  const handleLogout = () => {

    [
      "username",
      "useremail",
      "token",
      "role"
    ].forEach((key) => localStorage.removeItem(key));

    navigate("/login", { replace: true });

  };

  // ================= COPY EMAIL =================

  const handleCopyEmail = async () => {

    if (!email) return;

    try {

      await navigator.clipboard.writeText(email);

      setCopied(true);
      setCopyError("");

    } catch (err) {

      setCopied(false);
      setCopyError("Unable to copy email address.");

    }

  };

  return (

    <div className="agprofile-page">

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (

        <button
          type="button"
          className="agprofile-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation"
        />

      )}

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`agprofile-sidebar ${
          sidebarOpen ? "agprofile-sidebar-open" : ""
        }`}
      >

        <div className="agprofile-sidebar-header">

          <Link to="/dashboard" className="agprofile-logo">

            <div className="agprofile-logo-icon">
              <Sprout size={28} />
            </div>

            <div>

              <h2>AgriMind <span>AI</span></h2>

              <small>SMART AGRICULTURE</small>

            </div>

          </Link>

          <button
            type="button"
            className="agprofile-close-menu"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >

            <X size={23} />

          </button>

        </div>

        <p className="agprofile-nav-label">WORKSPACE</p>

        <nav className="agprofile-nav">

          {navigation.map((item) => {

            const Icon = item.icon;

            return (

              <NavLink
                key={item.path}
                to={item.path}
                end
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `agprofile-nav-link ${
                    isActive ? "agprofile-active" : ""
                  }`
                }
              >

                <Icon size={20} />

                <span>{item.name}</span>

              </NavLink>

            );

          })}

        </nav>

        <div className="agprofile-sidebar-bottom">

          <div className="agprofile-sidebar-info">

            <Sparkles size={25} />

            <h4>Your Smart Farming Workspace</h4>

            <p>
              Access intelligent agriculture tools
              from one unified platform.
            </p>

          </div>

          <button
            type="button"
            className="agprofile-sidebar-logout"
            onClick={() => {
              setSidebarOpen(false);
              setShowLogout(true);
            }}
          >

            <LogOut size={19} />

            Logout

          </button>

        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <main className="agprofile-main">

        <header className="agprofile-header">

          <div className="agprofile-header-left">

            <button
              type="button"
              className="agprofile-menu-button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              aria-expanded={sidebarOpen}
            >

              <Menu size={25} />

            </button>

            <div>

              <h2>My Profile</h2>

              <p>View your account and agriculture workspace</p>

            </div>

          </div>

          <Link
            to="/dashboard"
            className="agprofile-dashboard-link"
          >

            <LayoutDashboard size={18} />

            <span>Dashboard</span>

          </Link>

        </header>

        <div className="agprofile-content">

          {/* ================= PROFILE HERO ================= */}

          <section className="agprofile-hero">

            <div
              className="agprofile-cover"
              style={{
                backgroundImage: `
                  linear-gradient(
                    90deg,
                    rgba(4,46,25,0.92),
                    rgba(6,78,40,0.35)
                  ),
                  url("${heroImage}")
                `
              }}
            >

              <div className="agprofile-cover-text">

                <Sparkles size={17} />

                YOUR AGRICULTURE WORKSPACE

              </div>

              <Sprout
                size={100}
                strokeWidth={1}
                className="agprofile-cover-icon"
              />

            </div>

            <div className="agprofile-identity">

              <div className="agprofile-avatar">

                {initials}

              </div>

              <div className="agprofile-identity-details">

                <h1>{username}</h1>

                <p>AgriMind AI Member</p>

                <span className="agprofile-role">

                  <User size={13} />

                  {role === "admin"
                    ? "Administrator"
                    : "User Account"}

                </span>

              </div>

              <button
                type="button"
                className="agprofile-logout-button"
                onClick={() => setShowLogout(true)}
              >

                <LogOut size={18} />

                Logout

              </button>

            </div>

          </section>

          {/* ================= ACCOUNT INFORMATION ================= */}

          <div className="agprofile-info-grid">

            <section className="agprofile-card">

              <div className="agprofile-card-heading">

                <div className="agprofile-card-icon">

                  <User size={24} />

                </div>

                <div>

                  <h2>Personal Information</h2>

                  <p>Your account details</p>

                </div>

              </div>

              <div className="agprofile-field">

                <div className="agprofile-field-icon">

                  <User size={20} />

                </div>

                <div className="agprofile-field-value">

                  <span>Username</span>

                  <strong>{username}</strong>

                </div>

              </div>

              <div className="agprofile-field">

                <div className="agprofile-field-icon">

                  <Mail size={20} />

                </div>

                <div className="agprofile-field-value">

                  <span>Email Address</span>

                  <strong>{email || "Not available"}</strong>

                </div>

                <button
                  type="button"
                  className="agprofile-copy-button"
                  onClick={handleCopyEmail}
                  disabled={!email}
                  title={copied ? "Copied" : "Copy email"}
                  aria-label={copied ? "Email copied" : "Copy email"}
                >

                  {copied
                    ? <Check size={18} />
                    : <Copy size={18} />}

                </button>

              </div>

              {copyError && (

                <p className="agprofile-error" role="alert">
                  {copyError}
                </p>

              )}

              <div className="agprofile-field">

                <div className="agprofile-field-icon">

                  <Shield size={20} />

                </div>

                <div className="agprofile-field-value">

                  <span>Account Role</span>

                  <strong>

                    {role === "admin"
                      ? "Administrator"
                      : "Standard User"}

                  </strong>

                </div>

              </div>

            </section>

            {/* ================= WORKSPACE CARD ================= */}

            <section className="agprofile-card">

              <div className="agprofile-card-heading">

                <div className="agprofile-card-icon">

                  <Leaf size={24} />

                </div>

                <div>

                  <h2>Your Workspace</h2>

                  <p>Smart agriculture tools</p>

                </div>

              </div>

              <div className="agprofile-workspace">

                <div className="agprofile-workspace-icon">

                  <Sprout size={42} />

                </div>

                <h3>Grow Smarter with AI</h3>

                <p>
                  Explore crop analysis, fertilizer
                  recommendations, disease detection
                  and intelligent farming assistance.
                </p>

                <Link
                  to="/dashboard"
                  className="agprofile-explore-button"
                >

                  Explore Dashboard

                  <ArrowRight size={18} />

                </Link>

              </div>

            </section>

          </div>

          {/* ================= QUICK ACCESS ================= */}

          <section className="agprofile-quick-section">

            <div className="agprofile-section-heading">

              <h2>Quick Access</h2>

              <p>Continue exploring your agriculture tools</p>

            </div>

            <div className="agprofile-quick-grid">

              {quickAccess.map((item) => {

                const Icon = item.icon;

                return (

                  <Link
                    to={item.path}
                    className={`agprofile-quick-card ${item.color}`}
                    key={item.path}
                  >

                    <div className="agprofile-quick-top">

                      <div className="agprofile-quick-icon">

                        <Icon size={25} />

                      </div>

                      <ArrowUpRight
                        size={20}
                        className="agprofile-quick-arrow"
                      />

                    </div>

                    <h3>{item.title}</h3>

                    <p>{item.description}</p>

                  </Link>

                );

              })}

            </div>

          </section>

          <footer className="agprofile-footer">

            <span>
              AgriMind AI © {new Date().getFullYear()}
            </span>

            <span>Growing a smarter future.</span>

          </footer>

        </div>

      </main>

      {/* ================= LOGOUT CONFIRMATION ================= */}

      {showLogout && (

        <div className="agprofile-modal-overlay">

          <section
            className="agprofile-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="agprofile-logout-title"
            onKeyDown={(e) => {
              if (e.key === "Escape") setShowLogout(false);
            }}
          >

            <div className="agprofile-modal-icon">

              <LogOut size={30} />

            </div>

            <h2 id="agprofile-logout-title">
              Logout from AgriMind AI?
            </h2>

            <p>
              You will need to log in again to access
              your agriculture workspace.
            </p>

            <div className="agprofile-modal-actions">

              <button
                type="button"
                className="agprofile-cancel-button"
                onClick={() => setShowLogout(false)}
                autoFocus
              >

                Cancel

              </button>

              <button
                type="button"
                className="agprofile-confirm-button"
                onClick={handleLogout}
              >

                Yes, Logout

              </button>

            </div>

          </section>

        </div>

      )}

    </div>

  );

}
