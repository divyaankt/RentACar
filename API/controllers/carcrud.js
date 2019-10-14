const express = require('express')
const moment = require('moment')
const momentTimezone = require('moment-timezone')
const Car = require('../models/Car')
const { requireJWT } = require('../middleware/auth')

const router = new express.Router()

router.get('/cars', requireJWT, (req, res) => {
  Car.find()
    .then(car => {
      res.json(car)
    })
    .catch(error => {
      res.json({ error })
    })
})

router.post('/cars', requireJWT, (req, res) => {
  Car.create(req.body)
    .then(car => {
      res.status(201).json(car)
    })
    .catch(error => {
      res.status(400).json({ error })
    })
})

// Function to convert UTC JS Date object to a Moment.js object in AEST
const dateAEST = date => {
  return momentTimezone(date).tz('Asia/Kolkata')
}

// Function to calculate the duration of the hours between the start and end of the booking
const durationHours = (rentStart, rentEnd) => {
  // convert the UTC Date objects to Moment.js objeccts
  let startDateLocal = dateAEST(rentStart)
  let endDateLocal = dateAEST(rentEnd)
  // calculate the duration of the difference between the two times
  let difference = moment.duration(endDateLocal.diff(startDateLocal))
  // return the difference in decimal format
  return difference.hours() + difference.minutes() / 60
}

// Make a booking
router.put('/cars/:id', requireJWT, (req, res) => {
  const { id } = req.params
    Car.findByIdAndUpdate(
      id,
      {
        $addToSet: {
          rent: {
            user: req.user,
            // The hour on which the booking starts, calculated from 12:00AM as time = 0
            startHour: dateAEST(req.body.rentStart).format('H.mm'),
            // The duration of the booking in decimal format
            duration: durationHours(req.body.rentStart, req.body.rentEnd),
            // Spread operator for remaining attributes
            ...req.body
          }
        }
      },
      { new: true, runValidators: true, context: 'query' }
    )
      .then(car => {
        res.status(201).json()
      })
      .catch(error => {
        res.status(400).json({ error })
      })
})

// Delete a booking
router.delete('/cars/:id/:rentId', requireJWT, (req, res) => {
  const { id } = req.params
  const { rentId } = req.params
  Car.findByIdAndUpdate(
    id,
    { $pull: { rent: { _id: rentId } } },
    { new: true }
  )
    .then(car => {
      res.status(201).json(car)
    })
    .catch(error => {
      res.status(400).json({ error })
    })
})

module.exports = router