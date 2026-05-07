import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const CAT_EMOJI = {
  Education: '📚', Health: '❤️', Environment: '🌿',
  Food: '🍽️', 'Disaster Relief': '🆘', 'Animal Welfare': '🐾',
};

export default function CauseCard({ cause, index = 0 }) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef();
  const progress = Math.min((cause.raisedAmount / cause.goalAmount) * 100, 100).toFixed(0);
  const emoji = CAT_EMOJI[cause.category] || '🌍';

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        ...S.card,
        ...(hovered ? S.cardHover : {}),
        opacity: visible ? 1 : 0,
        transform: visible ? (hovered ? 'translateY(-8px)' : 'translateY(0)') : 'translateY(30px)',
        transition: `opacity 0.5s ease ${index * 0.08}s, transform 0.5s ease ${index * 0.08}s, box-shadow 0.25s ease`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={S.imgWrap}>
        {cause.image
          ? <img src={cause.image} alt={cause.title} style={{ ...S.img, transform: hovered ? 'scale(1.06)' : 'scale(1)' }} />
          : <div style={S.imgPlaceholder}><span style={S.placeholderEmoji}>{emoji}</span></div>
        }
        <div style={{ ...S.overlay, opacity: hovered ? 0.45 : 0.2 }} />
        <span style={S.badge}>
          <span style={S.badgeDot} />{emoji} {cause.category}
        </span>
        <div style={S.progressOverlay}>
          <div style={{ ...S.progressOverlayFill, width: `${progress}%` }} />
        </div>
      </div>

      <div style={S.body}>
        <h3 style={S.title}>{cause.title}</h3>
        <p style={S.desc}>{cause.description.slice(0, 88)}...</p>

        <div style={S.progWrap}>
          <div style={S.progHeader}>
            <span style={S.progLabel}>Funded</span>
            <span style={S.progPct}>{progress}%</span>
          </div>
          <div style={S.progTrack}>
            <div style={{
              ...S.progFill,
              width: visible ? `${progress}%` : '0%',
              transition: `width 1s ease ${index * 0.08 + 0.3}s`,
            }} />
          </div>
        </div>

        <div style={S.stats}>
          <div style={S.statBox}>
            <span style={S.statValGreen}>₹{cause.raisedAmount.toLocaleString()}</span>
            <span style={S.statLbl}>Raised</span>
          </div>
          <div style={S.statDivider} />
          <div style={S.statBox}>
            <span style={S.statVal}>₹{cause.goalAmount.toLocaleString()}</span>
            <span style={S.statLbl}>Goal</span>
          </div>
          <div style={S.statDivider} />
          <div style={S.statBox}>
            <span style={S.statVal}>{progress}%</span>
            <span style={S.statLbl}>Done</span>
          </div>
        </div>

        <div style={S.footer}>
          <span style={S.ngo}>🏢 {cause.ngo?.name || 'NGO'}</span>
          <Link to={`/causes/${cause._id}`} style={S.btn}>Donate →</Link>
        </div>
      </div>
    </div>
  );
}

const S = {
  card: {
    background: '#fff', borderRadius: '18px', overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    display: 'flex', flexDirection: 'column', cursor: 'pointer',
  },
  cardHover: { boxShadow: '0 20px 60px rgba(0,0,0,0.16)' },
  imgWrap: { position: 'relative', height: '200px', overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' },
  imgPlaceholder: { width: '100%', height: '100%', background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  placeholderEmoji: { fontSize: '4rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' },
  overlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.7) 0%, transparent 60%)', transition: 'opacity 0.3s' },
  badge: {
    position: 'absolute', top: '12px', left: '12px',
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    padding: '4px 10px', borderRadius: '20px',
    fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.2px',
    background: 'rgba(255,255,255,0.92)', color: '#1e293b',
    backdropFilter: 'blur(8px)',
  },
  badgeDot: { width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', flexShrink: 0 },
  progressOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'rgba(0,0,0,0.2)' },
  progressOverlayFill: { height: '4px', background: 'linear-gradient(90deg,#22c55e,#4ade80)', transition: 'width 1s ease' },
  body: { padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 },
  title: { fontSize: '1rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.4 },
  desc: { fontSize: '0.82rem', color: '#64748b', lineHeight: 1.6 },
  progWrap: {},
  progHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '5px' },
  progLabel: { fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 },
  progPct: { fontSize: '0.72rem', fontWeight: 800, color: '#22c55e' },
  progTrack: { background: '#f1f5f9', borderRadius: '10px', height: '7px', overflow: 'hidden' },
  progFill: { height: '7px', borderRadius: '10px', background: 'linear-gradient(90deg,#22c55e,#4ade80)' },
  stats: { display: 'flex', background: '#f8fafc', borderRadius: '10px', padding: '10px', gap: '4px' },
  statBox: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' },
  statVal: { fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' },
  statValGreen: { fontSize: '0.88rem', fontWeight: 800, color: '#22c55e' },
  statLbl: { fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' },
  statDivider: { width: '1px', background: '#e2e8f0', margin: '2px 0' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' },
  ngo: { fontSize: '0.76rem', color: '#94a3b8' },
  btn: {
    background: 'linear-gradient(135deg,#22c55e,#16a34a)',
    color: '#fff', padding: '8px 18px', borderRadius: '8px',
    fontWeight: 700, fontSize: '0.82rem', transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(34,197,94,0.35)',
  },
};
