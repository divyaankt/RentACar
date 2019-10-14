const mongoose = require('mongoose')
require('dotenv').config()
mongoose.Promise = global.Promise

//Establish Database Connection
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true})
	.then(() => {
    	console.log('Successfully Connected to Database')
  	})
	.catch(error => {
    	console.error('Error Connecting to MongoDB Atlas Database', error)
    })

module.exports = mongoose