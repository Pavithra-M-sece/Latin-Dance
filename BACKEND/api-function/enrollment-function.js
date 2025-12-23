import Enrollment from '../models/Enrollment.js';
import Class from '../models/Class.js';
import Payment from '../models/Payment.js';

export const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find().populate('class').populate('student', 'name email').sort({ enrolledAt: -1 });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStudentEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.params.studentId }).populate('class').populate('student', 'name email');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getClassEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ class: req.params.classId }).populate('student', 'name email').populate('class');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createEnrollment = async (req, res) => {
  try {
    const { student, class: classId } = req.body;
    const existingEnrollment = await Enrollment.findOne({ student, class: classId });
    if (existingEnrollment) return res.status(400).json({ error: 'Already enrolled in this class' });

    const classData = await Class.findById(classId);
    if (!classData) return res.status(404).json({ error: 'Class not found' });

    const isWaitlisted = classData.currentEnrollment >= classData.capacity;
    const waitlistPosition = isWaitlisted ? await Enrollment.countDocuments({ class: classId, isWaitlisted: true }) + 1 : null;

    const newEnrollment = new Enrollment({ 
      student, 
      class: classId, 
      isWaitlisted, 
      waitlistPosition,
      status: isWaitlisted ? 'Pending' : 'Active'
    });
    await newEnrollment.save();

    if (!isWaitlisted) {
      classData.currentEnrollment += 1;
      if (classData.currentEnrollment >= classData.capacity) classData.status = 'Full';
      await classData.save();
    }

    // Create payment record for enrolled students (not waitlisted)
    if (!isWaitlisted) {
      const currentDate = new Date();
      const dueDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 5); // Due on 5th of next month
      const monthYear = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;
      
      await Payment.create({
        student,
        class: classId,
        amount: classData.price || 100, // Use class price or default to $100
        month: monthYear,
        dueDate,
        status: 'Pending'
      });
    }

    const populatedEnrollment = await Enrollment.findById(newEnrollment._id).populate('class').populate('student', 'name email');
    res.status(201).json({ message: isWaitlisted ? 'Added to waitlist' : 'Enrolled successfully', enrollment: populatedEnrollment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.enrollmentId);
    if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });

    if (!enrollment.isWaitlisted) {
      const classData = await Class.findById(enrollment.class);
      if (classData) {
        classData.currentEnrollment = Math.max(0, classData.currentEnrollment - 1);
        classData.status = 'Active';
        await classData.save();

        const waitlisted = await Enrollment.findOne({ class: enrollment.class, isWaitlisted: true }).sort({ waitlistPosition: 1 });
        if (waitlisted && classData.currentEnrollment < classData.capacity) {
          waitlisted.isWaitlisted = false;
          waitlisted.waitlistPosition = null;
          waitlisted.status = 'Active';
          await waitlisted.save();
          classData.currentEnrollment += 1;
          await classData.save();
          
          // Create payment record for promoted student
          const currentDate = new Date();
          const dueDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 5);
          const monthYear = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;
          
          await Payment.create({
            student: waitlisted.student,
            class: enrollment.class,
            amount: classData.price || 100,
            month: monthYear,
            dueDate,
            status: 'Pending'
          });
        }
      }
    }

    res.json({ message: 'Enrollment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const approveEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.enrollmentId);
    if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });
    
    const classData = await Class.findById(enrollment.class);
    if (!classData) return res.status(404).json({ error: 'Class not found' });
    
    // Check if class has capacity for waitlisted student
    if (enrollment.isWaitlisted && classData.currentEnrollment >= classData.capacity) {
      return res.status(400).json({ error: 'Class is at full capacity' });
    }
    
    enrollment.status = 'Active';
    enrollment.approvedAt = new Date();
    enrollment.approvedBy = req.user.userId;
    
    // If approving a waitlisted student, move them to active enrollment
    if (enrollment.isWaitlisted) {
      enrollment.isWaitlisted = false;
      enrollment.waitlistPosition = null;
      classData.currentEnrollment += 1;
      if (classData.currentEnrollment >= classData.capacity) classData.status = 'Full';
      
      // Create payment record for newly approved student
      const currentDate = new Date();
      const dueDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 5);
      const monthYear = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;
      
      await Payment.create({
        student: enrollment.student,
        class: enrollment.class,
        amount: classData.price || 100,
        month: monthYear,
        dueDate,
        status: 'Pending'
      });
    }
    
    await enrollment.save();
    await classData.save();
    
    const populatedEnrollment = await Enrollment.findById(enrollment._id).populate('class').populate('student', 'name email');
    res.json({ message: 'Enrollment approved', enrollment: populatedEnrollment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const rejectEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.enrollmentId);
    if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });
    
    enrollment.status = 'Rejected';
    enrollment.approvedAt = new Date();
    enrollment.approvedBy = req.user.userId;
    
    // If rejecting a waitlisted student, update positions of other waitlisted students
    if (enrollment.isWaitlisted && enrollment.waitlistPosition) {
      await Enrollment.updateMany(
        { 
          class: enrollment.class, 
          isWaitlisted: true, 
          waitlistPosition: { $gt: enrollment.waitlistPosition } 
        },
        { $inc: { waitlistPosition: -1 } }
      );
    }
    
    await enrollment.save();
    
    const populatedEnrollment = await Enrollment.findById(enrollment._id).populate('class').populate('student', 'name email');
    res.json({ message: 'Enrollment rejected', enrollment: populatedEnrollment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
