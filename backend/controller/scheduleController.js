const asyncHandler = require('express-async-handler');

const scheduleSlots = require('../model/schedule');
const dispoData = require('../model/disponibilite.model');

const addScheduleSlot = asyncHandler(async (req, res) => {

    //verify teacher availability
    let teacherAvailable = await dispoData.findOne({
        utilisateur: scheduleSlots.teacher,
        jour: scheduleSlots.day,
        heureDebut: scheduleSlots.startTime,
        heureFin: scheduleSlots.endTime
    });
    if (!teacherAvailable) {
        return res.status(400).json({ message: "Teacher is not available" });
    }

    //verify student availability
    let studentAvailable = await dispoData.findOne({
        utilisateur: scheduleSlots.student,
        jour: scheduleSlots.day,
        heureDebut: scheduleSlots.startTime,
        heureFin: scheduleSlots.endTime
    });
    if (!studentAvailable) {
        return res.status(400).json({ message: "Student is not available" });
    }

    //create schedule based on teacher and student availabilty
    const schedule = await scheduleSlots.create({
        teacher: scheduleSlots.teacher,
        student: scheduleSlots.student,
        day: scheduleSlots.day,
        startTime: scheduleSlots.startTime,
        endTime: scheduleSlots.endTime,
        classroom: scheduleSlots.classroom,
        class: scheduleSlots.class
    })
});


module.exports = { addScheduleSlot }

