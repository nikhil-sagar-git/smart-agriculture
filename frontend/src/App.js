import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";

// User Pages
import Dashboard from "./pages/user/Dashboard";
import Disease from "./pages/user/Disease";
import Crop from "./pages/user/Crop";
import Fertilizer from "./pages/user/Fertilizer";
import Chatbot from "./pages/user/Chatbot";
import Profile from "./pages/user/Profile";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";

// Auth check
const isAuth = () => localStorage.getItem("token");
const isAdmin = () => localStorage.getItem("role") === "admin";

// Protected Route
const ProtectedRoute = ({ children }) => {
  return isAuth() ? children : <Navigate to="/login" />;
};

// Admin Route
const AdminRoute = ({ children }) => {
  return isAuth() && isAdmin() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/disease" element={<ProtectedRoute><Disease /></ProtectedRoute>} />
        <Route path="/crop" element={<ProtectedRoute><Crop /></ProtectedRoute>} />
        <Route path="/fertilizer" element={<ProtectedRoute><Fertilizer /></ProtectedRoute>} />
        <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;