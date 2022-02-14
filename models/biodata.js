const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../utils/dbConnection");

class Biodata extends Model {}

Biodata.init(
	{
		uuid: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		age: {
			type: DataTypes.INTEGER(3),
		},
		address: {
			type: DataTypes.STRING(255),
		},
		city: {
			type: DataTypes.STRING(255),
		},
		player_uuid: {
			type: DataTypes.UUID,
			allowNull: false,
		},
	},
	{
		sequelize, // Memberikan koneksi
		modelName: "biodata", // Nama tabel
		freezeTableName: true, //Nama tabel tidak menjadi bentuk jamak
		createdAt: true,
		updatedAt: true,
	}
);

module.exports = Biodata;
