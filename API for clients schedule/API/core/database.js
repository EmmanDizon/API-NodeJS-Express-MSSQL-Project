const environment = process.env.NODE_ENV || 'development'

const dbConfig = require('../config/database.json')[environment]

const sql = require('mssql')

var connection = undefined
let connectionPools = []

async function connect(newDBConfig = undefined) {
    try {
        const config = dbConfig.database
       
        
        const connectionName = getConnectionName(config)
    
        if (!connectionPools[connectionName]) {
       
                  
            connectionPools[connectionName] = await new sql.ConnectionPool(config).connect()
        
        }
    
        //const pool = new sql.ConnectionPool(config)
        //connection = await pool.connect()

        return connectionPools[connectionName]
    }
    catch (error) {
        console.log(error)
        throw 'Error connecting to database server.'
    }
}

async function getConnection() {
    return await connection||connect()
}

const toSQLBoolean = function(value) {
    if (value === true || value === '1' || value === 1 || value.toString().toLowerCase() === 'true')
        return 1
    else if (value === false || value === '0' || value === 0 || value.toString().toLowerCase() === 'false')
        return 0
    else
        return value
}

const getConnectionName = (config) => {
    return config.server + config.port.toString() + config.database
}

module.exports = {
    connect,
    sql,
    getConnection,
    toSQLBoolean
}
