const express = require("express");
const router = express.Router();
const { Teams, Players } = require("../dbConfig");
// List all teams
router.get("/", async (req, res) => {
  try {
    const results = await Teams.findAll({
      include: Players,
    });
    let response = {};

    results.map((result) => {
      const players = result.players.flatMap((player) => player.playerName);
      response = {
        teamName: result.dataValues.teamName,
        teamLeader: result.dataValues.teamLeader,
        teamPlayers: players,
      };
    });
    res.send({ body: response });
  } catch (err) {
    console.error("error adding new team: " + err);
    return res.send({
      body: null,
      err: "error retriving team: " + err,
    });
  }
});

// Get specific team by it's team's name
router.get("/:teamName", async (req, res) => {
  if (!req.params.teamName)
    return res.status(400).send({
      body: null,
      err: "Invalid name specified",
    });
  const teamName = req.params.teamName;
  try {
    const team = await Teams.findOne({
      where: {
        teamName: teamName,
      },
      include: Players,
    });
    const players = team.players.flatMap((player) => player.playerName);
    const responseBody = {
      teamName: team.dataValues.teamName,
      teamLeader: team.dataValues.teamLeader,
      teamPlayers: players,
    };
    res.send({
      body: responseBody,
    });
  } catch (err) {
    console.error("error adding new team: " + err);
    res.send({
      body: null,
      err: "error retriving team: " + err,
    });
  }
});

// Register team
router.post("/register", async (req, res) => {
  if (!req.headers)
    return res.status(400).send({
      body: null,
      err: "No headers specified",
    });

  const teamName = req.headers.name;
  const leader = req.headers.leader ?? null;

  if (!teamName)
    return res.status(400).send({
      body: null,
      err: "Invalid headers",
    });

  // try to add new team
  try {
    await Teams.create({
      teamName: teamName,
      teamLeader: leader,
      isLeaderNew: false,
    });
    res.status(201).send({
      body: {
        teamName: teamName,
        teamLeader: leader,
      },
    });
  } catch (err) {
    res.status(400).send({
      body: null,
      err: err.message,
    });
  }
});

module.exports = router;
