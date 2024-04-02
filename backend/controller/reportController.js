// const asyncHandler = require ("express-async-handler")
// const mongoose = require('mongoose');
// const Report = require("../model/report");
// const db=require("../config/db");
// const connectDB=require("../config/db");
// const { MongoClient, ObjectId } = require('mongodb');
// require('dotenv').config();

const Report=require("../model/report");
const User=require("../model/user");
const Course=require("../model/course");

// async function add(req, res) {
//     try {
//         const { teacherId, studentId, courseId, mark, markquiz  } = req.body;
    
//         //enseignant
//         const teacher = await User.findById(teacherId);
//          if (!teacher || teacher.role !== 'teacher') {
//          return res.status(404).json({ error: 'Invalid teacher ID' });
//         }
    
//         //étudiant
//         const student = await User.findById(studentId);
//          if (!student || student.role !== 'student') {
//          return res.status(404).json({ error: 'Invalid student ID' });
//          }
    
//         //cours
//         const course = await Course.findById(courseId);
//         if (!course) {
//           return res.status(404).json({ error: 'Invalid course ID' });
//         }

//          // Calcul de la moyenne
//          const average = (mark + markquiz) / 2;
    
//         const report = new Report({
//             teacher: teacher._id, //ObjectId de l'enseignant
//             student: student._id, // Utiliser l'identifiant ObjectId de l'étudiant
//             course: course._id,   // Utiliser l'identifiant ObjectId du cours
//             mark,
//             markquiz,
//             average
//         });
    
//         await report.save();
//         // Rechercher le rapport avec les noms correspondants
//     const populatedReport = await Report.findById(report._id)
//     .populate('teacher', 'firstName lastName')
//     .populate('student', 'firstName lastName')
//     .populate('course', 'name');
//         res.status(201).json({ message: 'Report created successfully', report: populatedReport });
//       } catch (error) {
//         console.error('Error creating report:', error);
//         res.status(500).json({ error: 'Error creating report' });
//       }
//     }

async function add(req, res) {
  try {
      const { teacherId, studentId, courseId, mark} = req.body;

      // Convertir les valeurs de mark et markquiz en nombres
      // const markValue = parseFloat(mark);
      // const markquizValue = parseFloat(markquiz);

      // // Vérifier si les valeurs sont valides
      // if (isNaN(markValue) || isNaN(markquizValue)) {
      //     return res.status(400).json({ error: 'Invalid mark or markquiz value' });
      // }

      // Continuer avec le reste du code
      const teacher = await User.findById(teacherId);
      if (!teacher || teacher.role !== 'teacher') {
          return res.status(404).json({ error: 'Invalid teacher ID' });
      }

      const student = await User.findById(studentId);
      if (!student || student.role !== 'student') {
          return res.status(404).json({ error: 'Invalid student ID' });
      }

      const course = await Course.findById(courseId);
      if (!course) {
          return res.status(404).json({ error: 'Invalid course ID' });
      }

    //  const average = (markValue + markquizValue) / 2;

      const report = new Report({
          teacher: teacher._id,
          student: student._id,
          course: course._id,
          mark: mark// Utiliser la valeur convertie en nombre
          // markquiz: markquizValue, // Utiliser la valeur convertie en nombre
          // average
      });

      await report.save();

      const populatedReport = await Report.findById(report._id)
          .populate('teacher', 'firstName lastName')
          .populate('student', 'firstName lastName')
          .populate('course', 'name');

      res.status(201).json({ message: 'Report created successfully', report: populatedReport });
  } catch (error) {
      console.error('Error creating report:', error);
      res.status(500).json({ error: 'Error creating report' });
  }
}


    async function getall(req, res) {
      try {
        const { sortOrder } = req.query;
        let sortQuery = {};
        if (sortOrder === 'asc') {
            sortQuery = { 'mark': 1 };
        } else if (sortOrder === 'desc') {
            sortQuery = { 'mark': -1 };
        }

        // Récupérez tous les rapports de la base de données et triez-les
        const reports = await Report.find()
            .populate('teacher', 'firstName lastName') 
            .populate('student', 'firstName lastName') 
            .populate('course', 'name')
            .sort(sortQuery); // Tri par note (mark) selon l'ordre spécifié

        // Renvoyez la liste des rapports triés
        res.status(200).json({ reports });
    } catch (error) {
        // Gérez les erreurs
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Error fetching reports' });
    }
      
        }

        async function getbyid(req, res) {
            try {
                const reportId = req.params.id;
            
                // Recherchez le rapport par son ID dans la base de données
                const report = await Report.findById(reportId)
                  .populate('teacher', 'firstName lastName') // Populer les données de l'enseignant avec les prénoms et noms seulement
                  .populate('student', 'firstName lastName') // Populer les données de l'étudiant avec les prénoms et noms seulement
                  .populate('course', 'name'); // Populer les données du cours avec le nom seulement
            
                if (!report) {
                  // Si le rapport n'est pas trouvé, renvoyez une erreur 404
                  return res.status(404).json({ error: 'Report not found' });
                }
            
                // Renvoyez le rapport trouvé
                res.status(200).json({ report });
              } catch (error) {
                // Gérez les erreurs
                console.error('Error fetching report:', error);
                res.status(500).json({ error: 'Error fetching report' });
              }
            }

            async function update(req, res) {
              try {
                const reportId = req.params.id;
                const { mark } = req.body;
               
            
                let report = await Report.findById(reportId);
            
                if (!report) {
                  return res.status(404).json({ error: "Report not found" });
                }
                report.mark = mark;
               // report.markquiz = markquiz;
            
               // report.average = (parseFloat(mark) + parseFloat(markquiz)) / 2;
            
                await report.save();
            
                res.status(200).json({ message: "Report updated successfully", report });
              } catch (error) {
                console.error("Error updating report:", error);
                res.status(500).json({ error: "Error updating report" });
              }
            }

                async function deletereport (req, res) {
                    try {
                        const reportId = req.params.id;
                        // Vérifiez d'abord si le rapport existe
                        const report = await Report.findById(reportId);
                        if (!report) {
                            return res.status(404).json({ error: 'Report not found' });
                        }
                        // Si le rapport existe, supprimez-le de la base de données
                        await Report.findByIdAndDelete(reportId);
                        res.json({ message: 'Report deleted successfully' });
                    } catch (error) {
                        console.error('Error deleting report:', error);
                        res.status(500).json({ error: 'Error deleting report' });
                    }
                }

                async function getReportsByStudentId(req, res) {
                  try {
                    const studentId = req.params.studentId;
                    const reports = await Report.find({ student: studentId }).populate('teacher', 'firstName lastName').populate('course', 'name');
                    res.status(200).json({ reports });
                  } catch (error) {
                    console.error('Error fetching student reports:', error);
                    res.status(500).json({ error: 'Error fetching student reports' });
                  }
                }

                async function getReportsByStudentUsername(req, res) {
                  try {
                      const username = req.params.username;
                  
                      // Recherchez l'utilisateur par nom d'utilisateur
                      const user = await User.findOne({ username });
                  
                      if (!user) {
                          return res.status(404).json({ error: 'User not found' });
                      }
                  
                      // Trouvez les rapports pour cet utilisateur en utilisant son ID
                      const reports = await Report.find({ student: user._id })
                          .populate('teacher', 'firstName lastName')
                          .populate('course', 'name');
                  
                      res.status(200).json({ reports });
                  } catch (error) {
                      console.error('Error fetching student reports:', error);
                      res.status(500).json({ error: 'Error fetching student reports' });
                  }
              }
              
              async function getReportsByTeacherUsername(req, res) {
                try {
                    const username = req.params.username;
                
                    // Recherchez l'utilisateur par nom d'utilisateur
                    const user = await User.findOne({ username });
                
                    if (!user) {
                        return res.status(404).json({ error: 'User not found' });
                    }
                
                    // Trouvez les rapports pour cet utilisateur en utilisant son ID
                    const reports = await Report.find({ teacher: user._id })
                        .populate('student', 'firstName lastName')
                        .populate('course', 'name');
                
                    res.status(200).json({ reports });
                } catch (error) {
                    console.error('Error fetching student reports:', error);
                    res.status(500).json({ error: 'Error fetching student reports' });
                }
            }
  
              async function searchByCourse(req, res) {
                try {
                    const courseName = req.params.courseName;
            
                    // Recherchez le cours par son nom
                    const course = await Course.findOne({ name: courseName });
                    if (!course) {
                        return res.status(404).json({ error: 'Course not found' });
                    }
            
                    // Recherchez les rapports associés à ce cours en utilisant son ID
                    const reports = await Report.find({ course: course._id })
                        .populate('teacher', 'firstName lastName')
                        .populate('student', 'firstName lastName')
                        .populate('course', 'name');
            
                    res.status(200).json({ reports });
                } catch (error) {
                    console.error('Error searching reports by course name:', error);
                    res.status(500).json({ error: 'Error searching reports by course name' });
                }
            }
            
            async function getStudentStatistics(req, res) {
              try {
                // Récupérer tous les rapports avec le nom du cours
                const reports = await Report.find().populate('course', 'name');
                
                if (!reports || reports.length === 0) {
                  return res.status(404).json({ error: 'No reports found' });
                }
                
                // Initialiser un objet pour stocker les statistiques
                const statistics = {};
                
                // Calculer la somme des notes et le nombre d'étudiants pour chaque cours
                reports.forEach((report) => {
                  const courseId = report.course._id.toString(); // Utilisez l'ID du cours comme clé
                  const courseName = report.course.name;
                  const mark = report.mark;
                
                  if (!statistics[courseId]) {
                    // Si le cours n'existe pas dans les statistiques, l'initialiser
                    statistics[courseId] = {
                      courseName: courseName,
                      totalMarks: 0,
                      numberOfStudents: 0,
                      averageMark: 0,
                    };
                  }
                
                  // Mettre à jour les statistiques pour le cours
                  statistics[courseId].totalMarks += mark;
                  statistics[courseId].numberOfStudents++;
                });
                
                // Calculer la moyenne des notes pour chaque cours
                for (const courseId in statistics) {
                  const { totalMarks, numberOfStudents } = statistics[courseId];
                  
                  // Vérifier si le nombre d'étudiants est différent de zéro
                  if (numberOfStudents !== 0) {
                    // Calculer la moyenne uniquement si le nombre d'étudiants est différent de zéro
                    statistics[courseId].averageMark = totalMarks / numberOfStudents;
                  } else {
                    // Si le nombre d'étudiants est zéro, attribuer une valeur par défaut à la moyenne
                    statistics[courseId].averageMark = 0; // ou null, selon le comportement souhaité
                  }
                }
                
                res.status(200).json({ statistics });
              } catch (error) {
                console.error('Error fetching student statistics:', error);
                res.status(500).json({ error: 'Error fetching student statistics' });
              }
            }
            
            
            
            
    // module.exports = { add, getall, getbyid, update, deletereport, getReportsByStudentId, getReportsByStudentUsername, searchByCourse, getReportsByTeacherUsername, getStudentStatistics };
                  
                

            

    module.exports={add,getall,getbyid,update,deletereport,getReportsByStudentId,getReportsByStudentUsername,searchByCourse,getReportsByTeacherUsername,getStudentStatistics};
// Fonction pour récupérer les détails d'un utilisateur par son ID
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
