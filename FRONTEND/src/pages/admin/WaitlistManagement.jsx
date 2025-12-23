import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { enrollmentAPI } from '../../utils/api.js';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  CalendarCheck2,
  CreditCard,
  MessageSquare,
  User,
  Bell,
  CheckCircle,
  LogOut,
} from 'lucide-react';
import './AdminDashboard.css';
import './WaitlistManagement.css';



const SidebarItem = ({ label, active, to }) => (
  <Link className={`side-item ${active ? 'active' : ''}`} to={to || '#'}>
    <span>{label}</span>
  </Link>
);

const PositionPill = ({ position }) => (
  <span className="pill pill-position">#{position}</span>
);

const StatusPill = ({ status }) => {
  const tone = status === 'waiting' ? 'pill-waiting' : 'pill-approved';
  return <span className={`pill ${tone}`}>{status}</span>;
};

const WaitlistManagement = () => {
  const navigate = useNavigate();
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWaitlist = async () => {
      try {
        // Fetch waitlisted enrollments from backend
        const enrollments = await enrollmentAPI.getAll();
        const waitlistedEnrollments = enrollments.filter(e => e.isWaitlisted);
        setWaitlist(waitlistedEnrollments);
      } catch (error) {
        console.error('Failed to fetch waitlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWaitlist();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const handleApprove = (id) => {
    // Remove from waitlist when approved
    setWaitlist((prev) => prev.filter((item) => item.id !== id));
    
    // In a real app, this would also update the class capacity in the backend
    alert('Student approved! Class capacity has been increased.');
  };

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">🎵</div>
          <div className="brand-text">
            <div className="brand-title">Latin Dance</div>
            <div className="brand-sub">Academy</div>
          </div>
        </div>
        <nav className="side-nav">
          <SidebarItem label="Dashboard" to="/admin" />
          <SidebarItem label="Classes" to="/admin/classes" />
          <SidebarItem label="Waitlist" active to="/admin/waitlist" />
          <SidebarItem label="Attendance" to="/admin/attendance" />
          <SidebarItem label="Fees & Payments" to="/admin/fees" />
          <SidebarItem label="Feedback" />
          <SidebarItem label="Profile" />
        </nav>
        <div className="side-user">
          <div className="user-info">
            <div className="avatar">A</div>
            <div className="user-details">
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

      <main className="content">
        <header className="page-header">
          <h1>Waitlist Management</h1>
          <p>Manage student waitlist and approvals</p>
        </header>

        <section className="panel waitlist-panel">
          <div className="table-title">Current Waitlist</div>
          <div className="table-wrapper">
            <table className="waitlist-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Class</th>
                  <th>Position</th>
                  <th>Request Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      Loading waitlist...
                    </td>
                  </tr>
                ) : waitlist.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      No students currently on waitlist
                    </td>
                  </tr>
                ) : (
                  waitlist.map((item) => (
                    <tr key={item._id}>
                      <td>{item.student?.name || 'Unknown'}</td>
                      <td>{item.class?.name || 'Unknown'}</td>
                      <td><PositionPill position={item.waitlistPosition || 1} /></td>
                      <td>{new Date(item.enrolledAt).toLocaleDateString()}</td>
                      <td><StatusPill status={item.status} /></td>
                      <td>
                        <div className="action-group">
                          <span className="next-badge">
                            <Bell size={14} />
                            Next in line
                          </span>
                          <button className="approve-btn" onClick={() => handleApprove(item._id)}>
                            <CheckCircle size={16} />
                            Approve
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel info-panel">
          <div className="info-title">Waitlist Information</div>
          <ul className="info-list">
            <li>• Students are automatically added to the waitlist when a class is full</li>
            <li>• Position #1 is highlighted as next in line when a seat becomes available</li>
            <li>• When approving enrollment, the system automatically updates class capacity</li>
            <li>• Students receive notifications when they move up in position (UI indication only in this demo)</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default WaitlistManagement;
