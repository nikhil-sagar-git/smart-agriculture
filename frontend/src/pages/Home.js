
import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Sprout,
  Leaf,
  ScanLine,
  FlaskConical,
  CloudSun,
  Bot,
  ArrowRight,
  Menu,
  X,
  BrainCircuit,
  Globe,
  ChevronRight,
  Cpu,
  Layers
} from "lucide-react";

import "../App.css";
import "./Home.css";

const features = [
  {
    icon: Sprout,
    title: "Crop Recommendation",
    description:
      "Discover suitable crops for your land using intelligent analysis of soil nutrients and environmental conditions.",
    color: "green"
  },
  {
    icon: ScanLine,
    title: "Disease Detection",
    description:
      "Identify potential plant diseases through image-based analysis and protect your crops.",
    color: "orange"
  },
  {
    icon: FlaskConical,
    title: "Fertilizer Recommendation",
    description:
      "Get intelligent fertilizer recommendations based on your crop and soil conditions.",
    color: "purple"
  },
  {
    icon: CloudSun,
    title: "Weather Intelligence",
    description:
      "Stay informed about weather conditions and make better decisions for your farming activities.",
    color: "blue"
  },
  {
    icon: Bot,
    title: "AI Agriculture Assistant",
    description:
      "Get instant answers to your agricultural questions with our intelligent AI-powered assistant.",
    color: "green"
  },
  {
    icon: BrainCircuit,
    title: "Smart Farming Insights",
    description:
      "Make informed agricultural decisions with machine learning and data-driven recommendations.",
    color: "pink"
  }
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Images from public/images folder
  const heroImage =
    `${process.env.PUBLIC_URL}/images/agriculture-hero.jpg`;

  const techImage =
    `${process.env.PUBLIC_URL}/images/agriculture-tech.jpg`;

  return (
    <div className="agri-home">

      {/* Navigation */}
      <header className="agri-navbar">
        <Link to="/" className="agri-logo">
          <div className="agri-logo-icon">
            <Sprout size={27} />
          </div>

          <span>
            AgriMind <strong>AI</strong>
          </span>
        </Link>

        <nav
          className={`agri-nav-links ${
            menuOpen ? "agri-nav-open" : ""
          }`}
        >
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          <a href="#features" onClick={() => setMenuOpen(false)}>
            Features
          </a>

          <Link to="/about" onClick={() => setMenuOpen(false)}>
            About
          </Link>

          <Link to="/contact" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>

          <Link to="/login" className="agri-login">
            Login
          </Link>

          <Link to="/register" className="agri-nav-button">
            Get Started <ArrowRight size={16} />
          </Link>
        </nav>

        <button
          className="agri-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Hero Section */}
      <section
        className="agri-hero"
        style={{
          backgroundImage: `url("${heroImage}")`
        }}
      >
        <div className="agri-hero-overlay"></div>

        <div className="agri-hero-content">
          <div className="agri-hero-badge">
            <span className="agri-pulse"></span>
            The Future of Intelligent Farming
          </div>

          <h1>
            Grow Smarter.
            <br />
            <span>Farm Better.</span>
          </h1>

          <p>
            Transform traditional agriculture with artificial
            intelligence, machine learning and data-driven
            insights. Make smarter decisions for healthier
            crops and a sustainable future.
          </p>

          <div className="agri-hero-actions">
            <Link to="/register" className="agri-primary-btn">
              Start Smart Farming
              <ArrowRight size={20} />
            </Link>

            <a href="#features" className="agri-secondary-btn">
              Explore Features
              <ChevronRight size={20} />
            </a>
          </div>

          <div className="agri-hero-trust">
            <span>
              <BrainCircuit size={18} /> AI Powered
            </span>

            <span>
              <Sprout size={18} /> Smart Agriculture
            </span>

            <span>
              <Globe size={18} /> Farmer Focused
            </span>
          </div>
        </div>

        {/* Floating Card */}
        <div className="agri-floating-card">
          <div className="agri-floating-icon">
            <Leaf size={28} />
          </div>

          <div>
            <small>Intelligent Agriculture</small>
            <h3>AI Meets Nature</h3>
            <span>Powered by Machine Learning</span>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="agri-highlights">
        <div>
          <Sprout />
          <h2>Smart</h2>
          <p>Crop Recommendations</p>
        </div>

        <div>
          <BrainCircuit />
          <h2>AI</h2>
          <p>Powered Assistance</p>
        </div>

        <div>
          <CloudSun />
          <h2>Weather</h2>
          <p>Farming Insights</p>
        </div>

        <div>
          <Globe />
          <h2>Digital</h2>
          <p>Agriculture Platform</p>
        </div>
      </section>

      {/* Features */}
      <section className="agri-features" id="features">
        <div className="agri-section-heading">
          <span className="agri-section-label">
            <Layers size={16} /> OUR SOLUTIONS
          </span>

          <h2>
            Everything You Need to
            <br />
            <span>Farm Smarter</span>
          </h2>

          <p>
            Powerful agricultural tools designed to simplify
            farming and support better decisions.
          </p>
        </div>

        <div className="agri-feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                className="agri-feature-card"
                key={feature.title}
              >
                <div className={`agri-feature-icon ${feature.color}`}>
                  <Icon size={29} />
                </div>

                <h3>{feature.title}</h3>
                <p>{feature.description}</p>

                <Link to="/login" className="agri-feature-link">
                  Explore Solution <ArrowRight size={17} />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* AI Technology */}
      <section className="agri-technology">

        <div
          className="agri-tech-image"
          style={{
            backgroundImage: `url("${techImage}")`
          }}
        >
          <div className="agri-tech-tag">
            <Cpu size={22} />
            Intelligent Farming Technology
          </div>
        </div>

        <div className="agri-tech-content">
          <span className="agri-section-label">
            <BrainCircuit size={17} /> POWERED BY AI
          </span>

          <h2>
            Where Technology
            <br />
            Meets <span>Agriculture.</span>
          </h2>

          <p>
            AgriMind AI combines modern machine learning
            models and artificial intelligence to make
            agricultural knowledge more accessible.
          </p>

          <div className="agri-tech-item">
            <div><BrainCircuit /></div>

            <section>
              <h4>Machine Learning Models</h4>
              <p>
                Data-driven crop and fertilizer recommendations.
              </p>
            </section>
          </div>

          <div className="agri-tech-item">
            <div><Bot /></div>

            <section>
              <h4>Generative AI Assistant</h4>
              <p>
                Intelligent agricultural conversations powered
                by large language models.
              </p>
            </section>
          </div>

          <div className="agri-tech-item">
            <div><CloudSun /></div>

            <section>
              <h4>Weather-Based Insights</h4>
              <p>
                Plan farming activities using weather information.
              </p>
            </section>
          </div>

          <Link to="/about" className="agri-primary-btn">
            Discover Our Technology <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Call To Action */}
      <section className="agri-cta">
        <Sprout size={45} />

        <h2>Ready to Transform Your Farming?</h2>

        <p>
          Take the next step towards intelligent and
          sustainable agriculture with AgriMind AI.
        </p>

        <Link to="/register" className="agri-primary-btn">
          Get Started Today <ArrowRight size={20} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="agri-footer">
        <div className="agri-footer-content">
          <div>
            <Link to="/" className="agri-logo">
              <Sprout size={30} />
              <span>AgriMind <strong>AI</strong></span>
            </Link>

            <p>
              Empowering agriculture through
              <br />
              artificial intelligence and innovation.
            </p>
          </div>

          <div className="agri-footer-links">
            <Link to="/">Home</Link>
            <a href="#features">Features</a>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/login">Login</Link>
          </div>
        </div>

        <div className="agri-footer-bottom">
          <span>
            © {new Date().getFullYear()} AgriMind AI.
            All rights reserved.
          </span>

          <span>Built for a greener future.</span>
        </div>
      </footer>
    </div>
  );
}
