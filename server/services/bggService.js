var _ = require('lodash');
var bgg = require('bgg')();

var MAX_PAGES = 10;
var PLAY_PARAMS = ['username', 'mindate', 'maxdate', 'page'];

module.exports = {

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
