var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

module.exports = {

  load: function(path) {
    return fs.readFileAsync(path).then(function(data) {
      return JSON.parse(data);
    });
  },

  save: function(path, data) {
    return fs.writeFileAsync(path, JSON.stringify(data));
  }

};
