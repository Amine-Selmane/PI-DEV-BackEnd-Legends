const express = require ("express")
const router = express.Router()

const controller = require('../controller/disponibiliteContoller.js');

router.get('/getall', controller.getAllDisponibilites);

router.post("/add", controller.addDisponibilite);
router.put('/update/:id', controller.updateDisponibiliteById);
router.put('/user/updateAvail/:userId', controller.updateDisponibilites);

router.delete('/delete/:id', controller.deleteDisponibilite);
router.route('/ById/:id').get(controller.getById);
// Route pour récupérer les disponibilités par utilisateur
router.get('/getByUser/:userId', controller.getDisponibiliteByUser);
module.exports = router
