const express = require("express");
const cors = require("cors");
const router = express.Router();
const SongsController = require("../../../controllers/songs_controller");

const whitelist = ['https://maddyg91.github.io', 'http://localhost:8080']
const corsOptions = {
  origin: function(origin, callback) {
     if(origin === undefined){
      callback(null, true);
    } else if (whitelist.indexOf(origin) === -1) {
      callback(new Error('Not allowed by CORS'));
    } else {
      callback(null, true);
    }
  },
  optionsSuccessStatus: 200
}

router.use(cors());
router.get('/', cors(corsOptions), SongsController.index);
router.post('/', cors(corsOptions), SongsController.create);
router.put('/:id', cors(corsOptions), SongsController.update);
router.get('/:id', SongsController.show);

module.exports = router
