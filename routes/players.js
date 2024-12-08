const express = require("express");
const router = express.Router();
const { Players } = require("../dbConfig");

// List all players
router.get("/", async (req, res) => {
  let response;
  try {
    const results = await Players.findAll();
    results.map((result) => console.log(result.dataValues));
    response = results.map((result) => result.dataValues);
    res.send({
      body: response,
    });
  } catch (err) {
    console.error("error retriving new player: " + err);
    return res.status(500).send({
      body: null,
      err: "error retriving player: " + err,
    });
  }
});

// Get specific player by player's name
router.get("/:playerName", async (req, res) => {
  if (!req.params.playerName)
    return res.status(400).send({
      body: null,
      err: "Invalid specified",
    });
  const playerName = req.params.playerName;

  try {
    const results = await Players.findOne({
      where: {
        playerName: playerName,
      },
    });

    res.send({
      body: results,
    });
  } catch (err) {
    console.error("error retriving new player: " + err);
    res.send({
      body: null,
      err: "error retriving player: " + err,
    });
  }
});

// Register player
router.post("/register", async (req, res) => {
  if (!req.headers)
    return res.status(400).send({
      body: null,
      err: "No headers specified",
    });

  const playerName = req.headers.name;
  const playerTeam = req.headers.player_team ?? null;
  const isTeamNew = req.headers.is_team_new === "true";

  if (!playerName) {
    return res.status(400).send({
      body: null,
      err: "Player name is required",
    });
  }
  try {
    let team, player;

    if (isTeamNew) {
      if (!playerTeam) {
        return res.status(400).send({
          body: null,
          err: "Team name is required for a new team.",
        });
      }

      // Create the leader as a player
      player = await Players.create({
        playerName: playerName,
        teamName: playerTeam,
        createsTeam: true,
      });
      // Creating a team in hooks
    } else {
      // Create the player
      player = await Players.create({
        playerName: playerName,
        teamName: playerTeam,
        createsTeam: false,
      });
    }

    res.status(201).send({
      body: { team, player },
    });
  } catch (error) {
    res.status(400).send({
      body: null,
      err: error.message,
    });
  }
});
module.exports = router;
