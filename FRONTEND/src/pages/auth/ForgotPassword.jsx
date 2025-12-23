import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  };

  return (
    <div className="auth-container">
      <div className="auth-image">
        <div className="auth-overlay">
          <h1>Latin Dance Academy</h1>
          <p>Reset your password securely</p>
        </div>
      </div>
      <div className="auth-form-container">
        <div className="auth-form">
          <div className="auth-header">
            <Mail size={48} color="var(--deep-red)" />
            <h2>Forgot Password</h2>
            <p>We'll send you a reset link</p>
          </div>

          {sent ? (
            <div className="alert" style={{ background: 'rgba(50, 200, 120, 0.1)', color: '#88e0a3', border: '1px solid rgba(50, 200, 120, 0.3)', marginBottom: '1rem' }}>
              If an account exists for <strong>{email}</strong>, a reset link has been sent.
            </div>
          ) : null}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full">
              Send Reset Link
            </button>
          </form>

          <div className="auth-footer">
            <p>Remembered your password? <Link to="/login">Back to Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
