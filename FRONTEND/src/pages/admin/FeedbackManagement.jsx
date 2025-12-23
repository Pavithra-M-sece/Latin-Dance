import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, UserCheck, DollarSign, Star as StarIcon, User, LogOut } from 'lucide-react';
import { feedbackAPI } from '../../utils/api.js';
import './AdminDashboard.css';
import './FeedbackManagement.css';

const SidebarItem = ({ label, path, location }) => {
  const isActive = location.pathname === path;
  return (
    <Link to={path} className={`side-item ${isActive ? 'active' : ''}`}>
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

const FeedbackManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const feedback = await feedbackAPI.getAll();
        setFeedbackData(feedback);
      } catch (err) {
        setError(err.message || 'Failed to load feedback');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">🎵</div>
          <div className="brand-text">
            <div className="brand-title">Latin Dance</div>
            <div className="brand-sub">Academy</div>
          </div>
        </div>

        <nav className="side-nav">
          <SidebarItem label="Dashboard" path="/admin" location={location} />
          <SidebarItem label="Classes" path="/admin/classes" location={location} />
          <SidebarItem label="Waitlist" path="/admin/waitlist" location={location} />
          <SidebarItem label="Attendance" path="/admin/attendance" location={location} />
          <SidebarItem label="Fees & Payments" path="/admin/fees" location={location} />
          <SidebarItem label="Feedback" path="/admin/feedback" location={location} />
          <SidebarItem label="Profile" path="/admin/profile" location={location} />
        </nav>

        <div className="side-user">
          <div className="user-info">
            <div className="avatar">A</div>
            <div>
              <div className="user-name">Admin User</div>
              <div className="user-role">Admin</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="content">
        <header className="page-header">
          <h1>Feedback Management</h1>
          <p>View student feedback</p>
        </header>

        <div className="feedback-section">
          <h2 className="section-title">All Feedback</h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="feedback-list">
            {loading ? (
              <div className="feedback-item">Loading feedback...</div>
            ) : feedbackData.length === 0 ? (
              <div className="feedback-item">No feedback found.</div>
            ) : (
              feedbackData.map((feedback) => (
                <div key={feedback._id} className="feedback-item">
                  <div className="feedback-instructor">
                    <span className="instructor-name">{feedback.instructor?.name || 'Unknown instructor'}</span>
                    {feedback.rating > 0 && (
                      <StarRating rating={feedback.rating} count={1} />
                    )}
                  </div>

                  {feedback.comment && (
                    <div className="feedback-card">
                      <div className="feedback-card-header">
                        <span className="student-name">{feedback.student?.name || 'Anonymous'}</span>
                        <div className="stars-display">
                          {renderStars(Math.floor(feedback.rating || 0))}
                        </div>
                      </div>
                      <p className="feedback-comment">{feedback.comment}</p>
                      <span className="feedback-date">{new Date(feedback.submittedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Help Button */}
        
      </main>
    </div>
  );
};

export default FeedbackManagement;
