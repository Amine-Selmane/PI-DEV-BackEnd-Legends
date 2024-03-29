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
    duration: {
        type: Number,
        default : 30
    },
    teacher_name: {
        type: String,
        required: true
    },
    nbrQuiz:{
        type: Number 
    },
    halfYearlyPrice:{
        type:Number,
    },
    yearlyPrice:{
        type:Number,
    }
})

module.exports = mongoose.model('Courses', coursesSchema)