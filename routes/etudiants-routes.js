const express = require('express');

const HttpErreur = require("../models/http-erreur");

const controleursEtudiants = require("../controllers/etudiants-controlleurs")
const router = express.Router();

router.get('/:etudiantId', controleursEtudiants.getEtudiantById);

module.exports = router;