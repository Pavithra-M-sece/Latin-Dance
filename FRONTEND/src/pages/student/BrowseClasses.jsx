import React, { useState, useEffect } from 'react';
import { classAPI, enrollmentAPI } from '../../utils/api.js';
import StudentSidebar from '../../components/StudentSidebar.jsx';
import './StudentDashboard.css';

const BrowseClasses = () => {
  const studentId = localStorage.getItem('userId');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classesData = await classAPI.getAll();
        setClasses(classesData);
      } catch (err) {
        setError(err.message || 'Failed to load classes');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleEnroll = async (classId, className) => {
    try {
      await enrollmentAPI.enroll({ student: studentId, class: classId });
      alert(`Enrolled in ${className}!`);
      // Refresh classes
      const classesData = await classAPI.getAll();
      setClasses(classesData);
    } catch (err) {
      alert(err.message || 'Failed to enroll');
    }
  };

  const handleWaitlist = async (classId, className) => {
    try {
      await enrollmentAPI.enroll({ student: studentId, class: classId });
      alert(`Added to waitlist for ${className}!`);
      // Refresh classes
      const classesData = await classAPI.getAll();
      setClasses(classesData);
    } catch (err) {
      alert(err.message || 'Failed to join waitlist');
    }
  };

  return (
    <div className="student-shell">
      <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="student-content">
        <header className="page-header">
          <h1>Class Management</h1>
          <p>Browse and enroll in available classes</p>
        </header>

        <section className="classes-section">
          <h2 className="section-heading">All Classes</h2>
          <p className="section-sub">Enroll in open classes or join the waitlist when seats are full.</p>
          
          {error && <div className="alert alert-danger">{error}</div>}
          
          <div className="classes-table-wrapper">
            <table className="classes-table">
              <thead>
                <tr>
                  <th>Class Name</th>
                  <th>Style</th>
                  <th>Level</th>
                  <th>Instructor</th>
                  <th>Schedule</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>Loading classes...</td></tr>
                ) : classes.length === 0 ? (
                  <tr><td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>No classes available</td></tr>
                ) : classes.map((cls) => (
                  <tr key={cls._id}>
                    <td className="class-name-cell">
                      <span>{cls.name}</span>
                    </td>
                    <td><span className="pill neutral">{cls.style}</span></td>
                    <td><span className="pill level">{cls.level}</span></td>
                    <td>{cls.instructor?.name || 'N/A'}</td>
                    <td>{cls.schedule}</td>
                    <td>
                      <span className={`capacity ${cls.currentEnrollment >= cls.capacity ? 'full' : 'available'}`}>
                        {cls.currentEnrollment} / {cls.capacity}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${cls.status.toLowerCase()}`}>
                        {cls.status}
                      </span>
                    </td>
                    <td className="actions-cell">
                      {cls.status === 'Active' && cls.currentEnrollment < cls.capacity ? (
                        <button 
                          className="action-btn enroll"
                          onClick={() => handleEnroll(cls._id, cls.name)}
                        >
                          Enroll
                        </button>
                      ) : (
                        <>
                          <button className="action-btn full" disabled>Full</button>
                          <button 
                            className="action-btn waitlist"
                            onClick={() => handleWaitlist(cls._id, cls.name)}
                          >
                            Join Waitlist
                          </button>
                        </>
                      )}
                    </td>
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

export default BrowseClasses;
