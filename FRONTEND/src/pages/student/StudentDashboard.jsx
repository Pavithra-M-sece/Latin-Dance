import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentAPI, paymentAPI } from '../../utils/api.js';
import StudentSidebar from '../../components/StudentSidebar.jsx';
import './StudentDashboard.css';

const StatCard = ({ title, value, description }) => (
  <div className="stat-card">
    <div className="stat-content">
      <h3 className="stat-title">{title}</h3>
      <div className="stat-value">{value}</div>
      {description && <p className="stat-description">{description}</p>}
    </div>
  </div>
);

const StudentDashboard = () => {
  const studentName = localStorage.getItem('userName')?.split('@')[0] || 'Student';
  const studentId = localStorage.getItem('userId');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    enrollments: [],
    payments: [],
    waitlistCount: 0,
    pendingPayments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [enrollments, payments] = await Promise.all([
          enrollmentAPI.getStudentEnrollments(studentId),
          paymentAPI.getStudentPayments(studentId)
        ]);
        
        const activeEnrollments = enrollments.filter(e => !e.isWaitlisted && e.status !== 'Dropped');
        const waitlistEnrollments = enrollments.filter(e => e.isWaitlisted);
        const pendingPayments = payments.filter(p => p.status === 'Pending').length;
        
        setDashboardData({
          enrollments: activeEnrollments,
          payments: payments.slice(0, 3),
          waitlistCount: waitlistEnrollments.length,
          pendingPayments
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchDashboardData();
    }
  }, [studentId]);

  return (
    <div className="student-shell">
      <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="student-content">
        {/* Hero Header */}
        <header className="hero-header">
          <div className="hero-content">
            <h1 className="hero-title">Feel the Rhythm. Master the Movement.</h1>
            <p className="hero-subtitle">Welcome back, {studentName}!</p>
          </div>
        </header>

        {/* Stats Section */}
        <section className="stats-section">
          <StatCard 
            title="Enrolled Classes" 
            value={loading ? '...' : dashboardData.enrollments.length} 
            description="Browse more classes →"
          />
          <StatCard 
            title="Pending Payments" 
            value={loading ? '...' : dashboardData.pendingPayments} 
          />
          <StatCard 
            title="Waitlist Status" 
            value={loading ? '...' : dashboardData.waitlistCount} 
          />
        </section>

        {/* Enrolled Classes */}
        <section className="enrolled-section">
          <h2 className="section-heading">My Enrolled Classes</h2>
          {loading ? (
            <div>Loading classes...</div>
          ) : dashboardData.enrollments.length === 0 ? (
            <div>No enrolled classes. <Link to="/student/classes">Browse classes →</Link></div>
          ) : (
            dashboardData.enrollments.map((enrollment) => (
              <div key={enrollment._id} className="class-card">
                <div className="class-info">
                  <h3 className="class-name">{enrollment.class?.name || 'Class'}</h3>
                  <p className="class-level">{enrollment.class?.style} • {enrollment.class?.level}</p>
                  <p className="class-schedule">{enrollment.class?.schedule}</p>
                </div>
                <div className="class-stats">
                  <div className="attendance-badge">{enrollment.class?.currentEnrollment || 0}/{enrollment.class?.capacity || 0}</div>
                  <p className="attendance-text">Status: {enrollment.status}</p>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Bottom Section */}
        <section className="bottom-section">
          <div className="recent-fees">
            <div className="section-header">
              <h2 className="section-heading">Recent Fees</h2>
              <Link to="/student/payments" className="view-all-link">View All →</Link>
            </div>
            {loading ? (
              <div>Loading payments...</div>
            ) : dashboardData.payments.length === 0 ? (
              <div>No payment records</div>
            ) : (
              dashboardData.payments.map((payment) => (
                <div key={payment._id} className="fee-item">
                  <div className="fee-info">
                    <h3 className="fee-class">{payment.class?.name || 'Class'}</h3>
                    <p className="fee-date">{payment.month}</p>
                  </div>
                  <div className="fee-details">
                    <span className={`fee-status ${payment.status.toLowerCase()}`}>{payment.status}</span>
                    <span className="fee-amount">${payment.amount}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="waitlist-status">
            <h2 className="section-heading">Waitlist Status</h2>
            <p className="waitlist-text">
              {loading ? 'Loading...' : dashboardData.waitlistCount === 0 ? 'No waitlist entries' : `${dashboardData.waitlistCount} class(es) on waitlist`}
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="student-footer">
          <div className="footer-content">
            <div className="footer-section">
              <h4 className="footer-title">Latin Dance Academy</h4>
              <p className="footer-text">Feel the Rhythm. Master the Movement.</p>
            </div>
            <div className="footer-section">
              <h4 className="footer-title">Quick Links</h4>
              <ul className="footer-links">
                <li><a href="#terms">Terms & Conditions</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4 className="footer-title">Contact</h4>
              <p className="footer-text">info@latindance.com</p>
            </div>
          </div>
          <div className="footer-copyright">
            © 2024 Latin Dance Academy. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  );
};

export default StudentDashboard;
