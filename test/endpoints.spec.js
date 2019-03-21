const chai = require("chai");
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../index');
const configuration = require('../knexfile')["test"];
const database = require('knex')(configuration);
pry = require('pryjs');

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
          response.body.favorites.name.should.equal('song_1');

          response.body.favorites.should.have.property('artist_name');
          response.body.favorites.name.should.equal('artist_1');

          response.body.favorites.should.have.property('genre');
          response.body.favorites.name.should.equal('Pop');

          response.body.favorites.should.have.property('rating');
          response.body.favorites.name.should.equal(88);
          done();
        })

      //         {
      //   "favorites": {
      //     "id": 1,
      //     "name": "We Are the Champions",
      //     "artist_name": "Queen"
      //     "genre": "Rock",
      //     "rating": 77
      //   }
      // }
    });

    it('returns 400 error if favorite not found', function(){
      chai.request(server)
        .put('/api/v1/favorites/20')
        .send({ name: "new_song", artist_name: "new_artist" })
        .end((err, response) => {
          response.should.have.status(200);
          done();
      });
    });
  });
});
