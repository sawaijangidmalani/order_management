import express from "express";
import pool from "../utils/db.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Set up the email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to hash passwords
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Helper function to compare passwords
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

      if (!isMatch) {
        res.json({ result: true, userDetails: result });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    } else {
      res.status(401).json({ message: "Invalid  password" });
    }
  } catch (err) {
    console.error("Error processing login request:", err);
    res.status(500).json({ error: err });
  }
});

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const checkEmailSql = "SELECT * FROM user WHERE email = ?";
  const insertUserSql = "INSERT INTO user (email, password) VALUES (?, ?)";

  try {
    const [existingUsers] = await pool.query(checkEmailSql, [email]);

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await hashPassword(password);
    await pool.query(insertUserSql, [email, hashedPassword]);
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
  const checkEmailSql = "SELECT password FROM user WHERE email = ?";

  try {
    const [result] = await pool.query(checkEmailSql, [email]);

    if (result.length === 0) {
      return res.status(404).json({ error: "Email not found" });
    }

    const userPassword = result[0].password;

    const sendForgotPasswordEmail = async () => {
      try {
        const info = await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Forgot Password",
          text: `Your password is: ${userPassword}`,
          html: `<b>Your password is: ${userPassword}</b>`,
        });

        console.log("Message sent: %s", info.messageId);
        return info;
      } catch (error) {
        console.error("Error sending email:", error);
        throw error;
      }
    };

    const info = await sendForgotPasswordEmail();
    res
      .status(200)
      .json({ message: "Email sent successfully", messageId: info.messageId });
  } catch (error) {
    console.error("Failed to send email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

export { router as authRoutes };
