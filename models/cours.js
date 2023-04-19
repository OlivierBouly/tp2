const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const coursSchema = new Schema({
    titre: {type: String, required: true, unique:true},
    professeur: {type: mongoose.Types.ObjectId, required: false, ref:"Professeur"},
    etudiants: [{type: mongoose.Types.ObjectId, required: false, ref:"Etudiant"}]
});



module.exports = mongoose.model("Cours", coursSchema);