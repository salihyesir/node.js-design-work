/**
 * Created by Emre-PC on 26.10.2017.
 */
var express =require('express');

var router = express.Router();

router.get('/chat', function(req, res, next) {
    res.render('chat', {title: 'chat'});
});

module.exports = router;