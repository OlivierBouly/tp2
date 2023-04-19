const express = require('express');

const HttpErreur = require("../models/http-erreur");

const controleursCours = require("../controllers/cours-controlleurs")
const router = express.Router();

router.get('/:coursId', controleursCours.getCoursById);

router.post('/', controleursCours.creerCours);

router.patch('/:coursId', controleursCours.updateCours);

router.delete('/:coursId', controleursCours.supprimerCours);

module.exports = router;