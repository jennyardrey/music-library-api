const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Artist = require('../src/models/artist');
const Album = require('../src/models/album');
const Song = require('../src/models/song');

describe('Songs', () => {
  let artistId;
  let albumId;

  beforeAll(done => {
    const url = process.env.DATABASE_CONN;
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    done();
  });

  beforeEach(done => {
    Artist.create({ name: 'Tame Impala', genre: 'Rock' }, (_, artist) => {
      artistId = artist._id.toString();
      Album.create({ name: 'InnerSpeaker', year: 2010, artist: artistId }, (__, album) => {
        albumId = album._id.toString();
        done();
      });
    });
  });

  afterEach(done => {
    Artist.deleteMany({}, () => {
      Album.deleteMany({}, () => {
        Song.deleteMany({}, () => {
          done();
        });
      });
    });
  });

  afterAll(done => {
    mongoose.connection.close();
    done();
  });

  describe('POST /albums/:albumId/songs', () => {
    it('creates a new song under an album', done => {
      request(app)
        .post(`/albums/${albumId}/songs`)
        .send({
          name: 'Solitude Is Bliss',
          artist: artistId,
          album: albumId,
        })
        .then(res => {
          console.log(artistId);
          expect(res.status).toBe(201);
          const songId = res.body._id;
          expect(res.body).toEqual({
            _id: songId,
            name: 'Solitude Is Bliss',
            artist: {
              _id: artistId,
              name: 'Tame Impala',
              genre: 'Rock',
              __v: 0,
            },
            album: {
              _id: albumId,
              artist: artistId,
              name: 'InnerSpeaker',
              year: 2010,
              __v: 0,
            },
            __v: 0,
          });
          done();
        });
    });
  });
});
