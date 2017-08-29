const JSONparser = (jsonString, callback) => {
    const filteredJSONString = jsonString.replace(/<.+>/g, '')

    try {
        callback(null, JSON.parse(filteredJSONString))
    } catch(err) {
        callback(err, null)
    }

    return
}

export default JSONparser
