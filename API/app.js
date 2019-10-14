const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const authMiddleware = require('./middleware/auth')
require('dotenv').config()

const app = express();

// Middleware
app.use(bodyParser.json())
app.use(cors({ credentials: true }))
app.use(authMiddleware.initialize)

// Routes
app.use([require('./controllers/logreg'), require('./controllers/carcrud')])

// Error handling
app.use((error, req, res, next) => {
  res.json({
    error: {
      message: error.message
    }
  })
})

// Read port and host from the configuration file
app.listen(process.env.PORT, process.env.LOCALHOST , error => {
  if (error) {
    console.error('Error starting', error)
  } else {
    console.info('Express listening on port ', process.env.PORT)
  }
})