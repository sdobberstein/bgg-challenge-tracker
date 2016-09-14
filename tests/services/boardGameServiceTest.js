const test = require('tape');
const td = require('testdouble');
const boardGameService = require('../../server/services/boardGameService');
const bggService = require('../../server/externalServices/bggService');

test('can get a boardgame by id', (t) => {
  td.replace(bggService, 'getBoardGame');
  td.when(bggService.getBoardGame(1234)).thenResolve({ id: 1234, name: { type: 'primary', value: 'Foo' } });

  boardGameService.getBoardGame(1234).then((boardgame) => {
    t.equal(boardgame.id, 1234);
    td.reset();
    t.end();
  });
});

test('board game gets the primary name extracted', (t) => {
  td.replace(bggService, 'getBoardGame');
  td.when(bggService.getBoardGame(1234)).thenResolve({ id: 1234, name: { type: 'primary', value: 'Foo' } });

  boardGameService.getBoardGame(1234).then((boardgame) => {
    t.equal(boardgame.name, 'Foo');
    td.reset();
    t.end();
  });
});

test('board game that has multipe names gets the primary name extracted', (t) => {
  td.replace(bggService, 'getBoardGame');
  td.when(bggService.getBoardGame(1234)).thenResolve({ id: 1234, name: [{ type: 'alternate', value: 'Bar' }, { type: 'primary', value: 'Foo' }] });

  boardGameService.getBoardGame(1234).then((boardgame) => {
    t.equal(boardgame.name, 'Foo');
    td.reset();
    t.end();
  });
});

test('can get all plays for a user', (t) => {
  td.replace(bggService, 'getAllPlays');
  td.when(bggService.getAllPlays({ username: 'gpburde' })).thenResolve([{ quantity: 3, item: { name: 'Foo', objectid: 1234 }, players: [{}, {}] }]);

  boardGameService.getAllPlays({ username: 'gpburde' }).then((plays) => {
    t.equal(plays.length, 1, 'there should be one play');
    t.equal(plays[0].quantity, 3, 'the game was played 3 times');
    t.equal(plays[0].boardGameName, 'Foo', 'the game is named Foo');
    t.equal(plays[0].boardGameId, 1234, 'the board game has an id of 1234');
    t.equal(plays[0].numberOfPlayers, 2, 'there were two players in the game');
    td.reset();
    t.end();
  });
});
