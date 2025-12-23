import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LogIn, ArrowLeft } from 'lucide-react';
import { authAPI } from '../../utils/api.js';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roleParam = searchParams.get('role');
  const registeredParam = searchParams.get('registered');
  const [selectedRole, setSelectedRole] = useState(roleParam || 'student');

  useEffect(() => {
    if (registeredParam) {
      setSuccess('Account created successfully! Please login with your credentials.');
    }
  }, [registeredParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    if (!agreed) {
      setError('You must agree to the Terms & Privacy');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.login({ email, password });
      
      console.log('Login response:', response);
      
      // Store token and user info
      localStorage.setItem('token', response.token);
      localStorage.setItem('userEmail', response.user.email);
      localStorage.setItem('userId', response.user._id || response.user.id);
      localStorage.setItem('userRole', response.user.role);
      localStorage.setItem('userName', response.user.name);

      // Navigate based on role
      if (response.user.role === 'admin') {
        navigate('/admin');
      } else if (response.user.role === 'instructor') {
        navigate('/instructor');
      } else if (response.user.role === 'student') {
        navigate('/student');
      } else {
        setError('Unknown role. Please contact support.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <button className="auth-hamburger" onClick={() => navigate('/')} aria-label="Open menu">
        <span style={{fontSize: '2rem', lineHeight: 1}}>&#9776;</span>
      </button>
      <div className="auth-image">
        <div className="auth-overlay">
          <div className="hero-icons" aria-hidden>
            <span>🎵</span>
            <span>✨</span>
          </div>
          <h1>Latin Dance Academy</h1>
          <p>Step Into the Rhythm<br/>of Latin Dance</p>
        </div>
      </div>
      <div className="auth-form-container">
        <div className="auth-form">
          <div className="auth-header">
            {roleParam && (
              <button
                type="button"
                onClick={() => navigate('/')}
                className="back-btn"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <LogIn size={48} color="var(--deep-red)" />
            <h2>Welcome Back</h2>
            <p>Sign in as {selectedRole} to continue</p>
            {roleParam && (
              <div className="role-indicator">
                <span className={`role-badge ${selectedRole}`}>
                  {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
                </span>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="change-role-link"
                >
                  Change role
                </button>
              </div>
            )}
          </div>

          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <div className="form-links" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', color: '#c9c9d1' }}>
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                Remember me
              </label>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <div className="terms-box">
              <label className="checkbox-label">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                <span>
                  I agree to the <Link to="/terms">Terms & Conditions</Link> and <Link to="/privacy">Privacy Policy</Link>
                </span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
          </div>

          <div className="demo-info">
            <p><strong>Demo Accounts:</strong></p>
            {selectedRole === 'admin' && (
              <>
                <p>Admin: admin@latindance.com</p>
                <p>Password: admin123</p>
              </>
            )}
            {selectedRole === 'student' && (
              <p>Create a student account or register first</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
