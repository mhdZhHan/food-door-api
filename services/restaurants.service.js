const MongoDb = require('./mongodb.service')
const { mongoConfig, jwtTokenSecret } = require('../config')


const getAllRestaurants = async () => {
    let response_data = {}
    try {
        let restaurants = await MongoDb.db
            .collection(mongoConfig.collections.RESTAURANTS)
            .find().toArray()
        
            if(restaurants && restaurants.length !== 0){
                response_data = {
                    status: true,
                    message: "Restaurants found successfully",
                    data: restaurants,
                } 
            }else {
                response_data = {
                    status: false,
                    message: "Restaurants not found",
                } 
            }
    } catch (error) {
        response_data = {
            status: false,
            message: "Restaurants finding failed",
            error: error?.message,
        } 
    }

    return response_data
}

module.exports = {
    getAllRestaurants
}