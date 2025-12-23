import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Latin-Dance-Management');
    console.log('Connected to MongoDB');

    // Clear existing demo users
    await User.deleteMany({ email: { $in: ['admin@academy.com', 'student@academy.com'] } });
    console.log('Cleared existing demo users');

    // Hash password
    const hashedPassword = await bcryptjs.hash('any', 10);

    // Create demo admin
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@academy.com',
      password: hashedPassword,
      role: 'admin',
      phone: '+1 (555) 111-1111',
    });

    // Create demo student
    const studentUser = new User({
      name: 'Student User',
      email: 'student@academy.com',
      password: hashedPassword,
      role: 'student',
      phone: '+1 (555) 222-2222',
    });

    await adminUser.save();
    await studentUser.save();

    console.log('✅ Demo users created successfully:');
    console.log('   Admin: admin@academy.com / any');
    console.log('   Student: student@academy.com / any');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
