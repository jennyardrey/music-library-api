const express = require('express');
const artistControllers = require('./controllers/artists');

const app = express();
app.use(express.json());

app.get('/artists', artistControllers.list);
app.post('/artists', artistControllers.create);
app.get('/artists/:artistId', artistControllers.find);
app.patch('/artists/:artistId', artistControllers.update);
app.delete('/artists/:artistId', artistControllers.delete);

module.exports = app;
