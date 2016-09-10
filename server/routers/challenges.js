var _ = require('lodash');
var express = require('express');
var router = express.Router();
var challengeService = require('../services/challengeService');

router.get('/', (req, res) => {
  challengeService.getAllChallenges().then((challenges) => {
    res.json(challenges);
  });
});

router.post('/', (req, res) => {
  challengeService.saveChallenge(req.body).then((challenge) => {
    res.json(challenge);
  });
});

router.get('/:id', (req, res) => {
  challengeService.getChallengeById(req.params.id).then((challenge) => {
    res.json(challenge);
  });
});

router.put('/:id', (req, res) => {
  challengeService.saveChallenge(req.body).then((challenge) => {
    res.json(challenge);
  });
});

module.exports = router;
