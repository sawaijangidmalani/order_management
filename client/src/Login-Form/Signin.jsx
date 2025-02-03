
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../Header/Header";
import "./Sign.css";
import Login from "./Login";

function Signin() {
  const navigate = useNavigate();
  const [sign, setSign] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [error, setError] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const inputEvent = (e) => {
    const { name, value } = e.target;
    setSign((prevSign) => ({
      ...prevSign,
      [name]: value,
    }));
  };

  const validForm = () => {
    let valid = true;
    let newError = { name: "", username: "", email: "", password: "", confirm: "" };

    if (!sign.name.trim()) {
      newError.name = "* Name is required";
      valid = false;
    }
    if (!sign.username.trim()) {
      newError.username = "* Username is required";
      valid = false;
    }
    if (!sign.email.trim()) {
      newError.email = "* Email is required";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(sign.email)) {
      newError.email = "* Enter a valid email";
      valid = false;
    }
    if (!sign.password.trim()) {
      newError.password = "* Password is required";
      valid = false;
    } else if (sign.password.length < 6) {
      newError.password = "* Password must be at least 6 characters";
      valid = false;
    }
    if (sign.password !== sign.confirm) {
      newError.confirm = "* Passwords do not match";
      valid = false;
    }

    setError(newError);
    return valid;
  };

  const onSubmits = async (e) => {
    e.preventDefault();
    if (validForm()) {
      try {
        const { data } = await axios.post("http://localhost:8000/auth/signup", sign);
        if (data?.success) {
          navigate("/dashboard");
        } else {
          setError({ email: "* Signup failed, try again" });
        }
      } catch (error) {
        console.error("Error signing up:", error);
        setError({ email: "* Error signing up, try again later" });
      }
    }
  };

  return (
    <div className="login">
      <Header />
      <form onSubmit={onSubmits} className="form">
        <h2>Sign Up</h2>

        <div className="input-group">
          <input type="text" placeholder="Full Name" name="name" value={sign.name} onChange={inputEvent} />
          <span className="error">{error.name}</span>
        </div>

        <div className="input-group">
          <input type="text" placeholder="Username" name="username" value={sign.username} onChange={inputEvent} />
          <span className="error">{error.username}</span>
        </div>

        <div className="input-group">
          <input type="email" placeholder="Email" name="email" value={sign.email} onChange={inputEvent} />
          <span className="error">{error.email}</span>
        </div>

        <div className="input-group">
          <input type="password" placeholder="Password" name="password" value={sign.password} onChange={inputEvent} />
          <span className="error">{error.password}</span>
        </div>

        <div className="input-group">
          <input type="password" placeholder="Confirm Password" name="confirm" value={sign.confirm} onChange={inputEvent} />
          <span className="error">{error.confirm}</span>
        </div>

        <button type="submit">Sign Up</button>

        <p>
          Already have an account? <Link to="/" className="signin-link">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

export default Signin;

