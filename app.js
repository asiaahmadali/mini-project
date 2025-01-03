const express = require('express') ;
const app = express() ;
const userModel = require('./models/user') ;
const cookieParser = require('cookie-parser');

app.use(express.json()) ;
app.use(express.urlencoded({extended:true})) ;
app.set('view engine','ejs') ;
app.use(cookieParser());


app.get('/',(req,res)=>{
    res.render('index')
})



app.listen(3000,()=>{
    console.log('server started') ;
})