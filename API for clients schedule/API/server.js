const express = require('express')
const helmet = require('helmet')

const db = require('./core/database')
const appConfig = require('./config/app.json')

const app = express()
app.use(helmet())


// to support JSON-encoded bodies
app.use(express.json({
    limit: '500mb'
}))

// to support URL-encoded bodies
app.use(express.urlencoded({
    extended: true,
    limit: '500mb'
}))


app.use((req, res, next) => {
    if (req.header('X-API-Key') != appConfig.api_key) {
        res.json({ error_message: 'Unauthorized request' })
    }
    else {
        next()
    }
})


// configure database connection
app.use(async (req, res, next) => {
    let pool = await db.getConnection()
    res.locals.pool = pool
    next()
})

const routes = require('./routes/routes')

app.use('/api', routes)

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
    server.setTimeout(600000)
})

console.log('this is API ' + port);