const { response } = require("express");
const {v4 : uuidv4} = require("uuid");
const HttpErreur = require("../models/http-erreur")
const Professeur = require("../models/professeur");
const Cours = require('../models/cours');
const Etudiant = require('../models/etudiant');
const mongoose = require('mongoose');
const etudiant = require("../models/etudiant");
const MongoClient = require('mongodb').MongoClient;

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

const updateCours = async (requete, reponse, next) => {
    const {titre, professeur, etudiants} = requete.body;
    const coursId = requete.params.coursId;

    let cours;
    let prof;
    try {

        prof = await Professeur.findById(professeur).populate(cours);
    } catch (err){
        console.log(err)
        return next(new HttpErreur("Création de cours échouée", 500));
    }
  
    if (!prof) {
      return next(new HttpErreur("Professeur non trouvé selon le id"), 504);
    }

  try {

    cours = await Cours.findById(coursId).populate("professeur").populate("etudiants");
  } catch (err){
      console.log(err)
      return next(new HttpErreur("Création de cours échouée", 500));
  }

  if (!cours) {
    return next(new HttpErreur("Cours non trouvé selon le id"), 504);
  }
  
    try {
        
        coursObjId = new mongoose.Types.ObjectId(coursId)
        
        cours.professeur.cours.pull(cours);

        await cours.professeur.save();

        cours = await Cours.findById(coursId).populate("professeur");

        listEtudiant = await Etudiant.find().populate("cours").populate("cours.professeur");
        listEtudiant.forEach(async etudiant =>{
          if(cours.etudiants.includes(etudiant._id)) {
            let index = etudiant.cours.indexOf(cours);
            etudiant.cours.splice(index, 1);
          }

          await etudiant.save()
        });

        etudiants.forEach(async etudiant => {
          etudiant = await Etudiant.findById(etudiant).populate("cours");
          if(etudiant.cours.includes(cours)){
          } else {
            etudiant.cours.push(cours);
          }

          await etudiant.save();
      });

        cours.titre = titre;
        cours.professeur = professeur;
        cours.etudiants = etudiants;

        index = prof.cours.findIndex(cours => cours._id === coursObjId);
        if(index === -1){
        prof.cours.push(cours);
        } else {
            prof.cours[index] = cours
        }
        await cours.save();
        await prof.save();

    } catch(err) {

      console.log(err)

      return next(
        new HttpErreur("Erreur lors de la mise à jour du cours", 500)
      );
    }
      reponse.status(200).json({cours:cours});
  };

  const supprimerCours = async (requete, reponse, next) => { 
    const coursId = requete.params.coursId;
    coursObjId = new mongoose.Types.ObjectId(coursId)

    let cours;
    try {
        cours = await Cours.findById(coursObjId).populate("professeur").populate("etudiants");
        console.log(cours);
    } catch (err){
      console.log(err)
      return next(
        new HttpErreur("Erreur lors de la suppression du cours", 500)
      );
    }
    if(!cours){
      return next(new HttpErreur("Impossible de trouver le cours", 404));
    }

    try{

        cours.professeur.cours.pull(cours);

        cours.etudiants.forEach(async etudiant => {etudiant.cours.pull(cours); await etudiant.save()});

        index = cours.professeur.cours.findIndex(cours => cours._id === coursObjId)
        cours.professeur.save()
        await Cours.deleteOne(cours);
    }catch (err){
      console.log(err);
      return next(
        new HttpErreur("Erreur lors de la suppression du cours", 500)
      );
    }
    reponse.status(200).json({ message: "Cours supprimée" });
  };

exports.getCoursById = getCoursById;
exports.creerCours = creerCours;
exports.updateCours = updateCours;
exports.supprimerCours = supprimerCours;