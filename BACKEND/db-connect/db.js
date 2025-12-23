import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Latin-Dance-Management');
    console.log('Db is connected');
  } catch (e) {
    console.error('Error in connecting to the db', e);
    process.exit(1);
  }
};
