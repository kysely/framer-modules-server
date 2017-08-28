import { R, Response } from '../Response'
import { moduleExists } from '../queries/Module'

/*
 * GET /checkName/:moduleName
 */
const checkName = (req, res) => {
    const { send } = new Response(req, res)

    moduleExists(req.params.moduleName, (err, exists, unique_name) => {
        if (err) return send(500, 'ERR', err)

        const availability = exists ? R.NAME_TAKEN : R.NAME_OK

        const details = {
            available: !exists,
            name: req.params.moduleName,
            unique_name
        }

        send(...availability, details)
        return
    })
}

export default checkName
