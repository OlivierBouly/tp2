const express = require('express');
const bodyParser = require('body-parser');

const profsRoutes = require("./routes/profs-routes");
const etudiantsRoutes = require("./routes/etudiants-routes");
const coursRoutes = require("./routes/cours-routes");

const app = express();

app.use(profsRoutes);
//app.use(etudiantsRoutes);
//app.use(coursRoutes);

app.listen(5000);

