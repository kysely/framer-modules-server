import argv from 'minimist'
const CL_ARG = argv(process.argv)

const DEV =             CL_ARG.DEV || false
const ALLOWED_UA =      'Framer Modules'
const MODULES_PER_PAGE = 2
const SERVER_PORT =     process.env.PORT || 3000
const MONGO_PASSWORD =  process.env.MONGO_PASSWORD || CL_ARG.MONGO_PASSWORD
const MONGO_USER =      'framermodules'
const MONGO_DATABASE =  'modules'
const MONGO_REPSET =    'framermodules-shard-0'
const MONGO_NODES =     [
                            'framermodules-shard-00-00-9qvzk.mongodb.net:27017',
                            'framermodules-shard-00-01-9qvzk.mongodb.net:27017',
                            'framermodules-shard-00-02-9qvzk.mongodb.net:27017'
                        ]

/* If you're developing and want to connect to your
   localhost mongo server, just modify the MONGO_URI variable
   e.g. const MONGO_URI = 'mongodb://localhost:27017/modules' */
const MONGO_URI =       `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_NODES.join(',')}` +
                        `/${MONGO_DATABASE}?ssl=true&replicaSet=${MONGO_REPSET}&authSource=admin`

export {
    MONGO_URI,
    SERVER_PORT,
    DEV,
    MODULES_PER_PAGE,
    ALLOWED_UA
}
