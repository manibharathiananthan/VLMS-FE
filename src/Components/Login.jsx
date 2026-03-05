import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://localhost:7291/api/User";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/Login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Login failed"); return; }
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch { setError("Server error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow w-100" style={{ maxWidth: "400px" }}>
        <h3 className="text-center mb-4">Login</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleLogin}>
          <input className="form-control mb-2" name="email" placeholder="Email" type="email"
                 onChange={handleChange} required />
          <input className="form-control mb-2" name="password" placeholder="Password" type="password"
                 onChange={handleChange} required />
          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="text-center mt-3">
          <small>Don’t have an account? <span className="text-primary" style={{cursor:"pointer"}}
                 onClick={() => navigate("/register")}>Register</span></small>
        </div>
      </div>
    </div>
  );
}

export default Login;