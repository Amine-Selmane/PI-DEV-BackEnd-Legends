const Claim = require('../model/claim');
const User = require('../model/User.model');
const Course=require("../model/course");
const Auth=require("../middlware/auth");


const createClaim = async (req, res) => {
  try {
    // Récupérer l'ID de l'utilisateur à partir des données de la demande
    const userId = req.body.userId;


    // Vérifier si l'ID de l'utilisateur est présent dans la demande
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }


    // Vous pouvez ajouter d'autres vérifications pour l'ID de l'utilisateur si nécessaire


    const userFullName = req.user.firstName + ' ' + req.user.lastName;


    // const courseId = req.body.courseId;
    // const course = await Course.findById(courseId);


    // if (!course) {
    //   return res.status(404).json({ error: 'Invalid course ID' });
    // }


    const { audio } = req.body;


    const claim = new Claim({
      student: userId, // Utiliser l'ID de l'utilisateur comme étudiant
      //course: course._id,
      audio
    });


    await claim.save();
    const populatedClaim = await Claim.findById(claim._id)
      //.populate('course', 'name');


    res.status(201).json({ message: 'Claim submitted successfully', claim: populatedClaim });
  } catch (error) {
    console.error('Error creating claim:', error);
    res.status(500).json({ error: 'Error creating claim' });
  }
};




// Obtenir toutes les réclamations
async function getAllClaims (req, res)  {
  try {
    const claims = await Claim.find().populate('student', 'firstName lastName')
   // .populate('course', 'name');
    res.status(200).json({ claims });
  } catch (error) {
    console.error('Error fetching claims:', error);
    res.status(500).json({ error: 'Error fetching claims' });
  }
};


// Mettre à jour le statut d'une réclamation
// async function updateClaimStatus (req, res) {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;
//     const updatedClaim = await Claim.findByIdAndUpdate(id, { status }, { new: true });
//     res.status(200).json({ message: 'Claim status updated successfully', claim: updatedClaim });
//   } catch (error) {
//     console.error('Error updating claim status:', error);
//     res.status(500).json({ error: 'Error updating claim status' });
//   }
// };


// Supprimer une réclamation
async function deleteClaim (req, res) {
  try {
    const { id } = req.params;
    await Claim.findByIdAndDelete(id);
    res.status(200).json({ message: 'Claim deleted successfully' });
  } catch (error) {
    console.error('Error deleting claim:', error);
    res.status(500).json({ error: 'Error deleting claim' });
  }
};
module.exports={createClaim,getAllClaims,deleteClaim};