const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClaimSchema = new Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
   required: true
  },
  audio: {
    type: String, // Ou un autre type approprié selon comment vous stockez l'audio
    required: true
  }
});

const Claim = mongoose.model('Claim', ClaimSchema);

module.exports = Claim;
