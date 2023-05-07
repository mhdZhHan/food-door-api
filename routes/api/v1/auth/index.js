var express = require('express')
var router = express.Router()

const { userRegister, userLogin } = require('../../../../services/auth.service')


router.post('/signup', async (req, res, next) => {
    let body = req.body
    console.log(body)
    let response = await userRegister(body)

    res.json(response)
})

router.post('/login', async (req, res)=>{
    let body = req.body
    let response = await userLogin(body)

    res.json(response) // send a response data
})

module.exports = router
