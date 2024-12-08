module.exports = (sequelize, type) => {
  // Define table with players
  return sequelize.define("players", {
    playerName: {
      primaryKey: true,
      type: type.STRING,
    },
    teamName: {
      allowNull: true,
      type: type.STRING,
    },
    createsTeam: {
      allowNull: false,
      type: type.BOOLEAN,
    },
  });
};
