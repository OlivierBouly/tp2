const express = require('express');

const HttpErreur = require("../models/http-erreur");

const controleursCours = require("../controllers/cours-controlleurs")
const router = express.Router();

router.get('/:coursId', controleursCours.getCoursById);

router.post('/inscriptionCours', controleursCours.inscription);

    module.exports = router;