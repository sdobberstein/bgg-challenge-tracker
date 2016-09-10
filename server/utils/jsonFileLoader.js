var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

module.exports = {

  loadJson: (path) => {
    fs.readFileAsync(path).then((data) => JSON.parse(data));
  }

};
