import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { gsap } from "gsap";
import { HiArrowLeft } from "react-icons/hi";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useLoading, setProgress } from "../../context/LoadingProvider";
import { useAuth0 } from "@auth0/auth0-react";
import "../styles/Auth.css";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const cardRef = useRef<HTMLDivElement>(null);

  const { setLoading } = useLoading();
  const { loginWithRedirect } = useAuth0();

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
    // In a real Auth0 setup, we might use loginWithRedirect for email/password too
    // or call a custom login logic if we were using the Management API directly.
    // For this SPI integration, we'll favor redirect.
    loginWithRedirect();
  };

  const handleSocialLogin = (connection: string) => {
    loginWithRedirect({
      authorizationParams: {
        connection: connection,
      },
    });
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
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
