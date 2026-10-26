
const mongoose = require("mongoose");

/**
 * Modèle représentant une réservation de catway au port de Russell.
 * @module Reservation
 */

const reservationSchema = new mongoose.Schema({
    catwayNumber: {
        type: Number,
        required: [true, "Le numéro du catway est obligatoire."],
        min: [1, "Le numéro du catway doit être supérieur à 0."]
    },

    clientName: {
        type: String,
        required: [true, "Le nom du client est obligatoire."],
        trim: true,
        minlength: [2, "Le nom du client doit contenir au moins 2 caractères."]
    },

    boatName: {
        type: String,
        required: [true, "Le nom du bateau est obligatoire."],
        trim: true,
        minlength: [2, "Le nom du bateau doit contenir au moins 2 caractères."]
    },

    startDate: {
        type: Date,
        required: [true, "La date de début est obligatoire."]
    },

    endDate: {
        type: Date,
        required: [true, "La date de fin est obligatoire."]
    }
});

/**
 * Vérifie que la date de fin est postérieure à la date de début.
 * La validation s'exécute lors de la validation ou de l'enregistrement.
 */
reservationSchema.pre("validate", function () {
    if (
        this.startDate &&
        this.endDate &&
        this.endDate <= this.startDate
    ) {
        this.invalidate(
            "endDate",
            "La date de fin doit être postérieure à la date de début."
        );
    }
});

/**
 * Modèle MongoDB des réservations.
 */
module.exports = mongoose.model("Reservation", reservationSchema);
