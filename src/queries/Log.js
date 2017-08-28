import Log from '../models/Log'
import Projection from './Projection'

const saveLog = LogDocument => {
    new Log(LogDocument).save((err, log) => {
        if (err) console.log('Couldn\'t save the log:', err.message, LogDocument)
        return
    })
}

const getLogs = callback => {
    Log.find(
        {},
        Projection.Log.find,
        { sort: { request_timestamp: -1 } },
        (err, foundLogs) => {
            return callback(
                err ? err.message : null,
                foundLogs
            )
        }
    )
}

export {
    saveLog,
    getLogs
}
