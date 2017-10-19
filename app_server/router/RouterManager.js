//Route için yol
var routeProcessing= require('./Processing');
//Login Route için
var routeLogin= require('./LoginRoute');

//Home Route için
var routeHome= require('./HomeRoute');


module.exports = function(app){
    app.use('/',routeHome);
    
    app.use('/login',routeLogin);
    
    app.use('/next',routeProcessing);
}
