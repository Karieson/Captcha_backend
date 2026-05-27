const express = require("express");
const session = require("express-session");
const cors = require("cors");

const app = express();

// allow frontend (your static site) to call this backend
app.use(cors({ origin: "*" }));
app.use(express.json());

// session stores captcha per user
app.use(
  session({
    secret: "captcha-secret",
    resave: false,
    saveUninitialized: true,
  })
);

// generate 6-letter captcha
function generateCaptcha() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let text = "";
  for (let i = 0; i < 6; i++) {
    text += chars[Math.floor(Math.random() * chars.length)];
  }
  return text;
}

// GET captcha
app.get("/captcha", (req, res) => {
  const text = generateCaptcha();
  req.session.captcha = text;

  res.json({ captcha: text });
});

// VERIFY captcha
app.post("/verify", (req, res) => {
  const user = (req.body.code || "").toUpperCase();

  const success = user === req.session.captcha;

  res.json({ success });
});

// start server
app.listen(process.env.PORT || 3000, () => {
  console.log("CAPTCHA backend running");
});
