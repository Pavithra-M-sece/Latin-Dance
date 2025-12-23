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
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Users,
} from 'lucide-react';
import { classAPI, enrollmentAPI } from '../../utils/api.js';
import './AdminDashboard.css';
import './ClassManagement.css';

const SidebarItem = ({ label, active, to }) => (
  <Link className={`side-item ${active ? 'active' : ''}`} to={to || '#'}>
    <span>{label}</span>
  </Link>
);

const StatusPill = ({ status }) => {
  const tone = status === 'Full' ? 'pill-danger' : 'pill-open';
  return <span className={`pill ${tone}`}>{status}</span>;
};

const ClassManagement = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [studentsModalOpen, setStudentsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    style: '',
    level: 'Beginner',
    schedule: '',
    capacity: '',
    price: '',
    description: '',
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const classes = await classAPI.getAll();
      setData(classes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const openCreateModal = () => {
    setFormData({
      name: '',
      style: '',
      level: 'Beginner',
      schedule: '',
      capacity: '',
      price: '',
      description: '',
    });
    setCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
  };

  const openEditModal = (cls) => {
    setSelected(cls);
    setFormData({
      name: cls.name,
      style: cls.style,
      level: cls.level,
      schedule: cls.schedule,
      capacity: cls.capacity,
      price: cls.price,
      description: cls.description || '',
    });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelected(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateClass = async () => {
    if (!formData.name || !formData.style || !formData.schedule || !formData.capacity || !formData.price) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const adminId = localStorage.getItem('userId');
      const newClassData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        price: parseFloat(formData.price),
        instructor: adminId,
      };

      const created = await classAPI.create(newClassData);
      setData([created, ...data]);
      closeCreateModal();
      alert('Class created successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateClass = async () => {
    try {
      const updatedClassData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        price: parseFloat(formData.price),
      };

      const updated = await classAPI.update(selected._id, updatedClassData);
      setData(data.map((c) => (c._id === selected._id ? updated : c)));
      closeEditModal();
      alert('Class updated successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;

    try {
      await classAPI.delete(classId);
      setData(data.filter((c) => c._id !== classId));
      alert('Class deleted successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleViewStudents = async (cls) => {
    setSelected(cls);
    setStudentsModalOpen(true);
    setLoadingStudents(true);
    
    try {
      const enrollments = await enrollmentAPI.getClassEnrollments(cls._id);
      setEnrolledStudents(enrollments);
    } catch (err) {
      alert('Failed to load students: ' + err.message);
    } finally {
      setLoadingStudents(false);
    }
  };

  const closeStudentsModal = () => {
    setStudentsModalOpen(false);
    setSelected(null);
    setEnrolledStudents([]);
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
          <SidebarItem label="Classes" active to="/admin/classes" />
          <SidebarItem label="Students" to="/admin/students" />
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
            <h1>Class Management</h1>
            <p>Create and manage dance classes</p>
          </div>
          <button className="btn btn-primary" onClick={openCreateModal} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> Create Class
          </button>
        </header>

        {error && <div className="alert alert-danger">{error}</div>}
        {loading && <p>Loading classes...</p>}

        {!loading && data.length === 0 && (
          <section className="panel class-panel">
            <p style={{ textAlign: 'center', padding: '40px' }}>No classes created yet. <button className="link-btn" onClick={openCreateModal} style={{ color: '#ff6ec7', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Create one now</button></p>
          </section>
        )}

        {!loading && data.length > 0 && (
          <section className="panel class-panel">
            <div className="table-title">All Classes ({data.length})</div>
            <div className="table-wrapper">
              <table className="class-table">
                <thead>
                  <tr>
                    <th>Class Name</th>
                    <th>Style</th>
                    <th>Level</th>
                    <th>Schedule</th>
                    <th>Capacity</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((c) => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>{c.style}</td>
                      <td>{c.level}</td>
                      <td>{c.schedule}</td>
                      <td>{c.currentEnrollment} / {c.capacity}</td>
                      <td>${c.price}</td>
                      <td><StatusPill status={c.status} /></td>
                      <td style={{ display: 'flex', gap: '8px' }}>
                        <button className="action-btn view" onClick={() => handleViewStudents(c)} title="View Students" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff6ec7' }}>
                          <Users size={16} />
                        </button>
                        <button className="action-btn edit" onClick={() => openEditModal(c)} title="Edit" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff6ec7' }}>
                          <Edit2 size={16} />
                        </button>
                        <button className="action-btn delete" onClick={() => handleDeleteClass(c._id)} title="Delete" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff6ec7' }}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {createModalOpen && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-header">
                <div>
                  <div className="modal-title">Create New Class</div>
                  <div className="modal-sub">Add a new dance class</div>
                </div>
                <button className="modal-close" onClick={closeCreateModal}>×</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="modal-label">Class Name *</label>
                  <input
                    type="text"
                    className="modal-input"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="e.g., Salsa Basics"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="modal-label">Dance Style *</label>
                    <input
                      type="text"
                      className="modal-input"
                      name="style"
                      value={formData.style}
                      onChange={handleFormChange}
                      placeholder="e.g., Salsa"
                    />
                  </div>
                  <div className="form-group">
                    <label className="modal-label">Level *</label>
                    <select className="modal-input" name="level" value={formData.level} onChange={handleFormChange}>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="modal-label">Schedule *</label>
                  <input
                    type="text"
                    className="modal-input"
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleFormChange}
                    placeholder="e.g., Mon, Wed 6:00 PM"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="modal-label">Capacity *</label>
                    <input
                      type="number"
                      className="modal-input"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleFormChange}
                      placeholder="20"
                    />
                  </div>
                  <div className="form-group">
                    <label className="modal-label">Price ($) *</label>
                    <input
                      type="number"
                      className="modal-input"
                      name="price"
                      value={formData.price}
                      onChange={handleFormChange}
                      placeholder="29.99"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="modal-label">Description</label>
                  <textarea
                    className="modal-input"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Class description"
                    rows="3"
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn ghost" onClick={closeCreateModal}>Cancel</button>
                <button className="btn primary" onClick={handleCreateClass}>Create Class</button>
              </div>
            </div>
          </div>
        )}

        {editModalOpen && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-header">
                <div>
                  <div className="modal-title">Edit Class</div>
                  <div className="modal-sub">{selected?.name}</div>
                </div>
                <button className="modal-close" onClick={closeEditModal}>×</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="modal-label">Class Name</label>
                  <input
                    type="text"
                    className="modal-input"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="modal-label">Dance Style</label>
                    <input
                      type="text"
                      className="modal-input"
                      name="style"
                      value={formData.style}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="modal-label">Level</label>
                    <select className="modal-input" name="level" value={formData.level} onChange={handleFormChange}>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="modal-label">Schedule</label>
                  <input
                    type="text"
                    className="modal-input"
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleFormChange}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="modal-label">Capacity</label>
                    <input
                      type="number"
                      className="modal-input"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="modal-label">Price ($)</label>
                    <input
                      type="number"
                      className="modal-input"
                      name="price"
                      value={formData.price}
                      onChange={handleFormChange}
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="modal-label">Description</label>
                  <textarea
                    className="modal-input"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows="3"
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn ghost" onClick={closeEditModal}>Cancel</button>
                <button className="btn primary" onClick={handleUpdateClass}>Save Changes</button>
              </div>
            </div>
          </div>
        )}

        {studentsModalOpen && (
          <div className="modal-overlay">
            <div className="modal-card wide">
              <div className="modal-header">
                <div>
                  <div className="modal-title">Enrolled Students</div>
                  <div className="modal-sub">{selected?.name} - {enrolledStudents.length} students</div>
                </div>
                <button className="modal-close" onClick={closeStudentsModal}>×</button>
              </div>
              <div className="modal-body">
                {loadingStudents ? (
                  <p style={{ textAlign: 'center', padding: '20px' }}>Loading students...</p>
                ) : enrolledStudents.length === 0 ? (
                  <p style={{ textAlign: 'center', padding: '20px' }}>No students enrolled in this class yet.</p>
                ) : (
                  <div className="students-list">
                    <table className="class-table">
                      <thead>
                        <tr>
                          <th style={{ width: '25%' }}>STUDENT NAME</th>
                          <th style={{ width: '35%' }}>EMAIL</th>
                          <th style={{ width: '20%' }}>STATUS</th>
                          <th style={{ width: '20%' }}>ENROLLED DATE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enrolledStudents.map((enrollment) => (
                          <tr key={enrollment._id}>
                            <td>{enrollment.student?.name || 'Unknown'}</td>
                            <td>{enrollment.student?.email || 'Unknown'}</td>
                            <td>
                              <span className={`pill ${enrollment.isWaitlisted ? 'pill-waiting' : 'pill-success'}`}>
                                {enrollment.isWaitlisted ? 'Waitlisted' : 'Enrolled'}
                              </span>
                            </td>
                            <td>{new Date(enrollment.enrolledAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="modal-actions">
                <button className="btn primary" onClick={closeStudentsModal}>Close</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ClassManagement;
