const express = require("express");
const router = express.Router();
const cors = require("../corsConfig").cors;
const corsOptions = require("../corsConfig").corsOptions;
const SongsController = require("../../../controllers/songs_controller");

router.use(cors());
router.get('/', cors(corsOptions), SongsController.index);
router.post('/', cors(corsOptions), SongsController.create);
router.put('/:id', cors(corsOptions), SongsController.update);
router.get('/:id', SongsController.show);
router.delete('/:id', cors(corsOptions), SongsController.deleteById);

module.exports = router
