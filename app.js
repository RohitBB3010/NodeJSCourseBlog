const express = require('express');
const body_parser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');
const exp = require('constants');

const app = express();

app.use(body_parser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feeds', feedRoutes);

mongoose.connect('mongodb+srv://rohit:Rohit123%40@cluster0.ha5sq.mongodb.net/messages?&w=majority&appName=Cluster0').then(result => {
    app.listen(8080);
}).catch(err => {
    console.log(result);
})