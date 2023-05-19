const jwt = require('jsonwebtoken')
const config = require('../config')

const tockenVerification = async (req, res, next) => {
    console.log(
        `auth.service || tockenVerification ${req?.originalUrl}`
    )

    try {
        if(
            req?.originalUrl.endsWith('/login') ||
            req?.originalUrl.endsWith('/signup') ||
            req?.originalUrl.endsWith('/user-exist')
        ){
            return next()
        }else {
            let token = req?.headers['authorization']
            if(token && token.startsWith('Bearer ')){
                token = token.slice(7, token?.length) // remove `Bearer` from totel token length
                jwt.verify(token, config.jwtTokenSecret, (error, decoded) => {
                    if(error) {
                        res.status(401).json({
                            status: false,
                            message: error?.name ? error?.name : 'Invalid token',
                            error: `Invalid token | ${error?.message}`
                        })
                    }else {
                        req['username'] = decoded?.username
                        next()
                    }
                })
            }else {
                res.status(401).json({
                    status: false,
                    message: 'Token missing',
                    error: 'Token missing'
                })
            }
        }
    } catch (error) {
        res.status(401).json({
            status: false,
            message: error?.message ? error?.message : 'Authentication failed',
            error: `Authentication failed ${error?.message}`
        })  
    }
}

module.exports = {
    tockenVerification
}