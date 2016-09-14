var _ = require('lodash');
var Promise = require('bluebird');
var Predicates = require('./predicates');

const FILTERS = {
  'complete': function(complete) {
    return function(play) {
      return play.complete === complete;
    }
  },
  'boardGameIds': function(boardGameIds) {
    return function(play) {
      return _(boardGameIds).includes(play.boardGameId);
    };
  },
  'numberOfPlayers': function(numberOfPlayers) {
    return function(play) {
      return play.numberOfPlayers === numberOfPlayers;
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
