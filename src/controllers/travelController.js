const RecommendationEngine = require("../engines/recommendationEngine");

const travelController = {
  async getRecommendation(req, res, next) { // Ajout de next pour le error handler
    try {
      const { region, country } = req.body;
      if (!region && !country) {
        // Utiliser une erreur HTTP standard pour les requêtes incorrectes
        const err = new Error("Region or country is required");
        err.status = 400;
        return next(err);
      }

      // Instancier le moteur de recommandation. Il sera créé à l'étape suivante.
      const recommendationEngine = new RecommendationEngine();
      const recommendation = await recommendationEngine.generateRecommendation(region, country);
      
      // Si recommendation est null ou undefined (par exemple, si aucun pays n'est trouvé après filtrage)
      if (!recommendation) {
        const err = new Error("No recommendation could be generated for the provided input.");
        err.status = 404; // Not Found, car la ressource (recommandation) n'a pas pu être créée/trouvée
        return next(err);
      }

      return res.json(recommendation);
    } catch (error) {
      // S'assurer que l'erreur est passée au middleware errorHandler
      // Le middleware errorHandler se chargera de logger et de formater la réponse d'erreur.
      next(error);
    }
  },
};

module.exports = travelController;

