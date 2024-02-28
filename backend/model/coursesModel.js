const mongoose = require('mongoose')


const coursesSchema = new mongoose.Schema({
    courseID: {
        type: mongoose.SchemaTypes.ObjectId
    } ,
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