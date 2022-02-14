// Import Module
require("dotenv").config();
const express = require("express");
const sequelize = require("./utils/dbConnection");
const routes = require("./routes/router");

// Inisiasi App untuk bisa menjalankan middleware
const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static(__dirname + "/public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rute untuk melakukan CRUD dari folder routes
app.use(routes);

// Menampilkan pesan error
app.use((error, req, res, next) => {
	const statusCode = error.statusCode || 500;
	res.status(statusCode).json({
		error: statusCode,
		message: error.message,
	});
});

// Menjalankan koneksi
sequelize
	.sync()
	.then(() => {
		const PORT = process.env.PORT;
		app.listen(PORT, () => {
			console.log(`Server is running at port ${PORT}`);
		});
	})
	.catch((error) => {
		console.log(error);
	});
