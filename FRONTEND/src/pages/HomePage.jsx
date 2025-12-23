
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield } from 'lucide-react';
import './HomePage.css';
import PublicNav from '../components/PublicNav';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <PublicNav />
      <div className="home-content">
        <div className="brand-section">
          <div className="brand-icon">🎵</div>
          <h1>Latin Dance Academy</h1>
          <p>Step Into the Rhythm of Latin Dance</p>
          <div className="hero-action">
            <button className="btn-signup" onClick={() => navigate('/signup')}>
              Sign Up Now
            </button>
          </div>
        </div>

        <div className="login-options">
          <button 
            className="login-card student"
            onClick={() => navigate('/login?role=student')}
          >
            <User size={32} />
            <h3>Student Login</h3>
            <p>Access your classes and payments</p>
          </button>

          <button 
            className="login-card admin"
            onClick={() => navigate('/login?role=admin')}
          >
            <Shield size={32} />
            <h3>Admin Login</h3>
            <p>Manage students and classes</p>
          </button>
        </div>

        <footer className="home-footer-simple">
          <p>&copy; 2025 Latin Dance Academy. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;