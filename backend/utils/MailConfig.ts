import nodemailer from "nodemailer";

/**
 * Configures the Nodemailer transporter for sending emails.
 * - Uses SMTP settings from environment variables.
 * - Authenticates with the SMTP server.
 */

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  
  /**
   * Verifies that the transporter configuration is correct and ready to send emails.
   * - Logs any errors encountered during verification.
   */

  transporter.verify((error) => {
    if (error) {
      console.error("Error configuring Nodemailer:", error);
    } else {
      console.log("✅Nodemailer is configured and ready to send emails🚀✉️");
    }
  });
  
  /**
   * Sends a password reset email to the user.
   * - Generates a password reset URL with the provided token.
   * - Configures email options, including the recipient, subject, and message content.
   * - Sends the email via Nodemailer.
   * 
   * @param {string} email - The user's email address.
   * @param {string} resetToken - The reset token to include in the email.
   */

  export const sendPasswordResetEmail = async (email: string, resetToken: string): Promise<void> => {
     const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
     
     const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset.</p>
             <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
             <p>This link will expire in 1 hour.</p>`,
     };
  
     await transporter.sendMail(mailOptions);
  }
  