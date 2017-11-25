var express = require("express");           //express web framework
var app = express();
var http    = require("http");              // http server core module
var easyrtc = require("easyrtc");           // easyRTC:  full-stack webrtc'nin üzerine kurulu bir framework. bize biraz daha kolaylık sağlıycak.
var io      = require("socket.io");         // web socket external module
var path=require('path');
var bodyParser = require('body-parser');    //form verilerinin ayrıştırılıması için
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(request,response,next){
    //console.log(request.body)
    console.log(request.session)
    console.log('Gelen İstek', request.url);
    console.log('İstek Tarihi,', Date.now());
    next();
});



// db ile mongoDB ye bağlanıyoruz.
mongoose.connect('mongodb://localhost/testForWebRTC');
var db =require('./app_server/models/db');
var db = mongoose.connection;
//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    })
  }));

  //express konfigrasyon
app.use('/public', express.static(path.join(__dirname, 'public')));




// easyrtc sunucusunu başlattık.
//https://easyrtc.com/docs/easyrtc_faq.php => bu adresten detaylara bakabilirsiniz.
//express serverda socket.io başlattık
var webServer = app.listen(8000);
//WebRTC'nin çalışması için socket.io çalıştırılır.
var socketServer = io.listen(webServer);
// EasyRTC server başlatılır.
var easyrtcServer = easyrtc.listen(app, socketServer, {'apiEnable':'true'});

//viewengine olarak jade yerine ejs yi tercih ettik.
var ejsLayouts = require('express-ejs-layouts');
app.set('view engine','ejs');
app.use(ejsLayouts);


//uygulamamıza views set ettik
app.set('views',path.join(__dirname,'./app_server/views'));



// Bize gelen istekleri parse etmek için body-parse tercih ettik. 








//Statically serve files in these directories  -easyRTC
app.use("/js", express.static(__dirname + '/node_modules/easyrtc/demos/js'));
app.use("/images", express.static(__dirname + '/node_modules/easyrtc/demos/images'));
app.use("/css", express.static(__dirname + '/node_modules/easyrtc/demos/css'));



//Serve a static login page if not logged in already
app.get('/konferans', function (req, res) {
    console.log('Login attempt');
    //true yazan kısma ileriki zamanlar oturum şartı geldiğinde düzenlicez.
    if (true) {
        res.sendfile(__dirname + '/node_modules/easyrtc/demos/demo_multiparty.html');
    }
    else {
        res.sendfile(__dirname + '/public/login.html');
    }
});

//routemanager
require('./app_server/router/RouterManager')(app);
//models
var user= require('./app_server/models/user');