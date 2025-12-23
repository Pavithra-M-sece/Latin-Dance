import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <header className="home-header">
        <div className="brand">
          <span className="logo">💃</span>
          <span className="title">Latin Dance Academy</span>
        </div>
        <nav className="nav">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/signup" className="btn-ghost">Sign up</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h1>Feel the Rhythm. Master the Movement.</h1>
          <p>Discipline, energy and community meet modern Latin studio training.
            Learn Salsa, Bachata, Cha-Cha, Rumba and Samba with world‑class instructors.</p>
          <div className="cta">
            <Link to="/login" className="btn-primary">Join a Class</Link>
            <a href="#programs" className="btn-outline">Explore Programs</a>
          </div>
        </div>
      </section>

      <section id="programs" className="programs">
        <div className="programs-grid">
          <div className="card">
            <h3>Salsa</h3>
            <p>Dynamic footwork, strong lead & follow, and rhythm confidence.</p>
          </div>
          <div className="card">
            <h3>Bachata</h3>
            <p>Smooth body movement and musicality with modern partnerwork.</p>
          </div>
          <div className="card">
            <h3>Cha‑Cha</h3>
            <p>Sharp timing and crisp action for elegant, confident dancers.</p>
          </div>
          <div className="card">
            <h3>Rumba</h3>
            <p>Expressive lines and controlled technique inspired by classic Latin.</p>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="links">
          <Link to="/terms">Terms & Conditions</Link>
          <span className="dot" />
          <Link to="/privacy">Privacy Policy</Link>
          <span className="dot" />
          <a href="#contact">Contact Us</a>
        </div>
        <p className="copyright">© {new Date().getFullYear()} Latin Dance Academy</p>
      </footer>
    </div>
  );
};

export default Home;
