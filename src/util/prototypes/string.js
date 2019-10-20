'use strict';

/* eslint-disable no-extend-native */

Object.defineProperty(String.prototype, 'fixPath', {
  value: function fixPath() {
    return this.replace(/\s+/g, '^ ');
  }
});
