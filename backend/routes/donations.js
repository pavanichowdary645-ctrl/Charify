const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const Donation = require('../models/Donation');
const Cause = require('../models/Cause');
const authMiddleware = require('../middleware/auth');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

router.post('/', async (req, res) => {
  try {
    const { causeId, amount, donorName, message, isAnonymous, screenshotBase64 } = req.body;

    if (!causeId) return res.status(400).json({ message: 'causeId is required' });

    const cause = await Cause.findById(causeId);
    if (!cause) return res.status(404).json({ message: 'Cause not found' });

    let screenshotUrl = '';
    if (screenshotBase64) {
      const base64Data = screenshotBase64.replace(/^data:image\/\w+;base64,/, '');
      const filename = `${Date.now()}.png`;
      fs.writeFileSync(path.join(uploadsDir, filename), Buffer.from(base64Data, 'base64'));
      screenshotUrl = `/uploads/${filename}`;
    }

    const donation = await Donation.create({
      cause: causeId,
      amount: Number(amount),
      donorName: isAnonymous ? 'Anonymous' : (donorName || 'Anonymous'),
      message: message || '',
      isAnonymous: !!isAnonymous,
      screenshotUrl,
      paymentStatus: 'pending',
    });

    await Cause.findByIdAndUpdate(causeId, { $inc: { raisedAmount: Number(amount) } });
    res.status(201).json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/cause/:causeId', async (req, res) => {
  try {
    const donations = await Donation.find({ cause: req.params.causeId }).sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/ngo/stats', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'ngo') return res.status(403).json({ message: 'Unauthorized' });
    const causes = await Cause.find({ ngo: req.user.id });
    const causeIds = causes.map(c => c._id);
    const donations = await Donation.find({ cause: { $in: causeIds } });
    const totalRaised = donations.reduce((sum, d) => sum + d.amount, 0);
    res.json({ totalCauses: causes.length, totalDonations: donations.length, totalRaised });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
