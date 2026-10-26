
/**
 * Vérifie que l'utilisateur est connecté.
 * Redirige les visiteurs non authentifiés vers la page d'accueil.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }

    return res.redirect("/");
}

module.exports = { isAuthenticated };
