const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRouters = require('./api/routes/products');
const orderRouters = require('./api/routes/orders');
const userRouters = require('./api/routes/user');

mongoose.connect(
    "mongodb://node-shop:" + 
    process.env.MONGO_ATLAS_PW + 
    "@node-rest-shop-shard-00-00-qssc3.mongodb.net:27017,node-rest-shop-shard-00-01-qssc3.mongodb.net:27017,node-rest-shop-shard-00-02-qssc3.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin"
);
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

//Routes which should handle requests
app.use('/products', productRouters);
app.use('/orders', orderRouters);
app.use('/user', userRouters);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;