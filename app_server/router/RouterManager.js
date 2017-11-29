//Route için yol


var loginRoute= require('./LoginRoute');
var chatRoute= require('./chatRoute');



module.exports = function(app){
    app.use('/',loginRoute);
    app.use('/chat',chatRoute);
}
