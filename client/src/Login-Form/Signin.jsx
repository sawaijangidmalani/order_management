import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdEmail, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FaSpinner, FaUser, FaUserCircle } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import "../Style/Home.css";

function Signin() {
  const navigate = useNavigate();
  const [sign, setSign] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputEvent = (e) => {
    const { name, value } = e.target;
    setSign((prevSign) => ({
      ...prevSign,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validForm = () => {
    let valid = true;
    let newError = {
      name: "",
      username: "",
      email: "",
      password: "",
    };

    if (!sign.name.trim()) {
      newError.name = "* Name is required";
      valid = false;
    }

    if (!sign.username.trim()) {
      newError.username = "* Username is required";
      valid = false;
    } else if (sign.username.length < 3) {
      newError.username = "* Username must be at least 3 characters";
      valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!sign.email.trim()) {
      newError.email = "* Email is required";
      valid = false;
    } else if (!emailPattern.test(sign.email)) {
      newError.email = "* Please enter a valid email address";
      valid = false;
    }

    if (!sign.password.trim()) {
      newError.password = "* Password is required";
      valid = false;
    } else if (sign.password.length < 6) {
      newError.password = "* Password must be at least 6 characters";
      valid = false;
    }

    setError(newError);
    return valid;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (validForm()) {
      setLoading(true);
      try {
        const { data } = await axios.post(
          "https://order-management-p53a.onrender.com/auth/signup",
          sign
        );
        if (data?.success) {
          toast.success("Signup Successful");
          navigate("/");
        } else {
          toast.error(data?.message || "Signup failed, try again");
        }
      } catch (error) {
        if (error.response?.status === 409) {
          setError((prevError) => ({
            ...prevError,
            email: "* Email already exists",
          }));
          toast.error("Email already exists. Try another one.");
        } else {
          toast.error(
            error.response?.data?.error || "An error occurred during signup."
          );
        }
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
          <h1>Create Account</h1>
          <p>Sign up to get started</p>
        </div>

        <form className="login-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                onChange={inputEvent}
                value={sign.name}
              />
              <FaUser className="input-icon" />
            </div>
            <span className="error-text">{error.name}</span>
          </div>

          <div className="form-group">
            <label>Username</label>
            <div className="input-wrapper">
              <input
                type="text"
                name="username"
                placeholder="Enter username"
                onChange={inputEvent}
                value={sign.username}
              />
              <FaUserCircle className="input-icon" />
            </div>
            <span className="error-text">{error.username}</span>
          </div>

          <div className="form-group">
            <label>Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                onChange={inputEvent}
                value={sign.email}
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
                placeholder="Enter password"
                onChange={inputEvent}
                value={sign.password}
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

          <button className="login-button" type="submit" disabled={loading}>
            Sign Up
          </button>

          <div className="additional-options">
            <span>Already have an account?</span>
            <Link to="/"> Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signin;
