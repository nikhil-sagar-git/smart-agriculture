const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// DB
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12958nikhil@",
  database: "agripro123"
});

db.connect(err => {
  if (err) console.log(err);
  else console.log("MySQL Connected");
});

// 📦 TEMP OTP STORE (no DB)
const otpStore = {};

// 📧 Mail setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rasalanikhil@gmail.com",
    pass: "vevttpjvxtxlrzaf"
  }
});

// ================= SEND OTP =================
app.post("/sendotp", (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  otpStore[email] = {
    otp,
    expires: Date.now() + 60000 // 1 min
  };

  transporter.sendMail({
    from: "rasalanikhil@gmail.com",
    to: email,
    subject: "OTP Verification",
    html: `<h2>Your OTP is: ${otp}</h2>`
  });

  res.json({ message: "OTP sent" });
});

// ================= VERIFY OTP =================
app.post("/verify", (req, res) => {
  const { email, otp } = req.body;

  const record = otpStore[email];

  if (!record) {
    return res.status(400).json({ message: "No OTP found" });
  }

  if (Date.now() > record.expires) {
    return res.status(400).json({ message: "OTP expired" });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // ✅ Verified → delete OTP
  delete otpStore[email];

  res.json({ message: "OTP verified" });
});

// ================= REGISTER =================
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, result) => {
      if (result.length > 0) {
        return res.status(400).json({ message: "Email exists" });
      }

      db.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, password],
        (err) => {
          if (err) return res.status(500).json({ message: "DB error" });

          res.json({ message: "Registered successfully" });
        }
      );
    }
  );
});

// ================= LOGIN =================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, result) => {
      if (result.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }

      const user = result[0];

      if (user.password !== password) {
        return res.status(400).json({ message: "Wrong password" });
      }

      res.json({
        message: "Login success",
        user: user
      });
    }
  );
});


// ================= GET ALL USERS =================
app.get("/getdata", (req, res) => {

  db.query(
    "SELECT id, username, email, created_at FROM users",
    (err, result) => {

      if (err) {
        return res.status(500).json({
          message: "DB error"
        });
      }

      res.json({
        users: result
      });
    }
  );
});


// ================= DELETE USER =================
app.delete("/delete/:id", (req, res) => {

  const id = req.params.id;

  db.query(
    "DELETE FROM users WHERE id=?",
    [id],
    (err) => {

      if (err) {
        return res.status(500).json({
          message: "Delete failed"
        });
      }

      res.json({
        message: "User deleted"
      });
    }
  );
});

app.listen(4000, () =>
  console.log("Server running on http://localhost:4000")
);