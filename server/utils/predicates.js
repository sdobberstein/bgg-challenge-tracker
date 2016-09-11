var _ = require('lodash');

module.exports = {

  all: function() {
    var predicates = _.flatten([...arguments]);
    return function() {
      for (let i = 0; i < predicates.length; i++) {
        if (!predicates[i].apply(null, arguments)) {
          return false;
        }
      }
      return true;
    };
  }

};
