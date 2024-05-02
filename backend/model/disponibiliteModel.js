const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DisponibiliteSchema = new Schema({
    jour: { type: String, required: true },
    heureDebut: { type: String, required: true },
    heureFin: { type: String, required: true },
    utilisateur: { type: String, required: true }
});

const Disponibilite = mongoose.model('Disponibilite', DisponibiliteSchema);

module.exports = Disponibilite;
//module.exports = mongoose.models.Disponibilite || mongoose.model('Disponibilite', DisponibiliteSchema)