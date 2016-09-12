var _ = require('lodash');
var test = require('tape');
var playBuilder = require('../testsupport/playBuilder');
var playMatcher = require('../../server/utils/playMatcher');

test('can match completed plays', function(t) {
  var plays = [
    playBuilder.new(1).complete().create(),
    playBuilder.new(2).complete().create(),
    playBuilder.new(3).incomplete().create(),
    playBuilder.new(4).complete().create(),
    playBuilder.new(5).incomplete().create()
  ];

  playMatcher.getMatches({
    filters: { incomplete: 0 },
    plays: plays
  }).then(function(matchedPlays) {
    t.equal(matchedPlays.length, 3, 'there should be 3 matched plays');

    var itemIds = _.map(matchedPlays, 'item.objectid');
    t.true(_.isEqual(itemIds, [1, 2, 4]), 'should match the item ids supplied');
    t.end();
  });
});

test('can match incomplete plays', function(t) {
  var plays = [
    playBuilder.new(1).complete().create(),
    playBuilder.new(2).complete().create(),
    playBuilder.new(3).incomplete().create(),
    playBuilder.new(4).complete().create(),
    playBuilder.new(5).incomplete().create()
  ];

  playMatcher.getMatches({
    filters: { incomplete: 1 },
    plays: plays
  }).then(function(matchedPlays) {
    t.equal(matchedPlays.length, 2, 'there should be 2 matched plays');

    var itemIds = _.map(matchedPlays, 'item.objectid');
    t.true(_.isEqual(itemIds, [3, 5]), 'should match the item ids supplied');
    t.end();
  });
});

test('can match plays that have the given item ids', function(t) {
  var plays = [
    playBuilder.new(1).complete().create(),
    playBuilder.new(2).complete().create(),
    playBuilder.new(3).incomplete().create(),
    playBuilder.new(4).complete().create(),
    playBuilder.new(5).incomplete().create()
  ];

  playMatcher.getMatches({
    filters: { itemIds: [2, 3, 100] },
    plays: plays
  }).then(function(matchedPlays) {
    t.equal(matchedPlays.length, 2, 'there should be 2 matched plays');

    var itemIds = _.map(matchedPlays, 'item.objectid');
    t.true(_.isEqual(itemIds, [2, 3]), 'should match the item ids supplied');
    t.end();
  });
});

test('can match the player count for a single player', function(t) {
  var plays = [
    playBuilder.new(1).complete().players({}).create(),
    playBuilder.new(2).complete().players([{}]).create(),
    playBuilder.new(3).incomplete().players({}, {}).create(),
    playBuilder.new(4).complete().players([{}, {}]).create(),
    playBuilder.new(5).incomplete().players({}).create()
  ];

  playMatcher.getMatches({
    filters: { playerCount: 1 },
    plays: plays
  }).then(function(matchedPlays) {
    t.equal(matchedPlays.length, 3, 'there should be 3 matched plays');

    var itemIds = _.map(matchedPlays, 'item.objectid');
    t.true(_.isEqual(itemIds, [1, 2, 5]), 'should match the item ids supplied');
    t.end();
  });
});

test('use all filters when finding matching plays', function(t) {
  var plays = [
    playBuilder.new(1).complete().players({}).create(),
    playBuilder.new(2).complete().players([{}]).create(),
    playBuilder.new(3).incomplete().players({}, {}).create(),
    playBuilder.new(4).complete().players([{}, {}]).create(),
    playBuilder.new(5).incomplete().players({}).create(),
    playBuilder.new(5).complete().players({}).create()
  ];

  playMatcher.getMatches({
    filters: { incomplete: 0, itemIds: [3, 5], playerCount: 1 },
    plays: plays
  }).then(function(matchedPlays) {
    t.equal(matchedPlays.length, 1, 'there should be 1 matched play');

    var play = _.head(matchedPlays);
    t.equal(play.incomplete, 0, 'play should be complete');
    t.equal(play.item.objectid, 5, 'play should match one of the supplied item ids');
    t.true(_.isObject(play.players.player), 'player should be an object');
    t.false(_.isArray(play.players.player), 'player should be not be an array');
    t.end();
  });
});
