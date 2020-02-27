const express = require('express');
const userControllers = require('./controllers/user');
const moodControllers = require('./controllers/mood');

const app = express();
app.use(express.json());

app.post('/user', userControllers.create);
app.post('/user/mood', moodControllers.postMood);
app.get('/user', userControllers.list);
app.post('/user/message', moodControllers.postMessage);
app.get('/moods', moodControllers.getMoods);
// app.get('/moods/:role', resultsControllers.getRoleMoods)
// app.get('/messages/:userId', resultsControllers.userMessages)

module.exports = app;
