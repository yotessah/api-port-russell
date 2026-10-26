
const User = require("../models/User");
const bcrypt = require("bcrypt");

/**
 * Connecte un utilisateur avec son email et son mot de passe.
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).render("index", {
                error: "Veuillez renseigner votre email et votre mot de passe."
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });

        // Message identique pour éviter de révéler si un email existe.
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).render("index", {
                error: "Email ou mot de passe incorrect."
            });
        }

        // Renouvelle la session après l'authentification.
        req.session.regenerate((error) => {
            if (error) {
                console.error("Erreur de session :", error);
                return res.status(500).render("index", {
                    error: "Impossible d'ouvrir une session."
                });
            }

            req.session.user = {
                id: user._id.toString(),
                username: user.username,
                email: user.email
            };

            req.session.save((saveError) => {
                if (saveError) {
                    console.error("Erreur de sauvegarde de session :", saveError);
                    return res.status(500).render("index", {
                        error: "Impossible d'enregistrer la session."
                    });
                }

                return res.redirect("/dashboard");
            });
        });
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        return res.status(500).render("index", {
            error: "Une erreur serveur est survenue."
        });
    }
};

/**
 * Déconnecte l'utilisateur et détruit sa session.
 */
exports.logout = (req, res, next) => {
    req.session.destroy((error) => {
        if (error) {
            console.error("Erreur lors de la déconnexion :", error);
            return next(error);
        }

        res.clearCookie("connect.sid");
        return res.redirect("/");
    });
};
