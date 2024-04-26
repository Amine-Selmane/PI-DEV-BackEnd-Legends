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
            duration: req.body.duration,
            teacher_name: req.body.teacher_name,
            nbrQuiz: req.body.nbrQuiz,
            halfYearlyPrice: req.body.halfYearlyPrice,
            yearlyPrice: req.body.yearlyPrice
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


// const asyncHandler = require ("express-async-handler")
// const mongoose = require('mongoose');
// const Report = require("../model/report");
// const db=require("../config/db");
// const connectDB=require("../config/db");
// const { MongoClient, ObjectId } = require('mongodb');
// require('dotenv').config();

// const coursesModel = require("../model/coursesModel");
// const User=require("../model/user");



// async function setCourse(req, res) {
//   try {
//       const { teacherId,name,classroom,duration,halfYearlyPrice,yearlyPrice} = req.body;

    
//       const teacher = await User.findById(teacherId);
//       if (!teacher || teacher.role !== 'teacher') {
//           return res.status(404).json({ error: 'Invalid teacher ID' });
//       }


//       const course = new coursesModel({
//           teacher: teacher._id,
//           name: name,
//           classroom:classroom,
//           duration:duration,
//           halfYearlyPrice:halfYearlyPrice,
//           yearlyPrice:yearlyPrice

//       });

//       await course.save();

//       const populatedCourse = await coursesModel.findById(report._id)
//           .populate('teacher', 'firstName lastName')

//       res.status(201).json({ message: 'Report created successfully', course: populatedCourse });
//   } catch (error) {
//       console.error('Error creating report:', error);
//       res.status(500).json({ error: 'Error creating report' });
//   }
// }


//     async function getCourse(req, res) {
//       try {
//         // const { sortOrder } = req.query;
//         // let sortQuery = {};
//         // if (sortOrder === 'asc') {
//         //     sortQuery = { 'mark': 1 };
//         // } else if (sortOrder === 'desc') {
//         //     sortQuery = { 'mark': -1 };
//         // }

//         // Récupérez tous les rapports de la base de données et triez-les
//         const courses = await coursesModel.find()
//             .populate('teacher', 'firstName lastName') 
  
//            // .sort(sortQuery); // Tri par note (mark) selon l'ordre spécifié

//         // Renvoyez la liste des rapports triés
//         res.status(200).json({ courses });
//     } catch (error) {
//         // Gérez les erreurs
//         console.error('Error fetching reports:', error);
//         res.status(500).json({ error: 'Error fetching reports' });
//     }
      
//         }

//         async function getById(req, res) {
//             try {
//                 const courseID = req.params.id;
            
//                 // Recherchez le rapport par son ID dans la base de données
//                 const course = await coursesModel.findById(courseID)
//                   .populate('teacher', 'firstName lastName') // Populer les données de l'enseignant avec les prénoms et noms seulement
            
//                 if (!course) {
//                   // Si le rapport n'est pas trouvé, renvoyez une erreur 404
//                   return res.status(404).json({ error: 'Report not found' });
//                 }
            
//                 // Renvoyez le rapport trouvé
//                 res.status(200).json({ course });
//               } catch (error) {
//                 // Gérez les erreurs
//                 console.error('Error fetching report:', error);
//                 res.status(500).json({ error: 'Error fetching report' });
//               }
//             }

//             async function updateCourse(req, res) {
//               try {
//                 const courseID = req.params.id;
//                 const { classroom } = req.body;
//                // const{teacher} = req.body;
//                 const {name} = req.body;
//                 const {halfYearlyPrice} = req.body;
//                 const {yearlyPrice} = req.body;
               
            
//                 let course = await Report.findById(courseID);
            
//                 if (!course) {
//                   return res.status(404).json({ error: "course not found" });
//                 }
//                 course.classroom = classroom;
//               // course.teacher = teacher;
//                 course.name = name;
//                 course.halfYearlyPrice = halfYearlyPrice;
//                 course.yearlyPrice = yearlyPrice;



//                // report.markquiz = markquiz;
            
//                // report.average = (parseFloat(mark) + parseFloat(markquiz)) / 2;
            
//                 await course.save();
            
//                 res.status(200).json({ message: "Course updated successfully", course });
//               } catch (error) {
//                 console.error("Error updating report:", error);
//                 res.status(500).json({ error: "Error updating report" });
//               }
//             }

//                 async function deleteCourse (req, res) {
//                     try {
//                         const courseID = req.params.id;
//                         // Vérifiez d'abord si le rapport existe
//                         const course = await coursesModel.findById(courseID);
//                         if (!course) {
//                             return res.status(404).json({ error: 'Report not found' });
//                         }
//                         // Si le rapport existe, supprimez-le de la base de données
//                         await coursesModel.findByIdAndDelete(courseID);
//                         res.json({ message: 'Report deleted successfully' });
//                     } catch (error) {
//                         console.error('Error deleting report:', error);
//                         res.status(500).json({ error: 'Error deleting report' });
//                     }
//                 }


//                 module.exports = {
//                         getCourse,
//                         setCourse,
//                         updateCourse,
//                         deleteCourse,
//                         getById
//                     }
                    

            
// async function getUserById(userId) {
//     try {
//         // Connexion à la base de données MongoDB
//         const client = await MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//         // Accès à la collection des utilisateurs
//         const collection = client.db('ElKindy-DB').collection('users'); // Utilisation de 'users' au lieu de 'User'

//         // Recherche de l'utilisateur par son ID
//         const user = await collection.findOne({ _id: new ObjectId(userId) });

//         // Fermeture de la connexion
//         await client.close();

//         // Renvoi de l'utilisateur trouvé
//         return user;
//     } catch (error) {
//         console.error('Error fetching user:', error);
//         throw error;
//     }
// }

// // Fonction pour récupérer les détails d'un cours par son ID
// async function getCourseById(courseId) {
//     try {
//         // Connexion à la base de données MongoDB
//         const client = await MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//         // Accès à la collection des cours
//         const collection = client.db('ElKindy-DB').collection('courses'); // Utilisation de 'courses' au lieu de 'Course'

//         // Recherche du cours par son ID
//         const course = await collection.findOne({ _id: new ObjectId(courseId) });

//         // Fermeture de la connexion
//         await client.close();

//         // Renvoi du cours trouvé
//         return course;
//     } catch (error) {
//         console.error('Error fetching course:', error);
//         throw error;
//     }
// }
// const add = asyncHandler(async (req, res) => {
//     try {
//         const { teacherId, studentId, courseId, mark } = req.body;

//         // Récupérer les détails de l'enseignant, de l'étudiant et du cours
//         const teacher = await getUserById(teacherId);
//         const student = await getUserById(studentId);
//         const course = await getCourseById(courseId);

//         if (!teacher || !student || !course) {
//             return res.status(404).json({ error: 'Teacher, student, or course not found' });
//         }

//         // Créer le rapport avec les détails complets
//         const report = new Report({
//             teacher: {
//                 _id: teacher._id,
//                 firstName: teacher.firstName,
//                 lastName: teacher.lastName
//             },
//             student: {
//                 _id: student._id,
//                 firstName: student.firstName,
//                 lastName: student.lastName
//             },
//             course: {
//                 _id: course._id,
//                 name: course.name
//             },
//             mark: mark
//         });

//         // Sauvegarder le rapport dans la base de données
//         await report.save();

//         res.status(201).json({ message: 'Report created successfully', report });
//     } catch (error) {
//         console.error('Error creating report:', error);
//         res.status(500).json({ error: 'Error creating report' });
//     }
// });
// // async function getUserById(userId) {
// //     const uri = process.env.MONGO_URI;
// //     const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// //     try {
// //         await client.connect();
// //         const database = client.db('ElKindy-DB'); // Remplacez 'votre_base_de_donnees' par le nom de votre base de données
// //         const usersCollection = database.collection('users'); // Remplacez 'users' par le nom de votre collection d'utilisateurs

// //         const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
// //         return user;
// //     } catch (error) {
// //         console.error('Error finding user:', error);
// //         throw error;
// //     } finally {
// //         await client.close();
// //     }
// // }

// // async function getCourseById(courseId) {
// //     const uri = process.env.MONGO_URI;
// //     const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// //     try {
// //         await client.connect();
// //         const database = client.db('ElKindy-DB'); // Remplacez 'votre_base_de_donnees' par le nom de votre base de données
// //         const coursesCollection = database.collection('courses'); // Remplacez 'courses' par le nom de votre collection de cours

// //         const course = await coursesCollection.findOne({ _id: new ObjectId(courseId) });
// //         return course;
// //     } catch (error) {
// //         console.error('Error finding course:', error);
// //         throw error;
// //     } finally {
// //         await client.close();
// //     }
// // }
// // async function add(req, res) {
// //     try {
// //         const { teacherId, studentId, courseId, mark } = req.body;

// //         // Vérifier si les utilisateurs et le cours existent
// //         const teacher = await getUserById(teacherId);
// //         const student = await getUserById(studentId);
// //         const course = await getCourseById(courseId);

// //         // Si l'un des utilisateurs ou le cours n'existe pas, renvoyer une erreur 404
// //         if (!teacher) {
// //             return res.status(404).json({ error: 'Teacher not found' });
// //         }

// //         if (!student) {
// //             return res.status(404).json({ error: 'Student not found' });
// //         }

// //         if (!course) {
// //             return res.status(404).json({ error: 'Course not found' });
// //         }

// //         // Créer le rapport avec les données récupérées
// //         const report = {
// //             teacher: teacherId,
// //             student: studentId,
// //             course: courseId,
// //             mark: mark // Utilisation de la valeur saisie pour 'mark'
// //         };

// //         // Insérer le rapport dans la collection 'reports'
// //         await db.collection('reports').insertOne(report);

// //         // Répondre avec un message de succès et les détails du rapport
// //         res.status(201).json({ message: 'Report created successfully', report: report });
// //     } catch (error) {
// //         // En cas d'erreur, renvoyer une réponse d'erreur avec le statut 500
// //         console.error('Error creating report:', error);
// //         res.status(500).json({ error: 'Error creating report' });
// //     }
// // }

//             //getall reports

//             const getall = asyncHandler(async (req, res) => {
//                 try {
//                     const reports = await Report.find().populate('teacher').populate('student').populate('course');
//                     const reportsWithUserNames = reports.map(report => {
//                         const teacherName = `${report.teacher.firstName} ${report.teacher.lastName}`;
//                         const studentName = `${report.student.firstName} ${report.student.lastName}`;
//                         const courseName = report.course.name;
//                         return { ...report.toObject(), teacher: teacherName, student: studentName, course: courseName };
//                     });
//                     res.status(200).json({ reports: reportsWithUserNames });
//                 } catch (error) {
//                     console.error('Error fetching reports:', error);
//                     res.status(500).json({ error: 'Error fetching reports' });
//                 }
//             });
            
            
// async function add(req, res) {
//     try {
//         const { teacherId, studentId, courseId, mark } = req.body;

//         // Vérifiez que les IDs des utilisateurs et du cours existent
//         const teacher = await getUserByIdAndRole(teacherId, 'teacher');
//         const student = await getUserByIdAndRole(studentId, 'student');
//         const course = await getCourseById(courseId);

//         if (!teacher || !student || !course) {
//             return res.status(404).json({ error: 'Invalid user or course ID' });
//         }

//         // Créez votre rapport en utilisant les données récupérées
//         const report = {
//             teacher: teacher._id,
//             student: student._id,
//             course: course._id,
//             mark
//         };

//         // Enregistrez le rapport dans la base de données

//         // Ensuite, envoyez une réponse appropriée
//         res.status(201).json({ message: 'Report created successfully', report });
//     } catch (error) {
//         console.error('Error creating report:', error);
//         res.status(500).json({ error: 'Error creating report' });
//     }
// }

// // Définissez les fonctions pour récupérer les utilisateurs et les cours directement à partir de MongoDB

// async function getUserByIdAndRole(userId, role) {
//     try {
//         const db = await connectDB(); // Assurez-vous que cette fonction renvoie une référence valide à la base de données MongoDB
//         if (!db) {
//             throw new Error('Database connection failed');
//         }
//         const collection = db.collection('users'); // Remplacez 'users' par le nom de votre collection d'utilisateurs dans MongoDB
//         const user = await collection.findOne({ _id: userId, role: role });
//         return user;
//     } catch (error) {
//         console.error('Error finding user:', error);
//         throw error;
//     }
// }

// async function getCourseById(courseId) {
//     try {
//         // Recherchez le cours par son ID dans la collection "courses" de MongoDB
//         const course = await db.collection('Course').findOne({ _id: courseId });

//         // Si le cours est trouvé, retournez son nom
//         if (course) {
//             return course.name;
//         } else {
//             return null; // Cours non trouvé
//         }
//     } catch (error) {
//         console.error('Error finding course:', error);
//         throw error;
//     }
// }


// async function getall(req, res) {
//     try {
//         const reports = await Report.find()
//             .populate({
//                 path: 'teacher',
//                 select: 'firstName lastName',
//                 match: { role: 'teacher' }
//             })
//             .populate({
//                 path: 'student',
//                 select: 'firstName lastName',
//                 match: { role: 'student' }
//             })
//             .populate('course', 'name');

//         res.status(200).json({ reports });
//     } catch (error) {
//         console.error('Error fetching reports:', error);
//         res.status(500).json({ error: 'Error fetching reports' });
//     }
// }

// async function getbyid(req, res) {
//     try {
//         const reportId = req.params.id;

//         const report = await Report.findById(reportId)
//             .populate({
//                 path: 'teacher',
//                 select: 'firstName lastName',
//                 match: { role: 'teacher' }
//             })
//             .populate({
//                 path: 'student',
//                 select: 'firstName lastName',
//                 match: { role: 'student' }
//             })
//             .populate('course', 'name');

//         if (!report) {
//             return res.status(404).json({ error: 'Report not found' });
//         }

//         res.status(200).json({ report });
//     } catch (error) {
//         console.error('Error fetching report:', error);
//         res.status(500).json({ error: 'Error fetching report' });
//     }
// }

// async function update(req, res) {
//     try {
//         const reportId = req.params.id;
//         const { teacherId, studentId, courseId, mark } = req.body;

//         let report = await Report.findById(reportId)
//             .populate({
//                 path: 'teacher',
//                 select: 'firstName lastName',
//                 match: { role: 'teacher' }
//             })
//             .populate({
//                 path: 'student',
//                 select: 'firstName lastName',
//                 match: { role: 'student' }
//             })
//             .populate('course', 'name');

//         if (!report) {
//             return res.status(404).json({ error: 'Report not found' });
//         }

//         report.teacher = teacherId;
//         report.student = studentId;
//         report.course = courseId;
//         report.mark = mark;

//         report = await report.save();

//         res.status(200).json({ message: 'Report updated successfully', report });
//     } catch (error) {
//         console.error('Error updating report:', error);
//         res.status(500).json({ error: 'Error updating report' });
//     }
// }
// async function add(req, res) {
//     try {
//         const { teacherId, studentId, courseId, mark } = req.body;

//         const report = new Report({
//             teacher: teacherId,
//             student: studentId,
//             course: courseId,
//             mark
//         });

//         await report.save();

//         const populatedReport = await Report.findById(report._id)
//             .populate('teacher', 'firstName lastName')
//             .populate('student', 'firstName lastName')
//             .populate('course', 'name');

//         res.status(201).json({ message: 'Report created successfully', report: populatedReport });
//     } catch (error) {
//         console.error('Error creating report:', error);
//         res.status(500).json({ error: 'Error creating report' });
//     }
// }

// async function getall(req, res) {
//     try {
//         // Accès direct aux collections MongoDB
//         const User = mongoose.connection.collection('users');
//         const Course = mongoose.connection.collection('courses');

//         // Récupérer tous les documents dans les collections
//         const users = await User.find().toArray();
//         const courses = await Course.find().toArray();

//         res.status(200).json({ users, courses });
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         res.status(500).json({ error: 'Error fetching data' });
//     }
// }
// async function getbyid(req, res) {
//     const uri = process.env.MONGO_URI;
//     const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//     try {
//         await client.connect();

//         const reportId = req.params.id; // Récupérer l'ID du rapport depuis les paramètres de la requête

//         const reportsCollection = client.db('ElKindy-DB').collection('reports');
//         const report = await reportsCollection.findOne({ _id: new ObjectId(reportId) });

//         if (!report) {
//             return res.status(404).json({ error: 'Report not found' });
//         }

//         // Récupérer les détails du rapport (teacher, student, course) en utilisant les fonctions getUserById et getCourseById
//         const teacher = await getUserById(client, report.teacher);
//         const student = await getUserById(client, report.student);
//         const course = await getCourseById(client, report.course);

//         res.status(200).json({
//             _id: report._id,
//             teacher,
//             student,
//             course,
//             mark: report.mark
//         });
//     } catch (error) {
//         console.error('Error fetching report by ID:', error);
//         res.status(500).json({ error: 'Error fetching report by ID' });
//     } finally {
//         await client.close();
//     }
// }

// async function update(req, res) {
//     const uri = process.env.MONGO_URI;
//     const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//     try {
//         await client.connect();

//         const reportId = req.params.id; // Récupérer l'ID du rapport depuis les paramètres de la requête
//         const { teacherId, studentId, courseId, mark } = req.body; // Récupérer les nouvelles données du rapport depuis le corps de la requête

//         const reportsCollection = client.db('ElKindy-DB').collection('reports');
//         const existingReport = await reportsCollection.findOne({ _id: new ObjectId(reportId) });

//         if (!existingReport) {
//             return res.status(404).json({ error: 'Report not found' });
//         }

//         // Mettre à jour les champs du rapport avec les nouvelles données
//         const updatedReport = {
//             teacherId,
//             studentId,
//             courseId,
//             mark
//         };

//         // Effectuer la mise à jour dans la collection des rapports
//         await reportsCollection.updateOne({ _id: new ObjectId(reportId) }, { $set: updatedReport });

//         res.status(200).json({ message: 'Report updated successfully', report: updatedReport });
//     } catch (error) {
//         console.error('Error updating report:', error);
//         res.status(500).json({ error: 'Error updating report' });
//     } finally {
//         await client.close();
//     }
// }

// async function deletereport(req, res) {
//     const uri = process.env.MONGO_URI;
//     const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//     try {
//         await client.connect();

//         const reportId = req.params.id; // Récupérer l'ID du rapport depuis les paramètres de la requête

//         const reportsCollection = client.db('ElKindy-DB').collection('reports');
//         const report = await reportsCollection.findOne({ _id: new ObjectId(reportId) });

//         if (!report) {
//             return res.status(404).json({ error: 'Report not found' });
//         }

//         // Supprimer le rapport de la collection des rapports
//         await reportsCollection.deleteOne({ _id: new ObjectId(reportId) });

//         res.status(200).json({ message: 'Report deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting report:', error);
//         res.status(500).json({ error: 'Error deleting report' });
//     } finally {
//         await client.close();
//     }
// }

// module.exports = { getUserById,getCourseById,add, getall, getbyid, update, deletereport };
