import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { gsap } from "gsap";
import { HiArrowLeft } from "react-icons/hi";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useLoading, setProgress } from "../../context/LoadingProvider";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAuthContext } from "../../context/AuthProvider";

import "../styles/Auth.css";

const AuthPage = () => {
  const { login } = useAuthContext();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const cardRef = useRef<HTMLDivElement>(null);

  const { setLoading } = useLoading();

  useEffect(() => {
    const loader = setProgress(setLoading);
    loader.loaded().then(() => {
      // Loader finished
    });

    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      });
    });
    return () => ctx.revert();
  }, [setLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailInput = (document.getElementById("email") as HTMLInputElement).value;
    const passwordInput = (document.getElementById("password") as HTMLInputElement).value;
    
    if (emailInput && passwordInput) {
      if (emailInput === "admin@test.com") {
         alert("Please use the Admin Portal for administrator login.");
         return;
      }
      const mockUser = {
        name: emailInput.split('@')[0],
        email: emailInput,
        picture: "https://ui-avatars.com/api/?name=" + emailInput.split('@')[0],
        role: "user" as const
      };
      login("mock_local_token", mockUser);
      window.location.href = "/";
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        login(tokenResponse.access_token, userInfo.data);
        // Force a hard redirect to bypass any SPA state locking
        window.location.href = "/";
      } catch (error) {
        alert("Failed to fetch user info from Google. Check console for details.");
        console.error("Failed to fetch user info", error);
      }
    },
    onError: (errorResponse) => alert("Login failed! " + JSON.stringify(errorResponse)),
  });

  const handleSocialLogin = (connection: string) => {
    if (connection === "google-oauth2") {
      handleGoogleLogin();
    } else {
      alert("This login method is currently disabled.");
    }
  };

  return (
    <div className="auth-page">
      <Link to="/" className="back-to-home">
        <HiArrowLeft /> Back to Home
      </Link>
      
      <div className="auth-card" ref={cardRef}>
        <div className="auth-header">
          <h1>{mode === "login" ? "Welcome Back" : "Join Us"}</h1>
          <p>{mode === "login" ? "Login to your account to continue" : "Create an account to get started"}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                placeholder="Your Name" 
                required 
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Enter your email" 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="••••••••" 
              required 
            />
          </div>
          <button type="submit" className="auth-btn">
            {mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>

        <div className="auth-separator">
          <span>Or continue with</span>
        </div>

        <div className="social-auth">
          <button 
            className="social-btn google" 
            onClick={() => handleSocialLogin("google-oauth2")}
          >
            <FaGoogle /> Google
          </button>
          <button 
            className="social-btn github"
            onClick={() => handleSocialLogin("github")}
          >
            <FaGithub /> GitHub
          </button>
        </div>

        <div className="auth-footer">
          {mode === "login" ? (
            <>Don't have an account? <span onClick={() => setMode("signup")} className="auth-toggle">Signup</span></>
          ) : (
            <>Already have an account? <span onClick={() => setMode("login")} className="auth-toggle">Login</span></>
          )}
          <div style={{ marginTop: '15px' }}>
            <Link to="/admin" className="auth-toggle" style={{ fontSize: '0.85rem', opacity: 0.8 }}>Goto Admin Portal</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
