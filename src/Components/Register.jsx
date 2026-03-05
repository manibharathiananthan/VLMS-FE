import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://localhost:7291/api/User";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ userName: "", email: "", password: "", phone: "" });
  const [error, setError] = useState(""); const [success, setSuccess] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      const res = await fetch(`${API_BASE}/Register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!res.ok) { setError(await res.text()); return; }
      setSuccess("Registration successful!"); setTimeout(() => navigate("/login"), 1500);
    } catch { setError("Server error"); }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow w-100" style={{ maxWidth: "400px" }}>
        <h3 className="text-center mb-4">Register</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleRegister}>
          <input className="form-control mb-2" name="userName" placeholder="User Name" onChange={handleChange} required/>
          <input className="form-control mb-2" name="email" placeholder="Email" type="email" onChange={handleChange} required/>
          <input className="form-control mb-2" name="password" placeholder="Password" type="password" onChange={handleChange} required/>
          <input className="form-control mb-2" name="phone" placeholder="Phone" onChange={handleChange} required/>
          <button className="btn btn-success w-100">Register</button>
        </form>
        <div className="text-center mt-3">
          <small>Already have account? <span className="text-primary" style={{cursor:"pointer"}} onClick={() => navigate("/")}>Login</span></small>
        </div>
      </div>
    </div>
  );
}

export default Register;