const Song = require('../models/song');

exports.create = (req, res) => {
  const song = new Song({
    name: req.body.name,
    album: req.params.albumId,
    artist: req.body.artist,
  });
  song.save().then(savedSong => {
    Song.findOne({ _id: savedSong._id })
      .populate({ path: 'artist' })
      .populate({ path: 'album' })
      .exec((err, songId) => {
        console.log(savedSong);
        res.status(201).json(songId);
      });
  });
};
