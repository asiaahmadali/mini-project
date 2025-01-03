const express = require('express') ;
const app = express() ;
const userModel = require('./models/user') ;
const postModel = require('./models/post') ;
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt') ;
const jwt = require('jsonwebtoken') ;


app.use(express.json()) ;
app.use(express.urlencoded({extended:true})) ;
app.set('view engine','ejs') ;
app.use(cookieParser());


app.get('/',(req,res)=>{
    res.render('index')
})

// regiter route

app.post('/register',async(req, res)=>{
   const {username, name , email, password, age}= req.body;

   let user = await userModel.findOne({email}) ;
   if(user) return res.status(500).send('user already register');

   bcrypt.genSalt(10,(err, salt)=>{
    bcrypt.hash(password,salt,async (err, hash)=>{
     const user =  await userModel.create({
            username,
            name,
            email,
            password:hash,
            age
         });
    //    generate token
       const token =  jwt.sign({email:email,userid:user._id},'secretkeyyyyyyyyyy');
       res.cookie('token',token) ;
       res.send('registered') ;
    })
   })   
})


// login 

app.get('/login',(req,res)=>{
    res.render('login') ;
})

// login post method

app.post('/login',async (req,res)=>{
    const {email, password}= req.body ;
    
})

app.listen(3000,()=>{
    console.log('server started') ;
})