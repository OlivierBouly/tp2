const express = require('express');

const HttpErreur = require("../models/http-erreur");

const router = express.Router();

const PROFS = [
    {
        id: "p1",
        nom: "Bouly",
        prenom: "Olivier"
    }
    ];

router.get('/:profId', (requete, reponse, next) => {
    const profId = requete.params.profId
    const prof = PROFS.find(prof => {
        return prof.id === profId;
    })
    console.log("Requête GET dans profs-routes")
    if(!prof){
        return next(new HttpErreur("Aucun professeur avec le id fourni", 404));
    } else {
        reponse.json({prof});
    }

    });
    module.exports = router;
