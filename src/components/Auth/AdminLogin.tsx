import { useState } from "react";
import { Link } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import { useAuthContext } from "../../context/AuthProvider";

import "../styles/Auth.css";

const AdminLogin = () => {
  const { login } = useAuthContext();
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailInput = (document.getElementById("admin-email") as HTMLInputElement).value;
    const passwordInput = (document.getElementById("admin-password") as HTMLInputElement).value;
    
    if (emailInput === "admin@test.com" && passwordInput === "admin123") {
      const adminUser = {
        name: "Administrator",
        email: emailInput,
        picture: "https://ui-avatars.com/api/?name=Admin&background=B22222&color=fff",
        role: "admin" as const
      };
      login("mock_admin_token", adminUser);
      window.location.href = "/";
    } else {
      setError("Invalid admin credentials");
    }
  };

  return (
    <div className="auth-page admin-bg" style={{ background: 'radial-gradient(circle at center, #2a0808 0%, #0a0a0a 100%)' }}>
      <Link to="/login" className="back-to-home">
        <HiArrowLeft /> Back to User Login
      </Link>
      
      <div className="auth-card" style={{ border: '1px solid #4a1a1a', boxShadow: '0 8px 32px rgba(255, 0, 0, 0.1)' }}>
        <div className="auth-header" style={{ borderBottom: '2px solid rgba(255, 75, 75, 0.3)', paddingBottom: '15px' }}>
          <h1 style={{ color: '#ff4b4b', textShadow: '0 0 10px rgba(255,75,75,0.4)' }}>Admin Portal</h1>
          <p>Login with administrator credentials</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          {error && <div style={{ color: '#ff4b4b', marginBottom: '10px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
          <div className="form-group">
            <label htmlFor="admin-email">Admin Email</label>
            <input 
              type="email" 
              id="admin-email" 
              placeholder="admin@test.com" 
              defaultValue="admin@test.com"
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="admin-password">Password</label>
            <input 
              type="password" 
              id="admin-password" 
              placeholder="admin123" 
              defaultValue="admin123"
              required 
            />
          </div>
          <button type="submit" className="auth-btn" style={{ background: 'linear-gradient(45deg, #cc0000, #ff4b4b)', boxShadow: '0 0 15px rgba(255,0,0,0.3)' }}>
            Enter Portal
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
