const express = require('express');

const HttpErreur = require("../models/http-erreur");

const controleursCours = require("../controllers/cours-controlleurs")
const router = express.Router();

router.get('/:coursId', controleursCours.getCoursById);

router.post('/inscriptionCours', controleursCours.inscription);
/*
const COURS = [
        {
            id: "c1",
            titre: "Math",
            nbEtudiant: "15"
        }
    ];


    */
    module.exports = router;