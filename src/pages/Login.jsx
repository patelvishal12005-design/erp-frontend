import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginUser = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await API.post("token/", { username, password });
      localStorage.setItem("token", response.data.access);
      navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (typeof data === 'object' && data !== null) {
          const errorMsg = Object.values(data).flat().join(" ");
          setError(errorMsg || "Login failed. Please try again.");
        } else {
          setError("Login failed. Please try again. Server error.");
        }
      } else {
        setError("Login failed. Network error or server is down.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-orb orb-1" />
      <div className="login-bg-orb orb-2" />

      <div className="login-card">
        <div className="login-logo">
          <span className="login-logo-icon">⚡</span>
        </div>
        <h1 className="login-title">ERP System</h1>
        <p className="login-subtitle">Sign in to your workspace</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={loginUser} className="login-form">
          <div className="login-field">
            <label className="login-label">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              className="login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label className="login-label">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            id="login-btn"
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="login-spinner" />
            ) : (
              "Sign In"
            )}
          </button>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#9ca3af' }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: '#8b5cf6', textDecoration: 'none', fontWeight: '500' }}>
              Create one
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}