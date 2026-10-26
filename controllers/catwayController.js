
const Catway = require("../models/Catway");

/**
 * Affiche la liste de tous les catways.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.getAllCatways = async (req, res) => {
    try {
        const catways = await Catway.find();
        res.status(200).json(catways);
    } catch (error) {
        console.error("Erreur lors de la récupération des catways :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

/**
 * Affiche un catway à partir de son numéro.
 */
exports.getCatwayById = async (req, res) => {
    try {
        const catwayNumber = Number(req.params.id);

        if (!Number.isInteger(catwayNumber) || catwayNumber < 1) {
            return res.status(400).json({ message: "Numéro de catway invalide." });
        }

        const catway = await Catway.findOne({ catwayNumber });

        if (!catway) {
            return res.status(404).json({ message: "Catway introuvable." });
        }

        res.status(200).json(catway);
    } catch (error) {
        console.error("Erreur lors de la récupération du catway :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

/**
 * Crée un nouveau catway.
 */
exports.createCatway = async (req, res) => {
    try {
        const { catwayNumber, catwayType, catwayState } = req.body;

        if (!Number.isInteger(Number(catwayNumber)) ||
            Number(catwayNumber) < 1 ||
            !["long", "short"].includes(catwayType) ||
            typeof catwayState !== "string" ||
            catwayState.trim().length < 2) {
            return res.status(400).json({
                message: "Données du catway invalides."
            });
        }

        const existingCatway = await Catway.findOne({
            catwayNumber: Number(catwayNumber)
        });

        if (existingCatway) {
            return res.status(409).json({
                message: "Ce numéro de catway existe déjà."
            });
        }

        const catway = await Catway.create({
            catwayNumber: Number(catwayNumber),
            catwayType,
            catwayState: catwayState.trim()
        });

        res.status(201).json(catway);
    } catch (error) {
        console.error("Erreur lors de la création du catway :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

/**
 * Modifie uniquement l'état d'un catway.
 */
exports.updateCatway = async (req, res) => {
    try {
        const catwayNumber = Number(req.params.id);
        const { catwayState } = req.body;

        if (!Number.isInteger(catwayNumber) || catwayNumber < 1) {
            return res.status(400).json({ message: "Numéro de catway invalide." });
        }

        if (typeof catwayState !== "string" || catwayState.trim().length < 2) {
            return res.status(400).json({ message: "État du catway invalide." });
        }

        // Seul catwayState est modifiable.
        const catway = await Catway.findOneAndUpdate(
            { catwayNumber },
            { $set: { catwayState: catwayState.trim() } },
            { new: true, runValidators: true }
        );

        if (!catway) {
            return res.status(404).json({ message: "Catway introuvable." });
        }

        res.status(200).json(catway);
    } catch (error) {
        console.error("Erreur lors de la modification du catway :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

/**
 * Supprime un catway à partir de son numéro.
 */
exports.deleteCatway = async (req, res) => {
    try {
        const catwayNumber = Number(req.params.id);

        if (!Number.isInteger(catwayNumber) || catwayNumber < 1) {
            return res.status(400).json({ message: "Numéro de catway invalide." });
        }

        const catway = await Catway.findOneAndDelete({ catwayNumber });

        if (!catway) {
            return res.status(404).json({ message: "Catway introuvable." });
        }

        res.status(200).json({ message: "Catway supprimé." });
    } catch (error) {
        console.error("Erreur lors de la suppression du catway :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};


/**
 * Affiche la page HTML contenant la liste des catways.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.renderCatwaysPage = async (req, res) => {
    try {
        const catways = await Catway.find();

     res.render("catways/index", {
    catways,
    error: null
});   
    } catch (error) {
        console.error("Erreur lors de l'affichage des catways :", error);

        res.status(500).send("Impossible d'afficher les catways.");
    }
};


/**
 * Affiche le formulaire de modification d'un catway.
 */
exports.renderCatwayDetails = async (req, res) => {
    try {
        const catwayNumber = Number(req.params.id);

        if (!Number.isInteger(catwayNumber) || catwayNumber < 1) {
            return res.status(400).send("Numéro de catway invalide.");
        }

        const catway = await Catway.findOne({ catwayNumber });

        if (!catway) {
            return res.status(404).send("Catway introuvable.");
        }

        res.render("catways/details", { catway });
    } catch (error) {
        console.error("Erreur détails catway :", error);
        res.status(500).send("Impossible d'afficher les détails.");
    }
};
exports.renderEditCatway = async (req, res) => {
    try {
        const catwayNumber = Number(req.params.id);

        if (!Number.isInteger(catwayNumber) || catwayNumber < 1) {
            return res.status(400).send("Numéro de catway invalide.");
        }

        const catway = await Catway.findOne({ catwayNumber });

        if (!catway) {
            return res.status(404).send("Catway introuvable.");
        }

        res.render("catways/edit", {
            catway,
            error: null
        });
    } catch (error) {
        console.error("Erreur lors de l'affichage du formulaire :", error);
        res.status(500).send("Impossible d'afficher le formulaire de modification.");
    }
};