import { R, Response } from '../Response'
import { findMultiModules } from '../queries/Module'

/*
 * GET /preset?modules[]=
 */
const preset = (req, res) => {
    const findModules = req.query.modules

    const { send } = new Response(req, res)

    findMultiModules(findModules, (err, foundModules) => {
        if (err) return send(500, 'ERR', err)

        const response = foundModules.length > 0 ? R.MOD_FOUND : R.MOD_NFOUND

        send(...response, foundModules)
        return
    })
}

export default preset
