// const chai = require("chai");
// const should = chai.should();
// const expect = chai.expect();
// const chaiHttp = require('chai-http');
// const server = require('../index');
// const pry = require("pryjs");
// const configuration = require('../knexfile')["test"];
// const database = require('knex')(configuration);
//
// chai.use(chaiHttp);
//
// describe('more API routes', function(){
//   describe('GET /api/v1/favorites/:id ', function(){
//     database.seed.run()
//     .then(() => {
//       it('it returns favorite by id', function(done){
//         chai.request(server)
//           .get('/api/v1/favorites/4')
//           .end((err, response) => {
//             response.should.have.status(200);
//             response.should.be.json;
//             response.body.should.have.property('favorites');
//
//             response.body.favorites.should.have.property('id');
//             response.body.favorites.id.should.equal(4);
//
//             response.body.favorites.should.have.property('name');
//             response.body.favorites.name.should.equal('funk');
//
//             response.body.favorites.should.have.property('artist_name');
//             response.body.favorites.artist_name.should.equal('pink');
//
//             response.body.favorites.should.have.property('genre');
//             response.body.favorites.genre.should.equal('Rock');
//
//             response.body.favorites.should.have.property('rating');
//             response.body.favorites.rating.should.equal('100');
//             done();
//           });
//         });
//       })
//       .catch(error => { throw error; });
//
//       database.seed.run()
//       .then(() => {
//         it('returns 400 error if favorite with id not found', function(done){
//           chai.request(server)
//             .get('/api/v1/favorites/4')
//             .end((err, response) => {
//               response.should.have.status(400);
//               response.body.should.have.property('message');
//               response.body.message.should.equal('favorite not found');
//               done();
//           });
//         });
//       })
//       .catch(error => { throw error; });
//    });
// });
