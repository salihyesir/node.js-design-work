var http=require("http");
var path=require('path');

var express = require('express');
var app = express();

var ejsLayouts = require('express-ejs-layouts');

var bodyParser = require('body-parser');

var db =require('./app_server/models/db');

app.set('view engine','ejs');

app.use(ejsLayouts);


app.set('views',path.join(__dirname,'./app_server/views'));


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())





app.use('/public', express.static(path.join(__dirname, 'public')));

require('./app_server/router/RouterManager')(app);

var user= require('./app_server/models/user');

// app.use(function(request,response,next){
//     console.log('Gelen İstek', request.url);
//     console.log('İstek Tarihi,', Date.now());
//     next();
// });



app.listen(8000)
