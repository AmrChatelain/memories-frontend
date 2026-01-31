import React, { useState } from "react";
import "./signUp.css";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../Components/input/PasswordInput";
import { validateEmail } from "../../utils/checker";
import axiosInstance from "../../utils/axiosInstance";

function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Please enter your name.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post("/auth/signup", {
        fullName: name,
        email: email,
        password: password,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error. Please try again later.");
      }
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        {/* Left side - Image/Brand */}
        <div className="signup-left">
          <div className="brand-content">
            <div className="photo-stack">
              <div className="photo-card card-1"></div>
              <div className="photo-card card-2"></div>
              <div className="photo-card card-3"></div>
            </div>
            <h1 className="brand-title">Capture Every Moment</h1>
            <p className="brand-subtitle">
              Store your precious memories and cherished images in one beautiful
              place
            </p>
            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-icon">📸</span>
                <span>Unlimited photo storage</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <span>Secure & private</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💝</span>
                <span>memories with loved ones</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="signup-right">
          <div className="form-container">
            <div className="form-header">
              <h2>Create Your Account</h2>
              <p>Start preserving your memories today</p>
            </div>

            <form onSubmit={handleSignUp} noValidate>
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">✉️</span>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
  <label htmlFor="password">Password</label>
  <div className="input-wrapper">
    <span className="input-icon">🔑</span>
    <PasswordInput
      id="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeHolder="Create a strong password"
    />
  </div>
</div>

<div className="input-group">
  <label htmlFor="confirmPassword">Confirm Password</label>
  <div className="input-wrapper">
    <span className="input-icon">🔑</span>
    <PasswordInput
      id="confirmPassword"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      placeHolder="Re-enter your password"
    />
  </div>
</div>


              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="submit-btn">
                <span>Create Account</span>
                <span className="btn-arrow">→</span>
              </button>
            </form>

            <div className="form-footer">
              <p>
                Already have an account?{" "}
                <button className="link-btn" onClick={() => navigate("/login")}>
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
