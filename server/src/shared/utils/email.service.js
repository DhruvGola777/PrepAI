import nodemailer from 'nodemailer';
import { env } from '../../config/env.js';

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD
  }
});

// Function to send welcome email
export async function sendWelcomeEmail(user) {
  try {
    const displayName = user.name || user.username || 'User';
    const mailOptions = {
      from: env.EMAIL_USER,
      to: user.email,
      subject: 'Welcome to AI Interview Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #4CAF50; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
            <h1 style="color: white; margin: 0;">Welcome!</h1>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <p>Hi <strong>${displayName}</strong>,</p>
            <p>Thank you for logging into the <strong>AI Interview Platform</strong>! We're excited to have you on board.</p>
            <p>Your account has been successfully created with the following details:</p>
            <ul>
              <li><strong>Email:</strong> ${user.email}</li>
              <li><strong>Username:</strong> ${user.username}</li>
            </ul>
            <p>You can now start using our platform to prepare for your interviews with AI-powered guidance.</p>
            <p style="margin-top: 30px; color: #666;">
              If you have any questions, feel free to contact our support team.
            </p>
            <p style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; color: #999; font-size: 12px;">
              Best regards,<br>
              The AI Interview Platform Team
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
}
