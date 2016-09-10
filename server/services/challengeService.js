var _ = require('lodash');
var jsonFiles = require('../utils/jsonFiles');
var path = require('path');

var CHALLENGES_FILE = path.join('..', 'data', 'challenges.json');

function findChallenge(challenges, id) {
  return _.find(challenges, (challenge) => challenge.id === id);
}

function getAllChallenges() {
  return jsonFiles.load(CHALLENGES_FILE);
}

function getChallengeById(id) {
  return getAllChallenges().then((challenges) => findChallenge(challenges, id));
}

function saveChallenge(challenge) {
  return getAllChallenges().then((challenges) => {
    var foundChallenge = findChallenge(challenges, challenge.id);
    if (foundChallenge) {
      foundChallenge = challenge;
    } else {
      challenges.push(challenge);
    }
    return jsonFiles.save(CHALLENGES_FILE, challenges);
  });
}

module.exports = {
  getAllChallenges,
  getChallengeById,
  saveChallenge
};
