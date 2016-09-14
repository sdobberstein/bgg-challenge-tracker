var _ = require('lodash');
var Promise = require('bluebird');
var boardGameService = require('./boardGameService');
var challengeService = require('./challengeService');
var playMatcher = require('../utils/playMatcher');

function countPlays(plays) {
  return _
    .chain(plays)
    .groupBy('boardGameId')
    .mapValues(function(quantities) {
      return quantities.reduce(function(obj, n) {
        obj.boardGameName = n.boardGameName;
        obj.quantity += n.quantity;
        return obj;
      }, { quantity: 0 });
    })
    .value();
}

function mergePlayCountsIntoChallenge({challenge, plays}, username) {
  var copy = _.cloneDeep(challenge);
  copy.items = _.map(copy.items, function(item) {
    return _.extend(item, {
      completedPlays: plays[item.id] ? plays[item.id].quantity : 0,
      name: plays[item.id] ? plays[item.id].boardGameName : 'N/A'
    });
  });
  return _.extend(copy, { username });
}

module.exports = {

  getChallengeStatus: function(challengeId, username) {
    return challengeService
      .getChallengeById(challengeId)
      .then(function(challenge) {
        return boardGameService
          .getAllPlays(_.extend({}, challenge.filters, { username }))
          .then(function(plays) {
            return {
              challenge: challenge,
              plays: plays
            };
          })
      })
      .then(function(results) {
        var itemIds = _.map(results.challenge.items, 'id');
        var matchedPlays = playMatcher.getMatches({
          filters: _.extend({}, results.challenge.filters, { complete: true, boardGameIds: itemIds }),
          plays: results.plays
        });
        return _.extend(results, { plays: matchedPlays });
      })
      .then(function(results) {
        return _.extend(results, { plays: countPlays(results.plays) });
      })
      .then(function(results) {
        return mergePlayCountsIntoChallenge(results, username);
      });
  }

};
