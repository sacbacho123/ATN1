const express = require('express');
var router = express.Router();
const multer = require('multer');
fs = require('fs-extra');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const MongoClient = require('mongodb').MongoClient;
ObjectId = require('mongodb').ObjectId;

var url = 'mongodb+srv://ducanh123:ducanh1234@cluster0-2p8hw.azure.mongodb.net/test?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({ storage: storage });

MongoClient.connect(url, (err, client) => {
    if (err) return console.log(err);
    db = client.db('dbtest')
});

router.get('/', async (req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("dbtest");
    let results = await dbo.collection("table").find({}).toArray();
    res.render('allProduct', { sanPham: results });
})

//Update 
router.get('/edit', async (req, res) => {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let client = await MongoClient.connect(url);
    let dbo = client.db("dbtest");
    let result = await dbo.collection("table").findOne({ "_id": ObjectID(id) });
    res.render('editProduct', { sanPham: result });
})
router.post('/edit', async (req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    let category = req.body.category;
    let price = req.body.price;
    let newValues = { $set: { TenSP: name, Category: category, Price: price } };
    var ObjectID = require('mongodb').ObjectID;
    let condition = { "_id": ObjectID(id) };

    let client = await MongoClient.connect(url);
    let dbo = client.db("dbtest");
    await dbo.collection("table").updateOne(condition, newValues);
    //
    let results = await dbo.collection("table").find({}).toArray();
    res.render('allProduct', { sanPham: results });
})

//insert
router.get('/insert', (req, res) => {
    res.render('insertProduct');
});
router.post('/insert', upload.single('picture'), async (req, res) => {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');

    var insertProducts = {
        _id: req.body._id,
        TenSP: req.body.product,
        Category: req.body.Cat,
        Price: req.body.price,
        contentType: req.file.mimetype,
        image: new Buffer(encode_image, 'base64')
    };
    let client = await MongoClient.connect(url);
    let dbo = client.db("dbtest");
    await dbo.collection("table").insertOne(insertProducts, (err, result) => {
        console.log(result)
        if (err) return console.log(err)
        console.log('saved to database')
    });
    let result2 = await dbo.collection("table").find({}).toArray();
    res.render('allProduct', { sanPham: result2 });
})
router.get('/photos/:id', (req, res) => {
    var filename = req.params.id;
    db.collection('table').findOne({ '_id': ObjectId(filename) }, (err, result) => {
        if (err) return console.log(err);
        res.contentType('image/jpeg');
        res.send(result.image.buffer);
    })
})

//search
// router.get('/search',(req,res)=>{
//     res.render('searchSanPham');
// })
router.post('/search', async (req, res) => {
    let searchSP = req.body.tenSP;
    let client = await MongoClient.connect(url);
    let dbo = client.db("dbtest");
    let results = await dbo.collection("table").find({ "TenSP": searchSP }).toArray();
    res.render('allProduct', { sanPham: results });
})

//delete
router.get('/delete', async (req, res) => {
    let client = await MongoClient.connect(url);
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let dbo = client.db("dbtest");
    let condition = { "_id": ObjectID(id) };
    await dbo.collection("table").deleteOne(condition);
    let results = await dbo.collection("table").find({}).toArray();
    res.render('allProduct', { sanPham: results });
})

module.exports = router;