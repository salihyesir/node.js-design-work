var mongoose = require ('mongoose');


var mongoDB= 'mongodb://localhost/NodeProje';
var promise = mongoose.connect(mongoDB,{
  useMongoClient: true,
  /* other options */
  
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