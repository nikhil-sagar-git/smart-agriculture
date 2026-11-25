
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
  LoaderCircle
} from "lucide-react";

import "./Fertilizer.css";

const API_URL =
  "https://smart-agriculture-python3.onrender.com/predictfertilizer";

const initialForm = {
  PH: "",
  Nitrogen: "",
  Phosphorous: "",
  Potassium: "",
  Temperature: "",
  Rainfall: "",
  Moisture: "",
  Crop: ""
};

const sampleForm = {
  PH: "6.5",
  Nitrogen: "90",
  Phosphorous: "42",
  Potassium: "43",
  Temperature: "25",
  Rainfall: "200",
  Moisture: "60",
  Crop: "rice"
};

const crops = [
  "Adzuki Beans",
  "Black gram",
  "Chickpea",
  "Coconut",
  "Coffee",
  "Cotton",
  "Ground Nut",
  "Jute",
  "Kidney Beans",
  "Lentil",
  "Moth Beans",
  "Mung Bean",
  "Peas",
  "Pigeon Peas",
  "Rubber",
  "Sugarcane",
  "Tea",
  "Tobacco",
  "apple",
  "banana",
  "grapes",
  "maize",
  "mango",
  "millet",
  "muskmelon",
  "orange",
  "papaya",
  "pomegranate",
  "rice",
  "watermelon",
  "wheat"
];

const navigation = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Crop Recommendation", path: "/crop", icon: Sprout },
  { name: "Disease Detection", path: "/disease", icon: ScanLine },
  { name: "Fertilizer Recommendation", path: "/fertilizer", icon: FlaskConical },
  { name: "AI Assistant", path: "/chatbot", icon: Bot },
  { name: "My Profile", path: "/profile", icon: User }
];

const fields = [
  {
    name: "PH",
    label: "Soil pH",
    placeholder: "e.g. 6.5",
    description: "Soil acidity or alkalinity",
    icon: TestTube,
    color: "purple",
    min: 0,
    max: 14
  },
  {
    name: "Nitrogen",
    label: "Nitrogen (N)",
    placeholder: "e.g. 90",
    description: "Nitrogen content in soil",
    icon: FlaskConical,
    color: "green",
    min: 0
  },
  {
    name: "Phosphorous",
    label: "Phosphorus (P)",
    placeholder: "e.g. 42",
    description: "Phosphorus content in soil",
    icon: FlaskConical,
    color: "orange",
    min: 0
  },
  {
    name: "Potassium",
    label: "Potassium (K)",
    placeholder: "e.g. 43",
    description: "Potassium content in soil",
    icon: FlaskConical,
    color: "purple",
    min: 0
  },
  {
    name: "Temperature",
    label: "Temperature",
    placeholder: "e.g. 25",
    description: "Environmental temperature",
    unit: "°C",
    icon: Thermometer,
    color: "orange"
  },
  {
    name: "Rainfall",
    label: "Rainfall",
    placeholder: "e.g. 200",
    description: "Rainfall measurement",
    unit: "mm",
    icon: CloudRain,
    color: "blue",
    min: 0
  },
  {
    name: "Moisture",
    label: "Soil Moisture",
    placeholder: "e.g. 60",
    description: "Moisture content in soil",
    icon: Droplets,
    color: "blue",
    min: 0
  }
];

export default function Fertilizer() {

  const [form, setForm] = useState(initialForm);
  const [fertilizer, setFertilizer] = useState("");
  const [remark, setRemark] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const username =
    localStorage.getItem("username")?.trim() || "Farmer";

  const heroImage =
    `${process.env.PUBLIC_URL}/images/agriculture-hero.jpg`;

  const completedFields = Object.values(form).filter(
    (value) => value.trim() !== ""
  ).length;

  const progress = Math.round(
    (completedFields / 8) * 100
  );

  // ================= CLEAR RESULT =================

  const clearResult = () => {
    setFertilizer("");
    setRemark("");
    setError("");
  };

  // ================= HANDLE INPUT =================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    clearResult();

  };

  // ================= RESET FORM =================

  const handleReset = () => {

    setForm({ ...initialForm });
    clearResult();

  };

  // ================= SAMPLE DATA =================

  const handleSampleData = () => {

    setForm({ ...sampleForm });
    clearResult();

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
        return `Enter a valid ${field.label} value.`;
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

    if (!crops.includes(form.Crop)) {
      return "Please select a valid crop.";
    }

    return "";

  };

  // ================= API PREDICTION =================

  const handlePredict = async (e) => {

    e.preventDefault();

    if (loading) return;

    clearResult();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {

      const res = await fetch(API_URL, {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(form)

      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.error) {

        throw new Error(
          data.error ||
          data.message ||
          "Unable to generate fertilizer recommendation."
        );

      }

      if (
        typeof data.fertilizername !== "string" ||
        !data.fertilizername.trim()
      ) {

        throw new Error(
          "The server returned an invalid recommendation."
        );

      }

      setFertilizer(data.fertilizername.trim());

      setRemark(
        typeof data.remark === "string"
          ? data.remark
          : ""
      );

    } catch (err) {

      console.error("Fertilizer prediction error:", err);

      setError(
        err.message ||
        "Server error. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="agfert-page">

      {sidebarOpen && (

        <button
          type="button"
          className="agfert-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation"
        />

      )}

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`agfert-sidebar ${
          sidebarOpen ? "agfert-sidebar-open" : ""
        }`}
      >

        <div className="agfert-sidebar-header">

          <Link to="/dashboard" className="agfert-logo">

            <div className="agfert-logo-icon">
              <Sprout size={28} />
            </div>

            <div>
              <h2>AgriMind <span>AI</span></h2>
              <small>SMART AGRICULTURE</small>
            </div>

          </Link>

          <button
            type="button"
            className="agfert-close-menu"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={23} />
          </button>

        </div>

        <p className="agfert-nav-label">WORKSPACE</p>

        <nav className="agfert-nav">

          {navigation.map((item) => {

            const Icon = item.icon;

            return (

              <NavLink
                key={item.path}
                to={item.path}
                end
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `agfert-nav-link ${
                    isActive ? "agfert-active" : ""
                  }`
                }
              >

                <Icon size={20} />

                <span>{item.name}</span>

              </NavLink>

            );

          })}

        </nav>

        <div className="agfert-sidebar-bottom">

          <div className="agfert-sidebar-info">

            <FlaskConical size={28} />

            <h4>Smart Soil Nutrition</h4>

            <p>
              Data-driven fertilizer recommendations
              for informed farming decisions.
            </p>

          </div>

          <div className="agfert-sidebar-footer">

            <Leaf size={15} />

            AgriMind AI © {new Date().getFullYear()}

          </div>

        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <main className="agfert-main">

        <header className="agfert-header">

          <div className="agfert-header-left">

            <button
              type="button"
              className="agfert-menu-button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              aria-expanded={sidebarOpen}
            >
              <Menu size={25} />
            </button>

            <div>
              <h2>Fertilizer Recommendation</h2>
              <p>AI-powered soil nutrition analysis</p>
            </div>

          </div>

          <Link to="/profile" className="agfert-profile">

            <div className="agfert-profile-avatar">
              {username.charAt(0).toUpperCase()}
            </div>

            <span>{username}</span>

          </Link>

        </header>

        <div className="agfert-content">

          {/* ================= HERO ================= */}

          <section
            className="agfert-hero"
            style={{
              backgroundImage: `
                linear-gradient(
                  90deg,
                  rgba(4,46,25,0.98),
                  rgba(6,78,40,0.85),
                  rgba(6,78,40,0.25)
                ),
                url("${heroImage}")
              `
            }}
          >

            <div className="agfert-hero-content">

              <div className="agfert-hero-badge">

                <Sparkles size={15} />

                INTELLIGENT SOIL NUTRITION

              </div>

              <h1>

                Nourish your soil.

                <br />

                <span>Grow better.</span>

              </h1>

              <p>
                Discover suitable fertilizers based on
                soil nutrients, environmental conditions
                and your selected crop using machine learning.
              </p>

              <div className="agfert-hero-tags">

                <span>
                  <CheckCircle2 size={16} />
                  8 Input Parameters
                </span>

                <span>
                  <CheckCircle2 size={16} />
                  31 Supported Crops
                </span>

              </div>

            </div>

          </section>

          <div className="agfert-analysis-grid">

            {/* ================= FORM CARD ================= */}

            <section className="agfert-form-card">

              <div className="agfert-card-header">

                <div className="agfert-card-icon">
                  <FlaskConical size={26} />
                </div>

                <div>

                  <h2>Soil & Crop Parameters</h2>

                  <p>Enter your agricultural data</p>

                </div>

              </div>

              {/* PROGRESS BAR */}

              <div className="agfert-progress">

                <div className="agfert-progress-label">

                  <span>Form Completion</span>

                  <strong>{completedFields} / 8</strong>

                </div>

                <div
                  className="agfert-progress-track"
                  role="progressbar"
                  aria-label="Form completion"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >

                  <div
                    className="agfert-progress-fill"
                    style={{ width: `${progress}%` }}
                  />

                </div>

              </div>

              <form
                className="agfert-form"
                onSubmit={handlePredict}
                noValidate
              >

                <div className="agfert-fields">

                  {fields.map((field) => {

                    const Icon = field.icon;

                    return (

                      <div
                        className="agfert-field"
                        key={field.name}
                      >

                        <label htmlFor={`fert-${field.name}`}>

                          <span
                            className={`agfert-field-icon ${field.color}`}
                          >
                            <Icon size={18} />
                          </span>

                          {field.label}

                        </label>

                        <div className="agfert-input-wrapper">

                          <input
                            id={`fert-${field.name}`}
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

                            <span className="agfert-input-unit">
                              {field.unit}
                            </span>

                          )}

                        </div>

                        <small>{field.description}</small>

                      </div>

                    );

                  })}

                  {/* ================= CROP DROPDOWN ================= */}

                  <div className="agfert-field">

                    <label htmlFor="fert-crop">

                      <span className="agfert-field-icon green">
                        <Sprout size={18} />
                      </span>

                      Crop Type

                    </label>

                    <select
                      id="fert-crop"
                      name="Crop"
                      value={form.Crop}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    >

                      <option value="">Select your crop</option>

                      {crops.map((crop) => (

                        <option key={crop} value={crop}>

                          {crop.charAt(0).toUpperCase() +
                            crop.slice(1)}

                        </option>

                      ))}

                    </select>

                    <small>
                      Select the crop you are cultivating
                    </small>

                  </div>

                </div>

                {error && (

                  <div className="agfert-error" role="alert">

                    <AlertCircle size={20} />

                    <span>{error}</span>

                  </div>

                )}

                {/* ================= FORM ACTIONS ================= */}

                <div className="agfert-form-actions">

                  <button
                    type="button"
                    className="agfert-reset-button"
                    onClick={handleReset}
                    disabled={loading}
                  >

                    <RotateCcw size={17} />

                    Reset

                  </button>

                  <button
                    type="button"
                    className="agfert-sample-button"
                    onClick={handleSampleData}
                    disabled={loading}
                  >

                    <FlaskConical size={17} />

                    Sample Data

                  </button>

                </div>

                <button
                  type="submit"
                  className="agfert-predict-button"
                  disabled={loading}
                >

                  {loading ? (

                    <>

                      <LoaderCircle
                        size={22}
                        className="agfert-spinner"
                      />

                      Analyzing Soil Nutrients...

                    </>

                  ) : (

                    <>

                      <BrainCircuit size={23} />

                      Get AI Recommendation

                      <ArrowRight size={19} />

                    </>

                  )}

                </button>

              </form>

            </section>

            {/* ================= RESULT PANEL ================= */}

            <div className="agfert-right-panel">

              <section
                className="agfert-result-card"
                aria-live="polite"
                aria-busy={loading}
              >

                <div className="agfert-result-header">

                  <FlaskConical size={22} />

                  <h3>Fertilizer Analysis</h3>

                </div>

                {loading ? (

                  <div className="agfert-result-empty">

                    <div className="agfert-result-icon agfert-pulse">

                      <BrainCircuit size={44} />

                    </div>

                    <h3>Analyzing soil nutrients</h3>

                    <p>
                      The machine learning model is
                      processing your parameters.
                    </p>

                    <div className="agfert-loading-dots">

                      <span></span>
                      <span></span>
                      <span></span>

                    </div>

                  </div>

                ) : fertilizer ? (

                  <div className="agfert-result-success">

                    <div className="agfert-result-icon">

                      <FlaskConical size={46} />

                    </div>

                    <div className="agfert-success-label">

                      <CheckCircle2 size={16} />

                      PREDICTION COMPLETE

                    </div>

                    <p>Recommended Fertilizer</p>

                    <h2>{fertilizer}</h2>

                    <div className="agfert-crop-tag">

                      <Sprout size={16} />

                      Selected Crop: {form.Crop}

                    </div>

                    {remark && (

                      <div className="agfert-remark">

                        <h4>

                          <Info size={18} />

                          Recommendation Remarks

                        </h4>

                        <p>{remark}</p>

                      </div>

                    )}

                    <Link
                      to="/chatbot"
                      className="agfert-assistant-link"
                    >

                      <Bot size={19} />

                      Ask AI Assistant

                      <ArrowRight size={17} />

                    </Link>

                  </div>

                ) : (

                  <div className="agfert-result-empty">

                    <div className="agfert-result-icon">

                      <FlaskConical
                        size={46}
                        strokeWidth={1.5}
                      />

                    </div>

                    <h3>Ready for analysis</h3>

                    <p>
                      Enter your soil parameters and select
                      a crop to receive a fertilizer
                      recommendation.
                    </p>

                  </div>

                )}

              </section>

              {/* ================= INFORMATION CARD ================= */}

              <section className="agfert-info-card">

                <div className="agfert-info-heading">

                  <Info size={21} />

                  <h3>Understanding Soil Nutrition</h3>

                </div>

                <div className="agfert-info-item">

                  <strong>Nitrogen (N)</strong>

                  <p>Supports leaf growth and chlorophyll production.</p>

                </div>

                <div className="agfert-info-item">

                  <strong>Phosphorus (P)</strong>

                  <p>Supports root development and energy transfer.</p>

                </div>

                <div className="agfert-info-item">

                  <strong>Potassium (K)</strong>

                  <p>Supports water regulation and plant resilience.</p>

                </div>

                <div className="agfert-info-item">

                  <strong>Soil pH & Moisture</strong>

                  <p>Influence nutrient availability and uptake.</p>

                </div>

              </section>

              <div className="agfert-disclaimer">

                <AlertCircle size={19} />

                <p>
                  Confirm fertilizer selection and application
                  rates with a soil test and a local agricultural
                  expert before use.
                </p>

              </div>

            </div>

          </div>

          <footer className="agfert-footer">

            <span>AgriMind AI — Growing a smarter future.</span>

            <span>Powered by Machine Learning</span>

          </footer>

        </div>

      </main>

    </div>

  );

}
