import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { 
      name,
      email,
      password, 
      role = 'student', 
      phone
    } = req.body;
    if (!name || !email || !password) 
      return res.status(400).json({ error: 'Name, email, and password are required' });

    const normalizedEmail = email.toLowerCase();

    // Check duplicates for email and phone
    const [emailUser, phoneUser] = await Promise.all([
      User.findOne({ email: normalizedEmail }),
      phone ? User.findOne({ phone }) : null,
    ]);

    if (emailUser) return res.status(409).json({ error: 'Email already in use' });
    if (phone && phoneUser) return res.status(409).json({ error: 'Phone number already in use' });

    const newUser = new User({ name, email: normalizedEmail, password, role, phone });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ message: 'User registered successfully', user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }, token });
  } catch (error) {
    // Handle duplicate key error from DB as a fallback
    if (error?.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0];
      const message = duplicateField === 'email' ? 'Email already in use' : 'Phone number already in use';
      return res.status(409).json({ error: message });
    }
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (!user.isActive) return res.status(401).json({ error: 'Account has been deactivated. Please contact admin.' });
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Login successful', user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId, 
      { isActive }, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json({ message: `User ${isActive ? 'activated' : 'deactivated'} successfully`, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
