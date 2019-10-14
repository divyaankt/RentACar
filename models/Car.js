const mongoose = require('./init')
const Schema = mongoose.Schema
const moment = require('moment')

const rentalSchema = new Schema({
  _rentId: Schema.Types.ObjectId,
  user: { type: Schema.ObjectId, ref: 'User' },
  rentStart: Date,
  rentEnd: Date,
  startHour: Number,
  duration: Number,
  carId: { type: Schema.ObjectId, ref: 'Car' }
})

// Validation to ensure a Car cannot be re-Rented
rentalSchema.path('rentStart').validate(function(value) {

  // Extract the Car Id from the query object
  let carId = this.carId
  
  // Convert booking Date objects into a number value
  let newRentStart = value.getTime()
  let newRentEnd = this.rentEnd.getTime()
  
  // Function to check for booking clash
  let clashesWithExisting = (existingRentStart, existingRentEnd, newRentStart, newRentEnd) => {
    if (newRentStart >= existingRentStart && newRentStart < existingRentEnd || 
      existingRentStart >= newRentStart && existingRentStart < newRentEnd) {
      
      throw new Error(
        `Car could not be rented. There is a clash with an existing rent from ${moment(existingRentStart).format('HH:mm')} to ${moment(existingRentEnd).format('HH:mm on LL')}`
      )
    }
    return false
  }
  
  // Locate the Car document containing the rentals
  return Car.findById(carId)
    .then(car => {

      // Loop through each existing rent and return false if there is a clash
      return car.rent.every(rent => {
        
        // Convert existing rent Date objects into number values
        let existingRentStart = new Date(rent.rentStart).getTime()
        let existingRentEnd = new Date(rent.rentEnd).getTime()

        // Check whether there is a clash between the new rentals and the existing rentals
        return !clashesWithExisting(
          existingRentStart, 
          existingRentEnd, 
          newRentStart, 
          newRentEnd
        )
      })
    })
}, `{REASON}`)


const carSchema = new Schema({
  car_model: { type: String, index: true, required: true },
  colour: { type: String },
  capacity: Number,
  isRented : { type: Boolean, default: false },
  rent: [rentalSchema]
})

const Car = (module.exports = mongoose.model('Car', carSchema))