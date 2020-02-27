const User = require('../models/user');

exports.create = (req, res) => {
  const user = new User({
    name: req.body.name,
    role: req.body.role,
  });
  if (!user.name || !user.role) {
    res.status(404).json({ error: 'Please login' });
  } else {
    user.save().then(newUser => {
      res.status(201).json(newUser);
    });
  }
};

exports.list = (req, res) => {
  User.find({}, (err, user) => {
    res.status(200).json(user);
  });
};
