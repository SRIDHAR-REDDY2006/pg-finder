const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const existing = await User.findOne({ email: 'admin@pgfinder.com' });
    if (existing) {
      console.log('Admin already exists!');
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await User.create({
      name: 'Admin',
      email: 'admin@pgfinder.com',
      password: hashedPassword,
      role: 'admin',
      phone: '0000000000'
    });

    console.log('Admin created successfully!');
    console.log('Email: admin@pgfinder.com');
    console.log('Password: admin123');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();