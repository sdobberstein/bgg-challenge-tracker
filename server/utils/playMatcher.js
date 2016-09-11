var _ = require('lodash');
var Promise = require('bluebird');
var Predicates = require('./predicates');

const FILTERS = {
  'incomplete': function(incomplete) {
    return function(play) {
      return play.incomplete === incomplete;
    }
  },
  'itemIds': function(itemIds) {
    return function(play) {
      return _(itemIds).includes(play.item.objectid);
    };
  },
  'playerCount': function(count) {
    return function(play) {
      var players = play.players.player;
      if (!_.isArray(players)) {
        players = [players];
      }
      return players.length === count;
    };
  }
};
const AVAILABLE_FILTERS = Object.keys(FILTERS);

module.exports = {

  getMatches: function(config) {
    return new Promise(function(resolve) {
      var filters = _.pick(config.filters || {}, AVAILABLE_FILTERS);
      var plays = config.plays ? _.cloneDeep(config.plays) : [];
      var filterFunctions = [];
      _(filters).forOwn(function(value, key) {
        if (FILTERS[key]) {
          filterFunctions.push(FILTERS[key](value));
        }
      });

      resolve(plays.filter(Predicates.all(filterFunctions)));
    });
  }

};
