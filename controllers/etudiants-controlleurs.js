const { response } = require("express");
const {v4 : uuidv4} = require("uuid");
const Professeur = require("../models/professeur");
const Cours = require('../models/cours');
const Etudiant = require('../models/etudiant');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

const HttpErreur = require("../models/http-erreur");

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

const creerEtudiant = ((requete, reponse, next) => {
    const {nom, prenom} = requete.body;
    console.log(requete.body);
    const nouveauEtudiant ={
      id: uuidv4(),
      nom: nom,
      prenom: prenom,
      cours: []
    }

    ETUDIANTS.push(nouveauEtudiant);

    reponse.status(201).json({etudiant: nouveauEtudiant}); 
})

const updateEtudiant = (requete, reponse, next) => {
    const {nom, prenom, cours} = requete.body;
    const etudiantId = requete.params.etudiantId;

      const etudiantModifiee = {...ETUDIANTS.find(etudiant => etudiant.id === etudiantId)};
      const indiceEtudiant = ETUDIANTS.findIndex(etudiant => etudiant.id === etudiantId);

      etudiantModifiee.cours = cours
      etudiantModifiee.nom = nom;
      etudiantModifiee.prenom = prenom;

      ETUDIANTS[indiceEtudiant] = etudiantModifiee;

      reponse.status(200).json({etudiant:etudiantModifiee});

  };

  const supprimerEtudiant = (requete, reponse, next) => { 
    
    const etudiantId = requete.params.etudiantId;
    ETUDIANTS = ETUDIANTS.filter(etudiant => etudiant.id !== etudiantId);
    reponse.status(200).json({message: "Etudiant supprimé"});
  };


exports.getEtudiantById = getEtudiantById;
exports.creerEtudiant = creerEtudiant;
exports.updateEtudiant = updateEtudiant;
exports.supprimerEtudiant = supprimerEtudiant;