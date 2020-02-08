const Song = require('../models/song');

exports.create = (req, res) => {
  const song = new Song({
    name: req.body.name,
    album: req.params.albumId,
    artist: req.body.artist,
  });
  if (!song.album) {
    res.status(404).json({ error: 'The album does not exist' });
  } else {
    song.save().then(savedSong => {
      Song.findOne({ _id: savedSong._id })
        .populate({ path: 'artist' })
        .populate({ path: 'album' })
        .exec((err, songId) => {
          res.status(201).json(songId);
        });
    });
  }
};

exports.list = (req, res) => {
  Song.find({}, (err, data) => {
    res.status(200).json(data);
  });
};

exports.find = (req, res) => {
  Song.findById({ _id: req.params.songId }, (err, data) => {
    if (err) {
      res.status(404).json({ error: 'No such song' });
    } else {
      res.status(200).json(data);
    }
  });
};

exports.update = (req, res) => {
  Song.findById({ _id: req.params.songId }, (err, data) => {
    if (!data) {
      res.status(404).json('The song can not be found');
    } else {
      data.set(req.body);
      data.save().then(updatedSong => {
        res.status(200).json(updatedSong);
      });
    }
  });
};

exports.delete = (req, res) => {
  Song.findByIdAndDelete({ _id: req.params.songId }, (err, data) => {
    if (!data) {
      res.status(404).json('Song not found');
    } else {
      res.status(200).json('Song deleted');
    }
  });
};
