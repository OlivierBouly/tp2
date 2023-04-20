const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const etudiantSchema = new Schema({
    nom: {type: String, required: true, unique:true},
    prenom: {type: String, required: true, unique:true},
    cours: [{type: mongoose.Types.ObjectId, required: false, ref:"Cours"}]
});



module.exports = mongoose.model("Etudiant", etudiantSchema);