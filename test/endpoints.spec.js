const chai = require("chai");
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../index');
const pry = require("pryjs");
const configuration = require('../knexfile')["test"];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('API routes', function(){
  before((done) => {
    database.migrate.latest()
    .then(() => done())
    .catch((error) => {throw error;});
  });

  beforeEach((done) => {
    database.seed.run()
    .then(() => done())
    .catch(error => {throw error;});
  });

  describe('GET /api/v1/favorites', function(){
    database.seed.run()
    .then(() => {
      it('returns favorites for a user', function(done){
        chai.request(server)
          .get('/api/v1/favorites')
          .end((err, response) => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('array');
            response.body.length.should.equal(3);
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
    })
    .catch(error => {throw error;})
  });

  describe('PUT /api/v1/favorites/:id ', function(){
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
        .put('/api/v1/favorites/20')
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
    it('it returns favorite by id', function(done){
      chai.request(server)
        .get('/api/v1/favorites/4')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.have.property('favorites');

          response.body.favorites.should.have.property('id');
          response.body.favorites.id.should.equal(4);

          response.body.favorites.should.have.property('name');
          response.body.favorites.name.should.equal('funk');

          response.body.favorites.should.have.property('artist_name');
          response.body.favorites.artist_name.should.equal('pink');

          response.body.favorites.should.have.property('genre');
          response.body.favorites.genre.should.equal('Rock');

          response.body.favorites.should.have.property('rating');
          response.body.favorites.rating.should.equal('100');
          done();
        });
    });

    it('returns 400 error if favorite with id not found', function(done){
      chai.request(server)
        .get('/api/v1/favorites/4')
        .end((err, response) => {
          response.should.have.status(400);
          response.body.should.have.property('message');
          response.body.message.should.equal('favorite not found');
          done();
      });
    });
  });
});
