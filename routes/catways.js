
const express = require("express");
const router = express.Router();

const catwayController = require("../controllers/catwayController");
const { isAuthenticated } = require("../middleware/auth");

/**
 * Routes de gestion des catways.
 * Toutes ces routes nécessitent une connexion.
 */

// GET /catways : liste tous les catways
router.get("/", isAuthenticated, catwayController.getAllCatways);

// GET /catways/:id/edit : affiche le formulaire de modification
router.get("/:id/edit", isAuthenticated, catwayController.renderEditCatway);

// GET /catways/:id : détail d'un catway
router.get("/:id", isAuthenticated, catwayController.getCatwayById);

// POST /catways : crée un catway
router.post("/", isAuthenticated, catwayController.createCatway);


router.post("/:id", isAuthenticated, async (req, res) => {
    try {
        const catwayNumber = Number(req.params.id);
        const { catwayState } = req.body;

        if (
            !Number.isInteger(catwayNumber) ||
            catwayNumber < 1 ||
            typeof catwayState !== "string" ||
            catwayState.trim().length < 2
        ) {
            return res.status(400).send("Données du catway invalides.");
        }

        const Catway = require("../models/Catway");

        const catway = await Catway.findOneAndUpdate(
            { catwayNumber },
            { $set: { catwayState: catwayState.trim() } },
            { new: true, runValidators: true }
        );

        if (!catway) {
            return res.status(404).send("Catway introuvable.");
        }

        return res.redirect("/catways-page");
    } catch (error) {
        console.error("Erreur lors de la modification du catway :", error);
        return res.status(500).send("Impossible de modifier le catway.");
    }
});

// PUT /catways/:id : modifie uniquement l'état
router.put("/:id", isAuthenticated, catwayController.updateCatway);

// DELETE /catways/:id : supprime un catway
router.delete("/:id", isAuthenticated, catwayController.deleteCatway);

module.exports = router;
