const fs = require('node:fs');
module.exports = {
    client: null,
    uri: null,

    getConnection: async function () {
        let connection = new this.client(this.uri)
        await connection.connect()
        return connection
    },

    init: async function (client, uri) {
        this.client = client
        this.uri = uri
        let connection
        try {
            connection = await this.getConnection()
            let exists = await connection.query("SELECT EXISTS (SELECT 1 FROM "
                + "information_schema.tables WHERE table_name = 'records') "
                + "AS table_existence;")
            if (!exists.rows[0].table_existence) {
                let data = fs.readFileSync('schema.sql', 'utf8')
                console.log('Table not found, creating records database')
                await connection.query(data)
            }
        } catch (error) {
            throw error.code
        } finally {
            connection && await connection.end()
        }
    },

    getRanking: async function (n) {
        let connection
        try {
            connection = await this.getConnection()
            let result = await connection
                .query('SELECT * FROM records ORDER BY points DESC LIMIT $1',
                    [n]);
            return result.rows
        } catch (error) {
            throw error.code
        } finally {
            connection && await connection.end()
        }
    },

    insertRecord: async function (username, points) {
        let connection
        try {
            connection = await this.getConnection()
            let result = await connection
                .query('INSERT INTO records (name, points, date) VALUES ($1, $2, $3)',
                    [username, points, new Date()]);
            console.log('Score successfully stored')
            return result.rows
        } catch (error) {
            throw error.code
        } finally {
            connection && connection.end()
        }
    }
}