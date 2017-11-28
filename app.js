var express = require("express");           //express web framework
var app = express();
var http    = require("http");              // http server core module
var easyrtc = require("easyrtc");           // easyRTC:  full-stack webrtc'nin üzerine kurulu bir framework. bize biraz daha kolaylık sağlıycak.
var sio      = require("socket.io");         // web socket external module
var path=require('path');
var bodyParser = require('body-parser');    //form verilerinin ayrıştırılıması için
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

app.use("/js", express.static(__dirname + '/easyrtc/js'));
app.use("/images", express.static(__dirname + '/easyrtc/images'));
app.use("/css", express.static(__dirname + '/easyrtc/css'));

app.use('/public', express.static(path.join(__dirname, 'public')));

//viewengine olarak jade yerine ejs yi tercih ettik.
var ejsLayouts = require('express-ejs-layouts');
app.set('view engine','ejs');
app.use(ejsLayouts);

//express konfigrasyon
app.use('/public', express.static(path.join(__dirname, 'public')));


//uygulamamıza views set ettik
app.set('views',path.join(__dirname,'./app_server/views'));


// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
/*
app.use(function(request,response,next){
    //console.log(request.body)
    console.log(request.session)
    console.log('Gelen İstek', request.url);
    console.log('İstek Tarihi,', Date.now());
    next();
});
*/

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


// easyrtc sunucusunu başlattık.
//https://easyrtc.com/docs/easyrtc_faq.php => bu adresten detaylara bakabilirsiniz.
//express serverda socket.io başlattık
var webServer = app.listen(8000);
//WebRTC'nin çalışması için socket.io çalıştırılır.
var io = sio.listen(webServer, {"log level":1});
// EasyRTC server başlatılır.
var easyrtcServer = easyrtc.listen(app, io, {'apiEnable':'true'});


app.get('/konferans', function (req, res) {
    console.log('Login attempt');
    //true yazan kısma ileriki zamanlar oturum şartı geldiğinde düzenlicez.
    if (true) {
        
        res.sendfile(__dirname + '/easyrtc/demo_multiparty.html');
    }
    else {
        easyrtc.setOption('apiEnable', 'false');
        res.sendfile(__dirname + '/public/login.html');
    }
});


app.get('/direk', function (req, res) {
    console.log('Login attempt');
    //true yazan kısma ileriki zamanlar oturum şartı geldiğinde düzenlicez.
    if (true) {
        
        res.sendfile(__dirname + '/easyrtc/demo_audio_video_simple.html');
    }
    else {
        easyrtc.setOption('apiEnable', 'false');
        res.sendfile(__dirname + '/public/login.html');
    }
});


app.get('/omegle', function (req, res) {
  console.log('Login attempt');
  //true yazan kısma ileriki zamanlar oturum şartı geldiğinde düzenlicez.
  if (true) {
      
    res.sendfile(__dirname + "/app_server/views/omegle.html");
  }
  else {
      easyrtc.setOption('apiEnable', 'false');
      res.sendfile(__dirname + '/public/login.html');
  }
});



//routemanager
require('./app_server/router/RouterManager')(app);
//models
var user= require('./app_server/models/user');

// Rastgele chat ortamı icin görüşme

var userList = {};
var waitingList = {};
var socketCount=0;


io.sockets.on("connection", function(socket) {
    socketCount++;
  
    socket.on("init_user", function(userData){
      // update the list of users
      userList[socket.id] = {"id": socket.id, "name": userData.name};
      
      // send the connected user list to the new user
      socket.emit("ui_user_set", userList);
      // send the new user to the all other users
      socket.broadcast.emit("ui_user_add", userList[socket.id]);
    });
    
    socket.on("next_user", function() {
      if(waitingList[socket.id]) return;
  
      if (Object.keys(waitingList).length == 0) {
        waitingList[socket.id] = true;
      } else {
        // pick a partner from the waiting list
        socket.partnerId = Object.keys(waitingList)[0];
  
        // connect two user with each other
        socket.emit("connect_partner", {'caller':false, 'partnerId': socket.partnerId});
        partnerSocket = io.sockets.socket(socket.partnerId);
        partnerSocket.partnerId = socket.id;
        partnerSocket.emit("connect_partner", {'caller':true, 'partnerId': socket.id});
        
        // delete the partner from the waiting list
        delete waitingList[socket.partnerId];
      }
    });
  });
  
  // Since "disconnect" event is consumed by easyRTC,
  // socket.on("disconnect",function(){}) will not work
  // use easyrtc event listener for disconnect
  easyrtc.events.on("disconnect", function(connectionObj, next){
    // call the default disconnect method 
    easyrtc.events.emitDefault("disconnect", connectionObj, next);
  
    var socket = connectionObj.socket;
    var id = socket.id; 
    // clear the server side variables
    socketCount--;
    delete userList[id];
    delete waitingList[id];
    
    // adjust the client side
    io.sockets.emit("ui_user_remove", id);
    if (socket.partnerId){
      partnerSocket = io.sockets.socket(socket.partnerId);
      partnerSocket.emit("disconnect_partner", socket.id);
      socket.partnerId = null;
    }
  });
  

/*
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
  });
  
  // error handler
  // define as the last app.use callback
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
  });
  */

