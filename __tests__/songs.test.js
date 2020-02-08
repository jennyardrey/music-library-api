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
    it('returns a 404 and does not create a song if the album does not exist', done => {
      request(app)
        .post('/albums/1234/songs')
        .send({
          name: 'Solitude Is Bliss',
          artist: artistId,
          album: albumId,
        })
        .then(res => {
          expect(res.status).toBe(404);
          expect(res.body.error).toBe('The album does not exist');
          Song.find({}, (err, songs) => {
            expect(err).toBe(null);
            expect(songs.length).toBe(0);
            done();
          });
        });
    });
  });

  describe('with songs in the database', () => {
    let songs;
    beforeEach(done => {
      Promise.all([Song.create({ name: 'Song1', artist: artistId, album: albumId })]).then(
        documents => {
          songs = documents;
          done();
        },
      );
    });

    describe('GET /songs', () => {
      it('gets all the songs', done => {
        request(app)
          .get(`/songs`)
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body.name).toBe(songs.name);
            expect(res.body.album).toBe(songs.album);
            expect(res.body.artist).toBe(songs.artist);
          });
        done();
      });
      it(' gets songs by song id', done => {
        request(app)
          .get(`/songs/${songs[0]._id}`)
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body.name).toBe(songs[0].name);
          });
        done();
      });
    });
    describe('PATCH /songs/:songId', () => {
      it('updates song info by song id', done => {
        const song = songs[0];
        const newSongName = 'New Song';
        request(app)
          .patch(`/songs/${song._id}`)
          .send({ name: newSongName })
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body.name).toBe(newSongName);
            done();
          });
      });
    });
    describe('DELETE /songs/:songId', () => {
      it('deletes ong by song Id', done => {
        const song = songs[0];
        request(app)
          .delete(`/songs/${song._id}`)
          .then(res => {
            expect(res.status).toBe(200);
            Song.findById(song._id, (err, updatedSong) => {
              expect(err).toBe(null);
              expect(updatedSong).toBe(null);
              done();
            });
          });
      });
    });
  });
});
