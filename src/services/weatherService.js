const axios = require("axios");
const env = require("../config/env");

class WeatherService {
  async getWeather(city) {
    if (!env.WEATHERAPI_KEY) {
      console.warn("WEATHERAPI_KEY is not set. Returning mock weather data.");
      // Retourner des données fictives si la clé API n'est pas configurée
      return {
        temp: 20, // Valeur par défaut
        humidity: 60, // Valeur par défaut
        condition: "Sunny (Mock Data)", // Indiquer que ce sont des données fictives
      };
    }

    const url = `${env.WEATHERAPI_URL}/current.json?key=${env.WEATHERAPI_KEY}&q=${encodeURIComponent(city)}&aqi=no`;
    try {
      const response = await axios.get(url);
      const data = response.data;
      if (data && data.current) {
        return {
          temp: data.current.temp_c,
          humidity: data.current.humidity,
          condition: data.current.condition.text,
        };
      } else {
        console.error(`Error fetching weather for ${city}: Invalid data structure in response`, data);
        throw new Error(`Could not fetch weather data for ${city} due to invalid response structure.`);
      }
    } catch (error) {
      console.error(`Error fetching weather for ${city}:`, error.message);
      // En cas d'erreur (clé invalide, ville non trouvée, etc.), retourner des valeurs par défaut ou une erreur claire
      // Pour l'instant, nous allons lancer une erreur pour que le moteur de recommandation puisse la gérer.
      // On pourrait aussi retourner des valeurs par défaut comme pour la clé manquante.
      throw new Error(`Could not fetch weather data for ${city}.`);
    }
  }
}

module.exports = WeatherService;

