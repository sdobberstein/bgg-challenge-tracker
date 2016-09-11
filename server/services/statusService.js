var _ = require('lodash');
var Promise = require('bluebird');
var bggService = require('./bggService');
var challengeService = require('./challengeService');

function completed(play) {
  return play.incomplete === 0;
}

function matches(itemIds) {
  return function(play) {
    return _(itemIds).includes(play.item.objectid);
  };
}

function getMatchingPlays(plays, itemIds) {
  var matchesGame = matches(itemIds);
  return _
    .chain(plays)
    .filter(function(play) { return completed(play) && matchesGame(play); })
    .map(function(play) { return { id: play.item.objectid, quantity: play.quantity }; })
    .value();
}

function countPlays(plays) {
  return _
    .chain(plays)
    .groupBy('id')
    .mapValues(function(quantities) { return quantities.reduce(function(sum, n) { return sum + n.quantity; }, 0); })
    .value();
}

function mergePlayCountsIntoChallenge(results, username) {
  var copy = _.cloneDeep(results.challenge);
  copy.items = _.map(copy.items, function(item) {
    return _.extend(item, {
      completedPlays: results.plays[item.id] || 0
    });
  });
  return _.extend(copy, { username });
}

function enrichWithBoardGameNames(challengeStatus) {
  var copy = _.cloneDeep(challengeStatus);
  var items = copy.items;
  var firstItem = _.first(items);
  var promises = [];
  var initialPromise = getBoardGameName(firstItem);

  promises.push(initialPromise);

  return initialPromise.then(function() {
    var remainingItems = _.tail(items);
    if (remainingItems) {
      remainingItems.forEach(function(item) {
        promises.push(getBoardGameName(item));
      });
    }

    return Promise.all(promises).then(function(items) {
      return _.extend(copy, {items});
    });
  });
}

function getBoardGameName(item) {
  return bggService.boardgameName(item.id).then(function(name) {
    return _.extend({}, item, {name});
  });
}

module.exports = {

  getChallengeStatus: function(challengeId, username) {
    return challengeService
      .getChallengeById(challengeId)
      .then(function(challenge) {
        return bggService
          .plays(_.extend({}, challenge.filters, { username }))
          .then(function(plays) {
            return {
              challenge: challenge,
              plays: plays
            };
          })
      })
      .then(function(results) {
        var itemIds = _.map(results.challenge.items, 'id');
        return _.extend(results, { plays: getMatchingPlays(results.plays, itemIds) });
      })
      .then(function(results) {
        return _.extend(results, { plays: countPlays(results.plays) });
      })
      .then(function(results) {
        return mergePlayCountsIntoChallenge(results, username);
      })
      .then(function(results) {
        return enrichWithBoardGameNames(results);
      });
  }

};
