import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

const GRADIENTS = [
  'linear-gradient(135deg,#22c55e,#10b981)',
  'linear-gradient(135deg,#3b82f6,#6366f1)',
  'linear-gradient(135deg,#ec4899,#a855f7)',
  'linear-gradient(135deg,#f97316,#eab308)',
  'linear-gradient(135deg,#ef4444,#f97316)',
  'linear-gradient(135deg,#eab308,#22c55e)',
];

export default function NGOs() {
  const [ngos, setNgos] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => { API.get('/ngos').then(r => { setNgos(r.data); setVisible(true); }).catch(() => {}); }, []);

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div style={S.blob1} /><div style={S.blob2} />
        <div style={S.headerContent}>
          <span style={S.pill}>🏢 Partners</span>
          <h1 style={S.title}>Our NGO Partners</h1>
          <p style={S.sub}>Verified organizations making a real difference around the world.</p>
        </div>
      </div>

      <div style={S.body}>
        {ngos.length === 0 ? (
          <div style={S.empty} className="fade-up">
            <div style={S.emptyIcon}>🏢</div>
            <h3 style={S.emptyTitle}>No NGOs registered yet</h3>
            <p style={S.emptySub}>Be the first to register your organization.</p>
            <Link to="/register" style={S.registerBtn}>Register as NGO →</Link>
          </div>
        ) : (
          <div style={S.grid}>
            {ngos.map((ngo, i) => {
              const grad = GRADIENTS[i % GRADIENTS.length];
              return (
                <div
                  key={ngo._id}
                  style={{
                    ...S.card,
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(30px)',
                    transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
                  }}
                  className="lift"
                >
                  <div style={{ ...S.cardTop, background: grad }}>
                    <div style={S.avatar}>{ngo.name[0].toUpperCase()}</div>
                    <div style={S.verifiedBadge}>✓ Verified</div>
                  </div>
                  <div style={S.cardBody}>
                    <h3 style={S.name}>{ngo.name}</h3>
                    <p style={S.email}>📧 {ngo.email}</p>
                    <div style={S.cardFooter}>
                      <Link to={`/causes?ngo=${ngo._id}`} style={{ ...S.btn, background: grad }}>
                        View Causes →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  page: { background: '#f1f5f9', minHeight: '100vh' },
  header: {
    position: 'relative', overflow: 'hidden',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0a1a0f 100%)',
    padding: '64px 48px 52px', color: '#fff', textAlign: 'center',
  },
  blob1: { position: 'absolute', width: '350px', height: '350px', borderRadius: '50%', background: '#a855f7', filter: 'blur(100px)', opacity: 0.12, top: '-80px', right: '-40px', animation: 'float 6s ease-in-out infinite' },
  blob2: { position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: '#22c55e', filter: 'blur(100px)', opacity: 0.1, bottom: '-60px', left: '-30px', animation: 'float 8s ease-in-out infinite reverse' },
  headerContent: { position: 'relative', maxWidth: '560px', margin: '0 auto' },
  pill: {
    display: 'inline-block', background: 'rgba(168,85,247,0.2)', color: '#d8b4fe',
    border: '1px solid rgba(168,85,247,0.3)', padding: '5px 16px', borderRadius: '20px',
    fontSize: '0.78rem', fontWeight: 700, marginBottom: '16px',
  },
  title: { fontSize: '2.4rem', fontWeight: 900, marginBottom: '10px', letterSpacing: '-0.5px' },
  sub: { color: '#94a3b8', fontSize: '0.95rem' },
  body: { padding: '48px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' },
  card: { background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  cardTop: { height: '100px', position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '0' },
  avatar: {
    width: '72px', height: '72px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)',
    border: '3px solid rgba(255,255,255,0.5)',
    color: '#fff', fontSize: '2rem', fontWeight: 900,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'absolute', bottom: '-36px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
  },
  verifiedBadge: {
    position: 'absolute', top: '12px', right: '12px',
    background: 'rgba(255,255,255,0.2)', color: '#fff',
    padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
    backdropFilter: 'blur(8px)',
  },
  cardBody: { padding: '48px 24px 24px', textAlign: 'center' },
  name: { fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' },
  email: { color: '#94a3b8', fontSize: '0.82rem', marginBottom: '20px' },
  cardFooter: {},
  btn: { display: 'inline-block', color: '#fff', padding: '9px 22px', borderRadius: '10px', fontWeight: 700, fontSize: '0.88rem', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' },
  empty: { textAlign: 'center', padding: '80px 20px' },
  emptyIcon: { fontSize: '3.5rem', marginBottom: '16px', animation: 'float 3s ease-in-out infinite', display: 'block' },
  emptyTitle: { fontSize: '1.3rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' },
  emptySub: { color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' },
  registerBtn: { display: 'inline-block', background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', padding: '11px 26px', borderRadius: '10px', fontWeight: 700, boxShadow: '0 4px 16px rgba(34,197,94,0.35)' },
};
