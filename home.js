const express = require('express');
//const engines = require('consolidate');
var MongoClient = require('mongodb').MongoClient;

//DataBase (mongo atlas)
var url = 'mongodb+srv://ducanh123:ducanh1234@cluster0-2p8hw.azure.mongodb.net/test?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';

var router = express.Router();

router.get('/', (req, res)=>{
    res.render('HomePage');
});

module.exports = router;