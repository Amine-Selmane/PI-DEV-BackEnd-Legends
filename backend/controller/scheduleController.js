const asyncHandler = require('express-async-handler');

const ScheduleSession = require('../model/ScheduleSession');
const dispoData = require('../model/disponibilite.model');
const User = require('../model/user');

const addScheduleSession = asyncHandler(async (req, res) => {
  try {
    const { teacher, students, startDateTime, endDateTime } = req.body;
    const scheduleSession = new ScheduleSession({
      teacher,
      students,
      startDateTime,
      endDateTime,
    });

    const addedScheduleSession = await scheduleSession.save();
    res.status(201).json({
      message: 'New schedule added',
      addedScheduleSession,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getScheduleSessions = asyncHandler(async (req, res) => {
  try {
    // filtering
    const { teacher, student, startDateTime, endDateTime } = req.query;

    // filter by date range if startDateTime and endDateTime are provided

    const filter = {};

    if (startDateTime && endDateTime) {
      filter.startDateTime = { $gte: startDateTime, $lt: endDateTime };
    }

    if (teacher) {
      filter.teacher = teacher;
    }

    if (student) {
      filter.students = student;
    }

    const scheduleSessions = await ScheduleSession.find(filter);
    res.status(200).json({
      message: 'Schedule sessions fetched successfully',
      scheduleSessions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getAvailableStudentsAndTeachers = asyncHandler(async (req, res) => {
  try {
    const { jour, heureDebut, heureFin } = req.query;

    const dispo = await dispoData.find({
      jour,
      heureDebut: { $gte: heureDebut },
      heureFin: { $lt: heureFin },
    });
    console.log('🚀 ~ getAvailableStudentsAndTeachers ~ dispo:', dispo);

    const parseUser = function (user) {
      return {
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };
    };
    const teachers = [];
    const students = [];
    for (const element of dispo) {
      const user = await User.findById(element.utilisateur);
      //   console.log('🚀 ~ getAvailableStudentsAndTeachers ~ user:', user);
      if (user) {
        if (user.role === 'teacher') {
          console.log('user is teacher');
          teachers.push(parseUser(user));
          console.log('🚀 ~ getAvailableStudentsAndTeachers ~ teachers:', teachers);
        } else if (user.role === 'student') {
          console.log('user is student');
          students.push(parseUser(user));
        } else {
          console.log('user is not teacher or student');
        }
      }
    }

    console.log('result', teachers, students);
    res.status(200).json({
      message: 'Available students and teachers fetched successfully',
      teachers,
      students,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = { addScheduleSession, getScheduleSessions, getAvailableStudentsAndTeachers };
