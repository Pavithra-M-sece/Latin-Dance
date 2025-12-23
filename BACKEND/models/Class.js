import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  style: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  schedule: { type: String, required: true },
  capacity: { type: Number, required: true },
  currentEnrollment: { type: Number, default: 0 },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  status: { type: String, enum: ['Active', 'Inactive', 'Full'], default: 'Active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Class = mongoose.model('Class', classSchema);
export default Class;
