import Module from '../models/Module'
import uniqueName from '../uniqueName'
import Projection from './Projection'
import { MODULES_PER_PAGE } from '../serverConfig'

const moduleExists = (name, callback) => {
    const searchedName = uniqueName(name)

    Module.count({unique_name: searchedName}, (err, count) => {
        return callback(
            err ? err.message : null,
            count === 0 ? false : true,
            searchedName
        )
    })
}

const isValidModule = (moduleObject, callback) => {
    new Module(moduleObject).validate(err => {
        if (err) return callback(err.message)
        return callback(null)
    })
}

const findSingleModule = (name, callback) => {
    const searchedName = uniqueName(name)

    Module.findOne(
        {unique_name: searchedName},
        Projection.Module.find,
        (err, foundModule) => {
            return callback(
                err ? err.message : null,
                foundModule
            )
        }
    )
}

const upsertSingleModule = (newModule, callback) => {
    Module.findOneAndUpdate(
        { unique_name: newModule.unique_name },
        { $set: newModule },
        { upsert: true, setDefaultsOnInsert: true, new: true },
        (err, upsertedModule) => {
            return callback(
                err ? err.message : null,
                upsertedModule
            )
        }
    )
}

const updateModuleStats = (name, update, callback) => {
    const unique_name = uniqueName(name)

    Module.findOneAndUpdate(
        { unique_name },
        { $inc: update },
        { new: true },
        (err, updatedModule) => {
            return callback(
                err ? err.message : null,
                updatedModule
            )
        }
    )
}

const findMultiModules = (modules, callback) => {
    Module.find(
        { unique_name: { $in: modules } },
        Projection.Module.find,
        (err, foundModules) => {
            return callback(
                err ? err.message : null,
                foundModules
            )
        }
    )
}

const searchModules = (searchQuery, /*page,*/ callback) => {
    if (!searchQuery) return callback(null, [])
    // Using aggregation so that we can sort by search relevancy ($meta expression)
    Module.aggregate(
        { $match: { $text: { $search: searchQuery } } },
        { $sort: { relevancy: { $meta: 'textScore' }, installed_count: -1, uninstalled_count: 1 } },
        // { $skip: MODULES_PER_PAGE * (page-1) },
        // { $limit: MODULES_PER_PAGE },
        { $project: Projection.Module.find },
        (err, foundModules) => {
            return callback(
                err ? err.message : null,
                foundModules
            )
        }
    )
}

const listAllModules = callback => {
    Module.aggregate(
        { $match: { name: { $exists: true } } },
        { $sort: { installed_count: -1, uninstalled_count: 1 } },
        { $project: Projection.Module.find },
        (err, foundModules) => {
            return callback(
                err ? err.message : null,
                foundModules
            )
        }
    )
}

export {
    moduleExists,
    findSingleModule,
    upsertSingleModule,
    isValidModule,
    updateModuleStats,
    findMultiModules,
    searchModules,
    listAllModules
}
