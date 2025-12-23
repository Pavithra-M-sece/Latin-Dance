import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Info, Phone, Menu } from 'lucide-react';
import '../pages/HomePage.css';

const PublicNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  return (
    <nav className="public-nav">
      <div className="nav-brand">
        <span className="nav-icon">🎵</span>
        <span>Latin Dance Academy</span>
      </div>
      <button className="nav-hamburger" onClick={() => setMenuOpen(m => !m)} aria-label="Open menu">
        <Menu size={28} />
      </button>
      <div className={`nav-links${menuOpen ? ' open' : ''}`}>
        <Link to="/" className={`nav-link${location.pathname === '/' ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><Home size={16} /> Home</Link>
        <Link to="/about" className={`nav-link${location.pathname === '/about' ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><Info size={16} /> About Us</Link>
        <Link to="/contact" className={`nav-link${location.pathname === '/contact' ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><Phone size={16} /> Contact</Link>
      </div>
    </nav>
  );
};

export default PublicNav;
