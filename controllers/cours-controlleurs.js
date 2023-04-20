const { response } = require("express");
const {v4 : uuidv4} = require("uuid");
const HttpErreur = require("../models/http-erreur")
const Professeur = require("../models/professeur");
const Cours = require('../models/cours');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

let COURS = [
    {
        id: "c1",
        titre: "Math",
        professeur: "",
        etudiants: [

        ]
    }
];

const getCoursById = async (requete, reponse, next) => {
    const coursId = requete.params.coursId
    let cours;
    try {
  
        coursObjId = new mongoose.Types.ObjectId(coursId.substring(0, coursId.length-1))
  
       cours = await Cours.findById(coursObjId);
    } catch (err) {
      console.log(err);
      return next(
        new HttpErreur("Erreur lors de la récupération du cours", 500)
      );
    }
    if (!cours) {
      return next(new HttpErreur("Aucune cours trouvée pour l'id fourni", 404));
    }
    reponse.json({ cours: cours.toObject({ getters: true }) });
  };

const creerCours = async (requete, reponse, next) => {
    const {titre, profId} = requete.body;
    console.log(requete.body);

    let coursExiste;

    try {
        coursExiste = await Cours.findOne({ titre: titre });
    } catch (err){
        console.log(err)
        return next(new HttpErreur("Échec vérification cours existe", 500));
    }
  
    if (coursExiste) {
      return next(
        new HttpErreur("Cours existe deja", 422)
      );
    }

    const nouveauCours = new Cours({
      titre: titre,
      professeur: profId,
      etudiants: []
    });

    let prof;

    try {
        prof = await Professeur.findById(profId);
    } catch (err){
        console.log(err)
        return next(new HttpErreur("Création de cours échouée", 500));
    }
  
    if (!prof) {
      return next(new HttpErreur("Professeur non trouvé selon le id"), 504);
    }

    try {
 
        await nouveauCours.save();
        prof.cours.push(nouveauCours);
        await prof.save();

      } catch (err) {
        console.log(err)
        const erreur = new HttpErreur("Création de cours échouée", 500);
        return next(erreur);
      }
    reponse.status(201).json({ cours: nouveauCours.toObject({ getter: true }) });

  };

const updateCours = (requete, reponse, next) => {
    const {titre, profId, etudiants} = requete.body;
    const coursId = requete.params.coursId;

      const coursModifiee = {...COURS.find(cours => cours.id === coursId)};
      const indiceCours = COURS.findIndex(cours => cours.id === coursId);

      coursModifiee.id = coursId;
      coursModifiee.titre = titre
      coursModifiee.professeur = professeur;
      coursModifiee.etudiants = etudiants;

      COURS[indiceCours] = coursModifiee;

      reponse.status(200).json({cours:coursModifiee});

  };

  const supprimerCours = (requete, reponse, next) => { 
    
    const coursId = requete.params.coursId;
    COURS = COURS.filter(cours => cours.id !== coursId);
    reponse.status(200).json({message: "Cours supprimé"});
  };

exports.getCoursById = getCoursById;
exports.creerCours = creerCours;
exports.updateCours = updateCours;
exports.supprimerCours = supprimerCours;