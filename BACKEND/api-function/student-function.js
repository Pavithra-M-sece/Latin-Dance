import User from '../models/User.js';

export const getStudentProfile = async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId).select('-password');
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    const userId = req.params.studentId;

    // Normalize email if provided
    const normalizedEmail = email ? email.toLowerCase() : undefined;

    // Check duplicates across other users
    const [emailUser, phoneUser] = await Promise.all([
      normalizedEmail ? User.findOne({ _id: { $ne: userId }, email: normalizedEmail }) : null,
      phone ? User.findOne({ _id: { $ne: userId }, phone }) : null,
    ]);

    if (emailUser) return res.status(409).json({ error: 'Email already in use' });
    if (phoneUser) return res.status(409).json({ error: 'Phone number already in use' });

    const updatedStudent = await User.findByIdAndUpdate(
      userId,
      { name, phone, email: normalizedEmail, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).select('-password');
    if (!updatedStudent) return res.status(404).json({ error: 'Student not found' });
    res.json(updatedStudent);
  } catch (error) {
    if (error?.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0];
      const message = duplicateField === 'email' ? 'Email already in use' : 'Phone number already in use';
      return res.status(409).json({ error: message });
    }
    res.status(500).json({ error: error.message });
  }
};

export const changeStudentPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const student = await User.findById(req.params.studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    const isPasswordValid = await student.comparePassword(currentPassword);
    if (!isPasswordValid) return res.status(401).json({ error: 'Current password is incorrect' });
    student.password = newPassword;
    await student.save();
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
