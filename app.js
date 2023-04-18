const express = require('express');
const bodyParser = require('body-parser');

const profsRoutes = require("./routes/profs-routes");
const etudiantsRoutes = require("./routes/etudiants-routes");
const coursRoutes = require("./routes/cours-routes");
const HttpErreur = require("./models/http-erreur");

const app = express();

app.use(bodyParser.json());

app.use("/api/professeurs", profsRoutes);
app.use("/api/cours", coursRoutes);

app.use((error, requete, reponse, next) => {
    if(reponse.headerSent){
    return next(error);
    }
    reponse.status(error.code || 500);
    reponse.json({message: error.message || "Une erreur inconnue est survenue" })});

app.use((requete, reponse, next) => {
    return next(new HttpErreur("Route non trouvée", 404));
});

app.listen(5000);

