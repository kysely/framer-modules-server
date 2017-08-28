import mongoose, { Schema } from 'mongoose'

const ModuleSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    unique_name: {
        type: String,
        lowercase: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },

    require: {
        type: String,
        required: true
    },
    install: {
        type: Schema.Types.Mixed, // String or [String]
        required: true
    },
    example: {
        type: String,
        required: true
    },
    dependencies: {
        type: [String],
        required: false
    },

    github: {
        type: String,
        required: true
    },

    thumb: {
        type: String,
        required: false
    },

    installed_count: {
        type: Number,
        required: true,
        default: 0,
    },

    uninstalled_count: {
        type: Number,
        required: true,
        default: 0
    },

    last_updated: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

ModuleSchema.index({ unique_name: 1 }, { unique: true })
ModuleSchema.index({ name: 'text', description: 'text', author: 'text', github: 'text' })
ModuleSchema.index({ installed_count: -1 })
ModuleSchema.index({ uninstalled_count: 1 })

export default mongoose.model('Module', ModuleSchema)
