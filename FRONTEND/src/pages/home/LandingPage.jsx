import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, LayoutDashboard, ArrowRight } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <div className="landing-hero">
        <div className="hero-content">
          <div className="brand-showcase">
            <div className="brand-icon-large">🎵</div>
            <h1 className="hero-title">Latin Dance Academy</h1>
            <p className="hero-subtitle">Step Into the Rhythm of Latin Dance</p>
          </div>

          <div className="hero-description">
            <p>Welcome to our exclusive Latin Dance platform. Please select your role to continue.</p>
          </div>

          <div className="role-selection">
            {/* Student Card */}
            <div className="role-card student-card">
              <div className="role-icon">
                <Users size={48} />
              </div>
              <h2 className="role-title">Student</h2>
              <p className="role-description">
                Browse classes, enroll in courses, manage payments, and share your feedback with instructors.
              </p>
              <ul className="role-features">
                <li>✓ Browse available classes</li>
                <li>✓ Enroll and manage enrollment</li>
                <li>✓ Track payments</li>
                <li>✓ Submit feedback</li>
              </ul>
              <button
                className="role-btn student-btn"
                onClick={() => navigate('/login?role=student')}
              >
                Student Login
                <ArrowRight size={20} />
              </button>
            </div>

            {/* Admin Card */}
            <div className="role-card admin-card">
              <div className="role-icon">
                <LayoutDashboard size={48} />
              </div>
              <h2 className="role-title">Admin</h2>
              <p className="role-description">
                Manage classes, track attendance, handle waitlists, process payments, and review feedback.
              </p>
              <ul className="role-features">
                <li>✓ Manage classes</li>
                <li>✓ Track attendance</li>
                <li>✓ Manage waitlists</li>
                <li>✓ Process payments</li>
              </ul>
              <button
                className="role-btn admin-btn"
                onClick={() => navigate('/login?role=admin')}
              >
                Admin Login
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          <div className="landing-footer">
            <p>Use demo credentials to test the platform</p>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="decorative-circle circle-1"></div>
      <div className="decorative-circle circle-2"></div>
      <div className="decorative-circle circle-3"></div>
    </div>
  );
};

export default LandingPage;
