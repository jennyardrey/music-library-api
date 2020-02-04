const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  name: String,
  album: { type: mongoose.Schema.ObjectId, ref: 'Album' },
  artist: { type: mongoose.Schema.ObjectId, ref: 'Artist' },
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
