const express = require('express')
const router = express.Router()

const { getAllRestaurants } = require('../../../../services/restaurants.service')

router.get('/', async (req, res)=> {
    let response = await getAllRestaurants()
    res.json(response)
})

module.exports = router