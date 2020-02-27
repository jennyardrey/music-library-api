const Mood = require('../models/mood');
const Message = require('../models/message');

exports.postMood = (req, res) => {
  // console.log(req.body.name);
  const mood = new Mood({
    user: req.body.user,
    moodScore: req.body.moodScore,
    role: req.body.role,
  });
  if (!mood.user) {
    res.status(404).json({ error: 'Please log in to log your mood' });
  } else {
    mood.save().then(savedMood => {
      Mood.findOne({ _id: savedMood._id })
        .populate({ path: 'user' })
        .exec((err, moodId) => {
          res.status(201).json(moodId);
        });
    });
  }
};

exports.postMessage = (req, res) => {
  const msg = new Message({
    user: req.body.user,
    message: req.body.message,
  });
  if (!msg.user) {
    res.status(404).json({ error: 'Please log in to send a message' });
  } else {
    msg.save().then(savedMsg => {
      Message.findOne({ _id: savedMsg })
        .populate({ path: 'user' })
        .exec((err, msgId) => {
          res.status(201).json(msgId);
        });
    });
  }
};

exports.getMoods = (req, res) => {
  Mood.find({}, (err, mood) => {
    res.status(200).json(mood);
  });
};
