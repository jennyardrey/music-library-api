const express = require('express');
const artistControllers = require('./controllers/artists');
const albumControllers = require('./controllers/albums');

const app = express();
app.use(express.json());

app.post('/artists', artistControllers.create);
app.get('/artists', artistControllers.list);
app.get('/artists/:artistId', artistControllers.find);
app.patch('/artists/:artistId', artistControllers.update);
app.delete('/artists/:artistId', artistControllers.delete);
app.post('/artists/:artistId/albums', albumControllers.create);
// app.get('/artists/albums', albumControllers.listAlbum);
app.get('/artists/:artistId/albums', albumControllers.list);
app.patch('/artists/:artistId/albums/:albumId', albumControllers.update);
app.delete('/artists/:artistId/albums/albumId', albumControllers.delete);

module.exports = app;
