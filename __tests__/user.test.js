const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user');

describe('/login', () => {
  beforeAll(done => {
    const url = process.env.DATABASE_CONN;
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    done();
  });

  afterEach(done => {
    User.deleteMany({}, () => {
      done();
    });
  });

  afterAll(done => {
    mongoose.connection.close();
    done();
  });

  describe('POST /login', () => {
    it('creates a new user in the database', done => {
      request(app)
        .post('/login')
        .send({
          name: 'Jenny',
          role: 'Cashier',
        })
        .then(res => {
          expect(res.status).toBe(201);
          User.findById(res.body._id, (_, user) => {
            // console.log(artist.name);
            expect(user.name).toBe('Jenny');
            expect(user.role).toBe('Cashier');
            done();
          });
        });
      done(); /* added this done() statement */
    });
  });
});
