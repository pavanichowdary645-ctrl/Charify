const router = require('express').Router();
const Cause = require('../models/Cause');
const authMiddleware = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = { isActive: true };
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };
    const causes = await Cause.find(filter).populate('ngo', 'name email').sort({ createdAt: -1 });
    res.json(causes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const cause = await Cause.findById(req.params.id).populate('ngo', 'name email');
    if (!cause) return res.status(404).json({ message: 'Cause not found' });
    res.json(cause);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'ngo') return res.status(403).json({ message: 'Only NGOs can create causes' });
    const cause = await Cause.create({ ...req.body, ngo: req.user.id });
    res.status(201).json(cause);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const cause = await Cause.findById(req.params.id);
    if (!cause) return res.status(404).json({ message: 'Cause not found' });
    if (cause.ngo.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    const updated = await Cause.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const cause = await Cause.findById(req.params.id);
    if (!cause) return res.status(404).json({ message: 'Cause not found' });
    if (cause.ngo.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    await cause.deleteOne();
    res.json({ message: 'Cause deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
