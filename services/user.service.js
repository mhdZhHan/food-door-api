const { mongoConfig } =  require("../config")
const MongoDb = require('./mongodb.service')

const getUserData = async (username) => {
    let response_data = {}

    try {
        let userObject = await MongoDb.db
            .collection(mongoConfig.collections.USERS)
            .findOne({ username })

        if(userObject) {
            response_data = {
                status: true,
                data: userObject,
            }
        }else {
            response_data = {
                status: false,
                message: 'No user found'
            }
        }
    } catch (error) {
        response_data = {
            status: false,
            message: 'User finding fialed',
            error: error?.message
        }
    }

    return response_data
}

module.exports = getUserData