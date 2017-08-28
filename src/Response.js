import { saveLog } from './queries/Log'

const R = {
    _NULL_IP:   'Unknown Request IP',
    _NULL_REQ:  'Unknown Request URI',
    _NULL_MET:  'Unknown Request Method',
    _NULL_UA:   'Unknown User Agent',
    _NO_RES:    (resHandl, resObj) => ['Couldn\'t respond:', resHandl, '\nResponse:', resObj],
    JSON_FAIL:  'Sorry, but I couldn\'t find the \'module.json\' file',
    NOT_FOUND:  [404, 'ERR', 'Not Found'],
    DUPL_OK:    [200, 'DUPL_OK', 'Module name is already taken, but allowed to update from the same author.'],
    DUPL_DENY:  [200, 'DUPL_DENY', 'Sorry, module name is already taken by someone else.'],
    PUBL_OK:    [201, 'OK', 'Module was successfully published.'],
    NAME_OK:    [200, 'OK', 'Module name is available for publishing.'],
    NAME_TAKEN: [200, 'TAKEN', 'Module name is taken.'],
    MOD_FOUND:  [200, 'OK', 'Your modules are saved in \'data\' key.'],
    MOD_NFOUND: [404, 'NFOUND', 'No modules found.'],
    STATS_OK:   [201, 'OK', 'Stats were updated.'],
    STATS_DENY: [403, 'DENY', 'Stats can be updated from Framer Modules only.'],
    LOGS_FOUND: [200, 'OK', 'Logs from the newest to oldest.'],
    LOGS_NFOUND:[404, 'NFOUND', 'No logs to show.'],
    WRONG_PAGE: [403, 'OK', 'Search pagination must start from page 1.'],

}

class Response {
    constructor(req, res, doLog = true) {
        this.res = res
        this.canRespond = this.res && this.res.status && this.res.json

        this.send = this.send.bind(this)

        // Don't log Safari automatic reqs for 'favicon' and 'apple-touch-icon'
        this.doLog = req.url.match(/^\/favicon|^\/apple-touch/) ?
                     false :
                     doLog

        this.log = {
            request_timestamp: Date.now(),
            request_ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress || R._NULL_IP,
            request: req.url || R._NULL_REQ,
            request_method: req.method || R._NULL_MET,
            request_ua: req.headers['user-agent'] || R._NULL_UA,
            request_body: req.body ? req.body : undefined
        }
    }

    send(statusCode = 500, status = 'ERR', message = null, data = null) {
        const ResObj = {
            message,
            statusCode: parseInt(statusCode),
            status,
            data,
        }

        this.log.response_timestamp = Date.now()
        this.log.response_status = ResObj.status
        this.log.response_statusCode = ResObj.statusCode

        if (this.doLog) saveLog(this.log)

        if (!this.canRespond) {
            console.log(...R._NO_RES(this.res, ResObj))
            return
        }

        this.res.status(ResObj.statusCode).json(ResObj)
        return
    }
}

export { R, Response }
