const { MongoClient } = require('mongodb')

let dbConnection // Global variable to store the database connection

module.exports = {
    connectToDb: async () => {
        // If the database connection already exists, return it
        if (dbConnection) {
            return dbConnection
        }

        try {
            // Establish a new database connection
            const client = await MongoClient.connect(process.env.REACT_APP_URI)
            dbConnection = client.db()
            return dbConnection
        } catch (err) {
            console.error(err)
            throw err
        }
    },
}
