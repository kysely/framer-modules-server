import path from 'path'
import zip from 'express-zip'

/*
 * GET /downloadDump
 */
const downloadDump = (req, res) => {
    res.zip([
        {
            path: path.resolve('dump', 'modules', 'modules.bson'),
            name: 'dump/modules/modules.bson'
        },
        {
            path: path.resolve('dump', 'modules', 'logs.bson'),
            name: 'dump/modules/logs.bson'
        },
        {
            path: path.resolve('dump', 'modules', 'modules.metadata.json'),
            name: 'dump/modules/modules.metadata.json'
        },
        {
            path: path.resolve('dump', 'modules', 'logs.metadata.json'),
            name: 'dump/modules/logs.metadata.json'
        }
    ], 'framer_modules_dump.zip')
}

export default downloadDump
