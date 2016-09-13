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
const APPILCABLE_FILTERS = Object.keys(FILTERS);

module.exports = {

  getMatches: function({ filters = {}, plays = [] }) {
    const applicableFilters = _.pick(filters, APPILCABLE_FILTERS);
    const clonedPlays = _.cloneDeep(plays);
    let filterFunctions = [];

    _(applicableFilters).forOwn((value, key) => {
      FILTERS[key] && filterFunctions.push(FILTERS[key](value));
    });

    return clonedPlays.filter(Predicates.all(filterFunctions));
  }

};
