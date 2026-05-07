const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cause: { type: mongoose.Schema.Types.ObjectId, ref: 'Cause', required: true },
  amount: { type: Number, required: true },
  donorName: { type: String, default: 'Anonymous' },
  message: { type: String, default: '' },
  isAnonymous: { type: Boolean, default: false },
  screenshotUrl: { type: String, default: '' },
  paymentStatus: { type: String, enum: ['pending', 'verified'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
