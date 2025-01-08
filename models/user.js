const mongoose = require('mongoose') ;
mongoose.connect('mongodb://127.0.0.1:27017/miniProject') ;

const userSchema = mongoose.Schema({
   username:String,
   name:String,
   age:Number,
   email:String,
   password:String,
   profilePic:{
    type:String,
    default:'default.jpeg'
   },
   posts:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'post'
    }
   ]
})

// export user module

module.exports = mongoose.model('user',userSchema) ;