
const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { isAuthenticated } = require("../middleware/auth");

/**
 * Routes de gestion des utilisateurs.
 * Toutes ces routes sont réservées aux utilisateurs connectés.
 */

// GET /users : liste des utilisateurs
router.get("/", isAuthenticated, userController.getAllUsers);

// GET /users/:email : détail d'un utilisateur
router.get("/:email", isAuthenticated, userController.getUserByEmail);

// POST /users : création d'un utilisateur
router.post("/", isAuthenticated, userController.createUser);

// PUT /users/:email : modification d'un utilisateur
router.put("/:email", isAuthenticated, userController.updateUser);

// DELETE /users/:email : suppression d'un utilisateur
router.delete("/:email", isAuthenticated, userController.deleteUser);

module.exports = router;
