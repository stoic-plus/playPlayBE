const chai = require("chai");
const pry = require("pryjs");
const should = chai.should();
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../index');
const configuration = require('../knexfile')['test'];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('API routes', function(){
  before((done) => {
    database.migrate.latest()
    .then(() => done())
    .catch((error) => {throw error;});
  });

  describe('GET /api/v1/favorites', function(){
    beforeEach((done) => {
      database.seed.run()
      .then(() => done())
      .catch(error => {throw error;});
    });

    it('returns favorites for a user', function(done){
      chai.request(server)
      .get('/api/v1/favorites')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(4);
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);

        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('song_1');

        response.body[0].should.have.property('artist_name');
        response.body[0].artist_name.should.equal('artist_1');

        response.body[0].should.have.property('genre');
        response.body[0].genre.should.equal('Pop');

        response.body[0].should.have.property('rating');
        response.body[0].rating.should.equal('88');
        done();
      })
    });
 });

  describe('PUT /api/v1/favorites/:id ', function(){
    beforeEach((done) => {
      database.seed.run()
      .then(() => done())
      .catch(error => {throw error;});
    });

    it('returns the updated favorite if found', function(done){
      chai.request(server)
        .put('/api/v1/favorites/1')
        .send({ name: "new_song", artist_name: "new_artist" })
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;

          response.body.should.have.property('favorites');

          response.body.favorites.should.have.property('id');
          response.body.favorites.id.should.equal(1);

          response.body.favorites.should.have.property('name');
          response.body.favorites.name.should.equal('new_song');

          response.body.favorites.should.have.property('artist_name');
          response.body.favorites.artist_name.should.equal('new_artist');

          response.body.favorites.should.have.property('genre');
          response.body.favorites.genre.should.equal('Pop');

          response.body.favorites.should.have.property('rating');
          response.body.favorites.rating.should.equal('88');
          done();
        });
    });

    it('returns 400 error if favorite not found', function(done){
      chai.request(server)
        .put('/api/v1/favorites/5')
        .send({ name: "new_song", artist_name: "new_artist" })
        .end((err, response) => {
          response.should.have.status(400);
          response.body.should.have.property('message');
          response.body.message.should.equal('favorite not found');
          done();
      });
    });
  });

  describe('GET /api/v1/favorites/:id ', function(){
    beforeEach((done) => {
      database.seed.run()
      .then(() => done())
      .catch(error => {throw error;});
    });

    it('it returns favorite by id', function(done){
      chai.request(server)
        .get('/api/v1/favorites/3')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.have.property('favorites');

          response.body.favorites.should.have.property('id');
          response.body.favorites.id.should.equal(3);

          response.body.favorites.should.have.property('name');
          response.body.favorites.name.should.equal('song_3');

          response.body.favorites.should.have.property('artist_name');
          response.body.favorites.artist_name.should.equal('artist_3');

          response.body.favorites.should.have.property('genre');
          response.body.favorites.genre.should.equal('Country');

          response.body.favorites.should.have.property('rating');
          response.body.favorites.rating.should.equal('81');
          done();
        });
      });

      it('returns 400 error if favorite with id not found', function(done){
        chai.request(server)
          .get('/api/v1/favorites/5')
          .end((err, response) => {
            response.should.have.status(400);
            response.body.should.have.property('message');
            response.body.message.should.equal('favorite with id not found');
            done();
        });
      });
  });

  describe('POST /api/v1/favorites', function(){
    it ('returns favorited song', function(done){
      chai.request(server)
      .post('/api/v1/favorites')
      .send(
           {
           "name": "Bohemian Rapsody",
           "artist_name": "Queen",
           "genre": "Rock",
           "rating": 100
            })
      .end((err, response) => {
        response.should.have.status(201);
        response.should.be.json;

        response.body.should.have.property('favorites');

        response.body.favorites.should.have.property('id');

        response.body.favorites.should.have.property('name');
        response.body.favorites.name.should.equal('Bohemian Rapsody');

        response.body.favorites.should.have.property('artist_name');
        response.body.favorites.artist_name.should.equal('Queen');

        response.body.favorites.should.have.property('genre');
        response.body.favorites.genre.should.equal('Rock');

        response.body.favorites.should.have.property('rating');
        response.body.favorites.rating.should.equal('100');
        done();
      })
    });
  });

  describe('GET /api/v1/playlists',function(){
    it ('returns all playlists with favorites', function(done) {
      chai.request(server)
      .get('/api/v1/playlists')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;

        response.body["playlists"][0].should.have.property("name");
        response.body["playlists"][0].should.have.property("id");
        response.body["playlists"][0].should.have.property("favorites");
        done();
      })
    })
  });

  describe('DELETE /api/v1/favorites/:id', function(){
    beforeEach((done) => {
      database.seed.run()
      .then(() => done())
      .catch(error => {throw error;});
    });

    it('removes favorite by id', function(done){
      chai.request(server)
        .delete('/api/v1/favorites/1')
        .end((err, response) => {
          response.should.have.status(202);
          done();
        })
    });

    it('returns 400 if favorite not found', function(done){
      chai.request(server)
        .delete('/api/v1/favorites/5')
        .end((err, response) => {
          response.should.have.status(400);
          done();
        })
    });
  });


  describe('POST /api/v1/playlists/:playlist_id/favorites/:id', function(){
    it('can add new song to playlist', function(done){
      chai.request(server)
      .post('/api/v1/playlists/2/favorites/3')
      .end((err,response) => {
        response.should.have.status(201);
        response.body.message.should.equal(`Successfully added song_3 to playlist_2`);
        done();
      })
    })
  })

  describe('DELETE /api/v1/playlists/:id/favorites/:favorite_id', function(){
    beforeEach((done) => {
      database.seed.run()
      .then(() => done())
      .catch(error => {throw error;});
    });

    it('removes a favorite from a playlist', function(done){
      chai.request(server)
        .delete('/api/v1/playlists/1/favorites/1')
        .end((err, response) => {
          response.should.have.status(202);
          response.body.should.have.property('message')
          response.body.message.should.equal('Successfully removed song_1 from playlist_1');
          done();
        })
    });


    it('return 404 if playlist not found', function(done){
      chai.request(server)
        .delete('/api/v1/playlists/4/favorites/1')
        .end((err, response) => {
          response.should.have.status(404);
          response.body.should.have.property('message')
          response.body.message.should.equal('playlist not found');
          done();
        })
    });

    it('return 404 if favorite not found for playlist', function(done){
      chai.request(server)
        .delete('/api/v1/playlists/1/favorites/3')
        .end((err, response) => {
          response.should.have.status(404);
          response.body.should.have.property('message')
          response.body.message.should.equal('song_3 does not belong to requested playlist');
          done();
        })
    });

    it('returns 404 if favorite not found', function(done){
      chai.request(server)
        .delete('/api/v1/playlists/1/favorites/7')
        .end((err, response) => {
          response.should.have.status(404);
          response.body.should.have.property('message')
          response.body.message.should.equal('favorite not found');
          done();
        })
    });
  });
});
