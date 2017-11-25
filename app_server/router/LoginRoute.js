var express =require('express');

var router = express.Router();

var ctrlLogin = require('../controller/LoginController');

router.get('/',ctrlLogin.login);
router.post('/',ctrlLogin.loginPost);

router.get('/profile',ctrlLogin.getProfile);
router.get('/logout',ctrlLogin.logout);
/*
router.get('/signup',ctrlLogin.signupGet);
router.post('/signup',ctrlLogin.signupPost);

router.get('/usersList',ctrlLogin.usersList);

router.get('/userRemove/:userName',ctrlLogin.userRemove);*/
module.exports = router;