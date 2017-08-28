import { R, Response } from '../Response'
import { updateModuleStats } from '../queries/Module'
import { ALLOWED_UA } from '../serverConfig'

/*
 * PUT /installed/:moduleName
 * PUT /uninstalled/:moduleName
 */
const updateStats = (req, res) => {
    const { send } = new Response(req, res)

    if (req.headers['user-agent'] !== ALLOWED_UA) return send(...R.STATS_DENY)

    const update = req.url.match(/^\/i/) ?
                 { installed_count: 1 } :
                 { uninstalled_count: 1 }

    updateModuleStats(req.params.moduleName, update, (err, updatedModule) => {
        if (err) return send(500, 'ERR', err)

        send(...R.STATS_OK)
        return
    })
}

export default updateStats
