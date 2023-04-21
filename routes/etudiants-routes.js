const express = require('express');

const HttpErreur = require("../models/http-erreur");

const controleursEtudiants = require("../controllers/etudiants-controlleurs")
const router = express.Router();

router.get('/:etudiantId', controleursEtudiants.getEtudiantById);

router.post('/', controleursEtudiants.creerEtudiant);

router.patch('/:etudiantId', controleursEtudiants.updateEtudiant);

router.patch('/:etudiantId/ajouterCours', controleursEtudiants.ajouterCoursEtudiant)

router.delete('/:etudiantId', controleursEtudiants.supprimerEtudiant);

module.exports = router;