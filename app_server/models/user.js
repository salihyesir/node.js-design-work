var mongoose = require ('mongoose');
//mongoose: MongoDB ile etkileşimi basitleştirmek için nesne veri modellemesi
var Schema = mongoose.Schema;

var bcrypt = require('bcrypt');

var userSchema = new Schema({
    userName:{ type: String, required:true, unique:true, trim: true},
    email: { type: String, unique: true, required: true, trim: true},
    password: {
      type: String,
      required: true,
    },
    passwordConf: {
      type: String,
      required: true,
    },
    avatar: { type:Buffer, contentType:String,default:null},
    isDeleted: { type:Boolean, required:true , default:false},
    friend:[String]
});

//authenticate input against database
userSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({ email: email })
      .exec(function (err, user) {
        if (err) {
          return callback(err)
        } else if (!user) {
          var err = new Error('User not found.');
          err.status = 401;
          return callback(err);
        }
        bcrypt.compare(password, user.password, function (err, result) {
          if (result === true) {
            return callback(null, user);
          } else {
            return callback();
          }
        })
      });
  }

//hashing a password before saving it to the database
userSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash){
    if (err) {
        return next(err);
    }
    user.password = hash;
    next();
    })
});


var User=mongoose.model('User',userSchema);


module.exports =User;