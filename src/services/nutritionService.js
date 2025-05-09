const axios = require("axios");
const env = require("../config/env");

class NutritionService {
  async getLocalFruits(countryName) {
    // L'API Open Food Facts utilise les codes pays (ex: "fr" pour France, "it" pour Italie)
    // Plutôt que le nom complet. Il faudra potentiellement une étape de mapping si
    // RestCountriesService ne fournit pas directement ce code sous une forme simple.
    // Pour l'instant, on suppose que `countryName` pourrait être un code pays ou un nom
    // que l'API Open Food Facts peut interpréter via `countries_tags`.
    // La spécification indique `countryInfo.name.toLowerCase()` qui est le nom commun en minuscule.
    const url = `${env.OPENFOODFACTS_URL}/search.json?search_simple=1&action=process&tagtype_0=countries&tag_contains_0=contains&tag_0=${encodeURIComponent(countryName.toLowerCase())}&tagtype_1=categories&tag_contains_1=contains&tag_1=fruits&json=1&page_size=10`; // Ajout de page_size pour limiter les résultats

    try {
      const response = await axios.get(url);
      const data = response.data;

      if (data && data.products && data.products.length > 0) {
        // Filtrer pour s'assurer que product_name existe et n'est pas vide
        const fruits = data.products
          .map(p => p.product_name_fr || p.product_name_en || p.product_name)
          .filter(name => name && name.trim() !== "")
          .slice(0, 3); // Prend les 3 premiers fruits avec un nom valide
        return fruits;
      } else {
        console.warn(`No fruits found for country "${countryName}" or invalid data structure.`);
        return []; // Retourner un tableau vide si aucun produit ou structure invalide
      }
    } catch (error) {
      console.error(`Error fetching local fruits for "${countryName}":`, error.message);
      // En cas d'erreur, retourner un tableau vide pour que le moteur de recommandation puisse gérer cela
      // conformément à la discussion avec l'utilisateur (afficher un message spécifique).
      return [];
    }
  }
}

module.exports = NutritionService;

