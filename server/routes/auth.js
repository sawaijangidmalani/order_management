import express from "express";
import pool from "../utils/db.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const otpStore = new Map();

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM user WHERE email = ?";

  try {
    const [result] = await pool.query(sql, [email]);

    if (result.length > 0) {
      const isMatch = await comparePassword(password, result[0].passwordhash);

      if (isMatch) {
        // User details aur token bhejna
        const user = {
          id: result[0].Id,
          name: result[0].name,
          email: result[0].email,
          isadmin: result[0].isadmin,
        };

        res.json({ success: true, user, token: "dummy_token_123" });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Invalid email or password" });
      }
    } else {
      res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
  } catch (err) {
    console.error("Error processing login request:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/signup", async (req, res) => {
  const { email, password, name, username } = req.body;

  if (!email || !password || !name || !username) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const checkEmailSql = "SELECT * FROM user WHERE email = ?";
  const insertUserSql =
    "INSERT INTO user (Username, name, email, passwordhash, isadmin, status) VALUES (?, ?, ?, ?, ?, ?)";

  try {
    const [existingUsers] = await pool.query(checkEmailSql, [email]);

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(insertUserSql, [
      username,
      name,
      email,
      hashedPassword,
      0,
      1,
    ]);

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error("Error processing signup request:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/forgotPassword", async (req, res) => {
  const { email } = req.body;
  const checkEmailSql = "SELECT * FROM user WHERE email = ?";

  try {
    const [result] = await pool.query(checkEmailSql, [email]);

    if (result.length === 0) {
      return res.status(404).json({ error: "Email not found" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    otpStore.set(email, otp);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
      html: `<b>Your OTP for password reset is: ${otp}</b>`,
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

router.post("/verifyOTP", (req, res) => {
  const { email, otp } = req.body;

  if (!otpStore.has(email) || otpStore.get(email) !== otp) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  otpStore.delete(email);
  res.status(200).json({ message: "OTP verified successfully" });
});

router.post("/resetPassword", async (req, res) => {
  const { email, newPassword } = req.body;

  const hashedPassword = await hashPassword(newPassword);
  const updatePasswordSql = "UPDATE user SET passwordhash = ? WHERE email = ?";

  try {
    await pool.query(updatePasswordSql, [hashedPassword, email]);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Failed to update password" });
  }
});

export { router as authRoutes };
