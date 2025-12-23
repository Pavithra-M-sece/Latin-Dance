import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Check, X } from 'lucide-react';
import { enrollmentAPI } from '../../utils/api.js';
import './AdminDashboard.css';

const SidebarItem = ({ label, active, to }) => (
  <Link className={`side-item ${active ? 'active' : ''}`} to={to || '#'}>
    <span>{label}</span>
  </Link>
);

const EnrollmentRequests = () => {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const data = await enrollmentAPI.getAll();
      const pendingEnrollments = data.filter(e => e.status === 'Pending');
      setEnrollments(pendingEnrollments);
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (enrollmentId) => {
    const confirmed = confirm('Approve this enrollment request?');
    if (confirmed) {
      try {
        await enrollmentAPI.approve(enrollmentId);
        fetchEnrollments();
        alert('Enrollment approved!');
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  };

  const handleReject = async (enrollmentId) => {
    const confirmed = confirm('Reject this enrollment request?');
    if (confirmed) {
      try {
        await enrollmentAPI.reject(enrollmentId);
        fetchEnrollments();
        alert('Enrollment rejected!');
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
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
          <SidebarItem label="Students" to="/admin/students" />
          <SidebarItem label="Enrollment Requests" active to="/admin/enrollment-requests" />
          <SidebarItem label="Waitlist" to="/admin/waitlist" />
          <SidebarItem label="Attendance" to="/admin/attendance" />
          <SidebarItem label="Fees & Payments" to="/admin/fees" />
          <SidebarItem label="Feedback" to="/admin/feedback" />
          <SidebarItem label="Profile" to="/admin/profile" />
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
          <h1>Enrollment Requests</h1>
          <p>Approve or reject student enrollment requests</p>
        </header>

        <section className="panel">
          <div className="panel-title">
            Pending Requests ({loading ? '...' : enrollments.length})
          </div>
          
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              Loading requests...
            </div>
          ) : enrollments.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              No pending enrollment requests
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="class-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Class</th>
                    <th>Request Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment._id}>
                      <td>{enrollment.student?.name}</td>
                      <td>{enrollment.class?.name} - {enrollment.class?.style}</td>
                      <td>{new Date(enrollment.enrolledAt).toLocaleDateString()}</td>
                      <td>
                        <span className="pill pill-warning">Pending</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="action-btn approve"
                            onClick={() => handleApprove(enrollment._id)}
                          >
                            <Check size={16} />
                            Approve
                          </button>
                          <button
                            className="action-btn reject"
                            onClick={() => handleReject(enrollment._id)}
                          >
                            <X size={16} />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default EnrollmentRequests;