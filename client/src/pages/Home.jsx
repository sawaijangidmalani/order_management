import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdEmail, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth";
import "../Style/Home.css";

function Home() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  useEffect(() => {
    const savedCredentials = JSON.parse(localStorage.getItem("rememberMeData"));
    if (savedCredentials) {
      setCredentials(savedCredentials);
      setRememberMe(true);
    }
  }, []);

  const validForm = () => {
    let valid = true;
    const newError = { email: "", password: "" };

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!credentials.email.trim()) {
      newError.email = "*Email is required";
      valid = false;
    } else if (!emailPattern.test(credentials.email)) {
      newError.email = "*Please enter a valid email address";
      valid = false;
    }

    if (!credentials.password.trim()) {
      newError.password = "*Password is required";
      valid = false;
    } else if (credentials.password.length < 6) {
      newError.password = "*Please enter a valid password (min 6 characters)";
      valid = false;
    }

    setError(newError);
    return valid;
  };

  const inputEvent = (e) => {
    const { value, name } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (validForm()) {
      setLoading(true);
      try {
        const { data } = await axios.post(
          "https://order-management-tgh3.onrender.com/auth/login",
          credentials
        );
        if (data?.success) {
          toast.success("User Login Successfully");
          localStorage.setItem("auth", JSON.stringify(data));
          setAuth({ user: data.user, token: data.token });

          if (rememberMe) {
            localStorage.setItem("rememberMeData", JSON.stringify(credentials));
          } else {
            localStorage.removeItem("rememberMeData");
          }
          navigate("/dashboard");
        } else {
          toast.error(data?.message || "Incorrect email or password");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Login error occurred while logging in"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {loading && (
          <div className="loading-overlay">
            <FaSpinner className="loading-spinner" />
          </div>
        )}
        <div className="login-header">
          {/* <h1>Welcome Back</h1> */}
          <img src="/inventory.png" alt="Inventory Logo" className="logo" />
          <p>Please sign in to continue</p>
        </div>

        <form className="login-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label>Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                autoComplete="email"
                onChange={inputEvent}
                value={credentials.email}
              />
              <MdEmail className="input-icon" />
            </div>
            <span className="error-text">{error.email}</span>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                onChange={inputEvent}
                value={credentials.password}
              />
              {showPassword ? (
                <MdVisibilityOff
                  className="input-icon"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <MdVisibility
                  className="input-icon"
                  onClick={togglePasswordVisibility}
                />
              )}
            </div>
            <span className="error-text">{error.password}</span>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberMe}
              />
              <span className="checkbox-text">Remember me</span>
            </label>
          </div>

          <button className="login-button" type="submit" disabled={loading}>
            Login
          </button>

          <div className="additional-options">
            <Link to="/forgot">Forgot Password?</Link>
            <span className="separator">•</span>
            <Link to="/signin">Create Account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Home;
