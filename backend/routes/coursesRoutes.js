const express = require("express")
const router = express.Router()
const { getCourse, setCourse, updateCourse, deleteCourse, getById } = require("../controller/coursesController")

router.get('/getCourse', getCourse)
router.post('/setCourse', setCourse)
router.put('/updateCourse/:id', updateCourse)
router.delete('/deleteCourse/:id', deleteCourse)
router.get('/getCoursebyId/:id', getById)

module.exports = router