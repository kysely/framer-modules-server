import { R, Response } from '../Response'
import { findSingleModule } from '../queries/Module'

/*
 * GET /module/:moduleName
 */
const module = (req, res) => {
    const { send } = new Response(req, res)

    findSingleModule(req.params.moduleName, (err, foundModule) => {
        if (err) return send(500, 'ERR', err)

        const response = foundModule ? R.MOD_FOUND : R.MOD_NFOUND

        send(...response, foundModule)
        return
    })
}

export default module
