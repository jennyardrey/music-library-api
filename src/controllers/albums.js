const Album = require('../models/album');

exports.create = (req, res) => {
  const { artistId } = req.params;
  const album = new Album({
    name: req.body.name,
    year: req.body.year,
    artist: artistId,
  });
  if (!album.artist) {
    res.status(404).json({ error: 'The artist could not be found.' });
  } else {
    album.save().then(() => {
      res.status(201).json(album);
    });
  }
};

exports.list = (req, res) => {
  Album.find({}, (err, data) => {
    res.status(200).json(data);
  });
};

exports.update = (req, res) => {
  Album.findById({ _id: req.params.albumId }, (err, data) => {
    if (!data) {
      res.status(404).json({ error: '44The album could not be found.' });
    } else {
      data.set(req.body);
      data.save().then(updatedData => {
        res.status(200).json(updatedData);
      });
    }
  });
};

exports.delete = (req, res) => {
  Album.findByIdAndDelete({ _id: req.params.albumId }, (err, data) => {
    if (!data) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      res.status(204).json({ Message: 'Album was deleted' });
    }
  });
};
