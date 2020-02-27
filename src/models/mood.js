const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  moodScore: Number,
  role: String,
});

const Mood = mongoose.model('Mood', moodSchema);

module.exports = Mood;
