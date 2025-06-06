const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("./generated/prisma");

const prisma = new PrismaClient();
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");

app.use(cors());
app.use(express.json());
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "devanshchaturvedi273@gmail.com",
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
  return res.status(400).json({ message: "All fields are required" });
}

  const adminMail = {
    from: email,
    to: "devanshchaturvedi273@gmail.com",
    subject: `New message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };
  const userMail = {
    from: "devanshchaturvedi273@gmail.com",
    to: email, // User's email
    subject: "Thank you for contacting us",
    text: `Hi ${name},\n\nThank you for trusting us. We have received your message and will get back to you shortly.\n\n– Team Merakinovus`,
  };

  try {
    await prisma.contact_messages.create({
      data: { name, email, message },
    });

    await transporter.sendMail(adminMail);
    await transporter.sendMail(userMail);

    res.status(200).json({ message: "Email Sent Succesfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
