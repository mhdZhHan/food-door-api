var express = require('express')
var router = express.Router()

const { userRegister, userLogin, 
    refreshToken, checkUserExist } = require('../../../../services/auth.service')


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

router.post('/token/refresh', refreshToken)

router.get('/user-exist', async (req, res)=>{
    let params = req.query
    let response = await checkUserExist(params)

    res.json(response)
})

module.exports = router
