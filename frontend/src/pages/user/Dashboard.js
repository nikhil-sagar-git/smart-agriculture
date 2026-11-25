
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  Sprout,
  LayoutDashboard,
  ScanLine,
  FlaskConical,
  Bot,
  User,
  LogOut,
  Menu,
  X,
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Layers,
  Leaf,
  CalendarDays,
  ChevronRight,
  Sparkles
} from "lucide-react";

import "./Dashboard.css";

const features = [
  {
    title: "Disease Detection",
    description:
      "Upload plant images to identify diseases and get useful insights for healthier crops.",
    icon: ScanLine,
    path: "/disease",
    color: "green",
    category: "PLANT HEALTH"
  },
  {
    title: "Crop Recommendation",
    description:
      "Discover suitable crops based on soil nutrients and environmental conditions.",
    icon: Sprout,
    path: "/crop",
    color: "orange",
    category: "SMART CULTIVATION"
  },
  {
    title: "Fertilizer Recommendation",
    description:
      "Find suitable fertilizers based on your crop and soil requirements.",
    icon: FlaskConical,
    path: "/fertilizer",
    color: "blue",
    category: "SOIL NUTRITION"
  },
  {
    title: "AI Agriculture Assistant",
    description:
      "Ask agriculture-related questions and receive intelligent farming guidance.",
    icon: Bot,
    path: "/chatbot",
    color: "purple",
    category: "GENERATIVE AI"
  }
];

const navigation = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard
  },
  {
    name: "Disease Detection",
    path: "/disease",
    icon: ScanLine
  },
  {
    name: "Crop Recommendation",
    path: "/crop",
    icon: Sprout
  },
  {
    name: "Fertilizer Recommendation",
    path: "/fertilizer",
    icon: FlaskConical
  },
  {
    name: "AI Assistant",
    path: "/chatbot",
    icon: Bot
  }
];

export default function Dashboard() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const username =
    localStorage.getItem("username")?.trim() || "Farmer";

  const email =
    localStorage.getItem("useremail") || "";

  const displayName =
    username.charAt(0).toUpperCase() + username.slice(1);

  const initials = username
    .split(/\s+/)
    .slice(0, 2)
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase();

  const currentDate = new Date().toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  );

  const heroImage =
    `${process.env.PUBLIC_URL}/images/agriculture-hero.jpg`;

  const logout = () => {

    localStorage.removeItem("username");
    localStorage.removeItem("useremail");
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/login", { replace: true });

  };

  return (

    <div className="agri-dashboard">

      {/* MOBILE SIDEBAR OVERLAY */}

      {sidebarOpen && (
        <button
          type="button"
          className="agd-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation"
        />
      )}

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`agd-sidebar ${
          sidebarOpen ? "agd-sidebar-open" : ""
        }`}
      >

        {/* Logo */}

        <div className="agd-sidebar-header">

          <Link to="/dashboard" className="agd-logo">

            <div className="agd-logo-icon">
              <Sprout size={28} />
            </div>

            <div>
              <h2>AgriMind <span>AI</span></h2>
              <small>SMART AGRICULTURE</small>
            </div>

          </Link>

          <button
            className="agd-close-menu"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={23} />
          </button>

        </div>

        {/* Main Navigation */}

        <div className="agd-nav-section">

          <p className="agd-nav-label">WORKSPACE</p>

          <nav className="agd-nav">

            {navigation.map((item) => {

              const Icon = item.icon;

              return (

                <NavLink
                  key={item.path}
                  to={item.path}
                  end
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `agd-nav-link ${
                      isActive ? "agd-active" : ""
                    }`
                  }
                >

                  <Icon size={20} />

                  <span>{item.name}</span>

                  <ChevronRight
                    size={15}
                    className="agd-nav-arrow"
                  />

                </NavLink>

              );

            })}

          </nav>

        </div>

        {/* Account Navigation */}

        <div className="agd-nav-section">

          <p className="agd-nav-label">ACCOUNT</p>

          <nav className="agd-nav">

            <NavLink
              to="/profile"
              className="agd-nav-link"
              onClick={() => setSidebarOpen(false)}
            >
              <User size={20} />
              <span>My Profile</span>
            </NavLink>

            <button
              type="button"
              className="agd-nav-link agd-logout"
              onClick={logout}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>

          </nav>

        </div>

        {/* Sidebar Bottom Card */}

        <div className="agd-sidebar-bottom">

          <div className="agd-sidebar-promo">

            <div className="agd-promo-icon">
              <Sparkles size={23} />
            </div>

            <h4>Grow smarter with AI</h4>

            <p>
              Discover intelligent solutions for
              everyday farming challenges.
            </p>

            <Link to="/chatbot">
              Ask AI Assistant
              <ArrowRight size={15} />
            </Link>

          </div>

          <div className="agd-sidebar-footer">

            <Leaf size={15} />

            <span>AgriMind AI © {new Date().getFullYear()}</span>

          </div>

        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <main className="agd-main">

        {/* Top Navbar */}

        <header className="agd-topbar">

          <div className="agd-topbar-left">

            <button
              type="button"
              className="agd-menu-button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              aria-expanded={sidebarOpen}
            >
              <Menu size={25} />
            </button>

            <div>

              <h2>Dashboard Overview</h2>

              <p>Your smart farming workspace</p>

            </div>

          </div>

          <div className="agd-topbar-right">

            <div className="agd-date">

              <CalendarDays size={17} />

              <span>{currentDate}</span>

            </div>

            <Link to="/profile" className="agd-user">

              <div className="agd-avatar">
                {initials}
              </div>

              <div className="agd-user-info">

                <strong>{displayName}</strong>

                <small>{email || "Farmer"}</small>

              </div>

              <ChevronRight size={17} />

            </Link>

          </div>

        </header>

        {/* Dashboard Content */}

        <div className="agd-content">

          {/* ================= HERO BANNER ================= */}

          <section
            className="agd-hero"
            style={{
              backgroundImage: `
                linear-gradient(
                  90deg,
                  rgba(4, 46, 25, 0.98),
                  rgba(6, 78, 40, 0.88),
                  rgba(6, 78, 40, 0.25)
                ),
                url("${heroImage}")
              `
            }}
          >

            <div className="agd-hero-content">

              <div className="agd-hero-badge">

                <Sparkles size={15} />

                AI-POWERED AGRICULTURE

              </div>

              <h1>
                Welcome back,
                <br />
                <span>{displayName}!</span>
              </h1>

              <p>
                Empower your farming decisions with
                artificial intelligence, machine learning,
                and smart agricultural insights.
              </p>

              <Link
                to="/chatbot"
                className="agd-hero-button"
              >

                <Bot size={20} />

                Explore AI Assistant

                <ArrowRight size={19} />

              </Link>

            </div>

            <div className="agd-hero-decoration">
              <Sprout size={150} strokeWidth={0.8} />
            </div>

          </section>

          {/* ================= OVERVIEW CARDS ================= */}

          <section className="agd-stats">

            <div className="agd-stat-card">

              <div className="agd-stat-icon green">
                <Layers size={25} />
              </div>

              <div>
                <p>Available Smart Tools</p>
                <h3>{String(features.length).padStart(2, "0")}</h3>
                <small>Explore agriculture solutions</small>
              </div>

            </div>

            <div className="agd-stat-card">

              <div className="agd-stat-icon blue">
                <BrainCircuit size={25} />
              </div>

              <div>
                <p>Technology</p>
                <h3>AI & ML</h3>
                <small>Intelligent recommendations</small>
              </div>

            </div>

            <div className="agd-stat-card">

              <div className="agd-stat-icon orange">
                <Leaf size={25} />
              </div>

              <div>
                <p>Our Focus</p>
                <h3>Smart Farming</h3>
                <small>Better agricultural decisions</small>
              </div>

            </div>

          </section>

          {/* ================= FEATURE SECTION ================= */}

          <section className="agd-features">

            <div className="agd-section-heading">

              <div>

                <span className="agd-eyebrow">
                  INTELLIGENT FARMING SOLUTIONS
                </span>

                <h2>Agriculture Intelligence Tools</h2>

                <p>
                  Choose a tool to get started with smarter farming.
                </p>

              </div>

              <div className="agd-tool-count">

                <Layers size={16} />

                {features.length} Tools Available

              </div>

            </div>

            <div className="agd-feature-grid">

              {features.map((feature, index) => {

                const Icon = feature.icon;

                return (

                  <Link
                    key={feature.path}
                    to={feature.path}
                    className={`agd-feature-card ${feature.color}`}
                    style={{
                      animationDelay: `${index * 0.08}s`
                    }}
                  >

                    <div className="agd-feature-top">

                      <div
                        className={`agd-feature-icon ${feature.color}`}
                      >
                        <Icon size={30} />
                      </div>

                      <div className="agd-feature-arrow">
                        <ArrowUpRight size={21} />
                      </div>

                    </div>

                    <span className="agd-feature-category">

                      {feature.category}

                    </span>

                    <h3>{feature.title}</h3>

                    <p>{feature.description}</p>

                    <div className="agd-feature-footer">

                      <span>Explore Feature</span>

                      <ArrowRight size={19} />

                    </div>

                  </Link>

                );

              })}

            </div>

          </section>

          {/* ================= AI ASSISTANT BANNER ================= */}

          

          {/* Footer */}

          <footer className="agd-footer">

            <div>

              <Sprout size={18} />

              <span>
                AgriMind AI — Growing a smarter future.
              </span>

            </div>

            <p>
              Powered by Artificial Intelligence & Machine Learning
            </p>

          </footer>

        </div>

      </main>

    </div>

  );

}
