var test = require('tape');
var td = require('testdouble');
var jsonFiles = td.replace('../../server/utils/jsonFiles');
var challengeService = require('../../server/services/challengeService');

test('can load all challenges', (t) => {
  // load fake data
  td.when(jsonFiles.load('../data/challenges.json')).thenResolve([{ id: '1234' }, { id: '5678' }]);

  challengeService.getAllChallenges().then((challenges) => {
    t.deepEqual(challenges, [{ id: '1234' }, { id: '5678' }]);
    t.end();
    td.reset();
  });
});

test('can get challenge by id', (t) => {
  // load fake data
  td.when(jsonFiles.load('../data/challenges.json')).thenResolve([{ id: '1234' }, { id: '5678' }]);

  challengeService.getChallengeById('1234').then((challenge) => {
    t.deepEqual(challenge, { id: '1234' });
    t.end();
    td.reset();
  });
});

test('returns undefined when a challenge doesnt exist', (t) => {
  // load fake data
  td.when(jsonFiles.load('../data/challenges.json')).thenResolve([{ id: '1234' }, { id: '5678' }]);

  challengeService.getChallengeById('9012').then((challenge) => {
    t.deepEqual(challenge, undefined);
    t.end();
    td.reset();
  });
});

test('can save a new challenge', (t) => {
  // load fake data
  td.when(jsonFiles.load('../data/challenges.json')).thenResolve([]);
  td.when(jsonFiles.save('../data/challenges.json', [{ id: '1234' }])).thenResolve(null);

  challengeService.saveChallenge({ id: '1234' }).then(() => {
    t.pass('saved a new challenge');
    t.end();
    td.reset();
  });
});

test('saving a new challenge doesnt override old challenges', (t) => {
  // load fake data
  td.when(jsonFiles.load('../data/challenges.json')).thenResolve([{ id: '1234' }]);
  td.when(jsonFiles.save('../data/challenges.json'), [{ id: '1234' }, { id: '5678' }]).thenResolve(null);

  challengeService.saveChallenge({ id: '5678' }).then(() => {
    t.pass('appended a new challenge to the list');
    t.end();
    td.reset();
  });
});

test('can update an existing challenge', (t) => {
  // load fake data
  td.when(jsonFiles.load('../data/challenges.json')).thenResolve([{ id: '1234', begin: '2016-09-09' }, { id: '5678', begin: '2016-09-09' }]);
  td.when(jsonFiles.save('../data/challenges.json'), [{ id: '1234', begin: '2016-09-09' }, { id: '5678', begin: '2016-09-10' }]).thenResolve(null);

  challengeService.saveChallenge({ id: '5678', begin: '2016-09-10' }).then(() => {
    t.pass('updated an existing challenge');
    t.end();
    td.reset();
  });
});
