import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';

const SidebarItem = ({ label, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link className={`side-item ${isActive ? 'active' : ''}`} to={to || '#'}>
      <span>{label}</span>
    </Link>
  );
};

const StudentSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const studentName = localStorage.getItem('userName')?.split('@')[0] || 'Student';

  const handleLogout = () => {
    const userRole = localStorage.getItem('userRole') || 'student';
    localStorage.clear();
    navigate(`/?role=${userRole}`);
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button 
        className="mobile-menu-toggle" 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`student-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-text">
            <div className="brand-title">Latin Dance</div>
            <div className="brand-sub">Academy</div>
          </div>
        </div>

        <nav className="side-nav">
          <SidebarItem label="Dashboard" to="/student" />
          <SidebarItem label="Browse Classes" to="/student/classes" />
          <SidebarItem label="My Payments" to="/student/payments" />
          <SidebarItem label="My Attendance" to="/student/attendance" />
          <SidebarItem label="Feedback" to="/student/feedback" />
          <SidebarItem label="Profile" to="/student/profile" />
        </nav>

        <div className="side-user">
          <div className="user-info">
            <div className="avatar">{studentName[0].toUpperCase()}</div>
            <div className="user-details">
              <div className="user-name">{studentName}</div>
              <div className="user-role">Student</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default StudentSidebar;
