const express = require('express');
const artistControllers = require('./controllers/artists');

const app = express();
app.use(express.json());

/* app.get('*', (req, res) => {
  res.status(200).json({ message: 'Bonjour, Terre!' });
});
 */
app.post('/artists', artistControllers.create);

module.exports = app;
