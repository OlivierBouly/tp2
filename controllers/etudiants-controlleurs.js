const { response } = require("express");
const {v4 : uuidv4} = require("uuid");
const HttpErreur = require("../models/http-erreur")

let ETUDIANTS = [
    {
        id: "e1",
        nom: "Bouly",
        prenom: "Olivier",
        cours: [

        ]
    }
];

const getEtudiantById = (requete, reponse, next) => {
    const etudiantId = requete.params.etudiantId
    const etudiant = ETUDIANTS.find(etudiant => {
        return etudiant.id === etudiantId;
    })
    if(!etudiant){
        return next(new HttpErreur("Aucun etudiant avec le id fourni", 404));
    } else {
        reponse.json({etudiant});
    }
};


exports.getEtudiantById = getEtudiantById;