const mongoose = require('mongoose');

const pgSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  gender: { type: String, enum: ['boys', 'girls', 'mixed'], required: true },
  amenities: [{ type: String }],
  images: [{ type: String }],
  phone: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('PG', pgSchema);

