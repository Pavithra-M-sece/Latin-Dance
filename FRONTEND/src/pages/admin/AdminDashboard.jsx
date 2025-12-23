import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { classAPI, enrollmentAPI, paymentAPI, adminAPI, contactAPI } from '../../utils/api.js';
import './AdminDashboard.css';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  CalendarCheck2,
  CreditCard,
  MessageSquare,
  User,
  AlertCircle,
  DollarSign,
  LogOut,
} from 'lucide-react';

const SidebarItem = ({ label, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link className={`side-item ${isActive ? 'active' : ''}`} to={to || '#'}>
      <span>{label}</span>
    </Link>
  );
};

const StatCard = ({ title, value, sub, icon: Icon, tone }) => (
  <div className="stat-card">
    <div className="stat-head">
      <span>{title}</span>
      {Icon ? <Icon size={16} className="stat-icon" /> : null}
    </div>
    <div className="stat-value">
      <strong className={tone || ''}>{value}</strong>
      <div className="stat-sub">{sub}</div>
    </div>
  </div>
);

const Pill = ({ children, tone }) => (
  <span className={`pill ${tone || ''}`}>{children}</span>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    activeClasses: 0,
    fullClasses: 0,
    monthlyRevenue: 0,
    waitlistCount: 0,
    overduePayments: 0,
    classes: [],
    recentStudents: [],
    recentContacts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    const fetchDashboardData = async () => {
      try {
        const [classes, payments, users, enrollments, paymentSummary, contacts] = await Promise.all([
          classAPI.getAll(),
          paymentAPI.getAll(),
          adminAPI.getUsers(),
          enrollmentAPI.getAll(),
          paymentAPI.getSummary(),
          contactAPI.getAll()
        ]);

        const students = users.filter(u => u.role === 'student');
        const activeClasses = classes.filter(c => c.status === 'Active').length;
        const fullClasses = classes.filter(c => c.status === 'Full' || c.currentEnrollment >= c.capacity).length;
        
        const currentMonth = now.getMonth() + 1; // 1-12
        const currentYear = now.getFullYear();
        const monthlyRevenue = (paymentSummary?.monthlyRevenue || [])
          .find(m => m.year === currentYear && m.month === currentMonth)?.total || 0;

        const waitlistCount = enrollments.filter(e => e.isWaitlisted).length;
        const overduePayments = payments.filter(p => p.status === 'Overdue').length;

        setDashboardData({
          totalStudents: students.length,
          activeClasses,
          fullClasses,
          monthlyRevenue,
          waitlistCount,
          overduePayments,
          classes: classes.slice(0, 4),
          recentStudents: students.slice(-3).reverse(),
          recentContacts: contacts.slice(0, 3)
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    const userRole = localStorage.getItem('userRole') || 'admin';
    localStorage.clear();
    navigate(`/?role=${userRole}`);
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
          <SidebarItem label="Waitlist" to="/admin/waitlist" />
          <SidebarItem label="Attendance" to="/admin/attendance" />
          <SidebarItem label="Fees & Payments" to="/admin/fees" />
          <SidebarItem label="Feedback" to="/admin/feedback" />
          <SidebarItem label="Profile" to="/admin/profile" />
        </nav>
        <div className="side-user">
          <div className="user-info">
            <div className="avatar">A</div>
            <div>
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
          <h1>Admin Dashboard</h1>
          <p>Overview of Latin Dance Academy</p>
        </header>

        <section className="stats">
          {loading ? (
            <div>Loading dashboard data...</div>
          ) : (
            <>
              <StatCard title="Total Students" value={dashboardData.totalStudents} sub="Active enrollments" icon={Users} />
              <StatCard title="Active Classes" value={dashboardData.activeClasses} sub="Across all levels" icon={CalendarCheck2} />
              <StatCard title="Full Classes" value={dashboardData.fullClasses} sub="At capacity" icon={AlertCircle} tone="danger" />
              <StatCard title="Monthly Revenue" value={`$${dashboardData.monthlyRevenue.toFixed(2)}`} sub={`${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}`} icon={DollarSign} tone="success" />
            </>
          )}
        </section>

        <section className="panel alerts">
          <div className="panel-title">Alerts & Notifications</div>

          {dashboardData.overduePayments > 0 && (
            <div className="notice notice-warn">
              <div className="notice-icon">⚠️</div>
              <div className="notice-body">
                <div className="notice-title">Payment Dues</div>
                <div className="notice-sub">{dashboardData.overduePayments} student(s) have pending or overdue payments</div>
                <Link className="notice-link" to="/admin/fees">View Details →</Link>
              </div>
            </div>
          )}

          {dashboardData.fullClasses > 0 && (
            <div className="notice notice-danger">
              <div className="notice-icon">❗</div>
              <div className="notice-body">
                <div className="notice-title">Full Class Notifications</div>
                <div className="notice-sub">{dashboardData.fullClasses} class(es) at full capacity</div>
                <Link to="/admin/waitlist" className="notice-link">Manage Waitlist →</Link>
              </div>
            </div>
          )}

          {dashboardData.waitlistCount > 0 && (
            <div className="notice notice-info">
              <div className="notice-icon">📘</div>
              <div className="notice-body">
                <div className="notice-title">Waitlist Pending</div>
                <div className="notice-sub">{dashboardData.waitlistCount} student(s) on waitlist</div>
                <Link to="/admin/waitlist" className="notice-link">View Waitlist →</Link>
              </div>
            </div>
          )}

          {dashboardData.overduePayments === 0 && dashboardData.fullClasses === 0 && dashboardData.waitlistCount === 0 && (
            <div className="notice notice-success">
              <div className="notice-icon">✅</div>
              <div className="notice-body">
                <div className="notice-title">All Good!</div>
                <div className="notice-sub">No urgent issues require attention</div>
              </div>
            </div>
          )}
        </section>

        <div className="grid-2">
          <section className="panel">
            <div className="panel-title with-link">
              <span>Recent Classes</span>
              <Link to="/admin/classes" className="panel-link">View All →</Link>
            </div>
            {loading ? (
              <div>Loading classes...</div>
            ) : dashboardData.classes.length === 0 ? (
              <div>No classes available</div>
            ) : (
              dashboardData.classes.map((cls) => (
                <div key={cls._id} className="class-item">
                  <div className="c-body">
                    <div className="c-title">{cls.name}</div>
                    <div className="c-sub">{cls.style} • {cls.level}</div>
                  </div>
                  <Pill tone={cls.currentEnrollment >= cls.capacity ? "danger" : "success"}>
                    {cls.currentEnrollment}/{cls.capacity}
                  </Pill>
                </div>
              ))
            )}
          </section>

          <section className="panel">
            <div className="panel-title with-link">
              <span>Recent Students</span>
              <Link to="/admin/students" className="panel-link">View All →</Link>
            </div>
            {loading ? (
              <div>Loading students...</div>
            ) : dashboardData.recentStudents.length === 0 ? (
              <div>No students found</div>
            ) : (
              dashboardData.recentStudents.map((student) => (
                <div key={student._id} className="student-item">
                  <div>
                    <div className="s-name">{student.name}</div>
                    <div className="s-sub">{student.email}</div>
                  </div>
                  <div className="s-meta">Joined<br/>{new Date(student.createdAt).toLocaleDateString()}</div>
                </div>
              ))
            )}
          </section>
        </div>

        <section className="panel">
          <div className="panel-title">
            <span>Recent Contact Messages</span>
          </div>
          {loading ? (
            <div>Loading messages...</div>
          ) : dashboardData.recentContacts.length === 0 ? (
            <div>No contact messages</div>
          ) : (
            dashboardData.recentContacts.map((contact) => (
              <div key={contact._id} className="contact-message-item">
                <div className="contact-header">
                  <div>
                    <div className="contact-name">{contact.name}</div>
                    <div className="contact-email">{contact.email}</div>
                  </div>
                  <div className="contact-meta">
                    <Pill tone={contact.status === 'New' ? 'warning' : contact.status === 'Read' ? 'info' : 'success'}>
                      {contact.status}
                    </Pill>
                    <div className="contact-date">{new Date(contact.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="contact-message">{contact.message}</div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
