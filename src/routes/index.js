const express = require("express");
const travelController = require("../controllers/travelController");

const router = express.Router();

// Route pour les recommandations de voyage
router.post("/v1/recommendation", travelController.getRecommendation);

router.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = router;

