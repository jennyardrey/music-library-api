const Artist = require('../models/artist');

exports.create = (req, res) => {
  // console.log(req.body.name);
  const artist = new Artist({
    name: req.body.name,
    genre: req.body.genre,
  });
  artist.save().then(() => {
    res.status(201).json(artist);
  });
};

exports.list = (req, res) => {
  Artist.find({}).then(data => {
    res.status(200).json(data);
  });
};

exports.find = (req, res) => {
  // console.log(req.params.artistId);
  Artist.find({ _id: req.params.artistId }, (err, data) => {
    if (!data) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else res.status(200).json(data[0]);
  });
};

exports.update = (req, res) => {
  Artist.findById({ _id: req.params.artistId }, (err, data) => {
    if (!data) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      data.set(req.body);
      data.save().then(updatedData => {
        res.status(200).json(updatedData);
      });
    }
  });
};

exports.delete = (req, res) => {
  Artist.findByIdAndRemove({ _id: req.params.artistId }, (err, data) => {
    if (!data) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      res.status(204).json(data);
    }
  });
};
