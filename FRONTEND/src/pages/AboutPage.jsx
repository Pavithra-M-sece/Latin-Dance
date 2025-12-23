import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, Award } from 'lucide-react';
import './HomePage.css';
import PublicNav from '../components/PublicNav';

const AboutPage = () => {
  return (
    <div className="home-container">
      <PublicNav />

      <div className="page-content">
        <div className="about-hero">
          <h1>About Latin Dance Academy</h1>
          <p>Passionate about Latin dance since 2010</p>
        </div>

        <div className="about-sections">
          <section className="about-section">
            <div className="section-icon">
              <Star size={32} />
            </div>
            <h3>Our Mission</h3>
            <p>To share the joy and passion of Latin dance with students of all levels, creating a vibrant community where everyone can express themselves through movement and rhythm.</p>
          </section>

          <section className="about-section">
            <div className="section-icon">
              <Users size={32} />
            </div>
            <h3>Our Community</h3>
            <p>Join over 500+ students who have discovered their love for Latin dance. From beginners to advanced dancers, we welcome everyone to our inclusive dance family.</p>
          </section>

          <section className="about-section">
            <div className="section-icon">
              <Award size={32} />
            </div>
            <h3>Expert Instructors</h3>
            <p>Learn from certified professionals with years of experience in Salsa, Bachata, Cha-Cha, and Rumba. Our instructors are passionate about helping you achieve your dance goals.</p>
          </section>
        </div>

        <div className="values-section">
          <h2 className="values-title">What We Offer</h2>
          <div className="values-grid">
            <div className="value-item">
              <h4>🎵 Multiple Dance Styles</h4>
              <p>Salsa, Bachata, Cha-Cha, Rumba, and more</p>
            </div>
            <div className="value-item">
              <h4>📅 Flexible Scheduling</h4>
              <p>Classes throughout the week to fit your schedule</p>
            </div>
            <div className="value-item">
              <h4>👥 Small Class Sizes</h4>
              <p>Personalized attention from expert instructors</p>
            </div>
            <div className="value-item">
              <h4>🎉 Social Events</h4>
              <p>Regular dance socials and performances</p>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <h2>Ready to Start Dancing?</h2>
          <div className="cta-buttons">
            <Link to="/signup" className="cta-btn primary">Sign Up Now</Link>
            <Link to="/contact" className="cta-btn secondary">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;