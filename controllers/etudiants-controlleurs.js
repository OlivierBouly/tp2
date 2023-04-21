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

const getEtudiantById = async (requete, reponse, next) => {
    const etudiantId = requete.params.etudiantId;
    let etudiant;
    try {
  
        etudiantObjId = new mongoose.Types.ObjectId(etudiantId)
  
        etudiant = await Etudiant.findById(etudiantObjId);
    } catch (err) {
      console.log(err);
      return next(
        new HttpErreur("Erreur lors de la récupération du etudiant", 500)
      );
    }
    if (!etudiant) {
      return next(new HttpErreur("Aucun etudiant trouvée pour l'id fourni", 404));
    }
    reponse.json({ etudiant: etudiant.toObject({ getters: true }) });
  };

const creerEtudiant = (async (requete, reponse, next) => {
   const {nom, prenom} = requete.body;
    console.log(requete.body);
    let etudiantExiste;

    try {
        etudiantExiste = await Etudiant.findOne({ nom: nom });
        etudiantExiste = await Etudiant.findOne({ prenom: prenom });
    } catch {
      return next(new HttpErreur("Échec vérification etudiant existe", 500));
    }
  
    if (etudiantExiste) {
      return next(
        new HttpErreur("Etudiant existe deja", 422)
      );
    }

    const nouveauEtudiant = new Etudiant({
      nom: nom,
      prenom: prenom,
      cours: []
    });

    try {
      await nouveauEtudiant.save();
    } catch (err) {
      console.log(err);
      return next(new HttpErreur("Erreur lors de l'ajout du etudiant", 422));
    }
    reponse
      .status(201)
      .json({ etudiant: nouveauEtudiant.toObject({ getter: true }) });

  });

  const updateEtudiant = async (requete, reponse, next) => {
    const {nom, prenom, cours} = requete.body;
    const etudiantId = requete.params.etudiantId;

    let etudiant;

    try {

      etudiantObjId = new mongoose.Types.ObjectId(etudiantId)

      etudiant = await Etudiant.findById(etudiantObjId);

      etudiant.nom = nom;
      etudiant.prenom = prenom;
      etudiant = await Etudiant.findById(etudiantObjId).populate("cours");
      etudiant.cours.forEach(async cours => {cours.etudiants.pull(etudiant); await cours.save()});

      etudiant.cours = cours;
      await etudiant.save();
      etudiant = await Etudiant.findById(etudiantObjId).populate("cours");
      etudiant.cours.forEach(async cours => {cours.etudiants.push(etudiant); await cours.save()});
      await etudiant.save();
      etudiant = await Etudiant.findById(etudiantObjId).populate("cours");
      etudiant.cours.forEach(cours => {if(!cours){return next(new HttpErreur("Impossible de trouver le cours", 404));}});
    } catch(err) {

      console.log(err)

      return next(
        new HttpErreur("Erreur lors de la mise à jour du etudiant", 500)
      );
    }
  
    reponse.status(200).json({ etudiant: etudiant.toObject({ getters: true }) });

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