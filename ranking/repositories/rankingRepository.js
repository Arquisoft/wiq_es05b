const fs = require('node:fs');
module.exports = {
    client: null,
    
    init: async function(client) {
        this.client = client
        try {
            await this.client.connect()
            let exists = await this.client.query("SELECT EXISTS (SELECT 1 FROM "
            + "information_schema.tables WHERE table_name = 'records') "
            + "AS table_existence;")
            if(!exists.rows[0].table_existence) {
                let data = fs.readFileSync('schema.sql', 'utf8')
                console.log('Table not found, creating records database')
                await this.client.query(data)
            }
            this.client.end()
        } catch (error) { return error }
    },

    getRanking: async function (n) {
        try {
            await this.client.connect();
            let result = await this.client
                .query('SELECT * FROM records ORDER BY points DESC LIMIT $1',
                    [n]);
            this.client.end();
            return result.rows
        } catch (error) { return error }
    },

    insertRecord: async function(username, points) {
        try {
            await this.client.connect()
            let result = await this
                .client
                .query('INSERT INTO records (name, points, date) VALUES ($1, $2, $3)',
                    [username, points, new Date()]);
            this.client.end()
            return result.rows
        } catch (error) { return error }
    }
}