const express = require("express");
const session = require("express-session");
const cors = require("cors");
const svgCaptcha = require("svg-captcha");

const app = express();

app.use(cors({ origin: "*" }));

app.use(express.json());

app.use(
  session({
    secret: "captcha-secret",
    resave: false,
    saveUninitialized: true
  })
);

app.get("/captcha", (req, res) => {

  const captcha = svgCaptcha.create({
    size: 6,
    noise: 3,
    color: true,
    background: "#f4f4f4"
  });

  req.session.captcha = captcha.text;

  res.json({
    image:
      "data:image/svg+xml;base64," +
      Buffer.from(captcha.data).toString("base64")
  });

});

app.post("/verify", (req, res) => {

  const user =
    (req.body.code || "").toUpperCase();

  const success =
    user === req.session.captcha;

  res.json({ success });

});

app.listen(process.env.PORT || 3000);
