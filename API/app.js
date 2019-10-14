const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config()

app.get('/', (req, res, next)=>{
    res.send('running node api');
});