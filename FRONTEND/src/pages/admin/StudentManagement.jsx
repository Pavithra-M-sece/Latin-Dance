import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  CalendarCheck2,
  CreditCard,
  MessageSquare,
  User,
  Users,
  LogOut,
  Mail,
  Phone,
} from 'lucide-react';
import { adminAPI } from '../../utils/api.js';
import './AdminDashboard.css';

const SidebarItem = ({ label, active, to }) => (
  <Link className={`side-item ${active ? 'active' : ''}`} to={to || '#'}>
    <span>{label}</span>
  </Link>
);

const StudentManagement = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const users = await adminAPI.getUsers();
      const studentUsers = users.filter(user => user.role === 'student');
      setStudents(studentUsers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    const confirmed = confirm(`Are you sure you want to ${action} this student?`);
    
    if (confirmed) {
      try {
        await adminAPI.updateUserStatus(userId, { isActive: !currentStatus });
        fetchStudents(); // Refresh the list
        alert(`Student ${action}d successfully!`);
      } catch (err) {
        alert('Error: ' + err.message);
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
          <SidebarItem label="Students" active to="/admin/students" />
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
          <div>
            <h1>Student Management</h1>
            <p>View and manage all registered students</p>
          </div>
        </header>

        {error && <div className="alert alert-danger">{error}</div>}

        <section className="panel">
          <div className="panel-title">
            <Users size={20} />
            All Students ({loading ? '...' : students.length})
          </div>
          
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              Loading students...
            </div>
          ) : students.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              No students registered yet.
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="class-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Registration Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '14px' }}>
                            {student.name?.charAt(0).toUpperCase() || 'S'}
                          </div>
                          <span>{student.name}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Mail size={16} />
                          {student.email}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Phone size={16} />
                          {student.phone || 'Not provided'}
                        </div>
                      </td>
                      <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`pill ${student.isActive !== false ? 'pill-success' : 'pill-danger'}`}>
                          {student.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`action-btn ${student.isActive !== false ? 'deactivate' : 'activate'}`}
                          onClick={() => toggleUserStatus(student._id, student.isActive !== false)}
                        >
                          {student.isActive !== false ? 'Deactivate' : 'Activate'}
                        </button>
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

export default StudentManagement;