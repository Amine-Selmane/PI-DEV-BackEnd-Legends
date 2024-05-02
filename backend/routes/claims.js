const express = require('express');
const router = express.Router();
const claimController = require('../controller/claimController');
const { Auth } = require('../middlware/auth');


// Utilisez le middleware d'authentification avant la fonction createClaim
router.post('/createClaim', Auth, claimController.createClaim);


// Obtenir toutes les réclamations
router.get('/getAllClaims', claimController.getAllClaims);


// // Mettre à jour le statut d'une réclamation
// router.put('/updateClaimStatus/:id', claimController.updateClaimStatus);


// // Supprimer une réclamation
 router.delete('/deleteClaim/:id', claimController.deleteClaim);


module.exports = router;