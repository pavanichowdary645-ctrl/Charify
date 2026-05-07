import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

const HOW = [
  { icon: '🔍', title: 'Discover', desc: 'Browse verified causes across 6 categories.', color: '#3b82f6', bg: 'linear-gradient(135deg,#eff6ff,#dbeafe)' },
  { icon: '💳', title: 'Donate', desc: 'Give securely with full fund transparency.', color: '#22c55e', bg: 'linear-gradient(135deg,#f0fdf4,#dcfce7)' },
  { icon: '📈', title: 'Track', desc: 'Watch real-time progress of your impact.', color: '#a855f7', bg: 'linear-gradient(135deg,#faf5ff,#ede9fe)' },
];

function useCountUp(target, duration = 1500) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!target || started.current) return;
    started.current = true;
    const steps = 40;
    const inc = target / steps;
    let cur = 0;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= target) { setVal(target); clearInterval(t); }
      else setVal(Math.floor(cur));
    }, duration / steps);
    return () => clearInterval(t);
  }, [target, duration]);
  return val;
}

export default function Home() {
  const [stats, setStats] = useState({ causes: 0, ngos: 0, raised: 0 });
  const [heroVisible, setHeroVisible] = useState(false);

  const causeCount  = useCountUp(stats.causes);
  const ngoCount    = useCountUp(stats.ngos);
  const raisedCount = useCountUp(stats.raised);

  useEffect(() => {
    setHeroVisible(true);
    API.get('/causes').then(r => {
      const raised = r.data.reduce((s, c) => s + c.raisedAmount, 0);
      setStats(s => ({ ...s, causes: r.data.length, raised }));
    }).catch(() => {});
    API.get('/ngos').then(r => setStats(s => ({ ...s, ngos: r.data.length }))).catch(() => {});
  }, []);

  return (
    <div>
      {/* ── Hero ── */}
      <section style={S.hero}>
        {/* Animated blobs */}
        <div style={{ ...S.blob, ...S.blob1 }} />
        <div style={{ ...S.blob, ...S.blob2 }} />
        <div style={{ ...S.blob, ...S.blob3 }} />

        <div style={{
          ...S.heroContent,
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 0.8s ease',
        }}>
          <div style={S.heroPill}>
            <span style={S.pillDot} />
            🌍 Trusted by {stats.ngos}+ NGOs on Charitex
          </div>
          <h1 style={S.heroTitle}>
            Make a{' '}
            <span style={S.gradText}>Real Difference</span>
            <br />in Someone's Life
          </h1>
          <p style={S.heroSub}>
            Support verified causes, track your impact in real-time,<br />
            and be part of a community that truly cares.
          </p>
          <div style={S.heroBtns}>
            <Link to="/causes" style={S.primaryBtn}>🎯 Explore Causes</Link>
            <Link to="/register" style={S.ghostBtn}>🏢 Join as NGO</Link>
          </div>
        </div>

        {/* Animated stats bar */}
        <div style={S.statsBar}>
          {[
            { icon: '🎯', val: causeCount, label: 'Active Causes', color: '#22c55e' },
            { icon: '🏢', val: ngoCount,   label: 'Verified NGOs',  color: '#3b82f6' },
            { icon: '💰', val: `₹${(raisedCount/1000).toFixed(0)}K+`, label: 'Total Raised', color: '#a855f7' },
          ].map((s, i) => (
            <div key={i} style={{ ...S.statItem, borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <span style={S.statIcon}>{s.icon}</span>
              <strong style={{ ...S.statVal, color: s.color }}>{s.val}</strong>
              <span style={S.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={S.howSection}>
        <div style={S.secHead}>
          <span style={{ ...S.secPill, background: 'linear-gradient(135deg,#ede9fe,#dbeafe)', color: '#6366f1' }}>🚀 Simple Process</span>
          <h2 style={S.secTitle}>How It Works</h2>
        </div>
        <div style={S.howGrid}>
          {HOW.map((h, i) => (
            <div key={i} style={{ ...S.howCard, background: h.bg, animationDelay: `${i * 0.15}s` }} className="fade-up">
              <div style={{ ...S.howIcon, boxShadow: `0 8px 24px ${h.color}33` }}>{h.icon}</div>
              <div style={{ ...S.howStep, color: h.color }}>Step {i + 1}</div>
              <h3 style={S.howTitle}>{h.title}</h3>
              <p style={S.howDesc}>{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Impact Numbers ── */}
      <section style={S.impactSection}>
        <div style={S.secHead}>
          <span style={{ ...S.secPill, background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>📊 Our Impact</span>
          <h2 style={{ ...S.secTitle, color: '#fff' }}>Numbers That Matter</h2>
        </div>
        <div style={S.impactGrid}>
          {[
            { val: '10K+', label: 'Lives Impacted', icon: '❤️', color: '#ec4899' },
            { val: '₹2L+', label: 'Funds Raised', icon: '💰', color: '#22c55e' },
            { val: '50+', label: 'Countries Reached', icon: '🌍', color: '#3b82f6' },
            { val: '99%', label: 'Donor Satisfaction', icon: '⭐', color: '#eab308' },
          ].map((item, i) => (
            <div key={i} style={S.impactCard} className="fade-up">
              <span style={S.impactIcon}>{item.icon}</span>
              <strong style={{ ...S.impactVal, color: item.color }}>{item.val}</strong>
              <span style={S.impactLabel}>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={S.cta}>
        <div style={S.ctaGlow} />
        <h2 style={S.ctaTitle}>Ready to Change a Life?</h2>
        <p style={S.ctaSub}>Join thousands of donors making a real difference every day.</p>
        <div style={S.heroBtns}>
          <Link to="/register" style={S.primaryBtn}>🚀 Start Donating Today</Link>
          <Link to="/causes" style={S.ghostBtn}>Browse Causes</Link>
        </div>
      </section>
    </div>
  );
}

const S = {
  hero: {
    position: 'relative', overflow: 'hidden',
    background: 'linear-gradient(135deg, #0a0f1e 0%, #0f172a 50%, #0a1a0f 100%)',
    color: '#fff', padding: '110px 48px 0', textAlign: 'center',
    minHeight: '92vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  blob: { position: 'absolute', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.18, animation: 'float 6s ease-in-out infinite' },
  blob1: { width: '500px', height: '500px', background: '#22c55e', top: '-100px', left: '-100px', animationDelay: '0s' },
  blob2: { width: '400px', height: '400px', background: '#3b82f6', top: '100px', right: '-80px', animationDelay: '2s' },
  blob3: { width: '300px', height: '300px', background: '#a855f7', bottom: '80px', left: '30%', animationDelay: '4s' },
  heroContent: { position: 'relative', maxWidth: '760px', zIndex: 1 },
  heroPill: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    background: 'rgba(34,197,94,0.1)', color: '#4ade80',
    border: '1px solid rgba(34,197,94,0.25)', padding: '7px 18px',
    borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600,
    marginBottom: '28px', letterSpacing: '0.3px',
  },
  pillDot: { width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', animation: 'pulse-ring 2s infinite' },
  heroTitle: { fontSize: 'clamp(2.2rem,5.5vw,3.8rem)', fontWeight: 900, lineHeight: 1.12, marginBottom: '22px', letterSpacing: '-1.5px' },
  gradText: {
    background: 'linear-gradient(135deg, #22c55e, #3b82f6, #a855f7)',
    backgroundSize: '200% 200%', animation: 'gradientShift 4s ease infinite',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
  },
  heroSub: { fontSize: '1.05rem', color: '#94a3b8', marginBottom: '40px', lineHeight: 1.7 },
  heroBtns: { display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '0' },
  primaryBtn: {
    background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff',
    padding: '14px 32px', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem',
    boxShadow: '0 4px 24px rgba(34,197,94,0.45)', transition: 'all 0.2s',
  },
  ghostBtn: {
    border: '1.5px solid rgba(255,255,255,0.18)', color: '#e2e8f0',
    padding: '14px 32px', borderRadius: '12px', fontWeight: 600, fontSize: '0.95rem',
    background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)',
  },
  statsBar: {
    position: 'relative', zIndex: 1,
    display: 'flex', justifyContent: 'center',
    background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px 20px 0 0', marginTop: '64px',
    padding: '28px 60px', flexWrap: 'wrap', gap: '0', width: '100%', maxWidth: '700px',
  },
  statItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '0 44px' },
  statIcon: { fontSize: '1.6rem', marginBottom: '4px' },
  statVal: { fontSize: '2rem', fontWeight: 900 },
  statLabel: { fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 500 },
  secHead: { textAlign: 'center', marginBottom: '52px' },
  secPill: {
    display: 'inline-block', background: '#dcfce7', color: '#16a34a',
    padding: '5px 16px', borderRadius: '20px', fontSize: '0.78rem',
    fontWeight: 700, marginBottom: '14px', letterSpacing: '0.5px',
  },
  secTitle: { fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', marginBottom: '10px', letterSpacing: '-0.5px' },
  secSub: { color: '#64748b', fontSize: '1rem' },
  howSection: { padding: '88px 48px', background: '#fff' },
  howGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', maxWidth: '860px', margin: '0 auto' },
  howCard: { borderRadius: '20px', padding: '36px 24px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.04)', transition: 'transform 0.25s ease, box-shadow 0.25s ease' },
  howIcon: { fontSize: '2.8rem', marginBottom: '14px', display: 'inline-block', borderRadius: '16px', padding: '12px', background: '#fff' },
  howStep: { fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' },
  howTitle: { fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' },
  howDesc: { fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 },
  impactSection: {
    padding: '88px 48px',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f2a1a 100%)',
  },
  impactGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', maxWidth: '900px', margin: '0 auto' },
  impactCard: {
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px', padding: '32px 20px', textAlign: 'center',
    backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', gap: '6px',
    transition: 'transform 0.25s ease',
  },
  impactIcon: { fontSize: '2.2rem', marginBottom: '4px' },
  impactVal: { fontSize: '2rem', fontWeight: 900 },
  impactLabel: { fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' },
  cta: {
    position: 'relative', overflow: 'hidden',
    background: 'linear-gradient(135deg, #0a0f1e, #0f2a1a)',
    padding: '100px 48px', textAlign: 'center', color: '#fff',
  },
  ctaGlow: {
    position: 'absolute', width: '600px', height: '600px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)',
    top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
  },
  ctaTitle: { position: 'relative', fontSize: '2.6rem', fontWeight: 900, marginBottom: '14px', letterSpacing: '-0.5px' },
  ctaSub: { position: 'relative', color: '#94a3b8', fontSize: '1rem', marginBottom: '36px' },
};
