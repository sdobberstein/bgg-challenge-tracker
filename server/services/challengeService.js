var _ = require('lodash');
var jsonFileLoader = require('../utils/jsonFileLoader');
var path = require('path');

var CHALLENGES_FILE = path.join('..', 'data', 'challenges.json');

function getAllChallenges() {
  return jsonFileLoader.loadJson(CHALLENGES_FILE);
}

function getChallengeById(id) {
  return getAllChallenges().then((challenges) => {
    return _.find(challenges, (challenge) => challenge.id === id);
  });
}

module.exports = {
  getAllChallenges,
  getChallengeById
};
