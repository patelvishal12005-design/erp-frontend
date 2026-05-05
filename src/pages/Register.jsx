import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const registerUser = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await API.post("register/", { username, password, email });
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (typeof data === 'object' && data !== null) {
          const errorMsg = Object.values(data).flat().join(" ");
          setError(errorMsg || "Registration failed. Please try again.");
        } else {
          setError("Registration failed. Please try again. Server error.");
        }
      } else {
        setError("Registration failed. Network error or server is down.");
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
        <h1 className="login-title">Create Account</h1>
        <p className="login-subtitle">Join the ERP workspace</p>

        {error && <div className="login-error">{error}</div>}
        {success && <div className="login-error" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderLeftColor: '#10b981' }}>{success}</div>}

        <form onSubmit={registerUser} className="login-form">
          <div className="login-field">
            <label className="login-label">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Choose a username"
              className="login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label className="login-label">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label className="login-label">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create a password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            id="register-btn"
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="login-spinner" />
            ) : (
              "Sign Up"
            )}
          </button>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#9ca3af' }}>
            Already have an account?{" "}
            <Link to="/" style={{ color: '#8b5cf6', textDecoration: 'none', fontWeight: '500' }}>
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
