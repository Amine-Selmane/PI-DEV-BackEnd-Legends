const asyncHandler = require('express-async-handler');

const scheduleSlots = require('../model/schedule');
const dispoData = require('../model/disponibilite.model');

const addScheduleSlot = asyncHandler(async (req, res) => {
    let userId = "660483e22c8829a741b3cdfc"

    //verify user availability


    try {
        let userAvailable = await dispoData.find({
            utilisateur: userId
        });
        if (!userAvailable) {
            return res.status(400).json({ message: "Teacher is not available" });
        }
        else {

            userAvailable.forEach(element => {
                const schedule = scheduleSlots.create({
                    teacher: element.utilisateur,
                    // student: scheduleSlots.student,
                    day: element.jour,
                    startTime: element.heureDebut,
                    endTime: element.heureFin,
                    // classroom: scheduleSlots.classroom,
                    // class: scheduleSlots.class
                })
                console.log ("schedule created");
            })
            return res.json(userAvailable);
        }
    } catch (error) {

        console.log(error);
        res.status(500).json({ message: "Error at creating the schedule" });
    }

});


module.exports = { addScheduleSlot }

