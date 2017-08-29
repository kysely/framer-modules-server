import url from 'url'
import request from 'request'

import { R, Response } from '../Response'
import { moduleExists, findSingleModule, isValidModule, upsertSingleModule } from '../queries/Module'
import JSONparser from '../JSONparser'
import uniqueName from '../uniqueName'

const explodeGitHubURL = gitHubURL => {
    let userRepoBranch
    const userRepo = gitHubURL.replace(/^.+\.com\/|\.git|\/$/g, '')

    if (userRepo.indexOf('tree') !== -1) {
        userRepoBranch = userRepo.replace(/\/tree/, '')
    } else {
        userRepoBranch = `${userRepo}/master`
    }

    const [author, repo, branch] = userRepoBranch.split('/')
    return {
        repoURL: `https://raw.githubusercontent.com/${userRepoBranch}/`,
        author, repo, branch
    }
}

const checkModuleJSON = (gitHubURL, callback) => {
    const {author, repo, branch, repoURL} = explodeGitHubURL(gitHubURL)
    const moduleJsonUrl = url.resolve(repoURL, 'module.json')

    request.get(moduleJsonUrl, (err, res, moduleString) => {
        if (err || res.statusCode !== 200) {
            const errorResponse = [
                err ? 500 : res.statusCode,
                'ERR',
                err ? err.message : R.JSON_FAIL
            ]
            return callback(errorResponse, null)
        }

        JSONparser(moduleString, (err, parsedJSON) => {
            if (err) {
                const errorResponse = [...R.PARSE_FAIL, err.message]
                return callback(errorResponse, null)
            }

            const responseObject = {
                module: parsedJSON,
                request: gitHubURL,
                author, repo, branch
            }

            return callback(null, responseObject)
        })
    })

}

const parseNewModule = fetchRes => {
    const newModuleObject = fetchRes.module

    delete newModuleObject.installed_count
    delete newModuleObject.uninstalled_count
    delete newModuleObject.last_updated

    newModuleObject.github = fetchRes.request
    newModuleObject.unique_name = uniqueName(fetchRes.module.name)
    newModuleObject.last_updated = Date.now()

    return newModuleObject
}

const handleDuplicate = (fetchRes, callback) => {
    findSingleModule(fetchRes.module.name, (err, existingModule) => {
        if (err) return callback([500, 'ERR', err])

        const {author: authorOfExisting} = explodeGitHubURL(existingModule.github)

        if (fetchRes.author === authorOfExisting) {
            return callback([...R.DUPL_OK, fetchRes.module])
        } else {
            return callback([...R.DUPL_DENY])
        }
    })
}

const fetchNewModule = (gitHubURL, callback) => {
    checkModuleJSON(gitHubURL, (err, fetchRes) => {
        if (err) return callback(err)

        // Add correct unique_name and github keys
        fetchRes.module = parseNewModule(fetchRes)

        isValidModule(fetchRes.module, err => {
            if (err) return callback([200, 'ERR', err])

            moduleExists(fetchRes.module.name, (err, exists) => {
                if (err) return callback([500, 'ERR', err])
                if (exists) return handleDuplicate(fetchRes, callback)

                return callback([...R.MOD_FOUND, fetchRes.module])
            })
        })
    })
}

/*
 * GET /tryNew/:gitHubURL
 */
const tryNew = (req, res) => {
    const { send } = new Response(req, res)

    fetchNewModule(req.params.gitHubURL, resData => {
        send(...resData)
        return
    })
}

/*
 * POST /publishNew
 */
const publishNew = (req, res) => {
    const { send } = new Response(req, res)

    fetchNewModule(req.body.gitHubURL || '', response => {
        const [stCode, resStatus, resMessage, resData] = response

        if (resStatus === 'ERR' || resStatus === 'DUPL_DENY') {
            send(...response)
            return
        }

        upsertSingleModule(resData, (err, upsertedModule) => {
            if (err) return send(500, 'ERR', err)

            send(...R.PUBL_OK, upsertedModule)
            return
        })
    })
}

export { tryNew, publishNew }
