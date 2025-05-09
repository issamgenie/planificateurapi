const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const env = require('./config/env');

const app = express();

// Middleware
// TODO: Configurer les origines CORS précises après le déploiement du frontend
app.use(cors({ origin: ['http://localhost:5173'] })); 
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limite à 100 requêtes par IP
  })
);

// Routes
app.use('/api', routes);

// Gestion des erreurs
app.use(errorHandler);

// Démarrer le serveur
if (process.env.NODE_ENV !== 'test') {
  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
}

module.exports = app; // Exporter pour les tests

