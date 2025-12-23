import { useMemo, useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { studentAPI, feedbackAPI, enrollmentAPI } from '../../utils/api.js';
import StudentSidebar from '../../components/StudentSidebar.jsx';
import './StudentDashboard.css';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Student',
  });

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    next: '',
    confirm: '',
  });

  const [feedbackForm, setFeedbackForm] = useState({
    className: '',
    rating: 5,
    comment: '',
  });

  const [message, setMessage] = useState(null);
  const [pwdMessage, setPwdMessage] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [attendedClasses, setAttendedClasses] = useState([]);

  const studentId = localStorage.getItem('userId');
  const lastLogin = useMemo(() => new Date().toLocaleDateString(), []);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const studentData = await studentAPI.getProfile(studentId);
        setForm({
          name: studentData.name,
          email: studentData.email,
          phone: studentData.phone || '',
          role: 'Student',
        });

        // Pull only the classes this student is actually enrolled in
        const enrollments = await enrollmentAPI.getStudentEnrollments(studentId);
        const activeClasses = enrollments
          .filter((e) => !e.isWaitlisted && e.status !== 'Dropped')
          .map((e) => e.class)
          .filter(Boolean);
        setAttendedClasses(activeClasses);
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };

    if (studentId) {
      fetchProfileData();
    }
  }, [studentId]);

  if (!studentId) {
    return (
      <div className="student-shell">
        <main className="student-content">
          <div className="notice error">Error: User not logged in. Please log in again.</div>
        </main>
      </div>
    );
  }

  const onSave = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      await studentAPI.updateProfile(studentId, {
        name: form.name,
        email: form.email,
        phone: form.phone,
      });
      setMessage({ type: 'success', text: 'Saved changes successfully.' });
      setTimeout(() => setMessage(null), 2500);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to save changes.' });
      setTimeout(() => setMessage(null), 2500);
    }
  };

  const onChangePassword = async (e) => {
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

    try {
      await studentAPI.changePassword(studentId, {
        currentPassword: passwordForm.current,
        newPassword: passwordForm.next,
      });
      setPwdMessage({ type: 'success', text: 'Password changed successfully.' });
      setPasswordForm({ current: '', next: '', confirm: '' });
      setTimeout(() => setPwdMessage(null), 2500);
    } catch (err) {
      setPwdMessage({ type: 'error', text: err.message || 'Failed to change password.' });
      setTimeout(() => setPwdMessage(null), 2500);
    }
  };

  const onSubmitFeedback = async (e) => {
    e.preventDefault();
    setFeedbackMessage(null);

    if (!feedbackForm.className || !feedbackForm.comment.trim()) {
      setFeedbackMessage({ type: 'error', text: 'Please select a class and enter your feedback.' });
      return;
    }

    const selectedClass = attendedClasses.find((c) => c._id === feedbackForm.className);
    if (!selectedClass) {
      setFeedbackMessage({ type: 'error', text: 'Selected class was not found. Please refresh and try again.' });
      return;
    }

    const instructorId = selectedClass.instructor?._id || selectedClass.instructor;
    if (!instructorId) {
      setFeedbackMessage({ type: 'error', text: 'Instructor information is missing for this class.' });
      return;
    }

    try {
      await feedbackAPI.submit({
        class: feedbackForm.className,
        instructor: instructorId,
        student: studentId,
        rating: feedbackForm.rating,
        comment: feedbackForm.comment,
      });
      setFeedbackMessage({ type: 'success', text: 'Feedback submitted successfully.' });
      setFeedbackForm({ className: '', rating: 5, comment: '' });
      setTimeout(() => setFeedbackMessage(null), 2500);
    } catch (err) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Failed to submit feedback.' });
      setTimeout(() => setFeedbackMessage(null), 2500);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={20}
          className={`star-icon ${i <= rating ? 'filled' : ''}`}
          fill={i <= rating ? '#fbbf24' : 'none'}
          stroke={i <= rating ? '#fbbf24' : '#cbd5e1'}
          style={{ cursor: 'pointer' }}
          onClick={() => setFeedbackForm({ ...feedbackForm, rating: i })}
        />
      );
    }
    return stars;
  };

  return (
    <div className="student-shell">
      <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="student-content">
        <header className="page-header">
          <h1>Profile & Settings</h1>
          <p>Manage your account information</p>
        </header>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Profile</button>
          <button className={`tab ${activeTab === 'password' ? 'active' : ''}`} onClick={() => setActiveTab('password')}>Password</button>
        </div>

        {/* Profile Tab */}
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

              {message && <div className={`notice ${message.type}`}>{message.text}</div>}

              <div className="actions">
                <button className="primary" type="submit">Save Changes</button>
              </div>
            </form>
          </section>
        )}

        {/* Password Tab */}
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
              <div className="info-label">Student ID:</div>
              <div className="info-value">STU001</div>
            </div>
            <div>
              <div className="info-label">Member Since:</div>
              <div className="info-value">October 2024</div>
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
