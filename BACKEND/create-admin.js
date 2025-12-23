import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/latin-dance');
    
    const adminExists = await User.findOne({ email: 'admin@latindance.com' });
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const admin = new User({
      name: 'Admin User',
      email: 'admin@latindance.com',
      password: 'admin123',
      role: 'admin',
      phone: '1234567890'
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@latindance.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    mongoose.disconnect();
  }
};

createAdmin();