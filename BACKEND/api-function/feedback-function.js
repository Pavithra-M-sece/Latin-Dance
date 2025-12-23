import Feedback from '../models/Feedback.js';

export const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().populate('class', 'name style').populate('instructor', 'name email').populate('student', 'name email').sort({ submittedAt: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getClassFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ class: req.params.classId }).populate('instructor', 'name email').populate('student', 'name email');
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStudentFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ student: req.params.studentId }).populate('class', 'name style').populate('instructor', 'name email');
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const submitFeedback = async (req, res) => {
  try {
    const { class: classId, instructor, student, rating, comment } = req.body;
    const existingFeedback = await Feedback.findOne({ class: classId, student });
    if (existingFeedback) return res.status(400).json({ error: 'Feedback already submitted for this class' });

    const newFeedback = new Feedback({ class: classId, instructor, student, rating, comment });
    await newFeedback.save();
    
    // Populate the saved feedback
    const populatedFeedback = await Feedback.findById(newFeedback._id)
      .populate('class', 'name style')
      .populate('instructor', 'name email')
      .populate('student', 'name email');
    
    res.status(201).json({ message: 'Feedback submitted successfully', feedback: populatedFeedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const updatedFeedback = await Feedback.findByIdAndUpdate(req.params.feedbackId, { rating, comment, updatedAt: Date.now() }, { new: true, runValidators: true })
      .populate('class', 'name style')
      .populate('instructor', 'name email')
      .populate('student', 'name email');
    if (!updatedFeedback) return res.status(404).json({ error: 'Feedback not found' });
    res.json(updatedFeedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const deletedFeedback = await Feedback.findByIdAndDelete(req.params.feedbackId);
    if (!deletedFeedback) return res.status(404).json({ error: 'Feedback not found' });
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
