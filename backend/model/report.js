const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Report=new Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // Référence au modèle User pour l'enseignant
      },
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // Référence au modèle User pour l'étudiant
      },
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true // Référence au modèle Course pour le cours
      },
      mark: {
        type: Number,
        required: true,
        min: 0,
        max: 20
      //   validate: {
      //     validator: function(value) {
      //  //       return /^\d+$/.test(value);
      //     },
      //     message: props => `${props.value} is not a valid mark.`
      // }
    // },
    // markquiz: {
    //     type: Number,
    //     required: true
    // },
    // average: {
    //     type: Number
    }
});

// Définition d'un hook "pre" pour calculer automatiquement la moyenne avant de sauvegarder le rapport
Report.pre('save', function(next) {
    this.average = (this.mark + this.markquiz) / 2; // Calcul de la moyenne
    next();
});

module.exports=mongoose.model("report",Report);