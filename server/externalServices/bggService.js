const _ = require('lodash');
const Promise = require('bluebird');
const bgg = require('bgg')();

const MAX_PAGES = 10;
const APPICABLE_PLAY_PARAMS = ['username', 'mindate', 'maxdate', 'page'];

module.exports = {

  getBoardGame: function(id) {
    return bgg('thing', { id, type: 'boardgame' }).then((results) => {
      return results.items.item;
    });
  },

  getAllPlays: function(params) {
    const options = _.pick(params, APPICABLE_PLAY_PARAMS);
    const initialPromise = this.getPaginatedPlays(options);
    const promises = [initialPromise];

    return initialPromise.then((paginatedPlays) => {
      const plays = paginatedPlays.plays || {};
      const pages = Math.min(MAX_PAGES, Math.ceil(plays.total / 100));
      if (pages > 1) {
        for (let i = 1; i < pages; i++) {
          promises.push(this.getPaginatedPlays(_.extend({}, options, { page: i + 1 })));
        }
      }

      return Promise.all(promises).then((pages) => {
        return _
          .chain(pages)
          .map((page) => { return page.plays && page.plays.play ? page.plays.play : []; })
          .flatten()
          .value();
      });
    });
  },

  getPaginatedPlays: function(params) {
    return bgg('plays', params);
  },

  getPlays: function(params) {
    return this.getPaginatedPlays(params).then((results) => {
      return ((results.plays && results.plays.play) ? results.plays.play : []);
    });
  }

};
