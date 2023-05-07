const config = require('./package.json').projectConfig

module.exports = {
    mongoConfig : {
        connectionUrl: config.mongoConnectionUrl,
        database_name: 'db_fooddoor',
        collections: {
            USERS: 'users',
        },
    },

    serverConfig: {
        ip: config.serverIp,
        port: config.serverPort,
    },
    
    jwtTokenSecret: "fooddoor_secret",
}