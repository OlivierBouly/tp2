const { response } = require("express");
const {v4 : uuidv4} = require("uuid");
const Professeur = require("../models/professeur");
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

const HttpErreur = require("../models/http-erreur");

let PROFS = [
  {
      id: "p1",
      nom: "Bouly",
      prenom: "Olivier",
      cours: [

      ]
  }
  ];
  
const getProfById = async (requete, reponse, next) => {
  let profId = requete.params.profId;
  let prof;
  try {

    profId = profId.substring(0, profId.length-1);

    profObjId = new mongoose.Types.ObjectId(profId)

    prof = await Professeur.findById(profObjId);
  } catch (err) {
    console.log(err);
    return next(
      new HttpErreur("Erreur lors de la récupération du prof", 500)
    );
  }
  if (!prof) {
    return next(new HttpErreur("Aucune place trouvée pour l'id fourni", 404));
  }
  reponse.json({ prof: prof.toObject({ getters: true }) });
};

  const creerProf = (async (requete, reponse, next) => {
      const {nom, prenom} = requete.body;
      console.log(requete.body);
      console.log(requete.params);

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

  const updateProf = (requete, reponse, next) => {
    const {nom, prenom, cours} = requete.body;
    const profId = requete.params.profId;

      const profModifiee = {...PROFS.find(prof => prof.id === profId)};
      const indiceProf = PROFS.findIndex(prof => prof.id === profId);

      profModifiee.cours = cours
      profModifiee.nom = nom;
      profModifiee.prenom = prenom;

      PROFS[indiceProf] = profModifiee;

      reponse.status(200).json({prof:profModifiee});

  };

  const supprimerProf = (requete, reponse, next) => { 
    
    const profId = requete.params.profId;
    PROFS = PROFS.filter(prof => prof.id !== profId);
    reponse.status(200).json({message: "Professeur supprimé"});
  };
  
  exports.getProfById = getProfById;
  exports.creerProf = creerProf;
  exports.updateProf = updateProf;
  exports.supprimerProf = supprimerProf;