import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { MdEmail, MdVisibility, MdVisibilityOff, MdLock } from "react-icons/md";
import "../Style/Home.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post("https://order-management-p53a.onrender.com/auth/forgotPassword", { email });
      toast.success(data.message || "OTP sent successfully");
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.error || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post("https://order-management-p53a.onrender.com/auth/verifyOTP", { email, otp });
      toast.success(data.message || "OTP verified successfully");
      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("Please enter and confirm your new password");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post("https://order-management-p53a.onrender.com/auth/resetPassword", { email, newPassword });
      toast.success(data.message || "Password reset successfully!");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.error || "Error resetting password");
    } finally {
      setLoading(false);
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
          <h1>Forgot Password</h1>
          <p>Reset your password in a few steps</p>
        </div>

        <form className="login-form">
          {step === 1 && (
            <>
              <div className="form-group">
                <label>Email</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <MdEmail className="input-icon" />
                </div>
              </div>
              <button className="login-button" onClick={sendOtp} disabled={loading}>
                Send OTP
              </button>
              <div className="additional-options">
                <Link to="/">Back to Login</Link>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="form-group">
                <label>OTP</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                  <MdLock className="input-icon" />
                </div>
              </div>
              <button className="login-button" onClick={verifyOtp} disabled={loading}>
                Verify OTP
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <div className="form-group">
                <label>New Password</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  {showPassword ? (
                    <MdVisibilityOff className="input-icon" onClick={() => setShowPassword(false)} />
                  ) : (
                    <MdVisibility className="input-icon" onClick={() => setShowPassword(true)} />
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <div className="input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  {showConfirmPassword ? (
                    <MdVisibilityOff className="input-icon" onClick={() => setShowConfirmPassword(false)} />
                  ) : (
                    <MdVisibility className="input-icon" onClick={() => setShowConfirmPassword(true)} />
                  )}
                </div>
              </div>

              <button className="login-button" onClick={resetPassword} disabled={loading}>
                Reset Password
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
