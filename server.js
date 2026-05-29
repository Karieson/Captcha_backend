const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(express.json());

/* -------------------------
   ALLOW MULTIPLE FRONTENDS
-------------------------- */
const allowedOrigins = [
  "https://garissadigitaltraining.onrender.com",
  "https://gdehworkshops.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  }
}));

/* -------------------------
   GOOGLE SECRET KEY
-------------------------- */
const SECRET_KEY = process.env.RECAPTCHA_SECRET;

/* -------------------------
   VERIFY CAPTCHA
-------------------------- */
app.post("/verify-captcha", async (req, res) => {
  try {
    const token = req.body.token;

    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: SECRET_KEY,
          response: token
        }
      }
    );

    res.json({
      success: response.data.success
    });

  } catch (err) {
    res.json({ success: false });
  }
});

app.listen(process.env.PORT || 3000);
