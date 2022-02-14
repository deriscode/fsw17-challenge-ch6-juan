const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../utils/dbConnection");
const bcrypt = require("bcrypt");

class Players extends Model {}

Players.init(
	{
		uuid: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		username: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true,
		},
		email: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
	},
	{
		sequelize, // Memberikan koneksi
		modelName: "players", // Nama tabel
		freezeTableName: true, //Nama tabel tidak menjadi bentuk jamak
		hooks: {
			beforeCreate: (players, option) => {
				players.password = players.password && players.password !== "" ? bcrypt.hashSync(players.password, 10) : "";
			},
		}, // Enkripsi password
		createdAt: true,
		updatedAt: true,
	}
);

module.exports = Players;
