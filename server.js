const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// =========================
// RECAPTCHA VERIFY FUNCTION
// =========================
async function verifyRecaptcha(token, expectedAction) {

    const response = await fetch(
        "https://www.google.com/recaptcha/api/siteverify",
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                secret: "6Lc3QgMtAAAAAMD_ZBYi2JHEOpiKeUU6uTJII407",
                response: token
            })
        }
    );

    const result = await response.json();

    if (!result.success) {
        return {
            success: false,
            reason: "Verification failed",
            result
        };
    }

    if (result.action !== expectedAction) {
        return {
            success: false,
            reason: "Invalid action",
            result
        };
    }

    if (result.score < 0.5) {
        return {
            success: false,
            reason: "Low score",
            result
        };
    }

    return {
        success: true,
        result
    };
}


// =========================
// ADMISSION FORM
// =========================
app.post("/api/admission", async (req, res) => {

    try {

        const token = req.body.recaptchaToken;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Missing reCAPTCHA token"
            });
        }

        const verification =
            await verifyRecaptcha(
                token,
                "submit"
            );

        if (!verification.success) {
            return res.status(403).json({
                success: false,
                message: verification.reason
            });
        }

        // Save admission form data here

        return res.json({
            success: true,
            message: "Admission submitted"
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});


// =========================
// COLLABORATION FORM
// =========================
app.post("/api/collaboration", async (req, res) => {

    try {

        const token = req.body.recaptchaToken;

        const verification =
            await verifyRecaptcha(
                token,
                "collaboration_submit"
            );

        if (!verification.success) {
            return res.status(403).json({
                success: false,
                message: verification.reason
            });
        }

        // Save collaboration form

        return res.json({
            success: true
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false
        });
    }
});


// =========================
// BOOKING FORM
// =========================
app.post("/api/booking", async (req, res) => {

    try {

        const token = req.body.recaptchaToken;

        const verification =
            await verifyRecaptcha(
                token,
                "booking_submit"
            );

        if (!verification.success) {
            return res.status(403).json({
                success: false,
                message: verification.reason
            });
        }

        // Save booking

        return res.json({
            success: true
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false
        });
    }
});


// =========================
// START SERVER
// =========================
const verification = await fetch(
  "https://www.google.com/recaptcha/api/siteverify",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY,
      response: token
    })
  }
);
