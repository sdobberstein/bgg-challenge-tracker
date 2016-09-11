var _ = require('lodash');
var bgg = require('bgg')();
var Promise = require('bluebird');
var cache = require('lru-cache')(100);

var MAX_PAGES = 10;
var PLAY_PARAMS = ['username', 'mindate', 'maxdate', 'page'];

module.exports = {

  boardgameName: function(id) {
    var self = this;
    return new Promise(function(resolve) {
      if (cache.has(id)) {
        resolve(cache.get(id));
      } else {
        self.boardgame(id).then(function(boardgame) {
          var names = _.isArray(boardgame.name) ? boardgame.name : [boardgame.name];
          var primaryName = _.find(names, function(name) { return name.type === 'primary'; });
          cache.set(id, primaryName.value);
          resolve(primaryName.value);
        });
      }
    });
  },

  boardgame: function(id) {
    return bgg('thing', { id, type: 'boardgame' })
      .then(function(results) {
        return results.items.item;
      });
  },

  plays: function(params) {
    var promises = [];
    var options = _.pick(params, PLAY_PARAMS);
    var initialPromise = bgg('plays', options);

    promises.push(initialPromise);

    return initialPromise.then(function(data) {
      var plays = data.plays || {};
      var pages = Math.min(MAX_PAGES, Math.ceil(plays.total / 100));
      if (pages > 1) {
        for (var i = 1; i < pages; i++) {
          promises.push(bgg('plays', _.extend({}, options, { page: i + 1 })));
        }
      }

      return Promise.all(promises).then(function(pages) {
        return _
          .chain(pages)
          .filter(function(page) { return page.plays; })
          .map(function(page) { return page.plays.play || []; })
          .flatten()
          .value();
      });
    });
  }

};
