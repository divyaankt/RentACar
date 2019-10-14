const express = require('express');
const mongoose = require('mongoose');
const app = express();

const DB_URL = "mongodb+srv://divyaankt:divyaank%40mongo@rac-api-78yya.mongodb.net/test?retryWrites=true&w=majority"
app.get('/', (req, res, next)=>{
    res.send('running node api');
});

mongoose.connect(DB_URL,{useNewUrlParser: true})
  .then(()=>{
    app.listen(3000);
    console.log('database connected!');})
  .catch(err => console.log(err));