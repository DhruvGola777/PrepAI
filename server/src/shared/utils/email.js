import nodemailer from 'nodemailer';
import { env } from '../../config/env.js';

/**
 * Creates a nodemailer transporter.
 * If EMAIL_USER and EMAIL_PASSWORD are not provided, it uses ethereal email for testing.
 */
const createTransporter = async () => {
  if (env.EMAIL_USER && env.EMAIL_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail', // You can change this to your email provider
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASSWORD,
      },
    });
  } else {
    // Mock transporter for development if no credentials are provided
    console.warn('⚠️ No email credentials found in env. Using ethereal email for testing.');
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
};

/**
 * Sends a password reset email.
 * @param {string} to - Recipient email address
 * @param {string} resetUrl - The password reset URL
 */
export const sendPasswordResetEmail = async (to, resetUrl) => {
  try {
    const transporter = await createTransporter();
    
    const mailOptions = {
      from: `"PrepAI Support" <${env.EMAIL_USER || 'support@prepai.com'}>`,
      to,
      subject: 'PrepAI - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #4F46E5;">Password Reset Request</h2>
          <p>You are receiving this email because you (or someone else) requested a password reset for your PrepAI account.</p>
          <p>Please click the button below to set a new password. This link is valid for 1 hour.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
          </div>
          <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;">If the button doesn't work, copy and paste this link into your browser: <br/> ${resetUrl}</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    if (!env.EMAIL_USER) {
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};
