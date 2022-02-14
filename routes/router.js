const express = require("express");
const router = express.Router();
const { Players, Biodata, History } = require("../models");
const bcrypt = require("bcrypt");

// Menampilkan Halaman Utama (READ)
router.get("/", (req, res, next) => {
	try {
		const { status } = req.query;
		res.render("main.ejs", { headTitle: "Home", status });
	} catch (error) {
		next(error);
	}
});

// Menampilkan Halaman Login (READ)
router.get("/login", (req, res, next) => {
	try {
		const { status } = req.query;
		res.render("login.ejs", { headTitle: "Login", status });
	} catch (error) {
		next(error);
	}
});

// Melakukan Login (AUTENTIKASI)
router.post("/login", async (req, res, next) => {
	const { email, password } = req.body;

	try {
		const playerAccount = await Players.findAll();

		const playerCompatible = playerAccount.find((item) => item.email === email);

		if (!playerCompatible) {
			res.redirect("/login?status=emailnotfound");
		} else {
			const match = await bcrypt.compare(password, playerCompatible.password);

			if (match) {
				res.redirect(`/profile/${playerCompatible.uuid}`);
			} else {
				res.redirect("/login?status=wrongpassword");
			}
		}
	} catch (error) {
		next(error);
	}
});

// Menampilkan Halaman Register (READ)
router.get("/register", (req, res, next) => {
	try {
		res.render("register.ejs", { headTitle: "Register" });
	} catch (error) {
		next(error);
	}
});

// Membuat Akun (CREATE)
router.post("/register", async (req, res, next) => {
	const { username, email, password, age, address, city, win, lose } = req.body;

	try {
		const newPlayer = await Players.create({
			username,
			email,
			password,
		});

		await Biodata.create({
			age,
			address,
			city,
			player_uuid: newPlayer.uuid,
		});

		await History.create({
			win,
			lose,
			player_uuid: newPlayer.uuid,
		});

		if (newPlayer) {
			res.redirect(`/profile/${newPlayer.uuid}`);
		}
	} catch (error) {
		next(error);
	}
});

// Menampilkan Halaman Profil (READ)
router.get("/profile/:id", async (req, res, next) => {
	try {
		const playerSelected = await Players.findOne({
			where: {
				uuid: req.params.id,
			},
			include: ["biodata", "history"],
		});
		// console.log(playerSelected);
		res.render("profile.ejs", {
			headTitle: "Profile",
			data: playerSelected,
		});
	} catch (error) {
		next(error);
	}
});

// Mengubah Informasi Akun (UPDATE)
router.post("/profile/:id", async (req, res, next) => {
	const { username, email, password, age, address, city, win, lose } = req.body;
	try {
		const playerToUpdate = await Players.findByPk(req.params.id);

		if (playerToUpdate) {
			const biodataToUpdate = await Biodata.findOne({
				where: {
					player_uuid: req.params.id,
				},
			});

			const updatedBiodata = await biodataToUpdate.update({
				age: age === "" ? biodataToUpdate.age : age,
				address: address,
				city: city,
			});

			const historyToUpdate = await History.findOne({
				where: {
					player_uuid: req.params.id,
				},
			});

			const updatedHistory = await historyToUpdate.update({
				win: win === "" ? historyToUpdate.win : win,
				lose: lose === "" ? historyToUpdate.lose : lose,
			});

			const updated = await playerToUpdate.update({
				username: username ?? playerToUpdate.username,
				email: email ?? playerToUpdate.email,
				password: password === "" ? playerToUpdate.password : password,
			});

			res.redirect(`/profile/${updated.uuid}`);
		}
	} catch (error) {
		next(error);
	}
});

// Menghapus Akun (DELETE)
router.post("/delete/:id", async (req, res, next) => {
	try {
		const playerToDelete = await Players.findByPk(req.params.id);

		if (playerToDelete) {
			await Biodata.destroy({
				where: {
					player_uuid: req.params.id,
				},
			});

			await History.destroy({
				where: {
					player_uuid: req.params.id,
				},
			});

			const deleted = await Players.destroy({
				where: {
					uuid: req.params.id,
				},
			});

			res.redirect("/?status=successfullydeleted");
		}
	} catch (error) {
		next(error);
	}
});

module.exports = router;
