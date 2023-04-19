const { response } = require("express");
const {v4 : uuidv4} = require("uuid");
const HttpErreur = require("../models/http-erreur")

let COURS = [
    {
        id: "c1",
        titre: "Math",
        professeur: "",
        etudiants: [

        ]
    }
];

const getCoursById = (requete, reponse, next) => {
    const coursId = requete.params.coursId
    const cours = COURS.find(cours => {
        return cours.id === coursId;
    })
    if(!cours){
        return next(new HttpErreur("Aucun cours avec le id fourni", 404));
    } else {
        reponse.json({cours});
    }
    };

const creerCours = (requete, reponse, next) => {
    const {titre} = requete.body;

    const coursExiste = COURS.find(c => c.titre === titre);
    if(coursExiste){
        throw new HttpErreur("Cours existe déjà", 422);
    }

    const nouveauCours = {
        id: uuidv4(),
        titre: titre,
        professeur: "",
        etudiants: []
    }

    COURS.push(nouveauCours);

    reponse.status(201).json(nouveauCours);
};

const updateCours = (requete, reponse, next) => {
    const {titre, professeur, etudiants} = requete.body;
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