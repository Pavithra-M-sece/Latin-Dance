import React from 'react';
import '../HomePage.css';

const Privacy = () => {
  return (
    <div className="home-container">
      <div style={{ maxWidth: 900, margin: '2rem auto', padding: '2rem 1rem', color: '#e9e9f0' }}>
      <h1 style={{ color: '#fff' }}>Privacy Policy</h1>
      <p>Your privacy matters to us. This policy explains how we collect and use your information.</p>
      <h3>1. Data We Collect</h3>
      <p>We collect account details like name, email, and activity related to classes and payments.</p>
      <h3>2. How We Use Data</h3>
      <p>To operate the platform, improve our services, and communicate with you.</p>
      <h3>3. Sharing</h3>
      <p>We do not sell your data. We may share with service providers who help run the platform.</p>
      <h3>4. Security</h3>
      <p>We use reasonable safeguards to protect your data.</p>
      <h3>5. Your Rights</h3>
      <p>You may request access, correction, or deletion of your data, subject to applicable law.</p>
      </div>
    </div>
  );
};

export default Privacy;
