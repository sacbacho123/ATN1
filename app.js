const express = require('express');
const engines = require('consolidate');
const app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

//npm i handlebars consolidate --save
app.engine('hbs',engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');

var homeController = require("./home.js");
app.use('/home', homeController);

var sanPhamController = require('./sanPham.js');
app.use('/product',sanPhamController);

const PORT = process.env.PORT||8080;

app.listen(PORT,()=>console.log(`connected on ${ PORT }`));