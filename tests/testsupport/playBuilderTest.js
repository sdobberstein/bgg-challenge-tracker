var _ = require('lodash');
var test = require('tape');
var playBuilder = require('./playBuilder');

test('can create a play that is marked incomplete', function(t) {
  var incompletePlay = playBuilder.new().incomplete().create();

  t.equal(incompletePlay.incomplete, 1);
  t.end();
});

test('can create a play that is marked complete', function(t) {
  var completePlay = playBuilder.new().complete().create();

  t.equal(completePlay.incomplete, 0);
  t.end();
});

test('plays are maked complete by default', function(t) {
  var completePlay = playBuilder.new().create();

  t.equal(completePlay.incomplete, 0);
  t.end();
});

test('play item is given a random identifer by default', function(t) {
  var play = playBuilder.new().create();

  t.true(_.isFinite(play.item.objectid));
  t.end();
});

test('can create a play with a given item id', function(t) {
  var play = playBuilder.new(1234).create();

  t.equal(play.item.objectid, 1234, 'the objectid should match what was supplied');
  t.end();
});

test('an error is thrown when creating a play with a non-finite value', function(t) {
  t.throws(function() {
    playBuilder.new('abcd');
  }, Error, 'an error should be thrown when attempting to use a non-finite value for an item id');
  t.end();
});

test('if only a single player is supplied then subdocument is an object', function(t) {
  var play = playBuilder.new().players({}).create();

  t.true(_.isObject(play.players.player), 'player should be an object');
  t.false(_.isArray(play.players.player), 'player should not be an array');
  t.end();
});

test('if players array only contains a single player then the subdocument is an object', function(t) {
  var play = playBuilder.new().players([{}]).create();

  t.true(_.isObject(play.players.player), 'player should be an object');
  t.false(_.isArray(play.players.player), 'player should not be an array');
  t.end();
});

test('if multiple players are supplied then subdocument is an array', function(t) {
  var play = playBuilder.new().players([{}, {}]).create();

  t.true(_.isArray(play.players.player), 'player should be an array');
  t.equal(play.players.player.length, 2);
  t.end();
});

test('can supply multiple players as separate arguments', function(t) {
  var play = playBuilder.new().players({}, {}).create();

  t.true(_.isArray(play.players.player), 'player should be an array');
  t.equal(play.players.player.length, 2);
  t.end();
});
