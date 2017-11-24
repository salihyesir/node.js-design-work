var http    = require("http");              // http server core module
var easyrtc = require("easyrtc");           // easyRTC:  full-stack webrtc'nin üzerine kurulu bir çerçevedir. bize biraz daha kolaylık sağlıycak.
var io      = require("socket.io");         // web socket external module
var path=require('path');


//web framework olan express' i yüklüyoruz ve konfigrasyonunu yapıyoruz.
var express = require("express");    
var app = express();
//public klasörümü uygulamaya static olarak bildiriyoruz.
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


//form verilerinin ayrıştırılıması için
var bodyParser = require('body-parser');

var db =require('./app_server/models/db');

//uygulamamıza views set ettik
app.set('views',path.join(__dirname,'./app_server/views'));



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


require('./app_server/router/RouterManager')(app);
var user= require('./app_server/models/user');


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
