//
const express = require('express');
const router=require('./routes/control');
const bcryptjs= require('bcryptjs')
const session = require('express-session');

const app=express();

app.use(express.urlencoded({extended:false}));
app.use(express.json());

const dotenv =require('dotenv');

dotenv.config({path:'./env/.env'});

//middlewares
app.use('/resources',express.static('public'));
app.use('/resources',express.static(__dirname + 'public'));
app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized:true
}));

//Settings
app.set('view engine', 'ejs');


//routes
app.use('/',router);

//LANZAR SERVIDOR
const PUERTO=3000;
app.listen(PUERTO,()=>{
    console.log(`Servidor listo en http://localhost:${PUERTO}`);
})