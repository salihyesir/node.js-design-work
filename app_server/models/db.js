var mongoose = require ('mongoose');

var dbURI= 'mongodb://localhost/testForWebRTC';

// var promise = mongoose.connect(dbURI,{
//   useMongoClient: true,
// });

// Create the database connection 
mongoose.connect(dbURI); 
var db = mongoose.connection;


// CONNECTION EVENTS
// When successfully connected
db.on('connected', function () {  
  console.log('Mongoose default connection open to ' + dbURI);
}); 

// If the connection throws an error
db.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

db.once('open', function () {
  // we're connected!
});

// When the connection is disconnected
db.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 



// promise.then(function(db,err,err) {
//     if(err)
//     {
//         console.log("mongoose error"+ err);
//     }
//     else{
//         console.log('mongoose connect:'+ mongoDB)
//     }
// });