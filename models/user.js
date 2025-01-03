const mongoose = require('mongoose') ;
mongoose.connect('mongodb//:127.0.0.1/27017miniProject') ;

const userSchema = mongoose.Schema({
   username:String,
   user:String,
   age:Number,
   email:String,
   password:String
})

module.exports = mongoose.model('user',userSchema) ;