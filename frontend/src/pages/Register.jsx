import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'donor' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await API.post('/auth/register', form);
      login(data.token, data.user);
      navigate(data.user.role === 'ngo' ? '/dashboard' : '/causes');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>
      {/* Left panel */}
      <div style={styles.left}>
        <div style={styles.leftContent}>
          <div style={styles.leftLogo}>💚 Charitex</div>
          <h2 style={styles.leftTitle}>Start your<br />giving journey.</h2>
          <p style={styles.leftSub}>Create an account to donate to causes you care about or register your NGO to reach more donors.</p>
          <div style={styles.roleCards}>
            <div style={{ ...styles.roleCard, ...(form.role === 'donor' ? styles.roleCardActive : {}) }}>
              <span style={styles.roleIcon}>🤝</span>
              <div>
                <div style={styles.roleTitle}>Donor</div>
                <div style={styles.roleDesc}>Browse & donate to causes</div>
              </div>
            </div>
            <div style={{ ...styles.roleCard, ...(form.role === 'ngo' ? styles.roleCardActive : {}) }}>
              <span style={styles.roleIcon}>🏢</span>
              <div>
                <div style={styles.roleTitle}>NGO</div>
                <div style={styles.roleDesc}>Create & manage causes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.title}>Create account ✨</h2>
          <p style={styles.cardSub}>Fill in your details to get started.</p>

          {error && <div style={styles.error}>⚠️ {error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input style={styles.input} placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email address</label>
              <input style={styles.input} type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input style={styles.input} type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>I am registering as</label>
              <div style={styles.roleToggle}>
                {['donor', 'ngo'].map(r => (
                  <button
                    key={r} type="button"
                    onClick={() => setForm({ ...form, role: r })}
                    style={{ ...styles.toggleBtn, ...(form.role === r ? styles.toggleBtnActive : {}) }}
                  >
                    {r === 'donor' ? '🤝 Donor' : '🏢 NGO / Organization'}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p style={styles.footer}>
            Already have an account? <Link to="/login" style={styles.footerLink}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex' },
  left: {
    flex: 1, background: 'linear-gradient(135deg, #0f172a 0%, #1a2e1a 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '60px 48px',
  },
  leftContent: { maxWidth: '380px', color: '#fff' },
  leftLogo: { color: '#22c55e', fontSize: '1.3rem', fontWeight: 800, marginBottom: '40px' },
  leftTitle: { fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.2, marginBottom: '16px', letterSpacing: '-0.5px' },
  leftSub: { color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '32px' },
  roleCards: { display: 'flex', flexDirection: 'column', gap: '12px' },
  roleCard: {
    display: 'flex', alignItems: 'center', gap: '14px',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px', padding: '14px 18px', transition: 'all 0.2s',
  },
  roleCardActive: { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' },
  roleIcon: { fontSize: '1.6rem' },
  roleTitle: { fontWeight: 700, fontSize: '0.9rem', color: '#fff' },
  roleDesc: { fontSize: '0.78rem', color: '#64748b' },
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
    fontSize: '0.95rem', outline: 'none', background: '#fff', color: '#0f172a',
  },
  roleToggle: { display: 'flex', gap: '10px' },
  toggleBtn: {
    flex: 1, padding: '10px', borderRadius: '10px', border: '1.5px solid #e2e8f0',
    background: '#fff', color: '#475569', fontSize: '0.85rem', fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.2s',
  },
  toggleBtnActive: {
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    color: '#fff', border: '1.5px solid transparent',
    boxShadow: '0 2px 10px rgba(34,197,94,0.3)',
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
