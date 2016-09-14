var _ = require('lodash');
var test = require('tape');
var playBuilder = require('../testsupport/playBuilder');
var playMatcher = require('../../server/utils/playMatcher');

test('can match completed plays', function(t) {
  var plays = [
    { boardGameId: 1, complete: true },
    { boardGameId: 2, complete: true },
    { boardGameId: 3, complete: false },
    { boardGameId: 4, complete: true },
    { boardGameId: 5, complete: false }
  ];

  var matchedPlays = playMatcher.getMatches({
    filters: { complete: true },
    plays: plays
  });

  t.equal(matchedPlays.length, 3, 'there should be 3 matched plays');

  var boardGameIds = _.map(matchedPlays, 'boardGameId');
  t.true(_.isEqual(boardGameIds, [1, 2, 4]));
  t.end();
});

test('can match incomplete plays', function(t) {
  var plays = [
    { boardGameId: 1, complete: true },
    { boardGameId: 2, complete: true },
    { boardGameId: 3, complete: false },
    { boardGameId: 4, complete: true },
    { boardGameId: 5, complete: false }
  ];

  var matchedPlays = playMatcher.getMatches({
    filters: { complete: false },
    plays: plays
  });

  t.equal(matchedPlays.length, 2, 'there should be 2 matched plays');

  var boardGameIds = _.map(matchedPlays, 'boardGameId');
  t.true(_.isEqual(boardGameIds, [3, 5]));
  t.end();
});

test('can match plays that have the given item ids', function(t) {
  var plays = [
    { boardGameId: 1, complete: true },
    { boardGameId: 2, complete: true },
    { boardGameId: 3, complete: false }
  ];

  var matchedPlays = playMatcher.getMatches({
    filters: { boardGameIds: [2, 3, 100] },
    plays: plays
  });

  t.equal(matchedPlays.length, 2, 'there should be 2 matched plays');

  var boardGameIds = _.map(matchedPlays, 'boardGameId');
  t.true(_.isEqual(boardGameIds, [2, 3]));
  t.end();
});

test('can match the player count for a single player', function(t) {
  var plays = [
    { boardGameId: 1, complete: true, numberOfPlayers: 1 },
    { boardGameId: 2, complete: true, numberOfPlayers: 1 },
    { boardGameId: 3, complete: false, numberOfPlayers: 2 },
    { boardGameId: 4, complete: true, numberOfPlayers: 2 },
    { boardGameId: 5, complete: false, numberOfPlayers: 1 }
  ];

  var matchedPlays = playMatcher.getMatches({
    filters: { numberOfPlayers: 1 },
    plays: plays
  });

  t.equal(matchedPlays.length, 3, 'there should be 3 matched plays');

  var boardGameIds = _.map(matchedPlays, 'boardGameId');
  t.true(_.isEqual(boardGameIds, [1, 2, 5]));
  t.end();
});

test('use all filters when finding matching plays', function(t) {
  var plays = [
    { boardGameId: 1, complete: true, numberOfPlayers: 1 },
    { boardGameId: 2, complete: false, numberOfPlayers: 2 },
    { boardGameId: 3, complete: true, numberOfPlayers: 2 },
    { boardGameId: 4, complete: false, numberOfPlayers: 1 },
    { boardGameId: 4, complete: true, numberOfPlayers: 1 }
  ];

  var matchedPlays = playMatcher.getMatches({
    filters: { complete: true, boardGameIds: [3, 4], numberOfPlayers: 1 },
    plays: plays
  });

  t.equal(matchedPlays.length, 1, 'there should be 1 matched play');

  var play = _.head(matchedPlays);
  t.equal(play.complete, true, 'play should be complete');
  t.equal(play.boardGameId, 4);
  t.equal(play.numberOfPlayers, 1);
  t.end();
});
