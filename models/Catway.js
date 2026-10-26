
const mongoose = require("mongoose");

/**
 * Modèle représentant un catway du port de Russell.
 * @module Catway
 */

const catwaySchema = new mongoose.Schema({
    catwayNumber: {
        type: Number,
        required: [true, "Le numéro du catway est obligatoire."],
        unique: true,
        min: [1, "Le numéro du catway doit être supérieur à 0."]
    },

    catwayType: {
        type: String,
        required: [true, "Le type du catway est obligatoire."],
        enum: {
            values: ["long", "short"],
            message: "Le type doit être 'long' ou 'short'."
        }
    },

    catwayState: {
        type: String,
        required: [true, "L'état du catway est obligatoire."],
        trim: true,
        minlength: [2, "La description de l'état est trop courte."]
    }
});

/**
 * Modèle MongoDB des catways.
 */
module.exports = mongoose.model("Catway", catwaySchema);
