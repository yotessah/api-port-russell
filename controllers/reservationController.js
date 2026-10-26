
const Reservation = require("../models/Reservation");
const Catway = require("../models/Catway");

/**
 * Liste toutes les réservations d'un catway.
 */
exports.getAllReservations = async (req, res) => {
    try {
        const catwayNumber = Number(req.params.id);

        if (!Number.isInteger(catwayNumber) || catwayNumber < 1) {
            return res.status(400).json({ message: "Numéro de catway invalide." });
        }

        const reservations = await Reservation.find({ catwayNumber });

        res.status(200).json(reservations);
    } catch (error) {
        console.error("Erreur lors de la récupération des réservations :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

/**
 * Récupère une réservation précise d'un catway.
 */
exports.getReservationById = async (req, res) => {
    try {
        const catwayNumber = Number(req.params.id);
        const reservationId = req.params.idReservation;

        if (!Number.isInteger(catwayNumber) || catwayNumber < 1) {
            return res.status(400).json({ message: "Numéro de catway invalide." });
        }

        const reservation = await Reservation.findOne({
            _id: reservationId,
            catwayNumber
        });

        if (!reservation) {
            return res.status(404).json({ message: "Réservation introuvable." });
        }

        res.status(200).json(reservation);
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Identifiant de réservation invalide." });
        }

        console.error("Erreur lors de la récupération de la réservation :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

/**
 * Crée une réservation pour un catway existant.
 */
exports.createReservation = async (req, res) => {
    try {
        const catwayNumber = Number(req.params.id);
        const { clientName, boatName, startDate, endDate } = req.body;

        if (!Number.isInteger(catwayNumber) || catwayNumber < 1) {
            return res.status(400).json({ message: "Numéro de catway invalide." });
        }

        if (
            typeof clientName !== "string" || clientName.trim().length < 2 ||
            typeof boatName !== "string" || boatName.trim().length < 2 ||
            !startDate || !endDate
        ) {
            return res.status(400).json({ message: "Données de réservation invalides." });
        }

        const debut = new Date(startDate);
        const fin = new Date(endDate);

        if (
            Number.isNaN(debut.getTime()) ||
            Number.isNaN(fin.getTime()) ||
            fin <= debut
        ) {
            return res.status(400).json({
                message: "Les dates sont invalides : la fin doit être postérieure au début."
            });
        }

        const catway = await Catway.findOne({ catwayNumber });

        if (!catway) {
            return res.status(404).json({ message: "Catway introuvable." });
        }

        const reservation = await Reservation.create({
            catwayNumber,
            clientName: clientName.trim(),
            boatName: boatName.trim(),
            startDate: debut,
            endDate: fin
        });

        res.status(201).json(reservation);
    } catch (error) {
        console.error("Erreur lors de la création de la réservation :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

/**
 * Modifie une réservation d'un catway.
 */
exports.updateReservation = async (req, res) => {
    try {
        const catwayNumber = Number(req.params.id);
        const reservationId = req.params.idReservation;
        const { clientName, boatName, startDate, endDate } = req.body;

        if (!Number.isInteger(catwayNumber) || catwayNumber < 1) {
            return res.status(400).json({ message: "Numéro de catway invalide." });
        }

        if (
            typeof clientName !== "string" || clientName.trim().length < 2 ||
            typeof boatName !== "string" || boatName.trim().length < 2 ||
            !startDate || !endDate
        ) {
            return res.status(400).json({ message: "Données de réservation invalides." });
        }

        const debut = new Date(startDate);
        const fin = new Date(endDate);

        if (
            Number.isNaN(debut.getTime()) ||
            Number.isNaN(fin.getTime()) ||
            fin <= debut
        ) {
            return res.status(400).json({ message: "Dates de réservation invalides." });
        }

        const reservation = await Reservation.findOneAndUpdate(
            { _id: reservationId, catwayNumber },
            {
                $set: {
                    clientName: clientName.trim(),
                    boatName: boatName.trim(),
                    startDate: debut,
                    endDate: fin
                }
            },
            { new: true, runValidators: true }
        );

        if (!reservation) {
            return res.status(404).json({ message: "Réservation introuvable." });
        }

        res.status(200).json(reservation);
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Identifiant de réservation invalide." });
        }

        console.error("Erreur lors de la modification de la réservation :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

/**
 * Supprime une réservation d'un catway.
 */
exports.deleteReservation = async (req, res) => {
    try {
        const catwayNumber = Number(req.params.id);
        const reservationId = req.params.idReservation;

        if (!Number.isInteger(catwayNumber) || catwayNumber < 1) {
            return res.status(400).json({ message: "Numéro de catway invalide." });
        }

        const reservation = await Reservation.findOneAndDelete({
            _id: reservationId,
            catwayNumber
        });

        if (!reservation) {
            return res.status(404).json({ message: "Réservation introuvable." });
        }

        res.status(200).json({ message: "Réservation supprimée." });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Identifiant de réservation invalide." });
        }

        console.error("Erreur lors de la suppression de la réservation :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};


/**
 * Affiche la page HTML contenant toutes les réservations.
 */
exports.renderReservationsPage = async (req, res) => {
    try {
        const reservations = await Reservation.find().sort({ startDate: 1 });

        res.render("reservation/index", {
            reservations
        });
    } catch (error) {
        console.error("Erreur lors de l'affichage des réservations :", error);

        res.status(500).send("Impossible d'afficher les réservations.");
    }
};


/**
 * Affiche les détails HTML d'une réservation.
 */
exports.renderReservationDetails = async (req, res) => {
    try {
        const catwayNumber = Number(req.params.id);
        const reservationId = req.params.idReservation;

        if (!Number.isInteger(catwayNumber) || catwayNumber < 1) {
            return res.status(400).send("Numéro de catway invalide.");
        }

        const reservation = await Reservation.findOne({
            _id: reservationId,
            catwayNumber
        });

        if (!reservation) {
            return res.status(404).send("Réservation introuvable.");
        }

        res.render("reservation/details", { reservation });
    } catch (error) {
        console.error("Erreur détails réservation :", error);
        res.status(500).send("Impossible d'afficher les détails de la réservation.");
    }
};
