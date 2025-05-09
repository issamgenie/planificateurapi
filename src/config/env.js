const dotenv = require("dotenv");
dotenv.config(); // Charge les variables d'environnement depuis le fichier .env à la racine de apps/api

const env = {
  RESTCOUNTRIES_URL: process.env.RESTCOUNTRIES_URL || "https://restcountries.com/v3.1",
  WEATHERAPI_URL: process.env.WEATHERAPI_URL || "http://api.weatherapi.com/v1",
  WEATHERAPI_KEY: process.env.WEATHERAPI_KEY, // Sera fourni par l'utilisateur plus tard
  OPENFOODFACTS_URL: process.env.OPENFOODFACTS_URL || "https://world.openfoodfacts.org/api/v0",
  PORT: process.env.PORT || 8080,
  CORS_ORIGINS: process.env.CORS_ORIGINS,
};

// Vérification simple des variables requises (uniquement celles qui sont critiques au démarrage sans valeur par défaut)
// WEATHERAPI_KEY sera vérifié au moment de l'appel si nécessaire, ou le service utilisera des mocks.

module.exports = env;

