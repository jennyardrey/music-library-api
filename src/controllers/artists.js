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
  console.log(req.params.artistId);
  Artist.find()
    .where('_id')
    .equals(req.params.artistId)
    .exec((err, data) => {
      console.log(data);
      res.status(200).json(data);
    });
};
