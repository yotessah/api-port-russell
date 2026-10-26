
const mongoose = require("mongoose");

/**
 * Modèle représentant un utilisateur de la capitainerie.
 * @module User
 */

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Le nom d'utilisateur est obligatoire."],
        trim: true,
        minlength: [3, "Le nom d'utilisateur doit contenir au moins 3 caractères."]
    },

    email: {
        type: String,
        required: [true, "L'adresse email est obligatoire."],
        unique: true,
        lowercase: true,
        trim: true,
       match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "L'adresse email est invalide."]
    },

    password: {
        type: String,
        required: [true, "Le mot de passe est obligatoire."],
        minlength: [8, "Le mot de passe doit contenir au moins 8 caractères."]
    }
});

/**
 * Modèle MongoDB des utilisateurs.
 */
module.exports = mongoose.model("User", userSchema);
