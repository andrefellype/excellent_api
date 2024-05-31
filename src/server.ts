import express from 'express';
import cors from 'cors'
import expressSession from 'express-session'
import { VALUES_APP } from '@utils';
import path from 'path'

var helmet = require('helmet')

const server = express();
server.use(express.json());
server.use(function (_, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})
server.use(cors())
server.use(helmet())
server.use(expressSession({ secret: VALUES_APP().EXPRESS.SESSION_SECRET, resave: false, saveUninitialized: false }))
server.use('/files', express.static(path.resolve(__dirname, "..", "public", VALUES_APP().FILE.UPLOAD)))

export default server