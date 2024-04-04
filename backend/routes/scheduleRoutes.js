const express = require("express")
const router = express.Router()
const {addScheduleSlot} = require("../controller/scheduleController")

router.post("/addScheduleSlot", addScheduleSlot)

module.exports = router