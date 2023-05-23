const MongoDb = require('./mongodb.service')
const { mongoConfig, jwtTokenSecret } = require('../config')

const bcrypt = require('bcrypt') // for password hashing
const jwt = require('jsonwebtoken')

const userRegister = async (user) => {
    let response_data = {}

    const hashPassword = await bcrypt.hash(user?.password, 10)

    if(!user?.username || !user.email || !user.password){
        response_data = {
            status: false,
            message: "All fields are require.",
        }
    }else {
        try {
            let userObject = {
                username: user?.username,
                email: user?.email,
                password: hashPassword,
            }
    
            // save to db
            let save_user = await MongoDb.db
                .collection(mongoConfig.collections.USERS)
                .insertOne(userObject)
    
            console.log(save_user)
    
            if(save_user.acknowledged && save_user.insertedId){
                const token = jwt.sign(
                    {
                        username: user?.username,
                        email: user?.email,
                    },
                    jwtTokenSecret, // a secret key
                    {
                        expiresIn: `24h`
                    }
                )
    
                response_data = {
                    status: true,
                    message: "User registered successfully.",
                    token: token,
                }
            }else {
                response_data = {
                    status: false,
                    message: "User register failed.",
                }
            }
    
        } catch (error) {
            let errMessage = "User register failed."
            error?.code === 11000 && error?.keyPattern?.username ? 
                (errMessage = "Username is alredy exists."): null
            
            error?.code ===11000 && error?.keyPattern.email ?
                (errMessage = "Email is alredy exists."): null
                
            response_data = {
                status: false,
                message: errMessage,
                error: error,
            }
        }
    }

    return response_data
}


const userLogin = async (user) => {
    let response_data = {}

    if(!user.username || !user.password){
        response_data = {
            status: false,
            message: "All fields are required"
        }
    }else {
        try {
            // check the user is exist in the db or not.
            let user_data = await MongoDb.db
                .collection(mongoConfig.collections.USERS)
                .findOne({username: user?.username})
    
            if(user_data) {
                // varify password
                const isVerfiedPassword = await bcrypt.compare(user?.password, user_data?.password)
                if(isVerfiedPassword){
                    // password is ok then genarate the token
                    const token = jwt.sign(
                        {
                            username: user_data?.username,
                            email: user_data?.email
                        },
                        jwtTokenSecret,
                        {
                            expiresIn: '24h'
                        }
                    )
    
                    response_data = {
                        status: true,
                        message: "User login successfully.",
                        token: token,
                    }
                }else {
                    response_data = {
                        status: true,
                        message: "Incorrect password.",
                    }
                }
            }else {
                response_data = {
                    status: false,
                    message: "Login failed (No user found.)",
                }
            }
        } catch (error) {
            response_data = {
                status: false,
                message: 'User login failed.',
                error: error,
            }
        }
    }

    return response_data
}


const refreshToken = async (req, res) => {
    console.log(`tokenRefresh | Middleware | ${req?.originalUrl}`)

    try {
        let token = req?.headers['authorization']
        if(token && token?.startsWith("Bearer ")){
            token = token.slice(7, token?.length)
            console.log('TOKEN', token)

            jwt.verify(token, jwtTokenSecret, { ignoreExpiration: true }, (error, decoded) => {
                if(error){
                    res.status(401).json({
                        status: false,
                        message: "Invalid token",
                        error: `Invalid token: ${error?.message}`
                    })
                }else {
                    console.log('=======================================');
                    console.log(decoded?.email);
                    console.log(decoded?.username);
                    console.log('=======================================');
                    if(decoded?.username && decoded?.email){
                        let newToken = jwt.sign(
                            { username: decoded?.username, email: decoded?.email },
                            jwtTokenSecret,
                            { expiresIn: '24h' }
                        )

                        res.json({
                            status: true,
                            message: "Token refresh successful",
                            refresh: newToken,
                        })
                    }else {
                        res.status(401).json({
                            status: false,
                            message: `${error?.name} ${error?.email}: Invalid token`,
                            error: `Invalid token: ${error?.message}`
                        })
                    }
                }
            })
        }else {
            res.status(401).json({
                status: false,
                message: "Token missing",
            })
        }
    } catch (error) {
        res.status(401).json({
            status: false,
            message: `${error?.name} ${error?.email} : Token refresh failed`,
            error: `Token refresh failed: ${error?.message}`
        })
    }
}


const checkUserExist = async (query) => {
    let response_data = {}

    let message = {
        username: "Username is alredy taken",
        email: "User with this email address is alredy exist"
    }
    
    let queryType = Object.keys(query)[0] // query key index of 0

    try {
        let user_data = await MongoDb.db
            .collection(mongoConfig.collections.USERS)
            .findOne(query)

        if(!user_data) {
            response_data = {
                status: true,
                message: `This ${queryType} is not taken`,
                data: user_data,
            }
        }else {
            response_data = {
                status: false,
                message: `${message[queryType]}`,
                data: user_data, // null
            }
        }
    }catch (error) {
        response_data = {
            status: false,
            error: error,
        }
    }

    return response_data
}


module.exports = {
    userRegister,
    userLogin,
    refreshToken,
    checkUserExist,
}
