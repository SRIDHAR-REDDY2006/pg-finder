const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

// Store reset tokens temporarily
const resetTokens = {};

// Send reset email
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    resetTokens[token] = { email, expires: Date.now() + 3600000 }; // 1 hour

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `https://pg-finder-two.vercel.app/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'PG Finder - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">PG Finder - Password Reset</h2>
          <p>Hi ${user.name},</p>
          <p>You requested to reset your password. Click the button below:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 25px; 
            background-color: #2c3e50; color: white; text-decoration: none; 
            border-radius: 5px; margin: 20px 0;">Reset Password</a>
          <p>This link expires in 1 hour.</p>
          <p>If you didn't request this, ignore this email.</p>
          <p>- PG Finder Team</p>
        </div>
      `,
    });

    res.json({ message: 'Password reset link sent to your email!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const record = resetTokens[token];

    if (!record) return res.status(400).json({ message: 'Invalid or expired token' });
    if (Date.now() > record.expires) {
      delete resetTokens[token];
      return res.status(400).json({ message: 'Token has expired. Please request again.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.findOneAndUpdate(
      { email: record.email },
      { password: hashedPassword }
    );

    delete resetTokens[token];
    res.json({ message: 'Password reset successful! You can now login.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { forgotPassword, resetPassword };