const configuration = require('./knexfile')["test"];
const database = require('knex')(configuration);
const chai = require("chai");
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../index');

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
    it('returns favorites for a user', function(){
      chai.request(server)
        .get('/api/v1/favorites')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.should.be.a('array');
          response.body.length.should.equal(3);

          response.body[0].should.have.property('id');
          response.body[0].id.should.equal('1');

          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('song_1');

          response.body[0].should.have.property('artist_name');
          response.body[0].id.should.equal('artist_1');

          response.body[0].should.have.property('genre');
          response.body[0].id.should.equal('Pop');

          response.body[0].should.have.property('rating');
          response.body[0].id.should.equal('88');
        })
    });
  });
});
