const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user');
const Mood = require('../src/models/mood');

describe('//user/mood', () => {
  let user;

  beforeAll(done => {
    const url = process.env.DATABASE_CONN;
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    done();
  });

  beforeEach(done => {
    User.create(
      {
        name: 'Jenny',
        role: 'Cashier',
      },
      (_, document) => {
        user = document;
        done();
      },
    );
  });

  afterEach(done => {
    User.deleteMany({}, () => {
      Mood.deleteMany({}, () => {
        done();
      });
    });
  });

  afterAll(done => {
    mongoose.connection.close();
    done();
  });

  describe('POST /user/:userId/moods', () => {
    it('creates a mood entry for user', done => {
      request(app)
        .post(`/user/${user._id}/mood`)
        .send({
          moodScore: 5,
          role: user.role,
        })
        .then(res => {
          expect(res.status).toBe(201);
          Mood.findById(res.body._id, (err, mood) => {
            expect(err).toBe(null);
            expect(mood.moodScore).toBe(5);
            expect(mood.userId).toBe(user._id);
            expect(mood.role).toEqual(user.role);
            done();
          });
        });
    });

    it('returns a 404 and does not create an album if the artist does not exist', done => {
      request(app)
        .post('/user/1234/mood')
        .send({
          moodScore: 5,
          role: user.role,
        })
        .then(res => {
          expect(res.status).toBe(404);
          expect(res.body.error).toBe('Please log in to log your mood');

          Mood.find({}, (err, mood) => {
            expect(err).toBe(null);
            expect(mood.length).toBe(0);
            done();
          });
        });
    });
  });
});
