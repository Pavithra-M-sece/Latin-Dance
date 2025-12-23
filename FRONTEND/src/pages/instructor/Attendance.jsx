import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './InstructorDashboard.css';
import { LogOut, CheckCircle, XCircle, Save } from 'lucide-react';

const SidebarItem = ({ label, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link className={`side-item ${isActive ? 'active' : ''}`} to={to || '#'}>
      <span>{label}</span>
    </Link>
  );
};

const Attendance = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [message, setMessage] = useState(null);
  const [students, setStudents] = useState([
    { id: 1, name: 'Juan Martinez', email: 'juan@dance.com', present: true },
    { id: 2, name: 'Sofia Lopez', email: 'sofia@dance.com', present: true },
    { id: 3, name: 'Diego Fernandez', email: 'diego@dance.com', present: false },
  ]);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const toggleAttendance = (studentId, present) => {
    setStudents(students.map(student =>
      student.id === studentId ? { ...student, present } : student
    ));
  };

  const handleSaveAttendance = () => {
    if (!selectedClass || !selectedDate) {
      setMessage({ type: 'error', text: 'Please select both class and date.' });
      return;
    }
    
    const attendanceData = {
      class: selectedClass,
      date: selectedDate,
      students: students,
      savedAt: new Date().toLocaleString()
    };
    
    localStorage.setItem(`attendance_${selectedClass}_${selectedDate}`, JSON.stringify(attendanceData));
    setMessage({ type: 'success', text: 'Attendance saved successfully!' });
    setTimeout(() => setMessage(null), 3000);
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
          <h1>Attendance Tracking</h1>
          <p>Mark and view student attendance</p>
        </header>

        <section className="feedback-section">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <h2 className="section-title">Select Class</h2>
              <select 
                value={selectedClass} 
                onChange={(e) => setSelectedClass(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 122, 89, 0.5)',
                  background: 'rgba(255, 255, 255, 0.12)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ff7a59' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '12px',
                  paddingRight: '40px'
                }}
              >
                <option value="">Choose a class</option>
                <option value="salsa">Salsa Basics - Mon, Wed 6:00 PM</option>
                <option value="chacha">Cha-Cha Intermediate - Fri 6:30 PM</option>
              </select>
            </div>
            
            {selectedClass && (
              <div>
                <h2 className="section-title">Select Date</h2>
                <input 
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 122, 89, 0.3)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#fff',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                />
              </div>
            )}
          </div>

          {selectedClass && selectedDate && (
            <>
              {message && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  background: message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: message.type === 'success' ? '#10b981' : '#ef4444',
                  border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`
                }}>
                  {message.text}
                </div>
              )}

              <h2 className="section-title">Student List</h2>
              <div className="feedback-list">
                {students.map((student) => (
                  <div key={student.id} className="feedback-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 600, marginBottom: '4px' }}>{student.name}</div>
                      <div style={{ color: '#888', fontSize: '14px' }}>{student.email}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => toggleAttendance(student.id, true)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '6px',
                          border: student.present ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.2)',
                          background: student.present ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                          color: student.present ? '#10b981' : '#888',
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                        <CheckCircle size={16} />
                        Present
                      </button>
                      <button 
                        onClick={() => toggleAttendance(student.id, false)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '6px',
                          border: !student.present ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.2)',
                          background: !student.present ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                          color: !student.present ? '#ef4444' : '#888',
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                        <XCircle size={16} />
                        Absent
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                <button 
                  onClick={handleSaveAttendance}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, rgba(255, 122, 89, 0.9), rgba(255, 165, 77, 0.9))',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, rgba(255, 122, 89, 1), rgba(255, 165, 77, 1))'}
                  onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, rgba(255, 122, 89, 0.9), rgba(255, 165, 77, 0.9))'}
                >
                  <Save size={18} />
                  Save Attendance
                </button>
              </div>
            </>
          )}
        </section>

        
      </main>
    </div>
  );
};

export default Attendance;
