
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

async function creerAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        const existe = await User.findOne({ email });

        if (existe) {
            console.log("Ce compte existe déjà.");
            return;
        }

        const motDePasseSecurise = await bcrypt.hash(password, 12);

        await User.create({
            username: "admin",
            email,
            password: motDePasseSecurise
        });

        console.log("Compte créé avec succès !");
        console.log("Email :", email);
    } catch (error) {
        console.error("Erreur :", error.message);
    } finally {
        await mongoose.disconnect();
    }
}

creerAdmin();
