import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { attendanceAPI } from '../../utils/api.js';
import StudentSidebar from '../../components/StudentSidebar.jsx';
import './StudentDashboard.css';

const Attendance = () => {
  const studentId = localStorage.getItem('userId');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        console.log('Fetching attendance for student ID:', studentId);
        const attendanceData = await attendanceAPI.getStudentAttendance(studentId);
        console.log('Received attendance data:', attendanceData);
        setAttendance(attendanceData);
      } catch (err) {
        console.error('Error fetching attendance:', err);
        setError(err.message || 'Failed to load attendance');
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchAttendance();
    } else {
      console.error('No student ID found in localStorage');
      setError('Student ID not found. Please login again.');
      setLoading(false);
    }
  }, [studentId]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Present':
        return <CheckCircle size={16} style={{ color: '#22c55e' }} />;
      case 'Absent':
        return <XCircle size={16} style={{ color: '#ef4444' }} />;
      case 'Late':
        return <Clock size={16} style={{ color: '#f59e0b' }} />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const baseClass = "status-badge";
    switch (status) {
      case 'Present':
        return `${baseClass} status-paid`;
      case 'Absent':
        return `${baseClass} status-overdue`;
      case 'Late':
        return `${baseClass} status-pending`;
      default:
        return baseClass;
    }
  };

  return (
    <div className="student-shell">
      <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="student-content">
        <header className="page-header">
          <h1>My Attendance</h1>
          <p>View your class attendance records</p>
        </header>

        <section className="classes-section">
          <h2 className="section-heading">Attendance Records</h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="classes-table-wrapper">
            <table className="classes-table">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Marked By</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Loading attendance...</td></tr>
                ) : attendance.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No attendance records found</td></tr>
                ) : attendance.map((record) => (
                  <tr key={record._id}>
                    <td>{record.class?.name || 'N/A'}</td>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>
                      <span className={getStatusBadge(record.status)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {getStatusIcon(record.status)}
                        {record.status}
                      </span>
                    </td>
                    <td>{record.markedBy?.name || 'N/A'}</td>
                    <td>{record.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Attendance;