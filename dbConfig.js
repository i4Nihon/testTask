const { Sequelize, DataTypes, where } = require("sequelize");
require("dotenv").config();

const PlayersModel = require("./models/player");
const TeamsModel = require("./models/team");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    define: {
      timestamps: false,
    },
  }
);

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

// Define table with teams
const Teams = TeamsModel(sequelize, DataTypes);
// Define table with players
const Players = PlayersModel(sequelize, DataTypes);

async function initTables() {
  // Create table "teams"
  await Teams.sync({ force: false });

  // Create table "players"
  await Players.sync({ force: false });
}
initTables();
// Set realation:
//   one team has many players
//   one player belongs to one team
Teams.hasMany(Players, {
  foreignKey: {
    name: "teamName",
    allowNull: true,
  },
});
Players.belongsTo(Teams, {
  foreignKey: {
    name: "teamName",
  },
});

Players.beforeCreate(async (player) => {
  // Check if player already exists
  const playerExists = await Players.findOne({
    where: {
      playerName: player.playerName,
    },
  });
  if (playerExists) throw new Error("Player already exists");

  if (!player.teamName) return;

  // Check if team exists
  const teamExists = await Teams.findOne({
    where: {
      teamName: player.teamName,
    },
  });
  if (!teamExists && player.createsTeam === false)
    throw new Error("The team has to exists");
  else if (!teamExists && player.createsTeam) {
    await Teams.create({
      teamName: player.teamName,
      teamLeader: player.playerName,
      isLeaderNew: true,
    });
  } else if (teamExists && player.createsTeam) {
    throw new Error("The team already exists");
  }

  // Check if team is full
  const countTeamPlayers = await Players.findAndCountAll({
    where: {
      teamName: player.teamName,
    },
  }).then((result) => result.count);
  if (countTeamPlayers >= 5)
    throw new Error("There can only be up to 5 players in one team");
});

Teams.beforeCreate(async (team) => {
  try {
    // Check if team already exists
    const teamExists = await Teams.findOne({
      where: {
        teamName: team.teamName,
      },
    });

    if (teamExists) throw new Error("Team already exists");

    if (!team.isLeaderNew) {
      // Check if leader exists
      let leader = await Players.findOne({
        where: {
          playerName: team.teamLeader,
        },
      });

      if (!leader) throw new Error("The leader has to exist");

      if (leader.teamName && leader.teamName !== team.teamName)
        throw new Error("The leader is already part of another team");
      Players.update(
        {
          teamName: team.teamName,
        },
        {
          where: {
            playerName: leader.playerName,
          },
        }
      );
    }
  } catch (err) {
    console.error("Error in Teams.beforeCreate:", err.message);
    throw err;
  }
});

module.exports = {
  Teams,
  Players,
  sequelize,
};
