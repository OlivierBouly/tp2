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

const inscription = (requete, reponse, next) => {
    const {titre, professeur, etudiants} = requete.body;

    const coursExiste = COURS.find(c => c.titre === titre);
    if(coursExiste){
        throw new HttpErreur("Cours existe déjà", 422);
    }

    const nouveauCours = {
        id: uuidv4(),
        titre,
        professeur: professeur,
        etudiants
    }

    COURS.push(nouveauCours);

    reponse.status(201).json(nouveauCours);
};

exports.getCoursById = getCoursById;
exports.inscription = inscription;