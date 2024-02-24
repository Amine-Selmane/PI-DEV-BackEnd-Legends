const mongoose = require('mongoose')


const coursesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    classroom: {
        type: String,
        required: true
    },
    teacher_name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Courses', coursesSchema)