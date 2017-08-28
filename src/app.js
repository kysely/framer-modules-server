import mongoose from 'mongoose'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import Module from './models/Module'
import Log from './models/Log'

import { MONGO_URI, SERVER_PORT, DEV } from './serverConfig'
import search from './routes/search'
import preset from './routes/preset'
import module from './routes/module'
import updateStats from './routes/updateStats'
import checkName from './routes/checkName'
import { tryNew, publishNew } from './routes/publish'
import logs from './routes/logs'
import downloadDump from './routes/downloadDump'
import wildcard from './routes/wildcard'

const server = express()
if (DEV) server.use( cors() ), console.log('!CORS ENABLED')
server.use( bodyParser.json() )
server.use( bodyParser.urlencoded({ extended: true }) )
server.set('json spaces', 2)

mongoose.Promise = global.Promise
mongoose.connect(MONGO_URI, { config: { autoIndex: true, useMongoClient: true } }, err => {
    if (err) return console.error('SERVER FAILED TO CONNECT TO MONGODB:', err.message)
    console.log('SERVER IS CONNECTED TO MONGODB')
})

server
    .get('/search', search) // for pagination, use /search/:searchQuery/:page
    .get('/search/:searchQuery', search) // for pagination, use /search/:searchQuery/:page
    .get('/preset', preset)
    .get('/module/:moduleName', module)
    .put('/installed/:moduleName', updateStats)
    .put('/uninstalled/:moduleName', updateStats)
    .get('/checkName/:moduleName', cors(), checkName)
    .get('/tryNew/:gitHubURL', tryNew)
    .post('/publishNew', publishNew)
    // .get('/logs', logs)
    // .get('/downloadDump', downloadDump)
    .all('*', wildcard)
    .listen(SERVER_PORT, () => {
        console.log(`SERVER IS RUNNING ON PORT ${SERVER_PORT}`)
    })
