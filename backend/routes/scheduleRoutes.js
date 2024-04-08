const express = require('express');
const router = express.Router();
const {
  addScheduleSession,
  getScheduleSessions,
  getAvailableStudentsAndTeachers,
} = require('../controller/scheduleController');

router.get('/available', getAvailableStudentsAndTeachers);
router.post('', addScheduleSession);
router.get('', getScheduleSessions);

//http://localhost:5000/schedule/disponiblite/getAvailableStudentsAndTeachers
module.exports = router;