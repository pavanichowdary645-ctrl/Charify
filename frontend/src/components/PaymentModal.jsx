import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const STEPS = ['Scan QR', 'Upload Proof', 'Confirm'];

export default function PaymentModal({ amount, donorName, causeId, onConfirm, onClose }) {
  const [step, setStep] = useState(0);
  const [screenshot, setScreenshot] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  // QR value — a UPI-style payment string (looks real)
  const qrValue = `upi://pay?pa=charitex@upi&pn=Charitex+Foundation&am=${amount}&cu=INR&tn=Donation+by+${encodeURIComponent(donorName || 'Donor')}`;

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setScreenshot(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleConfirm = async () => {
    if (!screenshot || loading) return;
    setLoading(true);
    try {
      await onConfirm(screenshot);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={S.modal} className="bounce-in">

        {/* Header */}
        <div style={S.header}>
          <div style={S.headerLeft}>
            <span style={S.headerIcon}>💳</span>
            <div>
              <div style={S.headerTitle}>Complete Payment</div>
              <div style={S.headerSub}>Amount: <strong style={{ color: '#22c55e' }}>₹{amount}</strong></div>
            </div>
          </div>
          <button onClick={onClose} style={S.closeBtn}>✕</button>
        </div>

        {/* Step indicators */}
        <div style={S.steps}>
          {STEPS.map((label, i) => (
            <React.Fragment key={i}>
              <div style={S.stepItem}>
                <div style={{ ...S.stepCircle, ...(i <= step ? S.stepActive : i < step ? S.stepDone : {}) }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{ ...S.stepLabel, color: i <= step ? '#22c55e' : '#94a3b8' }}>{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ ...S.stepLine, background: i < step ? '#22c55e' : '#e2e8f0' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 0 — QR Code */}
        {step === 0 && (
          <div style={S.body} className="fade-in">
            <div style={S.qrCard}>
              <div style={S.qrBadge}>📱 Scan with any UPI app</div>
              <div style={S.qrWrap}>
                <QRCodeSVG
                  value={qrValue}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#0f172a"
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div style={S.qrAmount}>₹{Number(amount).toLocaleString('en-IN')}</div>
              <div style={S.qrUpi}>charitex@upi</div>
              <div style={S.qrApps}>
                {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                  <span key={app} style={S.appChip}>{app}</span>
                ))}
              </div>
            </div>
            <div style={S.infoBox}>
              <span>🔒</span>
              <span>Scan the QR code using any UPI app and complete the payment of <strong>₹{amount}</strong>. Then click Next to upload your payment screenshot.</span>
            </div>
            <button style={S.nextBtn} onClick={() => setStep(1)}>
              I've Paid — Next →
            </button>
          </div>
        )}

        {/* Step 1 — Upload Screenshot */}
        {step === 1 && (
          <div style={S.body} className="fade-in">
            <div style={S.uploadArea} onClick={() => fileRef.current.click()}>
              {preview ? (
                <img src={preview} alt="proof" style={S.previewImg} />
              ) : (
                <>
                  <div style={S.uploadIcon}>📸</div>
                  <div style={S.uploadText}>Click to upload payment screenshot</div>
                  <div style={S.uploadHint}>PNG, JPG up to 5MB</div>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
            {preview && (
              <button style={S.changeBtn} onClick={() => { setScreenshot(null); setPreview(null); }}>
                🔄 Change Screenshot
              </button>
            )}
            <div style={S.infoBox}>
              <span>ℹ️</span>
              <span>Upload a screenshot of your payment confirmation from your UPI app as proof.</span>
            </div>
            <div style={S.btnRow}>
              <button style={S.backBtn} onClick={() => setStep(0)}>← Back</button>
              <button
                style={{ ...S.nextBtn, flex: 1, opacity: screenshot ? 1 : 0.5 }}
                disabled={!screenshot}
                onClick={() => setStep(2)}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Confirm */}
        {step === 2 && (
          <div style={S.body} className="fade-in">
            <div style={S.confirmCard}>
              <div style={S.confirmIcon}>✅</div>
              <h3 style={S.confirmTitle}>Review & Confirm</h3>
              <div style={S.confirmRows}>
                <div style={S.confirmRow}><span>Donor</span><strong>{donorName || 'Anonymous'}</strong></div>
                <div style={S.confirmRow}><span>Amount</span><strong style={{ color: '#22c55e' }}>₹{amount}</strong></div>
                <div style={S.confirmRow}><span>Payment</span><strong>UPI / QR</strong></div>
                <div style={S.confirmRow}><span>Screenshot</span><strong style={{ color: '#22c55e' }}>✓ Uploaded</strong></div>
              </div>
              {preview && <img src={preview} alt="proof" style={S.thumbImg} />}
            </div>
            <div style={S.infoBox}>
              <span>🎉</span>
              <span>Your donation will be recorded and the NGO will verify your payment screenshot.</span>
            </div>
            <div style={S.btnRow}>
              <button style={S.backBtn} onClick={() => setStep(1)}>← Back</button>
              <button
                style={{ ...S.nextBtn, flex: 1, opacity: loading ? 0.7 : 1 }}
                disabled={loading}
                onClick={handleConfirm}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span style={S.spinner} /> Processing...
                  </span>
                ) : `📚 Pay ₹${amount} Securely`}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const S = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(10,15,30,0.75)',
    backdropFilter: 'blur(6px)', zIndex: 2000,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
  },
  modal: {
    background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '480px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.3)', overflow: 'hidden',
    maxHeight: '90vh', overflowY: 'auto',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 24px', background: 'linear-gradient(135deg,#0f172a,#1e293b)',
    color: '#fff',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  headerIcon: { fontSize: '1.8rem' },
  headerTitle: { fontSize: '1rem', fontWeight: 700 },
  headerSub: { fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' },
  closeBtn: {
    background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
    width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer',
    fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  steps: {
    display: 'flex', alignItems: 'center', padding: '20px 24px',
    background: '#f8fafc', borderBottom: '1px solid #e2e8f0',
  },
  stepItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
  stepCircle: {
    width: '32px', height: '32px', borderRadius: '50%',
    background: '#e2e8f0', color: '#94a3b8',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.82rem', fontWeight: 700, transition: 'all 0.3s',
  },
  stepActive: { background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', boxShadow: '0 4px 12px rgba(34,197,94,0.4)' },
  stepDone: { background: '#dcfce7', color: '#16a34a' },
  stepLabel: { fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' },
  stepLine: { flex: 1, height: '2px', margin: '0 8px', marginBottom: '18px', transition: 'background 0.3s' },
  body: { padding: '24px' },
  qrCard: {
    background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)',
    border: '1px solid #bbf7d0', borderRadius: '16px',
    padding: '20px', textAlign: 'center', marginBottom: '16px',
  },
  qrBadge: {
    display: 'inline-block', background: '#fff', color: '#16a34a',
    padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem',
    fontWeight: 700, marginBottom: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  qrWrap: {
    display: 'inline-block', padding: '12px', background: '#fff',
    borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '14px',
  },
  qrAmount: { fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', marginBottom: '4px' },
  qrUpi: { fontSize: '0.82rem', color: '#64748b', marginBottom: '12px' },
  qrApps: { display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' },
  appChip: {
    background: '#fff', border: '1px solid #e2e8f0', padding: '4px 12px',
    borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600, color: '#475569',
  },
  infoBox: {
    display: 'flex', gap: '10px', alignItems: 'flex-start',
    background: '#f8fafc', border: '1px solid #e2e8f0',
    borderRadius: '10px', padding: '12px 14px',
    fontSize: '0.82rem', color: '#475569', lineHeight: 1.6, marginBottom: '16px',
  },
  nextBtn: {
    width: '100%', background: 'linear-gradient(135deg,#22c55e,#16a34a)',
    color: '#fff', padding: '13px', borderRadius: '12px', border: 'none',
    fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(34,197,94,0.35)',
  },
  uploadArea: {
    border: '2px dashed #22c55e', borderRadius: '16px', padding: '32px 20px',
    textAlign: 'center', cursor: 'pointer', background: '#f0fdf4',
    marginBottom: '12px', transition: 'all 0.2s', minHeight: '160px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  },
  uploadIcon: { fontSize: '2.5rem', marginBottom: '10px' },
  uploadText: { fontSize: '0.9rem', fontWeight: 600, color: '#16a34a', marginBottom: '4px' },
  uploadHint: { fontSize: '0.75rem', color: '#94a3b8' },
  previewImg: { width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '10px' },
  changeBtn: {
    background: 'transparent', border: '1px solid #e2e8f0', color: '#64748b',
    padding: '7px 16px', borderRadius: '8px', cursor: 'pointer',
    fontSize: '0.82rem', marginBottom: '12px', width: '100%',
  },
  btnRow: { display: 'flex', gap: '10px' },
  backBtn: {
    background: '#f1f5f9', border: 'none', color: '#475569',
    padding: '13px 20px', borderRadius: '12px', cursor: 'pointer',
    fontSize: '0.9rem', fontWeight: 600,
  },
  confirmCard: {
    background: '#f8fafc', borderRadius: '16px', padding: '20px',
    marginBottom: '16px', textAlign: 'center',
  },
  confirmIcon: { fontSize: '2.5rem', marginBottom: '8px' },
  confirmTitle: { fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' },
  confirmRows: { display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' },
  confirmRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '8px 12px', background: '#fff', borderRadius: '8px',
    fontSize: '0.85rem', color: '#64748b',
  },
  thumbImg: { width: '100%', maxHeight: '100px', objectFit: 'cover', borderRadius: '8px', marginTop: '12px' },
  spinner: {
    width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)',
    borderTop: '2px solid #fff', borderRadius: '50%',
    animation: 'spin 0.7s linear infinite', display: 'inline-block',
  },
};
