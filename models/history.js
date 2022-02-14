const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../utils/dbConnection");

class History extends Model {}

History.init(
	{
		uuid: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		win: DataTypes.INTEGER(4),
		lose: DataTypes.INTEGER(4),
		player_uuid: {
			type: DataTypes.UUID,
			allowNull: false,
		},
	},
	{
		sequelize, // Memberikan koneksi
		modelName: "history", // Nama tabel
		freezeTableName: true, //Nama tabel tidak menjadi bentuk jamak
		createdAt: true,
		updatedAt: true,
	}
);

module.exports = History;
