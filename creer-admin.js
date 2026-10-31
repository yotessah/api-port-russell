
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

async function creerAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!email || !password) {
            throw new Error("ADMIN_EMAIL ou ADMIN_PASSWORD manquant dans .env");
        }

        const motDePasseSecurise = await bcrypt.hash(password, 12);

        const admin = await User.findOne({ email });

        if (admin) {
            admin.password = motDePasseSecurise;
            await admin.save();
            console.log("Mot de passe administrateur réinitialisé !");
        } else {
            await User.create({
                username: "admin",
                email,
                password: motDePasseSecurise
            });
            console.log("Compte administrateur créé !");
        }

    } catch (error) {
        console.error("Erreur :", error.message);
    } finally {
        await mongoose.disconnect();
    }
}

creerAdmin();

