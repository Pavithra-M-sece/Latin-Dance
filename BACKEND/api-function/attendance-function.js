import Attendance from '../models/Attendance.js';

export const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate('student', 'name email')
      .populate('class', 'name style')
      .populate('markedBy', 'name')
      .sort({ date: -1 });
    
    console.log('Found all attendance records:', attendance.length);
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching all attendance:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    console.log('Fetching attendance for student:', studentId);
    
    const attendance = await Attendance.find({ student: studentId })
      .populate('class', 'name style')
      .populate('markedBy', 'name')
      .sort({ date: -1 });
    
    console.log('Found attendance records:', attendance.length);
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    res.status(500).json({ error: error.message });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { student, class: classId, date, status, notes } = req.body;
    const markedBy = req.user?.userId;

    // Validate required fields
    if (!student || !classId || !date || !status || !markedBy) {
      console.error('Missing required attendance fields:', { student, classId, date, status, markedBy });
      return res.status(400).json({ error: 'Missing required attendance fields.' });
    }

    // Validate status value
    const validStatuses = ['Present', 'Absent', 'Late'];
    if (!validStatuses.includes(status)) {
      console.error('Invalid attendance status:', status);
      return res.status(400).json({ error: 'Invalid attendance status.' });
    }

    // Parse and normalize date
    const attendanceDate = new Date(date);
    if (isNaN(attendanceDate.getTime())) {
      console.error('Invalid attendance date:', date);
      return res.status(400).json({ error: 'Invalid attendance date.' });
    }
    attendanceDate.setHours(0, 0, 0, 0);

    // Check for existing attendance
    const existingAttendance = await Attendance.findOne({
      student,
      class: classId,
      date: {
        $gte: attendanceDate,
        $lt: new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (existingAttendance) {
      existingAttendance.status = status;
      existingAttendance.notes = notes || '';
      existingAttendance.markedBy = markedBy;
      existingAttendance.markedAt = new Date();
      await existingAttendance.save();

      const updatedAttendance = await Attendance.findById(existingAttendance._id)
        .populate('student', 'name')
        .populate('class', 'name')
        .populate('markedBy', 'name');

      console.log('Attendance updated:', updatedAttendance);
      return res.json({ message: 'Attendance updated', attendance: updatedAttendance });
    }

    // Create new attendance record
    const attendance = new Attendance({
      student,
      class: classId,
      date: attendanceDate,
      status,
      notes: notes || '',
      markedBy
    });

    await attendance.save();
    console.log('New attendance saved:', attendance);

    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate('student', 'name')
      .populate('class', 'name')
      .populate('markedBy', 'name');

    console.log('Populated attendance:', populatedAttendance);
    res.status(201).json({ message: 'Attendance marked', attendance: populatedAttendance });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ error: error.message });
  }
};