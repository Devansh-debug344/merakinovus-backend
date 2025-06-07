// routes/contact.js
import express from "express"
const router = express.Router();

import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "engineeringdraft@gmail.com",
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const adminMail = {
    from: email,
    to: "engineeringdraft@gmail.com",
    subject: `New message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  const userMail = {
    from: "engineeringdraft@gmail.com",
    to: email,
    subject: "Thank you for contacting us",
    text: `Hi ${name},\n\nThank you for trusting us. We have received your message and will get back to you shortly.\n\n– Team Merakinovus`,
  };

  try {
    await prisma.contact_messages.create({
      data: { name, email, message },
    });

    // Send success response first (non-blocking)
    res.status(200).json({ message: "Message received. Emails being sent." });

    // Send emails in background
    transporter.sendMail(adminMail, (err, info) => {
      if (err) console.error("Admin email error:", err);
    });

    transporter.sendMail(userMail, (err, info) => {
      if (err) console.error("User email error:", err);
    });

  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router

