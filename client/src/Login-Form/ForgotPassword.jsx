import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../Header/Header";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("https://order-management-p53a.onrender.com/auth/forgotPassword", { email });
      setMessage(data.message || "OTP sent successfully");
      setStep(2);
    } catch (error) {
      setMessage(error.response?.data?.error || "Error sending OTP");
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("https://order-management-p53a.onrender.com/auth/verifyOTP", { email, otp });
      setMessage(data.message || "OTP verified successfully");
      setStep(3);
    } catch (error) {
      setMessage(error.response?.data?.error || "Invalid OTP");
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("https://order-management-p53a.onrender.com/auth/resetPassword", { email, newPassword });
      setMessage(data.message || "Password reset successfully!");
      setStep(4);
    } catch (error) {
      setMessage(error.response?.data?.error || "Error resetting password");
    }
  };

  return (
    <div className="login">
      <Header />
      <form className="form">
        <h2>Forgot Password</h2>
        <div className="input-groups">
          {message && <p>{message}</p>}
          
          {step === 1 && (
            <>
              <label>
                <span style={{ color: "red" }}>*</span> Email:
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <br />
              <button onClick={sendOtp}>Send OTP</button>
              <Link to="/" style={{ textDecoration: "none", float: "right" }}>
                Back
              </Link>
            </>
          )}

          {step === 2 && (
            <>
              <label>
                <span style={{ color: "red" }}>*</span> OTP:
              </label>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <br />
              <button onClick={verifyOtp}>Verify OTP</button>
            </>
          )}

          {step === 3 && (
            <>
              <label>
                <span style={{ color: "red" }}>*</span> New Password:
              </label>
              <input
                type="password"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <br />
              <button onClick={resetPassword}>Reset Password</button>
            </>
          )}

          {step === 4 && (
            <p>
              Password reset successfully! <a href="/">Login</a>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
