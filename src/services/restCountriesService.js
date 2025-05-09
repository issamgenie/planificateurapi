const axios = require("axios");
const env = require("../config/env");

class RestCountriesService {
  async getCountry(countryName) {
    // La spécification initiale utilise /name/{country}, mais l'API v3.1 semble préférer /name/{name}?fullText=true pour une correspondance exacte
    // ou /name/{name} pour une correspondance partielle. Nous utiliserons la correspondance partielle pour plus de flexibilité.
    // Cependant, pour correspondre à la logique de `generateRecommendation` qui prend `countries[0]`,
    // il est important que la recherche soit assez précise ou que la logique de sélection soit revue.
    // Pour l'instant, on s'en tient à la spécification qui prend le premier résultat.
    const url = `${env.RESTCOUNTRIES_URL}/name/${encodeURIComponent(countryName)}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching country ${countryName}:`, error.message);
      // Renvoyer une erreur ou un tableau vide pour que le moteur de recommandation puisse le gérer
      throw new Error(`Could not fetch data for country ${countryName}.`);
    }
  }

  async getCountriesByRegion(region) {
    const url = `${env.RESTCOUNTRIES_URL}/region/${encodeURIComponent(region)}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching countries for region ${region}:`, error.message);
      throw new Error(`Could not fetch data for region ${region}.`);
    }
  }
}

module.exports = RestCountriesService;

