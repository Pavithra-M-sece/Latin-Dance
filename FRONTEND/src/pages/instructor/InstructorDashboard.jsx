import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './InstructorDashboard.css';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  MessageSquare,
  User as UserIcon,
  UserPlus,
  Star,
  LogOut,
} from 'lucide-react';

const SidebarItem = ({ label, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link className={`side-item ${isActive ? 'active' : ''}`} to={to || '#'}>
      <span>{label}</span>
    </Link>
  );
};

const InstructorDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const userRole = localStorage.getItem('userRole') || 'instructor';
    localStorage.clear();
    navigate(`/?role=${userRole}`);
  };

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
          <h1>Instructor Dashboard</h1>
          <p>Welcome back, Maria Rodriguez!</p>
        </header>

        <section className="stats">
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <BookOpen size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-label">My Classes</div>
              <div className="stat-value">2</div>
              <Link to="/instructor/classes" className="stat-link">View details →</Link>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <Users size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Students</div>
              <div className="stat-value">30</div>
              <div className="stat-sub">Across all classes</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <Star size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Average Rating</div>
              <div className="stat-value">4.5</div>
              <div className="stat-sub">From 2 reviews</div>
            </div>
          </div>
        </section>

        <section className="assigned-classes">
          <div className="section-header">
            <h2>My Assigned Classes</h2>
            <Link to="/instructor/classes" className="view-all">View All →</Link>
          </div>

          <div className="class-list">
            <div className="class-card">
              <img src="/salsa.avif" alt="Salsa Basics" className="class-image" />
              <div className="class-info">
                <h3 className="class-title">Salsa Basics</h3>
                <p className="class-meta">Salsa • Beginner</p>
                <p className="class-schedule">Mon, Wed 6:00 PM</p>
              </div>
              <div className="class-status">
                <span className="capacity-badge">18/20</span>
                <span className="status-badge open">Open</span>
              </div>
            </div>

            <div className="class-card">
              <img src="/chacha.jpg" alt="Cha-Cha" className="class-image" />
              <div className="class-info">
                <h3 className="class-title">Cha-Cha Intermediate</h3>
                <p className="class-meta">Cha-Cha • Intermediate</p>
                <p className="class-schedule">Fri 6:30 PM</p>
              </div>
              <div className="class-status">
                <span className="capacity-badge">12/18</span>
                <span className="status-badge open">Open</span>
              </div>
            </div>
          </div>
        </section>

        <div className="bottom-section">
          <section className="recent-feedback">
            <div className="section-header">
              <h2>Recent Feedback</h2>
              <Link to="/instructor/feedback" className="view-all">View All →</Link>
            </div>

            <div className="feedback-list">
              <div className="feedback-card">
                <div className="feedback-header-row">
                  <h4 className="feedback-class">Salsa Basics</h4>
                  <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
                </div>
                <p className="feedback-text">Amazing class! Maria is a fantastic instructor.</p>
                <p className="feedback-author">- Juan Martinez</p>
              </div>

              <div className="feedback-card">
                <div className="feedback-header-row">
                  <h4 className="feedback-class">Cha-Cha Intermediate</h4>
                  <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
                </div>
                <p className="feedback-text">Great energy and well-structured lessons.</p>
                <p className="feedback-author">- Sofia Lopez</p>
              </div>
            </div>
          </section>

          <section className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-list">
              <Link to="/instructor/attendance" className="action-item">
                <UserPlus size={20} />
                <span>Mark Attendance</span>
              </Link>
              <Link to="/instructor/classes" className="action-item">
                <BookOpen size={20} />
                <span>View My Classes</span>
              </Link>
              <Link to="/instructor/feedback" className="action-item">
                <MessageSquare size={20} />
                <span>View Feedback</span>
              </Link>
            </div>
          </section>
        </div>

        
      </main>
    </div>
  );
};

export default InstructorDashboard;
