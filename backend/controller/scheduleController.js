const asyncHandler = require('express-async-handler');

const ScheduleSession = require('../model/ScheduleSession');
const dispoData = require('../model/disponibilite.model');
const User = require('../model/user');

const addScheduleSession = asyncHandler(async (req, res) => {
  try {
    const { teacher, students, startDateTime, endDateTime, day } = req.body;

    const existingSession = await ScheduleSession.findOne({ teacher, day });
    if (existingSession) {

      //  // Convert students array to a set to remove duplicates
      //  const uniqueStudents = new Set(existingSession.students);
      
      //  // Add new students to the set
      //  students.forEach(student => uniqueStudents.add(student));
 
       // Convert set back to array

       existingSession.students = [];
       existingSession.students = students;
       
       await existingSession.save();
 
       res.status(200).json({
         message: 'Schedule updated with new students',
         existingSession,
       });
    } else {
      const scheduleSession = new ScheduleSession({
        teacher,
        students,
        startDateTime,
        endDateTime,
        day
      });

      const addedScheduleSession = await scheduleSession.save();
      res.status(201).json({
        message: 'New schedule added',
        addedScheduleSession,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getScheduleSessions = asyncHandler(async (req, res) => {
  try {
    const { teacher, student } = req.query;
    const filter = {};

    if (teacher) {
      filter.teacher = teacher;
    }else if (student) {
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
      heureDebut,
      heureFin,
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
    if (teachers.length === 0 && students.length === 0) {
      res.status(400).json({
        message: 'Unvailable students and teachers !!',
        teachers,
        students,
      });
    } else {
      res.status(200).json({
        message: 'Available students and teachers fetched successfully',
        teachers,
        students,
      });
    }



  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = { addScheduleSession, getScheduleSessions, getAvailableStudentsAndTeachers };
