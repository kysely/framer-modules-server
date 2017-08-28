import { R, Response } from '../Response'
import { searchModules, listAllModules, findSingleModule } from '../queries/Module'

/*
 * GET /search/:searchQuery         /:page
 */
const search = (req, res) => {
    const { send } = new Response(req, res)

    // Skip pagination for now; will implement when there are more modules in db
    // if (req.params.page < 1) return send(...R.WRONG_PAGE)
    if (typeof req.params.searchQuery !== 'string') {
        send(...R.MOD_NFOUND, [])
        return
    } else if (req.params.searchQuery === 'all') {
        listAllModules((err, foundModules) => {
            if (err) return send(500, 'ERR', err)

            const response = foundModules.length > 0 ?
                            R.MOD_FOUND :
                            R.MOD_NFOUND

            send(...response, foundModules)
            return
        })
    } else if (req.params.searchQuery.indexOf(':') === 0) {
        const moduleName = req.params.searchQuery.replace(/:/, '')
        findSingleModule(moduleName, (err, foundModule) => {
            if (err) return send(500, 'ERR', err)

            const response = foundModule ? R.MOD_FOUND : R.MOD_NFOUND
            const data = foundModule ? [foundModule] : []

            send(...response, data)
            return
        })
    } else {
        searchModules(req.params.searchQuery, /*req.params.page,*/ (err, foundModules) => {
            if (err) return send(500, 'ERR', err)

            const response = foundModules.length > 0 ?
                            R.MOD_FOUND :
                            R.MOD_NFOUND

            send(...response, foundModules)
            return
        })
    }
}

export default search
