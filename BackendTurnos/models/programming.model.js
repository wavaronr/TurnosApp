const mongoose = require('mongoose');

const programmingSchema = new mongoose.Schema({
  year: { type: Number, required: true, index: true },
  month: { type: Number, required: true, index: true }, // 1-12
  schedule: { type: Object, required: true },
  lastModified: { type: Date, default: Date.now }
});

programmingSchema.index({ year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Programming', programmingSchema);