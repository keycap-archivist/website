const fs = require('fs');
const path = require('path');

module.exports = {
  DBREV: fs.readFileSync(path.join(__dirname, '..', 'catalog-revision.txt'), 'utf-8'),
};
