import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import Login from "./Login";
import "./Sign.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signin() {
  const navigate=useNavigate();
  const [login, setLogin] = useState(false);
  const [sign, setSign] = useState({
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState({
    email: "",
    password: "",
    confirm: "",
  });

  const inputEvent = (e) => {
    const { value, name } = e.target;
    setSign((prevSign) => ({
      ...prevSign,
      [name]: value,
    }));
  };

  const validForm = () => {
    let valid = true;
    const newError = { ...error };

    if (sign.email.trim() === "") {
      newError.email = "* Email is required";
      valid = false;
    } else {
      newError.email = "";
    }

    if (sign.password.trim() === "") {
      newError.password = "* Password is required";
      valid = false;
    } else {
      newError.password = "";
    }

    if (sign.password !== sign.confirm) {
      newError.confirm = "* Passwords do not match";
      valid = false;
    } else {
      newError.confirm = "";
    }

    setError(newError);
    return valid;
  };

  const onSubmits = async (e) => {
    e.preventDefault();

    if (validForm()) {
      try {
        const { data } = await axios.post("http://localhost:8000/auth/signup", sign);
        if(data?.success){
          navigate("/dashboard")
        }        
        
      } catch (error) {
        console.error("Error signing up:", error);
      }
    } else {
      console.log("Form is not valid");
      // Optionally handle invalid form case
    }
  };

  useEffect(() => {
    setSign({ email: "", password: "", confirm: "" });
  }, []);

  return (
    <div className="login">
      {login ? (
        <Login />
      ) : (
        <>
          <Header />
          <form onSubmit={onSubmits} className="form">
            <h2>Sign Up</h2>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={sign.email}
                onChange={inputEvent}
              />
              <span className="error">{error.email}</span>
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={sign.password}
                onChange={inputEvent}
              />
              <span className="error">{error.password}</span>
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Confirm Password"
                name="confirm"
                value={sign.confirm}
                onChange={inputEvent}
              />
              <span className="error">{error.confirm}</span>
            </div>
            <button type="submit">Sign Up</button>
          </form>
        </>
      )}
    </div>
  );
}

export default Signin;
