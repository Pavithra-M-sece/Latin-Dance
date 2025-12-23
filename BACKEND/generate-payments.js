import mongoose from 'mongoose';
import Enrollment from './models/Enrollment.js';
import Payment from './models/Payment.js';
import Class from './models/Class.js';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const generatePayments = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/latin-dance');
    
    // Get all active enrollments that don't have payments
    const enrollments = await Enrollment.find({ 
      isWaitlisted: false,
      status: { $ne: 'Dropped' }
    }).populate('class').populate('student');
    
    console.log(`Found ${enrollments.length} active enrollments`);
    
    for (const enrollment of enrollments) {
      // Check if payment already exists
      const existingPayment = await Payment.findOne({
        student: enrollment.student._id,
        class: enrollment.class._id
      });
      
      if (!existingPayment) {
        const currentDate = new Date();
        const dueDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 5);
        const monthYear = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;
        
        await Payment.create({
          student: enrollment.student._id,
          class: enrollment.class._id,
          amount: enrollment.class.price || 100,
          month: monthYear,
          dueDate,
          status: 'Pending'
        });
        
        console.log(`Created payment for ${enrollment.student.name} - ${enrollment.class.name}`);
      }
    }
    
    console.log('Payment generation completed');
  } catch (error) {
    console.error('Error generating payments:', error);
  } finally {
    mongoose.disconnect();
  }
};

generatePayments();