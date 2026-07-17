// const express = require("express");
// const cors = require("cors");
// const mysql = require("mysql2");
// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const app = express();
// app.use(cors());
// app.use(express.json());


// // DB
// // const db = mysql.createConnection({
// //   host: "localhost",
// //   user: "root",
// //   password: "12958nikhil@",
// //   database: "agripro123"
// // });

// ;

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT || 3306
// });

// db.connect((err) => {
//   if (err) {
//     console.error("DB Connection Failed:", err.message);

//     // IMPORTANT: STOP SERVER if DB fails
//     process.exit(1);
//   }

//   console.log("✅ AWS RDS Connected");
// });



// // 📦 TEMP OTP STORE (no DB)
// const otpStore = {};

// // 📧 Mail setup
// // const transporter = nodemailer.createTransport({
// //   service: "gmail",
// //   auth: {
// //     user: process.env.EMAIL_USER,
// //     pass: process.env.EMAIL_PASS
// //   }
// // });


// const transporter = nodemailer.createTransport({
//   service: "gmail",

//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   },

//   connectionTimeout: 10000,
//   socketTimeout: 10000
// });

// transporter.verify((err) => {
//   if (err) {
//     console.log("MAIL ERROR:", err.message);
//   } else {
//     console.log("MAIL READY");
//   }
// });

// // ================= SEND OTP =================

// // app.post("/sendotp", async (req, res) => {
// //   try {
// //     const { email } = req.body;

// //     if (!email) {
// //       return res.status(400).json({
// //         message: "Email is required"
// //       });
// //     }

// //     const otp = Math.floor(
// //       1000 + Math.random() * 9000
// //     ).toString();

// //     otpStore[email] = {
// //       otp,
// //       expires: Date.now() + 60000
// //     };

// //     const info = await transporter.sendMail({
// //       from: process.env.EMAIL_USER,
// //       to: email,
// //       subject: "OTP Verification",
// //       html: `
// //         <h2>Your OTP is: ${otp}</h2>
// //         <p>This OTP expires in 60 seconds.</p>
// //       `
// //     });

// //     console.log("EMAIL SENT:", info.response);

// //     return res.json({
// //       message: "OTP sent successfully"
// //     });

// //   } catch (err) {

// //     console.log("EMAIL ERROR:", err);

// //     return res.status(500).json({
// //       message: "Email sending failed",
// //       error: err.message
// //     });
// //   }
// // });


// app.post("/sendotp", async (req, res) => {
//   try {
//     const { email } = req.body;

//     console.log("OTP REQUEST:", email);

//     if (!email) {
//       return res.status(400).json({
//         message: "Email required"
//       });
//     }

//     const otp = "1234";

//     return res.json({
//       message: "Backend reached",
//       otp
//     });

//   } catch (err) {
//     console.log(err);

//     return res.status(500).json({
//       message: "Server error"
//     });
//   }
// });

// // ================= VERIFY OTP =================
// app.post("/verify", (req, res) => {
//   const { email, otp } = req.body;

//   const record = otpStore[email];

//   if (!record) {
//     return res.status(400).json({ message: "No OTP found" });
//   }

//   if (Date.now() > record.expires) {
//     return res.status(400).json({ message: "OTP expired" });
//   }

//   if (record.otp !== otp) {
//     return res.status(400).json({ message: "Invalid OTP" });
//   }

//   // ✅ Verified → delete OTP
//   delete otpStore[email];

//   res.json({ message: "OTP verified" });
// });

// // ================= REGISTER =================
// app.post("/register", (req, res) => {
//   const { username, email, password } = req.body;

//   db.query(
//     "SELECT * FROM users WHERE email = ?",
//     [email],
//     (err, result) => {
//       if (result.length > 0) {
//         return res.status(400).json({ message: "Email exists" });
//       }

//       db.query(
//         "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
//         [username, email, password],
//         (err) => {
//           if (err) return res.status(500).json({ message: "DB error" });

//           res.json({ message: "Registered successfully" });
//         }
//       );
//     }
//   );
// });

// // ================= LOGIN =================
// app.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   db.query(
//     "SELECT * FROM users WHERE email = ?",
//     [email],
//     (err, result) => {
//       if (result.length === 0) {
//         return res.status(400).json({ message: "User not found" });
//       }

//       const user = result[0];

//       if (user.password !== password) {
//         return res.status(400).json({ message: "Wrong password" });
//       }

//       res.json({
//         message: "Login success",
//         user: user
//       });
//     }
//   );
// });


// // ================= GET ALL USERS =================
// app.get("/getdata", (req, res) => {

//   db.query(
//     "SELECT id, username, email, created_at FROM users",
//     (err, result) => {

//       if (err) {
//         return res.status(500).json({
//           message: "DB error"
//         });
//       }

//       res.json({
//         users: result
//       });
//     }
//   );
// });


// // ================= DELETE USER =================
// app.delete("/delete/:id", (req, res) => {

//   const id = req.params.id;

//   db.query(
//     "DELETE FROM users WHERE id=?",
//     [id],
//     (err) => {

//       if (err) {
//         return res.status(500).json({
//           message: "Delete failed"
//         });
//       }

//       res.json({
//         message: "User deleted"
//       });
//     }
//   );
// });

// const PORT = process.env.PORT || 4000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ================= DATABASE =================

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

db.connect((err) => {

  if (err) {
    console.log("DB ERROR");
    console.log(err);
    process.exit(1);
  }

  console.log("✅ AWS RDS Connected");

});

// ================= OTP STORE =================

const otpStore = {};

// ================= BREVO CONFIG =================

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

// ================= HOME =================

app.get("/", (req, res) => {
  res.send("Smart Agriculture Backend Running");
});
// ================= SEND OTP =================

app.post("/sendotp", async (req, res) => {

  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    console.log("OTP Request:", email);

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    console.log("OTP Generated:", otp);

    const response = await fetch(BREVO_URL, {

      method: "POST",

      headers: {

        "accept": "application/json",

        "content-type": "application/json",

        "api-key": process.env.BREVO_API_KEY

      },

      body: JSON.stringify({

        sender: {
          name: "Smart Agriculture",
          email: process.env.SENDER_EMAIL
        },

        to: [
          {
            email: email
          }
        ],

        subject: "OTP Verification",

        htmlContent: `
          <h2>OTP Verification</h2>

          <h1>${otp}</h1>

          <p>
            Your OTP is valid for
            <b>1 minute</b>.
          </p>
        `

      })

    });

    const data = await response.json();

    console.log(data);

    if (!response.ok) {

      return res.status(500).json({

        message: data.message || "Email sending failed"

      });

    }

    otpStore[email] = {

      otp,

      expires: Date.now() + 60000

    };

    res.json({

      message: "OTP sent successfully"

    });

  }

  catch (err) {

    console.log(err);

    res.status(500).json({

      message: err.message

    });

  }

});
// ================= VERIFY OTP =================

app.post("/verify", (req, res) => {

  const { email, otp } = req.body;

  const data = otpStore[email];

  if (!data) {
    return res.status(400).json({
      message: "No OTP found"
    });
  }

  if (Date.now() > data.expires) {
    delete otpStore[email];

    return res.status(400).json({
      message: "OTP expired"
    });
  }

  if (data.otp !== otp) {
    return res.status(400).json({
      message: "Invalid OTP"
    });
  }

  delete otpStore[email];

  res.json({
    message: "OTP verified successfully"
  });

});


// ================= REGISTER =================

app.post("/register", (req, res) => {

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    (err, result) => {

      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Database Error"
        });
      }

      if (result.length > 0) {
        return res.status(400).json({
          message: "Email already exists"
        });
      }

      db.query(
        "INSERT INTO users(username,email,password) VALUES(?,?,?)",
        [username, email, password],
        (err) => {

          if (err) {
            console.log(err);

            return res.status(500).json({
              message: "Registration Failed"
            });
          }

          res.json({
            message: "Registration Successful"
          });

        }
      );

    }
  );

});


// ================= LOGIN =================

app.post("/login", (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and Password are required"
    });
  }

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    (err, result) => {

      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Database Error"
        });
      }

      if (result.length === 0) {
        return res.status(400).json({
          message: "User not found"
        });
      }

      const user = result[0];

      if (user.password !== password) {
        return res.status(400).json({
          message: "Wrong Password"
        });
      }

      res.json({
        message: "Login Successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          created_at: user.created_at
        }
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
        console.log(err);

        return res.status(500).json({
          message: "Database Error"
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
        console.log(err);

        return res.status(500).json({
          message: "Delete Failed"
        });
      }

      res.json({
        message: "User Deleted Successfully"
      });

    }
  );

});


// ================= SERVER =================

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {

  console.log(`🚀 Server running on port ${PORT}`);

});