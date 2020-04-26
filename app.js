//npm i express --save
const express = require('express');
const app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
var publicDir = require('path').join(__dirname, '/public');
app.use(express.static(publicDir));

//npm i handlebars consolidate --save
const engines = require('consolidate');
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

var homeController = require("./home.js");
app.use('/home', homeController);
var sanPhamController = require('./sanPham.js');
app.use('/product', sanPhamController);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`connected on ${PORT}`));