import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './InstructorDashboard.css';
import { Star as StarIcon, LogOut } from 'lucide-react';

const SidebarItem = ({ label, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link className={`side-item ${isActive ? 'active' : ''}`} to={to || '#'}>
      <span>{label}</span>
    </Link>
  );
};

const StarRating = ({ rating, count }) => {
  return (
    <div className="star-rating">
      <StarIcon className="rating-icon" size={20} fill="#fbbf24" stroke="#fbbf24" />
      <span className="rating-value">{rating.toFixed(1)}</span>
      <span className="rating-count">({count})</span>
    </div>
  );
};

const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <StarIcon
        key={i}
        size={20}
        fill={i <= rating ? '#fbbf24' : 'none'}
        stroke={i <= rating ? '#fbbf24' : '#4b5563'}
        className="star"
      />
    );
  }
  return stars;
};

const Feedback = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  // Sample feedback data for instructor Maria Rodriguez
  const [feedbackData] = useState([
    {
      id: 1,
      instructor: 'Maria Rodriguez',
      student: 'Juan Martinez',
      rating: 5.0,
      ratingCount: 1,
      comment: 'Amazing class! Maria is a fantastic instructor.',
      date: '12/11/2024',
      expanded: true
    },
    {
      id: 2,
      instructor: 'Carlos Santos',
      student: '',
      rating: 0,
      ratingCount: 0,
      comment: '',
      date: '',
      expanded: false
    },
    {
      id: 3,
      instructor: 'Maria Rodriguez',
      student: 'Sofia Lopez',
      rating: 4.0,
      ratingCount: 1,
      comment: 'Great energy and well-structured lessons.',
      date: '12/13/2024',
      expanded: true
    },
    {
      id: 4,
      instructor: 'Carlos Santos',
      student: '',
      rating: 0,
      ratingCount: 0,
      comment: '',
      date: '',
      expanded: false
    }
  ]);

  return (
    <div className="instructor-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icons">
            <span className="music-note">🎵</span>
            <span className="sparkle">✨</span>
          </div>
          <div className="brand-text">
            <div className="brand-title">Latin Dance</div>
            <div className="brand-sub">Academy</div>
          </div>
        </div>

        <nav className="side-nav">
          <SidebarItem label="Dashboard" to="/instructor" />
          <SidebarItem label="My Classes" to="/instructor/classes" />
          <SidebarItem label="Attendance" to="/instructor/attendance" />
          <SidebarItem label="Feedback" to="/instructor/feedback" />
          <SidebarItem label="Profile" to="/instructor/profile" />
        </nav>

        <div className="side-user">
          <div className="user-info">
            <div className="avatar">M</div>
            <div className="user-details">
              <div className="user-name">Maria Rodriguez</div>
              <div className="user-role">Instructor</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="content">
        <header className="page-header">
          <h1>Feedback Management</h1>
          <p>View student feedback</p>
        </header>

        <section className="feedback-section">
          <h2 className="section-title">All Feedback</h2>

          <div className="feedback-list">
            {feedbackData.map((feedback) => (
              <div key={feedback.id} className="feedback-item">
                <div className="feedback-instructor">
                  <span className="instructor-name">{feedback.instructor}</span>
                  {feedback.rating > 0 && (
                    <StarRating rating={feedback.rating} count={feedback.ratingCount} />
                  )}
                </div>

                {feedback.expanded && feedback.comment && (
                  <div className="feedback-card">
                    <div className="feedback-card-header">
                      <span className="student-name">{feedback.student}</span>
                      <div className="stars-display">
                        {renderStars(Math.floor(feedback.rating))}
                      </div>
                    </div>
                    <p className="feedback-comment">{feedback.comment}</p>
                    <span className="feedback-date">{feedback.date}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        
      </main>
    </div>
  );
};

export default Feedback;
