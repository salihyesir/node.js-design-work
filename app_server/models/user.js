var mongoose = require ('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    userName:{ type: String, required:true, unique:true},
    mail:String,
    password: { type: String, required: true},
    avatar: { type:Buffer, contentType:String,default:null},
    isDeleted: { type:Boolean, required:true , default:false},
    friend:[String]
});

var users=mongoose.model('users',userSchema);


module.exports =users;