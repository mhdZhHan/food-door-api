const  { MongoClient } = require('mongodb')

const { mongoConfig } = require('../config')

class MongoDb {
    static connectToMongoDb = () => {
        MongoClient.connect(mongoConfig.connectionUrl)
            .then(
                (connection) => {
                    console.log('Syccessfully connected to mongodb')
                    this.db = connection.db(mongoConfig.database_name)
                }
            )
            .catch((error)=> {
                console.log('Not connected ', error)
            })
    }
}

MongoDb.db = null


module.exports = MongoDb