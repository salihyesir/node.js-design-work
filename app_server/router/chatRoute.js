var express =require('express');
var router = express.Router();

var ctrlChat= require('../controller/ChatController');

router.get('/random',ctrlChat.omegle);





module.exports = router;