import React, { useEffect, useState } from 'react';
import API from '../api';
import CauseCard from '../components/CauseCard';

const CATS = [
  { label: 'All',            icon: '🌐', color: '#6366f1' },
  { label: 'Education',      icon: '📚', color: '#3b82f6' },
  { label: 'Health',         icon: '❤️', color: '#ec4899' },
  { label: 'Environment',    icon: '🌿', color: '#22c55e' },
  { label: 'Food',           icon: '🍽️', color: '#f97316' },
  { label: 'Disaster Relief',icon: '🆘', color: '#ef4444' },
  { label: 'Animal Welfare', icon: '🐾', color: '#eab308' },
];

export default function Causes() {
  const [causes, setCauses] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    API.get('/causes', { params }).then(r => { setCauses(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [search, category]);

  const activeCat = CATS.find(c => c.label === category || (category === '' && c.label === 'All'));

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div style={S.blob1} /><div style={S.blob2} />
        <div style={S.headerContent}>
          <span style={S.pill}>🎯 All Causes</span>
          <h1 style={S.title}>Browse & Support Causes</h1>
          <p style={S.sub}>Find a cause that resonates with you and make a lasting impact.</p>
          <div style={S.searchWrap}>
            <span style={S.searchIcon}>🔍</span>
            <input
              placeholder="Search causes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={S.searchInput}
            />
            {search && (
              <button onClick={() => setSearch('')} style={S.clearBtn}>✕</button>
            )}
          </div>
        </div>
      </div>

      <div style={S.body}>
        {/* Category pills */}
        <div style={S.catRow}>
          {CATS.map(c => {
            const isActive = (c.label === 'All' && category === '') || category === c.label;
            return (
              <button
                key={c.label}
                onClick={() => setCategory(c.label === 'All' ? '' : c.label)}
                style={{
                  ...S.catPill,
                  ...(isActive ? { background: c.color, color: '#fff', border: `1.5px solid ${c.color}`, boxShadow: `0 4px 16px ${c.color}44` } : {}),
                }}
              >
                {c.icon} {c.label}
              </button>
            );
          })}
        </div>

        {!loading && (
          <p style={S.resultCount}>
            <span style={{ color: activeCat?.color, fontWeight: 700 }}>{causes.length}</span> cause{causes.length !== 1 ? 's' : ''} found
            {category ? ` in ${category}` : ''}{search ? ` for "${search}"` : ''}
          </p>
        )}

        {loading ? (
          <div style={S.grid}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '380px' }} />
            ))}
          </div>
        ) : causes.length === 0 ? (
          <div style={S.empty} className="fade-up">
            <div style={S.emptyIcon}>🔎</div>
            <h3 style={S.emptyTitle}>No causes found</h3>
            <p style={S.emptySub}>Try a different search or category.</p>
            <button onClick={() => { setSearch(''); setCategory(''); }} style={S.resetBtn}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={S.grid}>
            {causes.map((c, i) => <CauseCard key={c._id} cause={c} index={i} />)}
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
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0f2a1a 100%)',
    padding: '64px 48px 52px', color: '#fff', textAlign: 'center',
  },
  blob1: { position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: '#3b82f6', filter: 'blur(100px)', opacity: 0.12, top: '-100px', left: '-50px', animation: 'float 7s ease-in-out infinite' },
  blob2: { position: 'absolute', width: '350px', height: '350px', borderRadius: '50%', background: '#22c55e', filter: 'blur(100px)', opacity: 0.1, bottom: '-80px', right: '-40px', animation: 'float 5s ease-in-out infinite reverse' },
  headerContent: { position: 'relative', maxWidth: '600px', margin: '0 auto' },
  pill: {
    display: 'inline-block', background: 'rgba(99,102,241,0.2)', color: '#a5b4fc',
    border: '1px solid rgba(99,102,241,0.3)', padding: '5px 16px', borderRadius: '20px',
    fontSize: '0.78rem', fontWeight: 700, marginBottom: '16px', letterSpacing: '0.5px',
  },
  title: { fontSize: '2.4rem', fontWeight: 900, marginBottom: '10px', letterSpacing: '-0.5px' },
  sub: { color: '#94a3b8', fontSize: '0.95rem', marginBottom: '28px' },
  searchWrap: { position: 'relative', maxWidth: '480px', margin: '0 auto' },
  searchIcon: { position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', zIndex: 1 },
  searchInput: {
    width: '100%', padding: '13px 44px 13px 44px',
    borderRadius: '14px', border: '1.5px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.08)', color: '#fff',
    fontSize: '0.95rem', outline: 'none', backdropFilter: 'blur(8px)',
    transition: 'border 0.2s',
  },
  clearBtn: {
    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
    background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
    width: '22px', height: '22px', borderRadius: '50%', cursor: 'pointer', fontSize: '0.7rem',
  },
  body: { padding: '36px 48px' },
  catRow: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' },
  catPill: {
    padding: '8px 18px', borderRadius: '20px', border: '1.5px solid #e2e8f0',
    background: '#fff', color: '#475569', fontSize: '0.85rem', fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.2s ease',
  },
  resultCount: { color: '#64748b', fontSize: '0.88rem', marginBottom: '24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' },
  empty: { textAlign: 'center', padding: '80px 20px' },
  emptyIcon: { fontSize: '3.5rem', marginBottom: '16px', animation: 'float 3s ease-in-out infinite' },
  emptyTitle: { fontSize: '1.3rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' },
  emptySub: { color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' },
  resetBtn: {
    background: 'linear-gradient(135deg,#6366f1,#3b82f6)', color: '#fff',
    padding: '10px 24px', borderRadius: '10px', border: 'none',
    fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
  },
};
