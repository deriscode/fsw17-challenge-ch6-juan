const jwt = require("jsonwebtoken");

const isLoggedIn = (req, res, next) => {
	const token = req.cookies.jwt;

	if (token) {
		jwt.verify(token, "kuNc1", (error, decodedToken) => {
			if (error) {
				res.locals.player = null;
				res.redirect("/login");
			} else {
				res.locals.player = decodedToken.email;
				next();
			}
		});
	} else {
		res.locals.player = null;
		res.redirect("login");
	}
};

module.exports = isLoggedIn;
