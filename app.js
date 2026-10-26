
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require("express-session");
const catwayController = require("./controllers/catwayController");
const reservationController = require("./controllers/reservationController");
const userController = require("./controllers/userController");
const methodOverride = require("method-override");

dotenv.config();

const app = express();

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connecté"))
    .catch((error) => console.error("Erreur MongoDB :", error));

// Lecture des données envoyées par les formulaires et les API
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use((req, res, next) => {
    console.log("REQUÊTE REÇUE :", req.method, req.originalUrl);
    next();
});

// Configuration des sessions
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    }
}));

// Fichiers publics : CSS, JavaScript, images
app.use(express.static("public"));

// Moteur de vues EJS
app.set("view engine", "ejs");

// Importation des routes
const authRoutes = require("./routes/auth");
const catwayRoutes = require("./routes/catways");
const reservationRoutes = require("./routes/reservation");
const userRoutes = require("./routes/user");

const { isAuthenticated } = require("./middleware/auth");
console.log("ROUTE DE TEST : POST /reservations définie dans app.js");
// Page d'accueil
app.get("/", (req, res) => {
    res.render("index", { error: null });
});

// Tableau de bord
app.get("/dashboard", isAuthenticated, async (req, res) => {
    try {
        const Reservation = require("./models/Reservation");
        const today = new Date();

        const reservations = await Reservation.find({
            startDate: { $lte: today },
            endDate: { $gte: today }
        }).sort({ startDate: 1 });

        return res.render("dashboard", {
            user: req.session.user,
            today,
            reservations
        });
    } catch (error) {
        console.error("Erreur lors du chargement du tableau de bord :", error);
        return res.status(500).send(
            "Impossible d'afficher le tableau de bord."
        );
    }
});

/**
 * Pages de l'application
 */

// Documentation de l'API
app.get("/documentation", isAuthenticated, (req, res) => {
    res.render("documentation");
});

app.get(
    "/catways-page",
    isAuthenticated,
    catwayController.renderCatwaysPage
);

app.get(
    "/catways-page/:id",
    isAuthenticated,
    catwayController.renderCatwayDetails
);

// Formulaire de création d'un catway
app.get("/catways/create", isAuthenticated, (req, res) => {
    res.render("catways/create");
});

// Traitement du formulaire de création d'un catway
app.post("/catways-page", isAuthenticated, async (req, res) => {
    try {
        const { catwayNumber, catwayType, catwayState } = req.body;

        const Catway = require("./models/Catway");

        await Catway.create({
            catwayNumber: Number(catwayNumber),
            catwayType,
            catwayState
        });

        res.redirect("/catways-page");
    } catch (error) {
        console.error("Erreur lors de la création du catway :", error);
        res.status(400).send(
            "Impossible de créer le catway. Vérifie que le numéro n'est pas déjà utilisé et que les informations sont correctes."
        );
    }
});


 // Liste des réservations
app.get(
    "/reservations-page",
    isAuthenticated,
    reservationController.renderReservationsPage
);


// Formulaire de création d'une réservation
app.get("/reservations/create", isAuthenticated, (req, res) => {
    res.render("reservation/create");
});


 // Liste des utilisateurs
app.get(
    "/users-page",
    isAuthenticated,
    userController.renderUsersPage
);

// Formulaire de modification
app.get(
    "/users-page/:email/edit",
    isAuthenticated,
    userController.renderEditUser
);

// Enregistrement des modifications
app.post(
    "/users-page/:email/edit",
    isAuthenticated,
    userController.renderUpdateUser
);

// Détails d'un utilisateur
app.get(
    "/users-page/:email",
    isAuthenticated,
    userController.renderUserDetails
);

// Formulaire de création d'un utilisateur
app.get(
    "/users/create",
    isAuthenticated,
    (req, res) => {
        res.render("users/create");
    }
);

// Branchement des routes
app.use("/", authRoutes);
app.use("/catways", catwayRoutes);
app.use("/", reservationRoutes);
app.use("/users", userRoutes);


// Démarrage du serveur
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
