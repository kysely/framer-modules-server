import { R, Response } from '../Response'
import { getLogs } from '../queries/Log'

/*
 * GET /logs
 */
const logs = (req, res) => {
    const { send } = new Response(req, res, false)

    getLogs((err, foundLogs) => {
        if (err) return send(500, 'ERR', err)

        const response = foundLogs.length > 0 ? R.LOGS_FOUND : R.LOGS_NFOUND

        send(...response, foundLogs)
        return
    })
}

export default logs
