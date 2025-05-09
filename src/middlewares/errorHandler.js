const errorHandler = (error, req, res, next) => {
  console.error(error.stack);
  // Envoyer une réponse d'erreur générique
  // Dans un environnement de production, on pourrait logger l'erreur de manière plus détaillée
  // et éviter d'exposer le stack trace à l'utilisateur.
  res.status(error.status || 500).json({
    error: {
      message: error.message || 'An internal server error occurred.', // Message par défaut en anglais
      // On pourrait ajouter un code d'erreur spécifique ici
    }
  });
};

module.exports = errorHandler;

