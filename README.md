# playPlay

Is a API that allows you access to several endpoints.
It allows full CRUD functionality for favoriting a song, it also allows you to add favorited songs to playlists and display those playlists.

## Endpoints
The base URL you can use is https://evening-cliffs-86902.herokuapp.com/ or http://localhost:8080/ if you want to run it locally.

These are the available endpoints:
 - GET /api/v1/favorites
    This endpoint will return a list of all the favorited songs.
    A sample response would looks like this:
    ```
      [
        {
          "id": 1,
          "name": "We Will Rock You",
          "artist_name": "Queen"
          "genre": "Rock",
          "rating": 88
        },
        {
          "id": 2,
          "name": "Careless Whisper",
          "artist_name": "George Michael"
          "genre": "Pop",
          "rating": 93
        },
      ]
    ```
- POST /api/v1/favorites
  This endpoint allows you to add a new favorite to the database.
  A sample request will need to have this information in the body:
  ```
  {
    "name": "Bohemian Rapsody",
    "artist_name": "Queen",
    "genre": "Rock",
    "rating": 100
   }
  ```
  A sample response would looks like this:
  ```
    {
      "favorites": {
        "id": 1,
        "name": "Bohemian Rapsody",
        "artist_name": "Queen",
        "genre": "Rock",
        "rating": 100    
      }
    }
  ```
- PUT /api/v1/favorites/:id
  A sample response would looks like this:
  ```
    {
      "favorites": {
        "id": 1,
        "name": "We Are the Champions",
        "artist_name": "Queen"
        "genre": "Rock",
        "rating": 77
      }
    }
  ```
- GET /api/v1/favorites/:id
  A sample response would looks like this:
  ```
    [
      {
        "id": 1,
        "name": "We Will Rock You",
        "artist_name": "Queen"
        "genre": "Rock",
        "rating": 88
      }
    ]
  ```
- DELETE /api/v1/favorites/:id
  This will delete a selected favorite by id
  It will return a 204 status code if the favorite id deleted succesfully.
- GET /api/v1/playlists
  A sample response would looks like this:
  ```
    [
        {
            "id": 1,
            "playlist_name": "Favorite songs of all time",
            "favorites": [
              {
                "id": 1,
                "name": "We Will Rock You",
                "artist_name": "Queen"
                "genre": "Rock",
                "rating": 88
              },
              {
                "id": 2,
                "name": "Careless Whisper",
                "artist_name": "George Michael"
                "genre": "Pop",
                "rating": 93
              }
            ]
        },
        {
            "id": 2,
            "name": "Other amazing songs",
            "favorites": [
              {
                "id": 1,
                "name": "We Will Rock You",
                "artist_name": "Queen"
                "genre": "Rock",
                "rating": 88
              },
              {
                "id": 2,
                "name": "Careless Whisper",
                "artist_name": "George Michael"
                "genre": "Pop",
                "rating": 93
              },
            ]
        },
    ]
  ```
- POST /api/v1/playlists/:playlist_id/favorites/:id
  A sample response would looks like this:
  ```
  {
    "message": "Successfully added SONG_NAME to PLAYLIST_NAME"
  }
  ```

## Schema

![Alt text](./schema.png?raw=true)

### Prerequisites

These are the commands you will need to get started:


### Installing
These are the packages you will need to install to get started
``````
npm install
npm install knex -g
npm install knex --save
npm install express -g
npm install express --save
npm install pg --save
npm install body-parser --save
``````
## Running the tests

To run the test you will need to install these packages:

```
npm install mocha
npm install chai
```
You should then be able to run the tests with the command:
```
npm test
```

### Break down into end to end tests

Here is a sample of an endpoint happy path test:

```describe('GET /api/v1/favorites', function(){
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
```

## Built With

* [Express](https://expressjs.com/)


## Contributing

You can contribute to this code by sending a PR to https://github.com/stoic-plus/playPlayBE. You code has to be tested.

## Authors

* **Ricardo Ledesma**  [stoic-plus](https://github.com/stoic-plus)
* **Maddie Jones**  [maddyg91](https://github.com/PurpleBooth)
