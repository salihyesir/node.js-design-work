var mongoose = require ('mongoose');
//mongoose: MongoDB ile etkileşimi basitleştirmek için nesne veri modellemesi
var UserSchema = mongoose.Schema;

var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    userName:{ type: String, required:true, unique:true, trim: true},
    email: { type: String, unique: true, required: true, trim: true},
    password: {
      type: String,
      required: true,
    },
    //şifrelenmemiş hali en son uygulamadan kaldırılacaktır
    passwordConf: {
      type: String,
      required: true,
    },
    avatar: { type:Buffer, contentType:String,default:null},
    isDeleted: { type:Boolean, required:true , default:false},
    friend:[String]
});

//authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
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
UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash){
    if (err) {
        return next(err);
    }
    user.password = hash;
    next();
    })
});


var User=mongoose.model('User',UserSchema);


module.exports =User;