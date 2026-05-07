import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      login(data.token, data.user);
      navigate(data.user.role === 'ngo' ? '/dashboard' : '/causes');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>
      {/* Left panel */}
      <div style={styles.left}>
        <div style={styles.leftContent}>
          <div style={styles.leftLogo}>💚 Charitex</div>
          <h2 style={styles.leftTitle}>Every donation<br />changes a life.</h2>
          <p style={styles.leftSub}>Join thousands of donors making a real difference around the world.</p>
          <div style={styles.leftStats}>
            {[['6+', 'Active Causes'], ['$200K+', 'Raised'], ['3+', 'NGOs']].map(([v, l]) => (
              <div key={l} style={styles.leftStat}>
                <strong style={styles.leftStatVal}>{v}</strong>
                <span style={styles.leftStatLabel}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.title}>Welcome back 👋</h2>
          <p style={styles.cardSub}>Sign in to continue your impact journey.</p>

          {error && <div style={styles.error}>⚠️ {error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Email address</label>
              <input
                style={styles.input} type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input} type="password" placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required
              />
            </div>
            <button type="submit" style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p style={styles.footer}>
            Don't have an account? <Link to="/register" style={styles.footerLink}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex' },
  left: {
    flex: 1, background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f2a1a 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '60px 48px', position: 'relative', overflow: 'hidden',
  },
  leftContent: { maxWidth: '380px', color: '#fff' },
  leftLogo: { color: '#22c55e', fontSize: '1.3rem', fontWeight: 800, marginBottom: '40px' },
  leftTitle: { fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.2, marginBottom: '16px', letterSpacing: '-0.5px' },
  leftSub: { color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '40px' },
  leftStats: { display: 'flex', gap: '32px' },
  leftStat: { display: 'flex', flexDirection: 'column', gap: '4px' },
  leftStatVal: { fontSize: '1.6rem', fontWeight: 800, color: '#22c55e' },
  leftStatLabel: { fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' },
  right: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '40px 48px', background: '#f8fafc',
  },
  card: { width: '100%', maxWidth: '420px' },
  title: { fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' },
  cardSub: { color: '#94a3b8', fontSize: '0.9rem', marginBottom: '28px' },
  error: {
    background: '#fff1f2', color: '#e11d48', padding: '12px 16px',
    borderRadius: '10px', marginBottom: '20px', fontSize: '0.88rem',
    border: '1px solid #fecdd3',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '0.82rem', fontWeight: 600, color: '#475569' },
  input: {
    padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #e2e8f0',
    fontSize: '0.95rem', outline: 'none', transition: 'border 0.2s',
    background: '#fff', color: '#0f172a',
  },
  btn: {
    background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff',
    padding: '13px', borderRadius: '10px', border: 'none',
    fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(34,197,94,0.35)', marginTop: '4px',
  },
  footer: { textAlign: 'center', marginTop: '24px', color: '#94a3b8', fontSize: '0.88rem' },
  footerLink: { color: '#22c55e', fontWeight: 600 },
};
