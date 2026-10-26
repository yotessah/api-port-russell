
const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

/**
 * Affiche le formulaire de connexion.
 * La page d'accueil sera rendue par app.js.
 */

/**
 * Connecte un utilisateur.
 * POST /login
 */
router.post("/login", authController.login);

/**
 * Déconnecte l'utilisateur.
 * GET /logout
 */
router.get("/logout", authController.logout);

module.exports = router;
