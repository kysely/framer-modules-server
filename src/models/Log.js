import mongoose, { Schema } from 'mongoose'

const LogSchema = new Schema({
    request: {
        type: String,
        required: true
    },
    request_timestamp: {
        type: Date,
        required: true,
        default: Date.now()
    },
    request_ip: {
        type: String,
        required: true
    },
    request_ua: {
        type: String,
        required: true
    },
    request_method: {
        type: String,
        required: true
    },
    request_body: {
        type: Object,
        required: false
    },
    response_timestamp: {
        type: Date,
        required: true,
        default: Date.now()
    },
    response_status: {
        type: Object,
        required: true
    },
    response_statusCode: {
        type: Number,
        required: true
    }
})

LogSchema.index({ request_timestamp: -1 })

export default mongoose.model('Log', LogSchema)
