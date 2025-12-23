import Class from '../models/Class.js';

export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('instructor', 'name email').sort({ createdAt: -1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getClassById = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id).populate('instructor', 'name email');
    if (!classData) return res.status(404).json({ error: 'Class not found' });
    res.json(classData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createClass = async (req, res) => {
  try {
    const { name, style, level, instructor, schedule, capacity, price, description, image } = req.body;
    const newClass = new Class({ name, style, level, instructor, schedule, capacity, price, description, image });
    await newClass.save();
    const populatedClass = await newClass.populate('instructor', 'name email');
    res.status(201).json(populatedClass);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateClass = async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('instructor', 'name email');
    if (!updatedClass) return res.status(404).json({ error: 'Class not found' });
    res.json(updatedClass);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) return res.status(404).json({ error: 'Class not found' });
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
