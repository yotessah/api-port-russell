
const express = require("express");
const router = express.Router();

const reservationController = require("../controllers/reservationController");
const { isAuthenticated } = require("../middleware/auth");

/**
 * Routes de gestion des réservations.
 * Toutes ces routes nécessitent une connexion.
 */

// GET /catways/:id/reservations
router.get(
    "/catways/:id/reservations",
    isAuthenticated,
    reservationController.getAllReservations
);

// GET /catways/:id/reservations/:idReservation
router.get(
    "/catways/:id/reservations/:idReservation",
    isAuthenticated,
    reservationController.getReservationById
);

// POST /catways/:id/reservations
router.post(
    "/catways/:id/reservations",
    isAuthenticated,
    reservationController.createReservation
);

// PUT /catways/:id/reservations/:idReservation
router.put(
    "/catways/:id/reservations/:idReservation",
    isAuthenticated,
    reservationController.updateReservation
);

// DELETE /catways/:id/reservations/:idReservation
router.delete(
    "/catways/:id/reservations/:idReservation",
    isAuthenticated,
    reservationController.deleteReservation
);



/**
 * POST /reservations
 * Création d'une réservation depuis le formulaire HTML.
 */
router.post("/reservations", async (req, res) => {
    try {
        const {
            catwayNumber,
            clientName,
            boatName,
            startDate,
            endDate
        } = req.body;

        const Reservation = require("../models/Reservation");

        await Reservation.create({
            catwayNumber: Number(catwayNumber),
            clientName: clientName.trim(),
            boatName: boatName.trim(),
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        });

        return res.redirect("/reservations-page");
    } catch (error) {
        console.error("Erreur création réservation :", error);
        return res.status(400).send(
            "Impossible de créer la réservation : " + error.message
        );
    }
});

// Afficher les détails d'une réservation en HTML
router.get(
    "/reservations/:id/:idReservation",
    isAuthenticated,
    reservationController.renderReservationDetails
);

module.exports = router;
