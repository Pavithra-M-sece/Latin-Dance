import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, UserCheck, DollarSign, Star, User, LogOut } from 'lucide-react';
import './AdminDashboard.css';
import './Profile.css';

const SidebarItem = ({ label, path, location }) => {
  const isActive = location.pathname === path;
  return (
    <Link to={path} className={`side-item ${isActive ? 'active' : ''}`}>
      <span>{label}</span>
    </Link>
  );
};

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const [form, setForm] = useState({
    name: 'Admin User',
    email: 'admin@dance.com',
    phone: '+1234567890',
    role: 'Admin',
  });

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    next: '',
    confirm: '',
  });

  const [message, setMessage] = useState(null);
  const [pwdMessage, setPwdMessage] = useState(null);

  const lastLogin = useMemo(() => new Date().toLocaleDateString(), []);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const onSave = (e) => {
    e.preventDefault();
    setMessage('Saved changes successfully.');
    setTimeout(() => setMessage(null), 2500);
  };

  const onChangePassword = (e) => {
    e.preventDefault();
    setPwdMessage(null);

    if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) {
      setPwdMessage({ type: 'error', text: 'Please complete all password fields.' });
      return;
    }

    if (passwordForm.next.length < 8) {
      setPwdMessage({ type: 'error', text: 'New password must be at least 8 characters.' });
      return;
    }

    if (passwordForm.next !== passwordForm.confirm) {
      setPwdMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setPwdMessage({ type: 'success', text: 'Password changed successfully.' });
    setPasswordForm({ current: '', next: '', confirm: '' });
    setTimeout(() => setPwdMessage(null), 2500);
  };

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">🎵</div>
          <div className="brand-text">
            <div className="brand-title">Latin Dance</div>
            <div className="brand-sub">Academy</div>
          </div>
        </div>

        <nav className="side-nav">
          <SidebarItem label="Dashboard" path="/admin" location={location} />
          <SidebarItem label="Classes" path="/admin/classes" location={location} />
          <SidebarItem label="Waitlist" path="/admin/waitlist" location={location} />
          <SidebarItem label="Attendance" path="/admin/attendance" location={location} />
          <SidebarItem label="Fees & Payments" path="/admin/fees" location={location} />
          <SidebarItem label="Feedback" path="/admin/feedback" location={location} />
          <SidebarItem label="Profile" path="/admin/profile" location={location} />
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

      {/* Main Content */}
      <main className="content">
        <header className="page-header">
          <h1>Profile & Settings</h1>
          <p>Manage your account information</p>
        </header>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Profile</button>
          <button className={`tab ${activeTab === 'password' ? 'active' : ''}`} onClick={() => setActiveTab('password')}>Password</button>
        </div>

        {/* Cards */}
        {activeTab === 'profile' && (
          <section className="card">
            <h2 className="card-title">Profile Information</h2>
            <form className="form" onSubmit={onSave}>
              <label>
                <span>Full Name</span>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>
              <label>
                <span>Email Address</span>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
              <label>
                <span>Phone Number</span>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </label>
              <label>
                <span>Account Type</span>
                <input value={form.role} disabled />
              </label>

              {message && <div className="notice success">{message}</div>}

              <div className="actions">
                <button className="primary" type="submit">Save Changes</button>
              </div>
            </form>
          </section>
        )}

        {activeTab === 'password' && (
          <section className="card">
            <h2 className="card-title">Change Password</h2>
            <form className="form" onSubmit={onChangePassword}>
              <label>
                <span>Current Password</span>
                <input type="password" value={passwordForm.current} onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })} />
              </label>
              <label>
                <span>New Password</span>
                <input type="password" value={passwordForm.next} onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })} />
              </label>
              <label>
                <span>Confirm New Password</span>
                <input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} />
              </label>

              {pwdMessage && (
                <div className={`notice ${pwdMessage.type}`}>{pwdMessage.text}</div>
              )}

              <div className="actions">
                <button className="danger" type="submit">Change Password</button>
              </div>
            </form>
          </section>
        )}

        <section className="card muted">
          <h2 className="card-title">Account Information</h2>
          <div className="info-grid">
            <div>
              <div className="info-label">Account ID:</div>
              <div className="info-value">1</div>
            </div>
            <div>
              <div className="info-label">Member Since:</div>
              <div className="info-value">November 2024</div>
            </div>
            <div>
              <div className="info-label">Last Login:</div>
              <div className="info-value">{lastLogin}</div>
            </div>
          </div>
        </section>

        
      </main>
    </div>
  );
};

export default Profile;
