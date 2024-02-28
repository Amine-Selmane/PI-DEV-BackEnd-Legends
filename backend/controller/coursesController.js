const asyncHandler = require("express-async-handler")

const Courses = require("../model/coursesModel")

//Get 
//@Route  Get /path/path
//@Desc
const getCourse = asyncHandler(async (req, res) => {

    const courses = await Courses.find()
    res.status(200).json(courses)
})


//Set 
//@Route  POST /path/path
//@Desc


const setCourse = asyncHandler(async (req, res) => {
    if (!req.body.name) {
        res.status(400).json({ message: 'Name not found' })
    } else {
        const courses = await Courses.create({
            name: req.body.name,
            classroom: req.body.classroom,
            teacher_name: req.body.teacher_name
        })

        res.status(200).json({ courses: courses, message: 'Course added successfuly' })

    }
})

//Put 
//@Route  PUT /path/path/:id
//@Desc   

const updateCourse = asyncHandler(async (req, res) => {

    const courses = await Courses.findById(req.params.id)
    if (!courses) {
        res.status(400).json({ message: 'course not found' })
    }

    const updatedCourses = await Courses.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json(updatedCourses)
})


//delete 
//@Route  DELETE /path/path/:id
//@Desc   

const deleteCourse = asyncHandler(async (req, res) => {

    const courses = await Courses.findById(req.params.id)

    if (!courses) {
        return res.status(404).json({ message: "No course with this id" })
    }

    await courses.deleteOne()
    res.json({ id: req.params.id })

})

    const getById = asyncHandler(async (req, res) => {
        const courses = await Courses.findById(req.params.id)
        // Send response back if user is
        res.status(200).json(courses)
    })


    

module.exports = {
    getCourse,
    setCourse,
    updateCourse,
    deleteCourse,
    getById
}