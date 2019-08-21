'use strict';

const fs = require('fs');
const { join } = require('path');

module.exports = db => {
  fs.readdirSync(join(__dirname, '..', 'data', 'models'))
    .filter(file => {
      return file.indexOf('.') !== 0 && file.slice(-3) === '.js';
    })
    .forEach(file => {
      const model = db.import(join(__dirname, '..', 'data', 'models', file));
      db[model.name] = model; // eslint-disable-line
    });
};
