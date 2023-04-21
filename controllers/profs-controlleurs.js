const { response } = require("express");
const {v4 : uuidv4} = require("uuid");
const Professeur = require("../models/professeur");
const Cours = require('../models/cours');
const Etudiant = require('../models/etudiant');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

const HttpErreur = require("../models/http-erreur");
const cours = require("../models/cours");
  
const getProfById = async (requete, reponse, next) => {
  const profId = requete.params.profId;
  let prof;
  try {

    profObjId = new mongoose.Types.ObjectId(profId.substring(0, profId.length-1))

    prof = await Professeur.findById(profObjId);
  } catch (err) {
    console.log(err);
    return next(
      new HttpErreur("Erreur lors de la récupération du prof", 500)
    );
  }
  if (!prof) {
    return next(new HttpErreur("Aucune prof trouvée pour l'id fourni", 404));
  }
  reponse.json({ prof: prof.toObject({ getters: true }) });
};

  const creerProf = (async (requete, reponse, next) => {
      const {nom, prenom} = requete.body;
      console.log(requete.body);

      let profExiste;

      try {
        profExiste = await Professeur.findOne({ nom: nom });
        profExiste = await Professeur.findOne({ prenom: prenom });
      } catch {
        return next(new HttpErreur("Échec vérification prof existe", 500));
      }
    
      if (profExiste) {
        return next(
          new HttpErreur("Professeur existe deja", 422)
        );
      }

      const nouveauProf = new Professeur({
        nom: nom,
        prenom: prenom,
        cours: []
      });

      try {
        await nouveauProf.save();
      } catch (err) {
        console.log(err);
        return next(new HttpErreur("Erreur lors de l'ajout du professeur", 422));
      }
      reponse
        .status(201)
        .json({ professeur: nouveauProf.toObject({ getter: true }) });

    });

  const updateProf = async (requete, reponse, next) => {
    const {nom, prenom, cours} = requete.body;
    const profId = requete.params.profId;

    let prof;

    try {

      
      profObjId = new mongoose.Types.ObjectId(profId)

      prof = await Professeur.findById(profObjId);

      prof.nom = nom;
      prof.prenom = prenom;
      await prof.save();
      prof = await Professeur.findById(profObjId).populate("cours");
      prof.cours.forEach(async cours => {cours.professeur = null; await cours.save()});

      prof.cours = cours;
      await prof.save();
      prof = await Professeur.findById(profObjId).populate("cours");
      prof.cours.forEach(cours => {if(!cours){return next(new HttpErreur("Impossible de trouver le cours", 404));}});

      prof.cours.forEach(cours => cours.professeur = profObjId);
      prof.cours.forEach(async cours => await cours.save());
    } catch(err) {

      console.log(err)

      return next(
        new HttpErreur("Erreur lors de la mise à jour du prof", 500)
      );
    }
  
    reponse.status(200).json({ prof: prof.toObject({ getters: true }) });

  };

  const supprimerProf = async (requete, reponse, next) => { 
    const profId = requete.params.profId;

    profObjId = new mongoose.Types.ObjectId(profId)

    let prof;
    try {
      prof = await Professeur.findById(profObjId).populate("cours");
      console.log(prof);
    } catch (err){
      console.log(err)
      return next(
        new HttpErreur("Erreur lors de la suppression du prof", 500)
      );
    }
    if(!prof){
      return next(new HttpErreur("Impossible de trouver le prof", 404));
    }

    try{

      prof.cours.forEach(cours => cours.professeur = null);

      prof.cours.forEach(async cours =>await cours.save());

      await Professeur.deleteOne(prof);
  
    }catch (err){
      console.log(err);
      return next(
        new HttpErreur("Erreur lors de la suppression du prof", 500)
      );
    }
    reponse.status(200).json({ message: "Professeur supprimée" });
  };

const ajouterCoursProf = async (requete, reponse, next) => {
  const {coursId} = requete.body;
  const profId = requete.params.profId;
  profObjId = new mongoose.Types.ObjectId(profId);
  coursObjId = new mongoose.Types.ObjectId(coursId);

  let prof;
  try {
    prof = await Professeur.findById(profObjId);
  } catch (err){
    console.log(err)
    return next(
      new HttpErreur("Erreur lors de l'ajout du cours", 500)
    );
  }
  if(!prof){
    return next(new HttpErreur("Impossible de trouver le prof", 404));
  }
  if(!cours){
    return next(new HttpErreur("Impossible de trouver le cours", 404));
  }

  if(prof.cours.includes(coursObjId)){return next(new HttpErreur("Le cours est deja assigne a ce professeur", 404)); }
  try{

    
    prof.cours.push(coursObjId);
    
    await prof.save();
    
    index = prof.cours.findIndex(cours => cours === coursObjId);

    prof = await Professeur.findById(profObjId).populate("cours");

    prof.cours[index].professeur = profObjId;

    await prof.cours[index].save()

    await prof.save()

    reponse.status(200).json({ prof: prof.toObject({ getters: true }) });
  }catch(err){
    console.log(err);
    return next(
      new HttpErreur("Erreur lors de l'ajout du cours", 500)
    );
  }
}
  exports.getProfById = getProfById;
  exports.creerProf = creerProf;
  exports.updateProf = updateProf;
  exports.supprimerProf = supprimerProf;
  exports.ajouterCoursProf = ajouterCoursProf;