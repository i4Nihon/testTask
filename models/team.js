module.exports = (sequelize, type) => {
  // Define table with teams
  return sequelize.define("teams", {
    teamName: {
      primaryKey: true,
      type: type.STRING,
    },
    teamLeader: {
      allowNull: false,
      type: type.STRING,
    },
    isLeaderNew: {
      allowNull: false,
      type: type.BOOLEAN,
    },
  });
};
