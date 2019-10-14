const Car = require('./Car')
const User = require('./User')

Car.deleteMany()
  .then(() => {
    console.log('Deleted cars')
    process.exit()
  })

User.deleteMany()
  .then(() => {
    console.log('Deleted users')
    process.exit()
  })