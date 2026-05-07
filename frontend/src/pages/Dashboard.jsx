import React, { useCallback, useEffect, useState } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Education', 'Health', 'Environment', 'Food', 'Disaster Relief', 'Animal Welfare'];
const EMPTY = { title: '', description: '', category: 'Education', goalAmount: '', image: '' };

const STAT_STYLES = [
  { grad: 'linear-gradient(135deg,#22c55e,#10b981)', icon: '🎯', shadow: 'rgba(34,197,94,0.3)' },
  { grad: 'linear-gradient(135deg,#3b82f6,#6366f1)', icon: '💳', shadow: 'rgba(59,130,246,0.3)' },
  { grad: 'linear-gradient(135deg,#a855f7,#ec4899)', icon: '💰', shadow: 'rgba(168,85,247,0.3)' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [causes, setCauses] = useState([]);
  const [stats, setStats] = useState({});
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const fetchData = useCallback(async () => {
    const [c, s] = await Promise.all([API.get(`/ngos/${user.id}/causes`), API.get('/donations/ngo/stats')]).catch(() => [{data:[]},{data:{}}]);
    setCauses(c.data); setStats(s.data);
  }, [user.id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await API.put(`/causes/${editing}`, form); setMsg({ text: '✅ Cause updated successfully!', type: 'success' }); }
      else { await API.post('/causes', form); setMsg({ text: '🎉 New cause created!', type: 'success' }); }
      setForm(EMPTY); setEditing(null); setShowForm(false); fetchData();
    } catch (err) { setMsg({ text: err.response?.data?.message || 'Error', type: 'error' }); }
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  const handleEdit = (cause) => {
    setForm({ title: cause.title, description: cause.description, category: cause.category, goalAmount: cause.goalAmount, image: cause.image });
    setEditing(cause._id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this cause?')) return;
    await API.delete(`/causes/${id}`); fetchData();
  };

  const statItems = [
    { label: 'Total Causes', val: stats.totalCauses || 0 },
    { label: 'Donations', val: stats.totalDonations || 0 },
    { label: 'Total Raised', val: `₹${(stats.totalRaised || 0).toLocaleString()}` },
  ];

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div style={S.blob1} /><div style={S.blob2} />
        <div style={S.headerContent}>
          <h1 style={S.title}>📊 NGO Dashboard</h1>
          <p style={S.sub}>Welcome back, <span style={S.nameHighlight}>{user?.name}</span> 👋</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditing(null); setForm(EMPTY); }}
          style={{ ...S.addBtn, background: showForm ? 'rgba(239,68,68,0.15)' : 'linear-gradient(135deg,#22c55e,#16a34a)', color: showForm ? '#f87171' : '#fff', border: showForm ? '1.5px solid rgba(239,68,68,0.3)' : 'none' }}
        >
          {showForm ? '✕ Cancel' : '+ New Cause'}
        </button>
      </div>

      <div style={S.body}>
        {/* Stats */}
        <div style={S.statsRow}>
          {statItems.map((s, i) => (
            <div key={i} style={{ ...S.statCard, boxShadow: `0 8px 32px ${STAT_STYLES[i].shadow}` }} className="fade-up">
              <div style={{ ...S.statIcon, background: STAT_STYLES[i].grad }}>{STAT_STYLES[i].icon}</div>
              <div>
                <div style={{ ...S.statVal, background: STAT_STYLES[i].grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.val}</div>
                <div style={S.statLabel}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Message */}
        {msg.text && (
          <div style={{ ...S.msgBox, ...(msg.type === 'success' ? S.msgSuccess : S.msgError) }} className="bounce-in">
            {msg.text}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div style={S.formCard} className="fade-up">
            <h2 style={S.formTitle}>{editing ? '✏️ Edit Cause' : '✨ Create New Cause'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={S.formGrid}>
                {[
                  { label: 'Title', key: 'title', type: 'text', placeholder: 'Cause title...' },
                  { label: 'Goal Amount (₹)', key: 'goalAmount', type: 'number', placeholder: '100000' },
                  { label: 'Image URL (optional)', key: 'image', type: 'text', placeholder: 'https://...' },
                ].map(f => (
                  <div key={f.key} style={S.field}>
                    <label style={S.label}>{f.label}</label>
                    <input style={S.input} type={f.type} placeholder={f.placeholder}
                      value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      required={f.key !== 'image'} />
                  </div>
                ))}
                <div style={S.field}>
                  <label style={S.label}>Category</label>
                  <select style={S.input} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={S.field}>
                <label style={S.label}>Description</label>
                <textarea style={S.textarea} value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={4} placeholder="Describe your cause..." required />
              </div>
              <button type="submit" style={S.submitBtn}>
                {editing ? '💾 Update Cause' : '🚀 Create Cause'}
              </button>
            </form>
          </div>
        )}

        {/* Causes list */}
        <div style={S.section}>
          <h2 style={S.sectionTitle}>Your Causes <span style={S.causeCount}>{causes.length}</span></h2>
          {causes.length === 0 ? (
            <div style={S.empty} className="fade-up">
              <div style={S.emptyIcon}>🎯</div>
              <p style={S.emptyText}>No causes yet. Create your first cause!</p>
            </div>
          ) : (
            <div style={S.causeList}>
              {causes.map((c, i) => {
                const pct = Math.min((c.raisedAmount / c.goalAmount) * 100, 100).toFixed(0);
                return (
                  <div key={c._id} style={S.causeRow} className="fade-up">
                    <div style={S.causeLeft}>
                      <div style={S.causeTitle}>{c.title}</div>
                      <span style={S.catBadge}>{c.category}</span>
                      <div style={S.progTrack}>
                        <div style={{ ...S.progFill, width: `${pct}%` }} />
                      </div>
                      <div style={S.causeStats}>
                        <span style={{ color: '#22c55e', fontWeight: 700 }}>₹{c.raisedAmount.toLocaleString()}</span>
                        <span style={{ color: '#94a3b8' }}> / ₹{c.goalAmount.toLocaleString()}</span>
                        <span style={{ color: '#3b82f6', fontWeight: 700, marginLeft: '8px' }}>{pct}%</span>
                      </div>
                    </div>
                    <div style={S.causeActions}>
                      <button onClick={() => handleEdit(c)} style={S.editBtn}>✏️ Edit</button>
                      <button onClick={() => handleDelete(c._id)} style={S.deleteBtn}>🗑️ Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { background: '#f1f5f9', minHeight: '100vh' },
  header: {
    position: 'relative', overflow: 'hidden',
    background: 'linear-gradient(135deg,#0f172a,#1e1b4b,#0f2a1a)',
    padding: '40px 48px', color: '#fff',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  blob1: { position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: '#22c55e', filter: 'blur(80px)', opacity: 0.1, top: '-80px', right: '100px', animation: 'float 6s ease-in-out infinite' },
  blob2: { position: 'absolute', width: '250px', height: '250px', borderRadius: '50%', background: '#3b82f6', filter: 'blur(80px)', opacity: 0.1, bottom: '-60px', left: '200px', animation: 'float 8s ease-in-out infinite reverse' },
  headerContent: { position: 'relative' },
  title: { fontSize: '1.8rem', fontWeight: 900, marginBottom: '4px' },
  sub: { color: '#94a3b8', fontSize: '0.9rem' },
  nameHighlight: { color: '#4ade80', fontWeight: 700 },
  addBtn: { position: 'relative', padding: '11px 24px', borderRadius: '12px', fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(34,197,94,0.3)' },
  body: { padding: '36px 48px', display: 'flex', flexDirection: 'column', gap: '24px' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' },
  statCard: { background: '#fff', borderRadius: '18px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' },
  statIcon: { width: '52px', height: '52px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 },
  statVal: { fontSize: '1.6rem', fontWeight: 900 },
  statLabel: { fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 500 },
  msgBox: { padding: '14px 18px', borderRadius: '12px', fontWeight: 600, fontSize: '0.92rem' },
  msgSuccess: { background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', color: '#16a34a', border: '1px solid #bbf7d0' },
  msgError: { background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3' },
  formCard: { background: '#fff', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  formTitle: { fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '0.82rem', fontWeight: 600, color: '#475569' },
  input: { padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.92rem', outline: 'none', background: '#fff', transition: 'border 0.2s' },
  textarea: { padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.92rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', marginBottom: '16px' },
  submitBtn: { background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', padding: '13px 28px', borderRadius: '12px', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem', boxShadow: '0 4px 16px rgba(34,197,94,0.35)' },
  section: {},
  sectionTitle: { fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' },
  causeCount: { background: 'linear-gradient(135deg,#22c55e,#3b82f6)', color: '#fff', padding: '2px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 },
  causeList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  causeRow: { background: '#fff', borderRadius: '16px', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', transition: 'transform 0.2s, box-shadow 0.2s' },
  causeLeft: { display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 },
  causeTitle: { fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' },
  catBadge: { display: 'inline-block', background: '#f1f5f9', color: '#475569', padding: '2px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600, width: 'fit-content' },
  progTrack: { background: '#f1f5f9', borderRadius: '10px', height: '6px', width: '280px', maxWidth: '100%', overflow: 'hidden' },
  progFill: { height: '6px', borderRadius: '10px', background: 'linear-gradient(90deg,#22c55e,#3b82f6)', transition: 'width 0.8s ease' },
  causeStats: { fontSize: '0.82rem' },
  causeActions: { display: 'flex', gap: '8px', flexShrink: 0 },
  editBtn: { background: '#eff6ff', color: '#2563eb', padding: '7px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s' },
  deleteBtn: { background: '#fff1f2', color: '#e11d48', padding: '7px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s' },
  empty: { textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '20px' },
  emptyIcon: { fontSize: '3rem', marginBottom: '12px', animation: 'float 3s ease-in-out infinite', display: 'block' },
  emptyText: { color: '#94a3b8', fontSize: '0.95rem' },
};
