
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import {
  Sprout,
  LayoutDashboard,
  ScanLine,
  FlaskConical,
  Bot,
  User,
  Menu,
  X,
  Thermometer,
  Droplets,
  CloudRain,
  TestTube,
  BrainCircuit,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Leaf,
  Info,
  SlidersHorizontal,
  LoaderCircle
} from "lucide-react";

import "./Crop.css";

const API_URL =
  "https://smart-agriculture-python3.onrender.com/predict";

const initialForm = {
  nitrogen: "",
  phosporous: "",
  potash: "",
  temperature: "",
  humidity: "",
  ph: "",
  rainfall: ""
};

const sampleForm = {
  nitrogen: "90",
  phosporous: "42",
  potash: "43",
  temperature: "25",
  humidity: "80",
  ph: "6.5",
  rainfall: "200"
};

const navigation = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard
  },
  {
    name: "Crop Recommendation",
    path: "/crop",
    icon: Sprout
  },
  {
    name: "Disease Detection",
    path: "/disease",
    icon: ScanLine
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

const fields = [
  {
    name: "nitrogen",
    label: "Nitrogen (N)",
    placeholder: "e.g. 90",
    description: "Nitrogen content in soil",
    icon: FlaskConical,
    color: "green",
    min: 0
  },
  {
    name: "phosporous",
    label: "Phosphorus (P)",
    placeholder: "e.g. 42",
    description: "Phosphorus content in soil",
    icon: FlaskConical,
    color: "orange",
    min: 0
  },
  {
    name: "potash",
    label: "Potassium (K)",
    placeholder: "e.g. 43",
    description: "Potassium content in soil",
    icon: FlaskConical,
    color: "purple",
    min: 0
  },
  {
    name: "temperature",
    label: "Temperature",
    placeholder: "e.g. 25",
    description: "Environmental temperature",
    unit: "°C",
    icon: Thermometer,
    color: "orange"
  },
  {
    name: "humidity",
    label: "Humidity",
    placeholder: "e.g. 80",
    description: "Relative humidity",
    unit: "%",
    icon: Droplets,
    color: "blue",
    min: 0,
    max: 100
  },
  {
    name: "ph",
    label: "Soil pH",
    placeholder: "e.g. 6.5",
    description: "Soil acidity or alkalinity",
    icon: TestTube,
    color: "purple",
    min: 0,
    max: 14
  },
  {
    name: "rainfall",
    label: "Rainfall",
    placeholder: "e.g. 200",
    description: "Rainfall measurement",
    unit: "mm",
    icon: CloudRain,
    color: "blue",
    min: 0
  }
];

export default function Crop() {

  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const username =
    localStorage.getItem("username")?.trim() || "Farmer";

  const heroImage =
    `${process.env.PUBLIC_URL}/images/agriculture-hero.jpg`;

  const completedFields = fields.filter(
    (field) => form[field.name].trim() !== ""
  ).length;

  const progress = Math.round(
    (completedFields / fields.length) * 100
  );

  // ================= HANDLE INPUT =================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    setError("");
    setResult("");

  };

  // ================= RESET FORM =================

  const handleReset = () => {

    setForm({ ...initialForm });
    setResult("");
    setError("");

  };

  // ================= SAMPLE DATA =================

  const handleSampleData = () => {

    setForm({ ...sampleForm });
    setResult("");
    setError("");

  };

  // ================= VALIDATION =================

  const validateForm = () => {

    for (const field of fields) {

      const value = form[field.name];

      if (value.trim() === "") {
        return `Please enter ${field.label}.`;
      }

      const number = Number(value);

      if (!Number.isFinite(number)) {
        return `Enter a valid value for ${field.label}.`;
      }

      if (
        field.min !== undefined &&
        number < field.min
      ) {
        return `${field.label} must be at least ${field.min}.`;
      }

      if (
        field.max !== undefined &&
        number > field.max
      ) {
        return `${field.label} must not exceed ${field.max}.`;
      }

    }

    return "";

  };

  // ================= CROP PREDICTION =================

  const handlePredict = async (e) => {

    e.preventDefault();

    if (loading) return;

    const validationError = validateForm();

    if (validationError) {

      setError(validationError);
      setResult("");

      return;

    }

    setLoading(true);
    setError("");
    setResult("");

    try {

      const response = await fetch(API_URL, {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(form)

      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.error) {

        throw new Error(
          data.error ||
          data.message ||
          "Unable to generate crop recommendation."
        );

      }

      if (
        typeof data.crop !== "string" ||
        !data.crop.trim()
      ) {

        throw new Error(
          "The server returned an invalid crop recommendation."
        );

      }

      setResult(data.crop.trim());

    } catch (err) {

      console.error("Crop prediction error:", err);

      setError(
        err.message ||
        "Prediction failed. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="agcrop-page">

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (

        <button
          type="button"
          className="agcrop-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation"
        />

      )}

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`agcrop-sidebar ${
          sidebarOpen ? "agcrop-sidebar-open" : ""
        }`}
      >

        <div className="agcrop-sidebar-header">

          <Link to="/dashboard" className="agcrop-logo">

            <div className="agcrop-logo-icon">
              <Sprout size={28} />
            </div>

            <div>

              <h2>AgriMind <span>AI</span></h2>

              <small>SMART AGRICULTURE</small>

            </div>

          </Link>

          <button
            type="button"
            className="agcrop-close-menu"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={23} />
          </button>

        </div>

        <p className="agcrop-nav-label">WORKSPACE</p>

        <nav className="agcrop-nav">

          {navigation.map((item) => {

            const Icon = item.icon;

            return (

              <NavLink
                key={item.path}
                to={item.path}
                end
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `agcrop-nav-link ${
                    isActive ? "agcrop-active" : ""
                  }`
                }
              >

                <Icon size={20} />

                <span>{item.name}</span>

              </NavLink>

            );

          })}

        </nav>

        <p className="agcrop-nav-label agcrop-account-label">
          ACCOUNT
        </p>

        <nav className="agcrop-nav">

          <NavLink
            to="/profile"
            className="agcrop-nav-link"
            onClick={() => setSidebarOpen(false)}
          >

            <User size={20} />

            <span>My Profile</span>

          </NavLink>

        </nav>

        <div className="agcrop-sidebar-bottom">

          <div className="agcrop-sidebar-info">

            <BrainCircuit size={28} />

            <h4>Intelligent Agriculture</h4>

            <p>
              Machine learning helps identify suitable
              crops using soil and environmental data.
            </p>

          </div>

          <div className="agcrop-sidebar-footer">

            <Leaf size={15} />

            AgriMind AI © {new Date().getFullYear()}

          </div>

        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <main className="agcrop-main">

        {/* HEADER */}

        <header className="agcrop-header">

          <div className="agcrop-header-left">

            <button
              type="button"
              className="agcrop-menu-button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              aria-expanded={sidebarOpen}
            >

              <Menu size={25} />

            </button>

            <div>

              <h2>Crop Recommendation</h2>

              <p>AI-powered crop analysis system</p>

            </div>

          </div>

          <Link to="/profile" className="agcrop-profile">

            <div className="agcrop-profile-avatar">

              {username.charAt(0).toUpperCase()}

            </div>

            <span>{username}</span>

          </Link>

        </header>

        <div className="agcrop-content">

          {/* ================= HERO ================= */}

          <section
            className="agcrop-hero"
            style={{
              backgroundImage: `
                linear-gradient(
                  90deg,
                  rgba(4, 46, 25, 0.98),
                  rgba(6, 78, 40, 0.80),
                  rgba(6, 78, 40, 0.20)
                ),
                url("${heroImage}")
              `
            }}
          >

            <div className="agcrop-hero-content">

              <div className="agcrop-hero-badge">

                <Sparkles size={15} />

                MACHINE LEARNING POWERED

              </div>

              <h1>

                Discover the right crop

                <br />

                <span>for your soil.</span>

              </h1>

              <p>
                Analyze soil nutrients and environmental
                conditions to discover suitable crops
                using intelligent machine learning.
              </p>

              <div className="agcrop-hero-tags">

                <span>
                  <CheckCircle2 size={15} />
                  7 Input Parameters
                </span>

                <span>
                  <CheckCircle2 size={15} />
                  ML Prediction
                </span>

              </div>

            </div>

          </section>

          {/* ================= ANALYSIS SECTION ================= */}

          <div className="agcrop-analysis-grid">

            {/* INPUT FORM */}

            <section className="agcrop-form-card">

              <div className="agcrop-card-header">

                <div className="agcrop-card-icon">

                  <SlidersHorizontal size={25} />

                </div>

                <div>

                  <h2>Soil & Environmental Data</h2>

                  <p>Enter your agricultural parameters</p>

                </div>

              </div>

              {/* PROGRESS BAR */}

              <div className="agcrop-progress">

                <div className="agcrop-progress-label">

                  <span>Form Completion</span>

                  <strong>
                    {completedFields} / {fields.length}
                  </strong>

                </div>

                <div
                  className="agcrop-progress-track"
                  role="progressbar"
                  aria-label="Form completion"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >

                  <div
                    className="agcrop-progress-fill"
                    style={{ width: `${progress}%` }}
                  />

                </div>

              </div>

              <form
                className="agcrop-form"
                onSubmit={handlePredict}
                noValidate
              >

                <div className="agcrop-fields">

                  {fields.map((field) => {

                    const Icon = field.icon;

                    return (

                      <div
                        className="agcrop-field"
                        key={field.name}
                      >

                        <label htmlFor={`crop-${field.name}`}>

                          <div
                            className={`agcrop-field-icon ${field.color}`}
                          >

                            <Icon size={18} />

                          </div>

                          {field.label}

                        </label>

                        <div className="agcrop-input-wrapper">

                          <input
                            id={`crop-${field.name}`}
                            type="number"
                            name={field.name}
                            value={form[field.name]}
                            placeholder={field.placeholder}
                            onChange={handleChange}
                            min={field.min}
                            max={field.max}
                            step="any"
                            disabled={loading}
                            required
                          />

                          {field.unit && (

                            <span className="agcrop-input-unit">

                              {field.unit}

                            </span>

                          )}

                        </div>

                        <small>{field.description}</small>

                      </div>

                    );

                  })}

                </div>

                {/* ERROR MESSAGE */}

                {error && (

                  <div className="agcrop-error" role="alert">

                    <AlertCircle size={20} />

                    <span>{error}</span>

                  </div>

                )}

                {/* FORM ACTIONS */}

                <div className="agcrop-form-actions">

                  <button
                    type="button"
                    className="agcrop-reset-button"
                    onClick={handleReset}
                    disabled={loading}
                  >

                    <RotateCcw size={17} />

                    Reset

                  </button>

                  <button
                    type="button"
                    className="agcrop-sample-button"
                    onClick={handleSampleData}
                    disabled={loading}
                  >

                    <FlaskConical size={17} />

                    Sample Data

                  </button>

                </div>

                <button
                  type="submit"
                  className="agcrop-predict-button"
                  disabled={loading}
                >

                  {loading ? (

                    <>

                      <LoaderCircle
                        size={22}
                        className="agcrop-spinner"
                      />

                      Analyzing Parameters...

                    </>

                  ) : (

                    <>

                      <BrainCircuit size={23} />

                      Get AI Recommendation

                      <ArrowRight size={20} />

                    </>

                  )}

                </button>

              </form>

            </section>

            {/* ================= RIGHT PANEL ================= */}

            <div className="agcrop-right-panel">

              <section
                className="agcrop-result-card"
                aria-live="polite"
                aria-busy={loading}
              >

                <div className="agcrop-result-header">

                  <Sprout size={21} />

                  <h3>Prediction Result</h3>

                </div>

                {loading ? (

                  <div className="agcrop-result-loading">

                    <div className="agcrop-loading-icon">

                      <BrainCircuit size={42} />

                    </div>

                    <h3>Analyzing your soil</h3>

                    <p>
                      The machine learning model is
                      processing your input parameters.
                    </p>

                    <div className="agcrop-loading-dots">

                      <span></span>
                      <span></span>
                      <span></span>

                    </div>

                  </div>

                ) : result ? (

                  <div className="agcrop-result-success">

                    <div className="agcrop-success-icon">

                      <Sprout size={48} />

                    </div>

                    <div className="agcrop-success-label">

                      <CheckCircle2 size={16} />

                      PREDICTION COMPLETE

                    </div>

                    <p>Recommended Crop</p>

                    <h2>{result.toUpperCase()}</h2>

                    <div className="agcrop-result-description">

                      This crop is recommended by the
                      machine learning model based on
                      your supplied parameters.

                    </div>

                    <Link
                      to="/fertilizer"
                      className="agcrop-result-link"
                    >

                      Explore Fertilizer Recommendation

                      <ArrowRight size={17} />

                    </Link>

                    <Link
                      to="/chatbot"
                      className="agcrop-assistant-link"
                    >

                      <Bot size={18} />

                      Ask AI Assistant

                    </Link>

                  </div>

                ) : (

                  <div className="agcrop-result-empty">

                    <div className="agcrop-empty-icon">

                      <Sprout size={48} strokeWidth={1.4} />

                    </div>

                    <h3>Ready for analysis</h3>

                    <p>
                      Enter your soil and environmental
                      parameters to receive a crop
                      recommendation.
                    </p>

                  </div>

                )}

              </section>

              {/* INFORMATION CARD */}

              <section className="agcrop-info-card">

                <div className="agcrop-info-heading">

                  <Info size={20} />

                  <h3>Understanding Parameters</h3>

                </div>

                <div className="agcrop-info-item">

                  <strong>NPK Nutrients</strong>

                  <p>
                    Nitrogen, phosphorus and potassium
                    support essential plant growth.
                  </p>

                </div>

                <div className="agcrop-info-item">

                  <strong>Soil pH</strong>

                  <p>
                    Measures soil acidity or alkalinity
                    and influences nutrient availability.
                  </p>

                </div>

                <div className="agcrop-info-item">

                  <strong>Environmental Conditions</strong>

                  <p>
                    Temperature, humidity and rainfall
                    influence crop suitability.
                  </p>

                </div>

              </section>

              <div className="agcrop-disclaimer">

                <AlertCircle size={18} />

                <p>
                  AI recommendations are decision-support
                  tools. Verify important cultivation
                  decisions with a local agricultural expert.
                </p>

              </div>

            </div>

          </div>

          {/* FOOTER */}

          <footer className="agcrop-footer">

            <div>

              <Sprout size={18} />

              AgriMind AI — Growing a smarter future.

            </div>

            <span>Powered by Machine Learning</span>

          </footer>

        </div>

      </main>

    </div>

  );

}
