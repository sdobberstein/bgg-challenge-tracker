var test = require('tape');
var Predicates = require('../../server/utils/predicates');

test('all() returns true when it passes all predicates', function(t) {
  var isEven = function(x) { return x % 2 === 0; };
  var lessThan20 = function(x) { return x < 20; };
  var predicate = Predicates.all([isEven, lessThan20]);

  t.ok(predicate(10), '10 is both even and less than 20');
  t.end();
});

test('all() returns false if any of the predicates fail', function(t) {
  var isEven = function(x) { return x % 2 === 0; };
  var lessThan20 = function(x) { return x < 20; };
  var predicate = Predicates.all([isEven, lessThan20]);

  t.notOk(predicate(7), '7 is not even');
  t.notOk(predicate(22), '22 is not less than 20');
  t.end();
});

test('all() accepts a mix of functions and arrays of functions', function(t) {
  var isEven = function(x) { return x % 2 === 0; };
  var lessThan20 = function(x) { return x < 20; };
  var predicate = Predicates.all(isEven, [lessThan20]);

  t.ok(predicate(10), '10 is both even and less than 20');
  t.notOk(predicate(7), '7 is not even');
  t.notOk(predicate(22), '22 is not les than 20');
  t.end();
});
