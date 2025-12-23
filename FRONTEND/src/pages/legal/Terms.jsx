import React from 'react';
import '../HomePage.css';

const Terms = () => {
  return (
    <div className="home-container">
      <div style={{ maxWidth: 900, margin: '2rem auto', padding: '2rem 1rem', color: '#e9e9f0' }}>
      <h1 style={{ color: '#fff' }}>Terms & Conditions</h1>
      <p>Welcome to Latin Dance Academy. By using our website and services, you agree to the following terms.</p>
      <h3>1. Use of Service</h3>
      <p>Our platform is provided for managing dance classes, schedules, and payments. You agree not to misuse the platform.</p>
      <h3>2. Accounts</h3>
      <p>You are responsible for maintaining the confidentiality of your account credentials.</p>
      <h3>3. Payments</h3>
      <p>All payments are processed securely. Fees are non-refundable unless required by law.</p>
      <h3>4. Content</h3>
      <p>Do not upload illegal, harmful, or infringing content.</p>
      <h3>5. Changes</h3>
      <p>We may update these terms from time to time. Continued use means you accept the updates.</p>
      </div>
    </div>
  );
};

export default Terms;
