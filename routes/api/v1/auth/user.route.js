const express = require('express')
const router = express.Router()

const getUserData = require('../../../../services/user.service')

// get user data
router.get('/user', async (req, res)=>{
    let username = req?.username
    let response = await getUserData(username)

    res.json(response)
})

module.exports = router