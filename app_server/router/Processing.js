var express= require('express');

var controller = require('../controller/Controller');


var router = express.Router();

router.use(function(request,response,next){
    request.message='message';
    next();
});

router.get('/',controller.index);
router.get('/chat',controller.chat);
router.get('/room',controller.room);


module.exports= router;