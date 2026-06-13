import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div>
      <div className="navbar">
        <h2>Admin Dashboard</h2>
        <div>
          <Link to="/admin/users">Manage Users</Link>
          <Link to="/login" onClick={() => localStorage.clear()}>
            Logout
          </Link>
        </div>
      </div>

      <div className="container">
        <h1>Welcome Admin 👨‍💼</h1>

        <div>
          <div className="card">
            <h3>Total Users</h3>
            <p>120</p>
          </div>

          <div className="card">
            <h3>Total Predictions</h3>
            <p>450</p>
          </div>

          <div className="card">
            <h3>System Status</h3>
            <p>Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}