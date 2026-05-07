import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import PaymentModal from '../components/PaymentModal';

const GRAD = 'linear-gradient(135deg,#22c55e,#16a34a)';

export default function CauseDetail() {
  const { id } = useParams();
  const [cause, setCause] = useState(null);
  const [donations, setDonations] = useState([]);
  const [form, setForm] = useState({ donorName: '', amount: '', message: '', isAnonymous: false });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showPayment, setShowPayment] = useState(false);

  const refresh = () => Promise.all([
    API.get(`/causes/${id}`),
    API.get(`/donations/cause/${id}`),
  ]).then(([c, d]) => { setCause(c.data); setDonations(d.data); }).catch(() => {});

  useEffect(() => { refresh(); }, [id]); // eslint-disable-line

  const handleDonate = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.amount || Number(form.amount) < 1) return setError('Enter a valid amount');
    setShowPayment(true);
  };

  const handlePaymentConfirm = async (screenshot) => {
    try {
      let screenshotBase64 = '';
      if (screenshot) {
        screenshotBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(screenshot);
        });
      }
      await API.post('/donations', {
        causeId: id,
        amount: Number(form.amount),
        donorName: form.donorName || '',
        message: form.message || '',
        isAnonymous: form.isAnonymous,
        screenshotBase64,
      });
      setSuccess('🎉 Thank you! Your donation has been recorded!');
      setForm({ donorName: '', amount: '', message: '', isAnonymous: false });
      setShowPayment(false);
      refresh();
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Donation failed');
      setShowPayment(false);
    }
  };

  if (!cause) return (
    <div style={S.loadingPage}>
      <div style={S.loadingSpinner} />
      <p style={{ color: '#94a3b8', marginTop: '16px' }}>Loading cause...</p>
    </div>
  );

  const progress = Math.min((cause.raisedAmount / cause.goalAmount) * 100, 100).toFixed(0);

  return (
    <>
    <div style={S.page}>
      {/* Hero */}
      <div style={S.hero}>
        {cause.image
          ? <img src={cause.image} alt={cause.title} style={S.heroImg} />
          : <div style={{ ...S.heroPlaceholder, background: GRAD }}><span style={S.heroEmoji}>🌍</span></div>
        }
        <div style={S.heroOverlay} />
        <div style={S.heroContent}>
          <span style={S.catBadge}>{cause.category}</span>
          <h1 style={S.heroTitle}>{cause.title}</h1>
          <p style={S.heroNgo}>🏢 by {cause.ngo?.name}</p>
        </div>
      </div>

      <div style={S.container}>
        {/* Left */}
        <div style={S.left} className="slide-left">
          {/* Progress */}
          <div style={S.progressCard}>
            <div style={S.progressHeader}>
              <span style={S.progressLabel}>Fundraising Progress</span>
              <span style={S.progressPct}>{progress}%</span>
            </div>
            <div style={S.progressTrack}>
              <div style={{ ...S.progressFill, width: `${progress}%` }} />
            </div>
            <div style={S.statsRow}>
              {[
                { val: `₹${cause.raisedAmount.toLocaleString()}`, label: 'Raised', color: '#22c55e' },
                { val: `${progress}%`, label: 'Funded', color: '#3b82f6' },
                { val: `₹${cause.goalAmount.toLocaleString()}`, label: 'Goal', color: '#a855f7' },
              ].map((s, i) => (
                <div key={i} style={S.statBox}>
                  <strong style={{ ...S.statVal, color: s.color }}>{s.val}</strong>
                  <span style={S.statLbl}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div style={S.descCard}>
            <h2 style={S.descTitle}>About This Cause</h2>
            <p style={S.descText}>{cause.description}</p>
          </div>

          {/* Donations list */}
          <div style={S.donationsCard}>
            <h3 style={S.donTitle}>
              💚 Recent Supporters
              <span style={S.donCount}>{donations.length}</span>
            </h3>
            {donations.length === 0
              ? <p style={S.donEmpty}>Be the first to donate!</p>
              : donations.slice(0, 6).map((d, i) => (
                <div key={d._id} style={{ ...S.donItem, animationDelay: `${i * 0.08}s` }} className="fade-up">
                  <div style={S.donAvatar}>{d.donorName[0]?.toUpperCase()}</div>
                  <div style={S.donInfo}>
                    <div style={S.donRow}>
                      <span style={S.donName}>{d.donorName}</span>
                      <span style={S.donAmt}>₹{d.amount}</span>
                    </div>
                    {d.message && <p style={S.donMsg}>"{d.message}"</p>}
                    {d.screenshotUrl && <span style={S.proofBadge}>📸 Proof submitted</span>}
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* Right — Donation form */}
        <div style={S.right} className="slide-right">
          <div style={S.formCard}>
            <div style={S.formHeader}>
              <h2 style={S.formTitle}>💚 Make a Donation</h2>
              <p style={S.formSub}>100% goes directly to this cause</p>
            </div>
            <div style={S.formBody}>
              {success && <div style={S.successBox} className="bounce-in">{success}</div>}
              {error   && <div style={S.errorBox}>⚠️ {error}</div>}

              <form onSubmit={handleDonate} style={S.form}>
                <div style={S.field}>
                  <label style={S.label}>Your Name</label>
                  <input style={S.input} value={form.donorName}
                    onChange={e => setForm({ ...form, donorName: e.target.value })}
                    placeholder="John Doe" disabled={form.isAnonymous} />
                </div>

                <div style={S.field}>
                  <label style={S.label}>Donation Amount (₹)</label>
                  <div style={S.quickRow}>
                    {[100, 250, 500, 1000, 2500].map(a => (
                      <button key={a} type="button" onClick={() => setForm({ ...form, amount: a })}
                        style={{ ...S.quickBtn, ...(Number(form.amount) === a ? S.quickBtnActive : {}) }}>
                        ₹{a}
                      </button>
                    ))}
                  </div>
                  <input style={{ ...S.input, marginTop: '10px' }} type="number" min="1"
                    value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                    placeholder="Or enter custom amount" required />
                </div>

                <div style={S.field}>
                  <label style={S.label}>Message (optional)</label>
                  <textarea style={S.textarea} value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Leave an encouraging message..." rows={3} />
                </div>

                <label style={S.checkLabel}>
                  <input type="checkbox" checked={form.isAnonymous}
                    onChange={e => setForm({ ...form, isAnonymous: e.target.checked })} style={S.checkbox} />
                  <span>Donate anonymously 🎭</span>
                </label>

                <button type="submit" style={S.submitBtn}>
                  💚 Donate Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
      {showPayment && (
        <PaymentModal
          amount={form.amount}
          donorName={form.isAnonymous ? 'Anonymous' : form.donorName}
          causeId={id}
          onConfirm={handlePaymentConfirm}
          onClose={() => setShowPayment(false)}
        />
      )}
    </>
  );
}

const S = {
  loadingPage: { minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  loadingSpinner: { width: '44px', height: '44px', border: '4px solid #e2e8f0', borderTop: '4px solid #22c55e', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  page: { background: '#f1f5f9', minHeight: '100vh' },
  hero: { position: 'relative', height: '380px', overflow: 'hidden' },
  heroImg: { width: '100%', height: '100%', objectFit: 'cover' },
  heroPlaceholder: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  heroEmoji: { fontSize: '6rem', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))' },
  heroOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,15,30,0.85) 0%, rgba(10,15,30,0.2) 60%, transparent 100%)' },
  heroContent: { position: 'absolute', bottom: '32px', left: '48px', color: '#fff' },
  catBadge: { display: 'inline-block', background: 'rgba(34,197,94,0.2)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)', padding: '5px 14px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '10px' },
  heroTitle: { fontSize: '2.2rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.5px', maxWidth: '700px' },
  heroNgo: { color: '#94a3b8', fontSize: '0.9rem' },
  container: { display: 'grid', gridTemplateColumns: '1fr 400px', gap: '28px', maxWidth: '1140px', margin: '0 auto', padding: '36px 48px' },
  left: { display: 'flex', flexDirection: 'column', gap: '20px' },
  progressCard: { background: '#fff', borderRadius: '18px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' },
  progressHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  progressLabel: { fontSize: '0.85rem', fontWeight: 600, color: '#475569' },
  progressPct: { fontSize: '1.4rem', fontWeight: 900, color: '#22c55e' },
  progressTrack: { background: '#f1f5f9', borderRadius: '10px', height: '12px', overflow: 'hidden', marginBottom: '20px' },
  progressFill: { height: '12px', borderRadius: '10px', background: 'linear-gradient(90deg,#22c55e,#4ade80)', transition: 'width 1.2s ease' },
  statsRow: { display: 'flex', gap: '8px' },
  statBox: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '12px', background: '#f8fafc', borderRadius: '10px' },
  statVal: { fontSize: '1.1rem', fontWeight: 800 },
  statLbl: { fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' },
  descCard: { background: '#fff', borderRadius: '18px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' },
  descTitle: { fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px' },
  descText: { color: '#475569', lineHeight: 1.8, fontSize: '0.95rem' },
  donationsCard: { background: '#fff', borderRadius: '18px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' },
  donTitle: { fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' },
  donCount: { background: '#dcfce7', color: '#16a34a', padding: '2px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 },
  donEmpty: { color: '#94a3b8', textAlign: 'center', padding: '20px', fontSize: '0.9rem' },
  donItem: { display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px 0', borderBottom: '1px solid #f1f5f9' },
  donAvatar: { width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 },
  donInfo: { flex: 1 },
  donRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  donName: { fontSize: '0.88rem', fontWeight: 600, color: '#1e293b' },
  donAmt: { fontSize: '0.88rem', color: '#22c55e', fontWeight: 700 },
  donMsg: { fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic', marginTop: '4px' },
  right: {},
  formCard: { background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.12)', position: 'sticky', top: '80px' },
  formHeader: { padding: '22px 28px', background: GRAD, color: '#fff' },
  formTitle: { fontSize: '1.25rem', fontWeight: 800, marginBottom: '4px' },
  formSub: { fontSize: '0.82rem', opacity: 0.85 },
  formBody: { padding: '24px 28px' },
  successBox: { background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', color: '#16a34a', padding: '14px 16px', borderRadius: '12px', marginBottom: '16px', fontSize: '0.9rem', fontWeight: 600, border: '1px solid #bbf7d0' },
  errorBox: { background: '#fff1f2', color: '#e11d48', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.88rem', border: '1px solid #fecdd3' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '0.82rem', fontWeight: 600, color: '#475569' },
  input: { padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.92rem', outline: 'none', background: '#fff', color: '#0f172a' },
  textarea: { padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.92rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', background: '#fff' },
  quickRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  quickBtn: { flex: 1, minWidth: '48px', padding: '9px 6px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#475569', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s' },
  quickBtnActive: { background: GRAD, color: '#fff', border: '1.5px solid transparent', boxShadow: '0 4px 12px rgba(34,197,94,0.35)' },
  checkLabel: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#475569', cursor: 'pointer' },
  checkbox: { width: '16px', height: '16px', accentColor: '#22c55e' },
  proofBadge: { display: 'inline-block', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '2px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 600, marginTop: '4px' },
  submitBtn: { background: GRAD, color: '#fff', padding: '14px', borderRadius: '12px', border: 'none', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 20px rgba(34,197,94,0.4)', transition: 'all 0.2s' },
};
