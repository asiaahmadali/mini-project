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

// middleware for login

const isLoggedIn = (req,res,next)=>{
    if(req.cookies.token === '') res.redirect('/login')
    else{
       const data = jwt.verify(req.cookies.token,'secretkeyyyyyyyyyy')
       req.user = data ;
       next() ;
    }
   
}

// login 

app.get('/login',(req,res)=>{
    res.render('login') ;
})

// login post method

app.post('/login',async (req,res)=>{
    const {email, password}= req.body ;
    const user = await userModel.findOne({email:email}) ;
    if(!user) return res.status(500).send('something went wrong');

    bcrypt.compare(password,user.password,(err,result)=>{
        if(result){
            const token =  jwt.sign({email:email,userid:user._id},'secretkeyyyyyyyyyy');
            res.cookie('token',token) ;
            res.status(200).redirect('/profile') ;
        }
        else res.redirect('/login') ;
    })
})  



// logout

app.get('/logout',(req, res)=>{
    res.cookie('token','') ;
    res.redirect('/login') ;
})

// profile

app.get('/profile',isLoggedIn,async (req,res)=>{
   const user = await userModel.findOne({email:req.user.email}).populate('posts')
   res.render('profile',{user})
})

// edit the post

app.get('/edit/id',isLoggedIn, async (req,res)=>{
    const post = await postModel.findOne({_id:req.params.id}).populate('user') ;

    
})

// create the post

app.post('/post',isLoggedIn , async (req,res)=>{
    const user = await userModel.findOne({email:req.user.email})
    const post =  await postModel.create({
        user:user._id,
        content:req.body.content,      
    })
  
    user.posts.push(post._id) ;
    await user.save() ;
    res.redirect('/profile') ;
})

// litsen

app.listen(3000,()=>{
    console.log('server started') ;
})