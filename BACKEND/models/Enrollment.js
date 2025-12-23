import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  enrolledAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Active', 'Completed', 'Dropped', 'Rejected'], default: 'Pending' },
  isWaitlisted: { type: Boolean, default: false },
  waitlistPosition: { type: Number },
  approvedAt: { type: Date },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
export default Enrollment;
