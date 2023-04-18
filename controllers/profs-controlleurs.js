const { response } = require("express");
const {v4 : uuidv4} = require("uuid");

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

const getProfById = (requete, reponse, next) => {
    const profId = requete.params.profId;
    const prof = PROFS.find((prof) => {
      return prof.id === profId;
    });
  
    if (!prof) {
      return next(new HttpErreur("Aucun professeur trouvé pour l'id fourni", 404));
    }
  
    reponse.json({ prof });
  };

  const creerProf = ((requete, reponse, next) => {
      const {nom, prenom} = requete.body;
      console.log(requete.body);
      const nouveauProf ={
        id: uuidv4(),
        nom: nom,
        prenom: prenom,
        cours: []
      }

      PROFS.push(nouveauProf);

      reponse.status(201).json({prof: nouveauProf}); 
  })

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
    reponse.status(200).json({message: "Professeur supprimée"});
  };
  
  exports.getProfById = getProfById;
  exports.creerProf = creerProf;
  exports.updateProf = updateProf;
  exports.supprimerProf = supprimerProf;