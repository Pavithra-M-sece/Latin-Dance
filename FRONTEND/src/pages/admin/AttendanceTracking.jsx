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
  CheckCircle,
  XCircle,
  LogOut,
} from 'lucide-react';
import { classAPI, enrollmentAPI, attendanceAPI } from '../../utils/api.js';
import './AdminDashboard.css';
import './AttendanceTracking.css';



const SidebarItem = ({ label, active, to }) => (
  <Link className={`side-item ${active ? 'active' : ''}`} to={to || '#'}>
    <span>{label}</span>
  </Link>
);

const AttendanceTracking = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [students, setStudents] = useState([]);
  const [showStudents, setShowStudents] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classesData = await classAPI.getAll();
        setClasses(classesData);
      } catch (error) {
        console.error('Failed to fetch classes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setShowStudents(false);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleMarkAttendance = async () => {
    if (selectedClass && selectedDate) {
      try {
        const enrollments = await enrollmentAPI.getClassEnrollments(selectedClass);
        const activeStudents = enrollments.filter(e => !e.isWaitlisted && e.status !== 'Dropped' && e.student);
        setStudents(activeStudents.map(e => ({
          id: e.student?._id || e.student,
          name: e.student?.name || 'Unknown',
          email: e.student?.email || 'No email',
          attended: null
        })));
        setShowStudents(true);
      } catch (error) {
        console.error('Failed to fetch students:', error);
        alert('Failed to load students');
      }
    }
  };

  const handleToggleAttendance = (studentId) => {
    setStudents(prev => 
      prev.map(s => 
        s.id === studentId 
          ? { ...s, attended: s.attended === null ? true : s.attended ? false : true }
          : s
      )
    );
  };

  const handleSaveAttendance = async () => {
    try {
      console.log('Saving attendance for date:', selectedDate);
      console.log('Students to mark:', students.filter(s => s.attended !== null));
      
      const attendancePromises = students.map(student => {
        if (student.attended !== null) {
          const attendanceData = {
            student: student.id,
            class: selectedClass,
            date: selectedDate, // This should be in YYYY-MM-DD format
            status: student.attended ? 'Present' : 'Absent',
            notes: ''
          };
          console.log('Marking attendance:', attendanceData);
          return attendanceAPI.markAttendance(attendanceData);
        }
        return null;
      }).filter(Boolean);

      const results = await Promise.all(attendancePromises);
      console.log('Attendance save results:', results);
      alert('Attendance saved successfully!');
      setShowStudents(false);
      setSelectedClass('');
      setSelectedDate('');
    } catch (error) {
      console.error('Failed to save attendance:', error);
      alert(`Failed to save attendance: ${error.message}`);
    }
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
          <SidebarItem label="Waitlist" to="/admin/waitlist" />
          <SidebarItem label="Attendance" active to="/admin/attendance" />
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
          <h1>Attendance Tracking</h1>
          <p>Mark and view student attendance</p>
        </header>

        <section className="panel attendance-panel">
          <div className="attendance-controls">
            <div className="control-group">
              <label className="control-label">Select Class</label>
              <select 
                className="control-select"
                value={selectedClass}
                onChange={handleClassChange}
                disabled={loading}
              >
                <option value="">{loading ? 'Loading classes...' : 'Choose a class'}</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>{cls.name} - {cls.style}</option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label className="control-label">Select Date</label>
              <input 
                type="date"
                className="control-date"
                value={selectedDate}
                onChange={handleDateChange}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <button 
            className="mark-btn"
            onClick={handleMarkAttendance}
            disabled={!selectedClass || !selectedDate}
          >
            mark attendance
          </button>
        </section>

        {showStudents && (
          <section className="panel students-panel">
            <div className="panel-title">Student List - {classes.find(c => c._id === selectedClass)?.name}</div>
            <div className="students-grid">
              {students.map(student => (
                <div key={student.id} className="student-card">
                  <div className="student-info">
                    <div className="student-name">{student.name}</div>
                    <div className="student-email">{student.email}</div>
                  </div>
                  <button 
                    className={`attendance-btn ${student.attended === true ? 'present' : student.attended === false ? 'absent' : ''}`}
                    onClick={() => handleToggleAttendance(student.id)}
                  >
                    {student.attended === true ? (
                      <>
                        <CheckCircle size={18} />
                        Present
                      </>
                    ) : student.attended === false ? (
                      <>
                        <XCircle size={18} />
                        Absent
                      </>
                    ) : (
                      'Mark'
                    )}
                  </button>
                </div>
              ))}
            </div>
            <div className="panel-actions">
              <button className="btn secondary" onClick={() => setShowStudents(false)}>Cancel</button>
              <button className="btn primary" onClick={handleSaveAttendance}>Save Attendance</button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AttendanceTracking;
