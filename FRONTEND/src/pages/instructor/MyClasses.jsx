import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './InstructorDashboard.css';
import { LogOut, BookOpen, Users } from 'lucide-react';

const SidebarItem = ({ label, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link className={`side-item ${isActive ? 'active' : ''}`} to={to || '#'}>
      <span>{label}</span>
    </Link>
  );
};

const MyClasses = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/login');
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
          <h1>My Classes</h1>
          <p>View and manage your assigned classes</p>
        </header>

        <section className="assigned-classes">
          <div className="section-header">
            <h2>Assigned Classes</h2>
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

        
      </main>
    </div>
  );
};

export default MyClasses;
