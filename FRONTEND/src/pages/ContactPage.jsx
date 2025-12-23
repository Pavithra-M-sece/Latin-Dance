import React, { useState } from 'react';
import { Mail, MapPin, Clock, Phone } from 'lucide-react';
import { contactAPI } from '../utils/api.js';
import './HomePage.css';
import PublicNav from '../components/PublicNav';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await contactAPI.create(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="home-container">
      <PublicNav />

      <div className="page-content">
        <div className="contact-hero">
          <h1>Contact Us</h1>
          <p>Get in touch with our team</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <h3>Get In Touch</h3>
            
            <div className="contact-item">
              <Mail size={20} />
              <div>
                <strong>Email</strong>
                <p>info@latindance.com</p>
              </div>
            </div>

            <div className="contact-item">
              <Phone size={20} />
              <div>
                <strong>Phone</strong>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="contact-item">
              <MapPin size={20} />
              <div>
                <strong>Address</strong>
                <p>123 Dance Street<br />Music City, MC 12345</p>
              </div>
            </div>

            <div className="contact-item">
              <Clock size={20} />
              <div>
                <strong>Hours</strong>
                <p>Mon-Fri: 6:00 PM - 10:00 PM<br />Sat-Sun: 2:00 PM - 8:00 PM</p>
              </div>
            </div>
          </div>

          <div className="contact-form">
            <h3>Send Message</h3>
            
            {success && (
              <div className="alert alert-success">
                Thank you for your message! We will get back to you soon.
              </div>
            )}
            
            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;