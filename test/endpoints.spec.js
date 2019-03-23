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
    it('returns favorites for a user', function(done){
      chai.request(server)
        .get('/api/v1/favorites')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');

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
  // eval(pry.it);
        response.body["favorites"].should.have.property('id');

        response.body["favorites"].should.have.property('name');
        response.body["favorites"].name.should.equal('Bohemian Rapsody');

        response.body["favorites"].should.have.property('artist_name');
        response.body["favorites"].artist_name.should.equal('Queen');

        response.body["favorites"].should.have.property('genre');
        response.body["favorites"].genre.should.equal('Rock');

        response.body["favorites"].should.have.property('rating');
        response.body["favorites"].rating.should.equal('100');
        done();
      })
    });
  });
});
