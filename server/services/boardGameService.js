const _ = require('lodash');
const Promise = require('bluebird');
const cache = require('lru-cache')(100);
const bggService = require('../externalServices/bggService');

module.exports = {

  getBoardGame: (id) => {
    if (cache.has(id)) {
      return Promise.resolve(cache.get(id));
    }

    return bggService.getBoardGame(id).then((rawBoardGame) => {
      const names = _.isArray(rawBoardGame.name) ? _.cloneDeep(rawBoardGame.name) : _.cloneDeep([rawBoardGame.name]);
      const primaryName = _.find(names, (name) => name.type === 'primary');
      const boardGame = {
        id: rawBoardGame.id,
        name: primaryName.value
      };
      cache.set(id, boardGame);
      return boardGame;
    });
  },

  getAllPlays: (params) => {
    return bggService.getAllPlays(params).then((plays) => {
      return plays.map((play) => {
        return {
          quantity: play.quantity,
          boardGameName: play.item.name,
          boardGameId: play.item.objectid,
          numberOfPlayers: _.isArray(play.players) ? play.players.length : 1
        };
      });
    });
  }

};
