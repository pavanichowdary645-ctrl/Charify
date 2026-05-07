const router = require('express').Router();
const User = require('../models/User');
const Cause = require('../models/Cause');

router.get('/', async (req, res) => {
  try {
    const ngos = await User.find({ role: 'ngo' }).select('-password');
    res.json(ngos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id/causes', async (req, res) => {
  try {
    const causes = await Cause.find({ ngo: req.params.id, isActive: true });
    res.json(causes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
