const Album = require('../models/album');
const Artist = require('../models/artist');

exports.create = (req, res) => {
  const { artistId } = req.params;
  Artist.findById({ _id: artistId }, (err, data) => {
    if (!data) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      const album = new Album({
        name: req.body.name,
        year: req.body.year,
        artist: req.params.artistId,
      });
      album.save().then(() => {
        res.status(201).json(album);
      });
    }
  });
};
