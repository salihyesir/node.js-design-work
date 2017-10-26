//Route için yol


var loginRoute= require('./LoginRoute');
var chatRoute= require('./chatRoute');



module.exports = function(app){
    app.use('/login',loginRoute);
    app.use('/chat',chatRoute);
}
