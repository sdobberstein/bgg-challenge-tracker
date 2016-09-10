var test = require('tape');
var td = require('testdouble');
var jsonFileLoader = td.replace('../../server/utils/jsonFileLoader');
var challengeService = require('../../server/services/challengeService');

test('can load all challenges', (t) => {
  // load fake data
  td.when(jsonFileLoader.loadJson('../data/challenges.json')).thenResolve([{ id: '1234' }, { id: '5678' }]);

  challengeService.getAllChallenges().then((challenges) => {
    t.deepEqual(challenges, [{ id: '1234' }, { id: '5678' }]);
    t.end();
    td.reset();
  });
});

test('can get challenge by id', (t) => {
  // load fake data
  td.when(jsonFileLoader.loadJson('../data/challenges.json')).thenResolve([{ id: '1234' }, { id: '5678' }]);

  challengeService.getChallengeById('1234').then((challenge) => {
    t.deepEqual(challenge, { id: '1234' });
    t.end();
    td.reset();
  });
});

test('returns undefined when a challenge doesnt exist', (t) => {
  // load fake data
  td.when(jsonFileLoader.loadJson('../data/challenges.json')).thenResolve([{ id: '1234' }, { id: '5678' }]);

  challengeService.getChallengeById('9012').then((challenge) => {
    t.deepEqual(challenge, undefined);
    t.end();
    td.reset();
  });
});
