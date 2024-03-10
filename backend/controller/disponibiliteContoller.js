const DisponibiliteModel = require ("../model/disponibilite.Model") 


/** add disponibilite */
async function addDisponibilite(req, res) {
  try {
      // Récupérer les données du corps de la requête
      const { disponibilites, utilisateur } = req.body;

      // Vérifier si disponibilites est un tableau
      if (!Array.isArray(disponibilites)) {
          return res.status(400).send({ error: "Le champ 'disponibilites' doit être un tableau d'objets." });
      }

      // Utiliser create pour ajouter une disponibilité à la fois
      for (const dispo of disponibilites) {
          await DisponibiliteModel.create({
              jour: dispo.jour,
              heureDebut: dispo.heureDebut,
              heureFin: dispo.heureFin,
              utilisateur: utilisateur
          });
      }

      res.status(200).send("Disponibilites ajoutées avec succès");
  } catch (err) {
      // Gérer les erreurs
      console.error(err);

      if (err.name === 'ValidationError') {
          // Erreur de validation
          const validationErrors = {};
          for (const field in err.errors) {
              validationErrors[field] = err.errors[field].message;
          }
          res.status(400).send({ error: validationErrors });
      } else {
          // Erreur générique
          res.status(400).send({ error: err.message });
      }
  }
}


  /** get all disponibilites */
  /** GET: http://localhost:5000/disponibilte/getall  */
  async function getAllDisponibilites(req, res) {
    try {
      const data = await DisponibiliteModel.find().populate('utilisateur', 'username');
      res.status(200).send(data);
    } catch (err) {
      res.status(400).send(err);
    }
  }
  
  /** update disponibilite */
  /** PUT: http://localhost:5000/disponibilte/update/:id  */

  async function updateDisponibiliteById(req, res) {
    try {
      const { jour, heureDebut, heureFin } = req.body;
  
      // Vérifier si l'ID de la disponibilité est fourni
      if (!req.params.id) {
        return res.status(400).send({ error: "L'ID de la disponibilité est requis pour la mise à jour." });
      }
  
      // Utiliser findByIdAndUpdate pour mettre à jour la disponibilité
      const updatedDisponibilite = await DisponibiliteModel.findByIdAndUpdate(
        req.params.id,
        { jour, heureDebut, heureFin },
        { new: true }
      );
  
      // Vérifier si la disponibilité existe
      if (!updatedDisponibilite) {
        return res.status(404).send({ error: "La disponibilité avec cet ID n'a pas été trouvée." });
      }
  
      // Envoyer une réponse de succès
      res.status(200).send("Disponibilité mise à jour avec succès");
    } catch (err) {
      // Gérer les erreurs
      console.error(err);
  
      if (err.name === 'ValidationError') {
        // Erreur de validation
        const validationErrors = {};
        for (const field in err.errors) {
          validationErrors[field] = err.errors[field].message;
        }
        console.log('Erreurs de validation:', validationErrors);
        res.status(400).send({ error: validationErrors });
      } else {
        // Erreur générique
        console.log('Erreur générique:', err.message);
        res.status(400).send({ error: err.message });
      }
    }
  }
  
  
  // async function updateDisponibiliteById(req, res) {
  //   try {
  //     await DisponibiliteModel.findByIdAndUpdate(req.params.id, req.body);
  //     res.status(200).send("Disponibilite updated");
  //   } catch (err) {
  //     res.status(400).send(err);
  //   }
  // }
  
  /** DELETE: http://localhost:5000/disponibilte/delete/:id  */
  async function deleteDisponibilite(req, res) {
    try {
      await DisponibiliteModel.findByIdAndDelete(req.params.id);
      res.status(200).send("Disponibilite deleted");
    } catch (err) {
      res.status(400).send(err);
    }
  }
  
  async function getById(req, res) {
    try {
      
      const data = await DisponibiliteModel.findById(req.params.id);
  
      if (!data) {
        // If user with the specified ID is not found, return 404
        return res.status(404).json({ error: 'Disponiblite not found' });
      }
  
      // If user is found, return the data
      res.status(200).json(data);
    } catch (err) {
      // Handle any other errors
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  module.exports = {
    addDisponibilite,
    getAllDisponibilites,
    updateDisponibiliteById,
    deleteDisponibilite,
    getById

}