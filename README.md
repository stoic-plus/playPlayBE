# playPlay

__Overview__

__playPlay__ is an CRUD app that allows that utilizes the MusicMatch API.
It allows full CRUD functionality for favorites (saved songs), it also allows you to add favorited songs to playlists and display those playlists.

## Table of Contents

- [Getting Started](#getting-started)
- [Endpoints](#endpoints)
  * [City Forecast](#city-forecast)
  * [Account Creation](#account-creation)
  * [Session Creation](#session-creation)
  * [Favorites Creation](#favorites-creation)
  * [Favorites Deletion](#favorites-deletion)
  * [Favorites Listing](#favorites-listing)
  * [Background Image](#background-image)
  * [Giphs!](#giphs!)
- [Built With](#built-with)
- [Built By](#built-by)


## Getting Started

To copy the app onto your machine:
```
$ git clone https://github.com/stoic-plus/playPlayBE.git
```

#### Prerequisites

This repository assumes you have a Postgres installed on your machine.
To create the necessary databases use the following commands:

```
$ psql
$ CREATE DATABASE play;
$ CREATE DATABASE play_test;
```

#### Installing and Running the tests

To install simply run:

``````
npm install
``````

Then run the following commands to get your DB setup with Knex

```
knex migrate:latest
knex seed:run
```


To run tests simply run:

```
npm test
```

## Endpoints

__Base URL__: https://evening-cliffs-86902.herokuapp.com/

All endpoints return the following error if favorite is not found by id

<details><summary>Example Error Response:</summary>

```
{message: "favorite not found"}
```

</details>

#### Get All Favorites

`GET /api/v1/favorites`

This endpoint will return a list of all the favorited songs.

<details><summary>Example Response:</summary>

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

</details>


#### Create a favorite

`POST /api/v1/favorites`

This endpoint allows you to add a new favorite to the database.
All fields must be specified

<details><summary>Example Request:</summary>

```
POST /api/v1/favorites HTTP/1.1
Content-Type: application/x-www-form-urlencoded

name=Bohemian%20Rapsody&artist_name=Queen&genre=Rock&rating=100
```

</details>

<details><summary>Example Response:</summary>

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

</details>

<details><summary>Example Error Response:</summary>

```
  { error: Expected format: { name: <String>, artist_name: <String>, genre: <Sting>, rating: <Integer>}. You're missing a <required parameter> property. }
```

</details>



#### Updating Favorites

`PUT /api/v1/favorites/:id`

All fields must be provided to update

<details><summary>Example Request:</summary>

```
PUT /api/v1/favorites HTTP/1.1
Content-Type: application/x-www-form-urlencoded

name=Bohemian%20Rapsody&artist_name=Queen&genre=Rock&rating=100
```

</details>

<details><summary>Example Response:</summary>

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

</details>



#### GET a Favorite

`GET /api/v1/favorites/:id`

<details><summary>Example Response:</summary>

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

</details>

#### Destroy a Favorite

`DELETE /api/v1/favorites/:id`

This will delete a selected favorite by id
It will return a 204 status code if the favorite id deleted successfully.

<details><summary>Example Response:</summary>

```
  { message: 'succesfully deleted' }
```

</details>


#### Get all Playlists

`GET /api/v1/playlists`

<details><summary>Example Response:</summary>

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

</details>


#### Creating a Favorite for a Playlist

`POST /api/v1/playlists/:playlist_id/favorites/:id`

<details><summary>Example Response:</summary>

```
{
  "message": "Successfully added SONG_NAME to PLAYLIST_NAME"
}
```

</details>

## Schema

![Alt text](./schema.png?raw=true)


## Built With

* [Express](https://expressjs.com/)
* [Knex](https://knexjs.org/)
* [Mocha](https://mochajs.org/)
* [Chai](https://www.chaijs.com/)
* [Chai-HTTP](https://www.chaijs.com/plugins/chai-http/)

## Contributing

You can contribute to this code by sending a PR to https://github.com/stoic-plus/playPlayBE. Your code has to be tested.

## Authors

* **Ricardo Ledesma**  [stoic-plus](https://github.com/stoic-plus)
* **Maddie Jones**  [maddyg91](https://github.com/maddyg91)
