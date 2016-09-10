var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

module.exports = {

  load: (path) => {
    fs.readFileAsync(path).then((data) => JSON.parse(data));
  },

  save: (path, data) => {
    fs.writeFileAsync(path, JSON.stringify(data));
  }

};
