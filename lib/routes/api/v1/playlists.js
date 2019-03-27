const express = require("express");
const router = express.Router();
const cors = require("../corsConfig").cors;
const corsOptions = require("../corsConfig").corsOptions;
const PlaylistsController = require("../../../controllers/playlists_controller");
const SongsController = require("../../../controllers/songs_controller");

router.use(cors());
router.get('/', cors(corsOptions), PlaylistsController.index);
router.post('/:playlist_id/favorites/:id', cors(corsOptions), PlaylistsController.createFavorite);
router.delete('/:playlist_id/favorites/:id', cors(corsOptions), PlaylistsController.deleteFavorite);

module.exports = router;
