const mongoose = require('mongoose')

const booksSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    author: {
        type: String,
        trim: true,
        required: true,
    },
    publishedYear: {
        type: Number,
        required: true,
    },
    genre: [String],
    language: {
        type: String,
        trim: true,
    },
    country: {
        type: String,
        trim: true,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 10,
        default: 0,
    },
    summary: {
        type: String,
        trim: true,
    },
    coverImageUrl:{
        type: String,
        trim: true,
    }
}, {timestamps: true})


const NewBook = mongoose.model('NewBook', booksSchema)

module.exports = NewBook