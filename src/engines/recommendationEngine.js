const RestCountriesService = require("../services/restCountriesService");
const WeatherService = require("../services/weatherService");
const NutritionService = require("../services/nutritionService");

class RecommendationEngine {
  constructor() {
    this.restCountriesService = new RestCountriesService();
    this.weatherService = new WeatherService();
    this.nutritionService = new NutritionService();
  }

  async generateRecommendation(region, country) {
    let countriesData;
    try {
      if (country) {
        countriesData = await this.restCountriesService.getCountry(country);
      } else if (region) {
        countriesData = await this.restCountriesService.getCountriesByRegion(region);
      } else {
        // Ni région ni pays fourni, déjà géré par le contrôleur, mais sécurité supplémentaire
        return null;
      }

      if (!countriesData || countriesData.length === 0) {
        console.error(`No countries found for input: region='${region}', country='${country}'`);
        return null; // Le contrôleur gérera l'erreur 404
      }

      // Si recherche par région et plusieurs pays sont retournés, et aucun pays spécifique n'a été fourni initialement
      if (!country && region && countriesData.length > 1) {
        // Retourner une liste de pays pour sélection par l'utilisateur
        return {
          potentialCountries: countriesData.map(c => ({
            name: c.name.common,
            // Ajouter d'autres infos si nécessaire pour la sélection, ex: c.cca2 pour un code unique
          })).sort((a, b) => a.name.localeCompare(b.name)) // Trier par nom
        };
      }
      
      // Si un pays est spécifié ou si la région ne retourne qu'un seul pays
      const selectedCountryData = countriesData[0];

      if (!selectedCountryData || !selectedCountryData.name || !selectedCountryData.name.common || !selectedCountryData.capital || !selectedCountryData.capital[0] || !selectedCountryData.currencies || !selectedCountryData.languages) {
        console.error("Selected country data is incomplete:", selectedCountryData);
        throw new Error("Selected country data is incomplete or missing essential fields.");
      }

      const countryInfo = {
        name: selectedCountryData.name.common,
        capital: selectedCountryData.capital[0],
        currencies: Object.keys(selectedCountryData.currencies).length > 0 ? Object.keys(selectedCountryData.currencies)[0] : "N/A",
        languages: Object.values(selectedCountryData.languages).length > 0 ? Object.values(selectedCountryData.languages)[0] : "N/A",
      };

      let weatherInfo;
      try {
        weatherInfo = await this.weatherService.getWeather(countryInfo.capital);
      } catch (error) {
        console.error(`Error in RecommendationEngine fetching weather for ${countryInfo.capital}:`, error.message);
        throw error;
      }

      let fruits = [];
      try {
        fruits = await this.nutritionService.getLocalFruits(countryInfo.name.toLowerCase());
      } catch (error) {
        console.warn(`Warning in RecommendationEngine fetching fruits for ${countryInfo.name}:`, error.message);
        fruits = [];
      }

      let message;
      const fruitsList = fruits.length > 0 ? fruits.join(", ") : "fruits locaux (si disponibles)";

      if (weatherInfo.humidity > 70) {
        message = `Avec une humidité élevée (${weatherInfo.humidity}%), privilégiez des aliments hydratants comme ${fruitsList}.`;
      } else if (weatherInfo.temp < 10) {
        message = `Avec un froid de ${weatherInfo.temp}°C, consommez des aliments riches en vitamine C comme ${fruitsList} pour renforcer votre immunité.`;
      } else {
        message = `Les conditions sont agréables (${weatherInfo.temp}°C, ${weatherInfo.humidity}% d’humidité). Profitez des fruits locaux : ${fruitsList} !`;
      }

      if (fruits.length === 0 && message.includes("fruits locaux (si disponibles)")){
          let baseMessage;
          if (weatherInfo.humidity > 70) {
              baseMessage = `Avec une humidité élevée (${weatherInfo.humidity}%), pensez à bien vous hydrater.`;
          } else if (weatherInfo.temp < 10) {
              baseMessage = `Avec un froid de ${weatherInfo.temp}°C, couvrez-vous bien et consommez des boissons chaudes.`;
          } else {
              baseMessage = `Les conditions sont agréables (${weatherInfo.temp}°C, ${weatherInfo.humidity}% d’humidité). Profitez de votre séjour !`;
          }
          message = baseMessage + " Aucun fruit local spécifique n'a été trouvé pour ce pays. Nous vous recommandons de vous renseigner sur place pour découvrir les produits de saison.";
      }

      const healthTip = { message };

      return {
        country: countryInfo,
        weather: weatherInfo,
        tips: [healthTip],
      };

    } catch (error) {
      console.error("Error in RecommendationEngine main logic:", error.message);
      // S'assurer que l'erreur est propagée pour être gérée par le contrôleur et le middleware d'erreur
      throw error; 
    }
  }
}

module.exports = RecommendationEngine;

