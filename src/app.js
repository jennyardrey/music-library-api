const express = require('express');
const artistControllers = require('./controllers/artists');
const albumControllers = require('./controllers/albums');

const app = express();
app.use(express.json());

app.get('/artists', artistControllers.list);
app.post('/artists', artistControllers.create);
app.get('/artists/:artistId', artistControllers.find);
app.patch('/artists/:artistId', artistControllers.update);
app.delete('/artists/:artistId', artistControllers.delete);
app.post('/artists/:artistId/albums', albumControllers.create);

module.exports = app;
