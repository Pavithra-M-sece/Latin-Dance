import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../../utils/api.js';
import './Auth.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  const selectedRole = (roleParam === 'admin' || roleParam === 'student') ? roleParam : 'student';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !phone || !password || !confirm) return setError('Please fill in all fields');
    if (password !== confirm) return setError('Passwords do not match');
    if (!agreed) return setError('You must agree to the Terms & Privacy');

    setLoading(true);
    try {
      await authAPI.register({ name, email, phone, password, role: selectedRole });

      // Account created successfully, redirect to login page
      navigate('/login?registered=true');
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <button className="auth-hamburger" onClick={() => navigate('/')} aria-label="Open menu">
        <span style={{fontSize: '2rem', lineHeight: 1}}>&#9776;</span>
      </button>
      <div className="auth-image" style={{ backgroundImage: 'linear-gradient(135deg, rgba(255, 140, 66, 0.85), rgba(128, 0, 32, 0.85)), url(/signup.jpg)' }}>
        <div className="auth-overlay">
          <div className="hero-icons">
            <span>✨</span>
            <span>🎵</span>
          </div>
          <h1>Join Our Community</h1>
          <p>Feel the Rhythm<br />Master the Movement</p>
        </div>
      </div>
      <div className="auth-form-container">
        <div className="auth-form">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>{selectedRole === 'admin' ? 'Admin access for managing classes' : 'Join the rhythm revolution'}</p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>

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
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-input"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
              />
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
