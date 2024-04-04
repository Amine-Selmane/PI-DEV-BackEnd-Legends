const express = require ("express")
const router = express.Router()
const reportController=require("../controller/reportController");
// const {} = require ("../controller/restController") UNCOMMENT  AND ADD YOUR METHODS' NAMES BTWN THE {}
router.post('/add', reportController.add);
router.get('/getall', reportController.getall);

// Route pour récupérer un bulletin par son ID
router.get('/getbyid/:id', reportController.getbyid);

// Route pour mettre à jour un bulletin
router.put('/update/:id', reportController.update);
// Route pour supprimer un bulletin
router.delete('/deletereport/:id',reportController.deletereport);
// Route pour récupérer les rapports d'un étudiant spécifique
//router.get('/student/:studentId', reportController.getReportsByStudentId);
router.get('/student/:username', reportController.getReportsByStudentUsername);
router.get('/teacher/:username', reportController.getReportsByTeacherUsername);
router.get('/search/:courseName', reportController.searchByCourse);
router.get('/statistics', reportController.getStudentStatistics);
//router.get('/search', reportController.searchByCourse);
// router.get('/',method name here)
// router.post('/',method name here)
// router.put('/:id',method name here)
// router.delete('/:id',method name here)

module.exports = router