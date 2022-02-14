const Players = require("./players");
const Biodata = require("./biodata");
const History = require("./history");

Players.hasOne(Biodata, {
	foreignKey: "player_uuid",
	as: "biodata",
});

Biodata.belongsTo(Players, {
	foreignKey: "player_uuid",
	as: "players",
});

Players.hasOne(History, {
	foreignKey: "player_uuid",
	as: "history",
});

History.belongsTo(Players, {
	foreignKey: "player_uuid",
	as: "players",
});

module.exports = {
	Players,
	Biodata,
	History,
};
