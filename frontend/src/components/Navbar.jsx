import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };
  const active = (p) => location.pathname === p;

  return (
    <nav style={{ ...S.nav, ...(scrolled ? S.scrolled : {}) }}>
      <Link to="/" style={S.brand}>
        <span style={S.brandIcon}>💚</span>
        <span style={S.brandText}>Charitex</span>
      </Link>

      <div style={S.links}>
        {[['/', '🏠 Home'], ['/causes', '🎯 Causes'], ['/ngos', '🏢 NGOs']].map(([path, label]) => (
          <Link key={path} to={path} style={{ ...S.link, ...(active(path) ? S.activeLink : {}) }}>
            {label}
            {active(path) && <span style={S.activeDot} />}
          </Link>
        ))}

        {user ? (
          <>
            {user.role === 'ngo' && (
              <Link to="/dashboard" style={{ ...S.link, ...(active('/dashboard') ? S.activeLink : {}) }}>
                📊 Dashboard
                {active('/dashboard') && <span style={S.activeDot} />}
              </Link>
            )}
            <div style={S.chip}>
              <div style={S.avatar}>{user.name[0].toUpperCase()}</div>
              <span style={S.chipName}>{user.name.split(' ')[0]}</span>
            </div>
            <button onClick={handleLogout} style={S.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ ...S.link, ...(active('/login') ? S.activeLink : {}) }}>Login</Link>
            <Link to="/register" style={S.ctaBtn}>✨ Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const S = {
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 48px',
    background: 'rgba(10,15,30,0.92)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    position: 'sticky', top: 0, zIndex: 1000,
    transition: 'all 0.3s ease',
  },
  scrolled: {
    padding: '10px 48px',
    boxShadow: '0 4px 32px rgba(0,0,0,0.4)',
    background: 'rgba(10,15,30,0.98)',
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: '8px',
    textDecoration: 'none',
  },
  brandIcon: { fontSize: '1.5rem', animation: 'float 3s ease-in-out infinite' },
  brandText: {
    fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.5px',
    background: 'linear-gradient(135deg, #22c55e, #4ade80, #86efac)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  links: { display: 'flex', alignItems: 'center', gap: '4px' },
  link: {
    position: 'relative', color: '#94a3b8', fontSize: '0.88rem', fontWeight: 500,
    padding: '8px 14px', borderRadius: '8px',
    transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
  },
  activeLink: { color: '#22c55e', background: 'rgba(34,197,94,0.1)' },
  activeDot: {
    width: '4px', height: '4px', borderRadius: '50%', background: '#22c55e',
    animation: 'bounceIn 0.4s ease',
  },
  chip: {
    display: 'flex', alignItems: 'center', gap: '8px',
    background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(59,130,246,0.1))',
    border: '1px solid rgba(34,197,94,0.25)',
    padding: '6px 14px', borderRadius: '20px',
  },
  avatar: {
    width: '26px', height: '26px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    color: '#fff', fontSize: '0.75rem', fontWeight: 800,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 0 0 2px rgba(34,197,94,0.3)',
  },
  chipName: { color: '#4ade80', fontSize: '0.85rem', fontWeight: 600 },
  logoutBtn: {
    background: 'transparent', border: '1.5px solid rgba(239,68,68,0.4)',
    color: '#f87171', padding: '7px 14px', borderRadius: '8px',
    cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
    transition: 'all 0.2s',
  },
  ctaBtn: {
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    color: '#fff', padding: '9px 20px', borderRadius: '10px',
    fontWeight: 700, fontSize: '0.88rem',
    boxShadow: '0 0 20px rgba(34,197,94,0.4)',
    transition: 'all 0.2s', animation: 'pulse-ring 2.5s infinite',
  },
};
