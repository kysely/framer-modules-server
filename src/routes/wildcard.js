import { R, Response } from '../Response'

/*
 * ALL /*
 */
const wildcard = (req, res) => {
    const { send } = new Response(req, res)
    send(...R.NOT_FOUND)
    return
}

export default wildcard
