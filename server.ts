import express from "express";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ override: true });
import { createServer as createViteServer } from "vite";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import nodemailer from "nodemailer";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Firebase Config for Admin SDK
const firebaseConfig = JSON.parse(readFileSync(path.join(__dirname, "firebase-applet-config.json"), "utf8"));

const adminApp = initializeApp();

const db = getFirestore(adminApp, firebaseConfig.firestoreDatabaseId);

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // --- OTP ENDPOINTS ---

  // Generate and Send OTP
  app.post("/api/auth/send-otp", async (req, res) => {
    const { email, uid } = req.body;

    if (!email || !uid) {
      return res.status(400).json({ error: "Email and UID are required" });
    }

    try {
      // 1. Verify user is actually an admin in Firestore users collection
      const userDoc = await db.collection("users").doc(uid).get();
      if (!userDoc.exists || !userDoc.data()?.isAdmin) {
        return res.status(403).json({ error: "Unauthorized. Admin access required." });
      }

      // 2. Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

      // 3. Store OTP in a secure collection
      await db.collection("admin_otps").doc(uid).set({
        otp,
        expiresAt,
        createdAt: FieldValue.serverTimestamp()
      });

      // 4. Send Email
      const smtpHost = process.env.SMTP_HOST;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const smtpPort = process.env.SMTP_PORT || "587";
      const smtpFrom = process.env.SMTP_FROM || smtpUser;

      const hasSmtp = Boolean(smtpHost && smtpUser && smtpPass);
      
      const emailHtml = `
        <div style="font-family: serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #1a1a1a; color: #ffffff;">
          <h1 style="color: #d4af37; border-bottom: 1px solid #333; padding-bottom: 20px;">Secure Admin Access</h1>
          <p style="font-size: 16px; line-height: 1.6;">Your administrative login request has been initiated.</p>
          <div style="background-color: #222; border: 1px solid #d4af37; padding: 20px; text-align: center; margin: 30px 0;">
            <p style="text-transform: uppercase; letter-spacing: 2px; color: #888; font-size: 12px; margin-bottom: 10px;">Your Passcode</p>
            <h2 style="font-size: 48px; letter-spacing: 12px; color: #d4af37; margin: 0;">${otp}</h2>
          </div>
          <p style="font-size: 14px; color: #888;">This code expires in 5 minutes. If you did not request this, please change your password immediately.</p>
          <hr style="border: 0; border-top: 1px solid #333; margin: 40px 0;">
          <p style="font-size: 10px; text-align: center; color: #555; text-transform: uppercase; letter-spacing: 1px;">PIXXXLR CREATIVES Secure Login System</p>
        </div>
      `;

      if (hasSmtp) {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(smtpPort, 10),
          secure: smtpPort === "465",
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: smtpFrom || `"Secure Login" <${smtpUser}>`,
          to: email,
          subject: "🔐 Admin Passcode: " + otp,
          html: emailHtml,
        });
        
        console.log(`OTP sent via SMTP to ${email}`);
      } else {
        console.warn("SMTP not configured. OTP logged to console for testing/preview.");
        console.log("-----------------------------------------");
        console.log(`PASSCODE FOR ${email}: ${otp}`);
        console.log("-----------------------------------------");
      }

      res.json({ success: true, maskedEmail: email.replace(/(.{2})(.*)(?=@)/, (gp1, gp2, gp3) => gp2 + "*".repeat(gp3.length)) });
    } catch (error: any) {
      console.error("Error generating OTP:", error);
      res.status(500).json({ error: "Internal server error during auth flow." });
    }
  });

  // Verify OTP
  app.post("/api/auth/verify-otp", async (req, res) => {
    const { uid, otp } = req.body;

    if (!uid || !otp) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const otpDoc = await db.collection("admin_otps").doc(uid).get();
      
      if (!otpDoc.exists) {
        return res.status(400).json({ error: "No active OTP session. Please request a new code." });
      }

      const data = otpDoc.data();
      if (data?.otp !== otp) {
        return res.status(400).json({ error: "Invalid passcode. Please check and try again." });
      }

      if (Date.now() > data?.expiresAt) {
        return res.status(400).json({ error: "Passcode has expired. Please request a new one." });
      }

      // Success! Delete the OTP doc so it can't be reused
      await db.collection("admin_otps").doc(uid).delete();

      res.json({ success: true });
    } catch (error) {
      console.error("OTP verification error:", error);
      res.status(500).json({ error: "Verification failed." });
    }
  });

  // --- BOOKING EMAILS ---

  app.post("/api/bookings/send-email", async (req, res) => {
    const { email, fullName, date, time, status, sessionType } = req.body;

    if (!email || !status) {
      return res.status(400).json({ error: "Email and status are required" });
    }

    try {
      const smtpHost = process.env.SMTP_HOST;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const smtpPort = process.env.SMTP_PORT || "587";
      const smtpFrom = process.env.SMTP_FROM || smtpUser;

      const hasSmtp = Boolean(smtpHost && smtpUser && smtpPass);
      
      let subject = "";
      let title = "";
      let message = "";

      if (status === "confirmed") {
        subject = "Booking Confirmed - PIXXXLR Creatives Studio";
        title = "Your Session is Confirmed";
        message = `We are pleased to confirm your upcoming photo session. We look forward to capturing your moments!`;
      } else if (status === "pending") {
        subject = "Booking Status Update - PIXXXLR Creatives Studio";
        title = "Booking Pending";
        message = `Your booking request is currently pending. Our team is reviewing the availability and will update you shortly.`;
      } else if (status === "cancelled") {
        subject = "Booking Cancelled - PIXXXLR Creatives Studio";
        title = "Booking Cancelled";
        message = `Your booking has been cancelled. If you have any questions or wish to reschedule, feel free to contact us.`;
      } else {
        return res.status(400).json({ error: "Invalid status" });
      }

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #f9f9f9; color: #333;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #d4af37; margin: 0;">PIXXXLR</h1>
            <p style="font-size: 12px; letter-spacing: 2px; color: #666; text-transform: uppercase;">Creatives Studio</p>
          </div>
          <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
            <h2 style="color: #222; text-align: center; border-bottom: 2px solid #f0f0f0; padding-bottom: 20px; font-weight: 600;">${title}</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #444;">Hello ${fullName || "Valued Client"},</p>
            <p style="font-size: 16px; line-height: 1.6; color: #444;">${message}</p>
            
            <div style="background-color: #fafafa; border: 1px solid #eaeaea; border-radius: 6px; padding: 20px; margin: 25px 0;">
              <h3 style="margin-top: 0; color: #d4af37; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Booking Details</h3>
              <p style="margin: 8px 0; font-size: 15px;"><strong>Date:</strong> ${date || "N/A"}</p>
              <p style="margin: 8px 0; font-size: 15px;"><strong>Time:</strong> ${time || "N/A"}</p>
              <p style="margin: 8px 0; font-size: 15px;"><strong>Session Type:</strong> ${sessionType || "N/A"}</p>
              <p style="margin: 8px 0; font-size: 15px;"><strong>Status:</strong> <span style="text-transform: uppercase; font-weight: bold; color: ${status === 'confirmed' ? '#2e7d32' : status === 'pending' ? '#f57c00' : '#c62828'};">${status}</span></p>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">If you have any questions, please reply to this email or contact us at our studio.</p>
          </div>
          <div style="text-align: center; margin-top: 30px;">
            <p style="font-size: 12px; color: #999;">© ${new Date().getFullYear()} PIXXXLR Creatives Studio. All rights reserved.</p>
          </div>
        </div>
      `;

      if (hasSmtp) {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(smtpPort, 10),
          secure: smtpPort === "465",
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: smtpFrom || `"PIXXXLR Studio" <${smtpUser}>`,
          to: email,
          subject: subject,
          html: emailHtml,
        });
        
        console.log(`Booking notification sent to ${email}`);
      } else {
        console.warn("SMTP not configured. Email logged to console.");
        console.log("-----------------------------------------");
        console.log(`To: ${email}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${message}`);
        console.log("-----------------------------------------");
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error("Error sending booking email:", error);
      res.status(500).json({ error: "Internal server error while sending email." });
    }
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
