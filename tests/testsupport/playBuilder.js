var _ = require('lodash');

module.exports = {

  new: function(itemId) {
    if (!_.isUndefined(itemId) && !_.isFinite(itemId)) {
      throw new Error('itemId must be a finite number');
    }
    itemId = _.isFinite(itemId) ? itemId : Math.floor(Math.random() * 10000);
    return Object.create({
      _play: {
        incomplete: 0,
        item: {
          objectid: itemId
        },
        players: {}
      },

      incomplete: function() {
        this._play.incomplete = 1;
        return this;
      },

      complete: function() {
        this._play.incomplete = 0;
        return this;
      },

      players: function() {
        var players = _.flatten([...arguments]);
        if (players.length === 1) {
          players = _.head(players);
        }
        this._play.players.player = _.cloneDeep(players);
        return this;
      },

      create: function() {
        return _.cloneDeep(this._play);
      }
    });
  }

};
