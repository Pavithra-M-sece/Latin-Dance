import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { feedbackAPI, enrollmentAPI } from '../../utils/api.js';
import StudentSidebar from '../../components/StudentSidebar.jsx';
import './StudentDashboard.css';

const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        size={18}
        className="star-icon"
        fill={i <= Math.round(rating) ? '#fbbf24' : 'none'}
        stroke={i <= Math.round(rating) ? '#fbbf24' : '#4b5563'}
      />
    );
  }
  return stars;
};

const Feedback = () => {
  const studentId = localStorage.getItem('userId');
  const [feedbackList, setFeedbackList] = useState([]);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feedbackData, enrollments] = await Promise.all([
          feedbackAPI.getStudentFeedback(studentId),
          enrollmentAPI.getStudentEnrollments(studentId)
        ]);
        
        console.log('Enrollments:', enrollments);
        console.log('Feedback Data:', feedbackData);
        
        setFeedbackList(feedbackData);
        
        // Get active enrollments (non-waitlisted students)
        const activeEnrollments = enrollments.filter(e => !e.isWaitlisted && e.status !== 'Dropped' && e.status !== 'Rejected');
        console.log('Active Enrollments:', activeEnrollments);
        
        // Filter out classes that already have feedback
        const feedbackClassIds = feedbackData.map(fb => fb.class?._id || fb.class);
        const availableForFeedback = activeEnrollments.filter(
          e => !feedbackClassIds.includes(e.class?._id || e.class)
        );
        
        console.log('Available for Feedback:', availableForFeedback);
        setEnrolledClasses(availableForFeedback);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchData();
    }
  }, [studentId]);

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!selectedClass || !comment.trim()) {
      setMessage({ type: 'error', text: 'Please select a class and enter your feedback.' });
      return;
    }

    setSubmitting(true);
    try {
      const classData = enrolledClasses.find(e => e.class._id === selectedClass);
      const instructorId = classData.class.instructor?._id || classData.class.instructor;
      
      await feedbackAPI.submit({
        student: studentId,
        instructor: instructorId,
        class: selectedClass,
        rating,
        comment: comment.trim()
      });

      // Refresh feedback list and enrolled classes
      const [updatedFeedback, enrollments] = await Promise.all([
        feedbackAPI.getStudentFeedback(studentId),
        enrollmentAPI.getStudentEnrollments(studentId)
      ]);
      
      setFeedbackList(updatedFeedback);
      
      // Update available classes
      const activeEnrollments = enrollments.filter(e => !e.isWaitlisted && e.status !== 'Dropped' && e.status !== 'Rejected');
      const feedbackClassIds = updatedFeedback.map(fb => fb.class?._id || fb.class);
      const availableForFeedback = activeEnrollments.filter(
        e => !feedbackClassIds.includes(e.class?._id || e.class)
      );
      setEnrolledClasses(availableForFeedback);
      
      // Reset form
      setSelectedClass('');
      setRating(5);
      setComment('');
      setMessage({ type: 'success', text: 'Feedback submitted successfully!' });
      setTimeout(() => setMessage(null), 2500);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to submit feedback.' });
      setTimeout(() => setMessage(null), 2500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="student-shell">
      <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="student-content">
        <div className="content-wrapper">
          <header className="page-header">
            <div>
              <h1>Feedback Management</h1>
              <p>Submit feedback for attended classes</p>
            </div>
          </header>

          <div className="feedback-layout">
          <section className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 className="card-title" style={{ margin: 0 }}>Submit Feedback</h2>
              <button 
                type="button"
                className="primary"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Cancel' : 'Give Feedback'}
              </button>
            </div>
            
            {showForm && (
              <form className="form" onSubmit={handleSubmitFeedback}>
                {enrolledClasses.length === 0 ? (
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', padding: '20px' }}>
                    You need to enroll in classes before you can give feedback. Go to Browse Classes to enroll.
                  </p>
                ) : (
                  <>
                <label>
                  <span>Select Class</span>
                  <select 
                    value={selectedClass} 
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option value="">-- Choose a class you attended --</option>
                    {enrolledClasses.map(enrollment => (
                      <option key={enrollment._id} value={enrollment.class?._id || enrollment.class}>
                        {enrollment.class?.name || 'Unknown Class'} - {enrollment.class?.style || ''}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Rating</span>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        size={20}
                        className="star-icon"
                        fill={star <= rating ? '#fbbf24' : 'none'}
                        stroke={star <= rating ? '#fbbf24' : '#cbd5e1'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                </label>

                <label>
                  <span>Your Feedback</span>
                  <textarea 
                    rows="5"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this class..."
                  />
                </label>

                {message && (
                  <div className={`notice ${message.type}`}>{message.text}</div>
                )}

                <div className="actions">
                  <button className="primary" type="submit" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </div>
                </>
                )}
              </form>
            )}
          </section>

          <section className="card">
            <h2 className="section-heading">My Feedback</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="feedback-cards">
              {loading ? (
                <div className="empty-state">Loading feedback...</div>
              ) : feedbackList.length === 0 ? (
                <div className="empty-state">No feedback yet</div>
              ) : feedbackList.map((fb) => (
              <div key={fb._id} className="feedback-item">
                <div className="feedback-card-head">
                  <div>
                    <div className="class-title">{fb.class?.name || 'N/A'}</div>
                    <div className="class-meta">{fb.instructor?.name || 'N/A'}</div>
                  </div>
                  <div className="rating-badge">
                    <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
                    <span>{fb.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="comment-card">
                  <div className="comment-head">
                    <div className="commenter">{fb.student?.name || 'Anonymous'}</div>
                    <div className="star-row">{renderStars(fb.rating)}</div>
                  </div>
                  <p className="comment-text">{fb.comment}</p>
                  <div className="comment-date">{new Date(fb.submittedAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
            </div>
          </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Feedback;
