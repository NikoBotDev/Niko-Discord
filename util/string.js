'use strict';

function pascalCasesify(str) {
  const start = str.charAt(0);
  return `${start.toUpperCase()}${str.slice(0).toLowerCase()}`;
}

module.exports = {
  pascalCasesify
};
