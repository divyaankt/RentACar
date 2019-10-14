const mongoose = require('mongoose')
mongoose.Promise = global.Promise

mongoose.connect(process.env.MONGO_URI, { useMongoClient: true })
	.then(() => {
    	console.log('Successfully Connected to Database')
  	})
	.catch(error => {
    	console.error('Error Connecting to MongoDB Atlas Database', error)
    })

module.exports = mongoose