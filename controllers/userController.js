
const User = require("../models/User");
const bcrypt = require("bcrypt");

/**
 * Liste les utilisateurs sans exposer leurs mots de passe.
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        return res.status(200).json(users);
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        return res.status(500).json({ message: "Erreur serveur." });
    }
};

/**
 * Récupère un utilisateur par son adresse email.
 */
exports.getUserByEmail = async (req, res) => {
    try {
        const email = req.params.email.trim().toLowerCase();
        const user = await User.findOne({ email }).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "Utilisateur introuvable."
            });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        return res.status(500).json({ message: "Erreur serveur." });
    }
};

/**
 * Crée un utilisateur en hachant son mot de passe.
 */
exports.createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (
            typeof username !== "string" ||
            username.trim().length < 3 ||
            typeof email !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
            typeof password !== "string" ||
            password.length < 8
        ) {
            return res.status(400).json({
                message: "Nom d'utilisateur, email ou mot de passe invalide."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Cette adresse email est déjà utilisée."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            username: username.trim(),
            email: normalizedEmail,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "Utilisateur créé.",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur :", error);
        return res.status(500).json({ message: "Erreur serveur." });
    }
};

/**
 * Modifie les informations d'un utilisateur via l'API.
 */
exports.updateUser = async (req, res) => {
    try {
        const email = req.params.email.trim().toLowerCase();
        const { username, password } = req.body;
        const updates = {};

        if (username !== undefined) {
            if (
                typeof username !== "string" ||
                username.trim().length < 3
            ) {
                return res.status(400).json({
                    message: "Nom d'utilisateur invalide."
                });
            }

            updates.username = username.trim();
        }

        if (password !== undefined) {
            if (
                typeof password !== "string" ||
                password.length < 8
            ) {
                return res.status(400).json({
                    message: "Le mot de passe doit contenir au moins 8 caractères."
                });
            }

            updates.password = await bcrypt.hash(password, 12);
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "Aucune information valide à modifier."
            });
        }

        const user = await User.findOneAndUpdate(
            { email },
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "Utilisateur introuvable."
            });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error("Erreur lors de la modification de l'utilisateur :", error);
        return res.status(500).json({ message: "Erreur serveur." });
    }
};

/**
 * Supprime un utilisateur via l'API.
 */
exports.deleteUser = async (req, res) => {
    try {
        const email = req.params.email.trim().toLowerCase();
        const user = await User.findOneAndDelete({ email });

        if (!user) {
            return res.status(404).json({
                message: "Utilisateur introuvable."
            });
        }

        return res.status(200).json({
            message: "Utilisateur supprimé."
        });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur :", error);
        return res.status(500).json({ message: "Erreur serveur." });
    }
};

/**
 * Affiche la page HTML contenant la liste des utilisateurs.
 */
exports.renderUsersPage = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        return res.render("users/index", { users });
    } catch (error) {
        console.error("Erreur lors de l'affichage des utilisateurs :", error);
        return res.status(500).send(
            "Impossible d'afficher les utilisateurs."
        );
    }
};

/**
 * Affiche la page HTML des détails d'un utilisateur.
 */
exports.renderUserDetails = async (req, res) => {
    try {
        const email = decodeURIComponent(req.params.email)
            .trim()
            .toLowerCase();

        const user = await User.findOne({ email }).select("-password");

        if (!user) {
            return res.status(404).send("Utilisateur introuvable.");
        }

        return res.render("users/details", { user });
    } catch (error) {
        console.error("Erreur lors de l'affichage des détails :", error);
        return res.status(500).send(
            "Impossible d'afficher les détails de l'utilisateur."
        );
    }
};

/**
 * Affiche le formulaire HTML de modification.
 */
exports.renderEditUser = async (req, res) => {
    try {
        const email = decodeURIComponent(req.params.email)
            .trim()
            .toLowerCase();

        const user = await User.findOne({ email }).select("-password");

        if (!user) {
            return res.status(404).send("Utilisateur introuvable.");
        }

        return res.render("users/edit", {
            user,
            error: null
        });
    } catch (error) {
        console.error(
            "Erreur lors de l'affichage du formulaire de modification :",
            error
        );

        return res.status(500).send(
            "Impossible d'afficher le formulaire de modification."
        );
    }
};

/**
 * Enregistre les modifications envoyées depuis le formulaire HTML.
 */
exports.renderUpdateUser = async (req, res) => {
    try {
        const email = decodeURIComponent(req.params.email)
            .trim()
            .toLowerCase();

        const { username, password } = req.body;
        const updates = {};

        if (
            typeof username !== "string" ||
            username.trim().length < 3
        ) {
            return res.status(400).send(
                "Le nom d'utilisateur doit contenir au moins 3 caractères."
            );
        }

        updates.username = username.trim();

        // Le mot de passe est facultatif : s'il est vide, on le conserve.
        if (typeof password === "string" && password.length > 0) {
            if (password.length < 8) {
                return res.status(400).send(
                    "Le mot de passe doit contenir au moins 8 caractères."
                );
            }

            updates.password = await bcrypt.hash(password, 12);
        }

        const user = await User.findOneAndUpdate(
            { email },
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).send("Utilisateur introuvable.");
        }

        return res.redirect("/users-page");
    } catch (error) {
        console.error(
            "Erreur lors de l'enregistrement des modifications :",
            error
        );

        return res.status(500).send(
            "Impossible d'enregistrer les modifications."
        );
    }
};


