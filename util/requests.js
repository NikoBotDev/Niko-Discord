'use strict';

const axios = require('axios');
const { logger } = require('../classes');

async function getHTML(url) {
  try {
    const res = await axios(url, { responseType: 'text' });
    return res.data;
  } catch (err) {
    return null;
  }
}

async function getImage(url, config = {}) {
  try {
    const res = await axios(url, {
      responseType: 'arraybuffer',
      ...config
    });
    return res.data;
  } catch (err) {
    logger.error(err);
    return null;
  }
}

async function getJSON(url, config = {}) {
  try {
    const res = await axios(url, {
      responseType: 'json',
      ...config
    });
    return res.data;
  } catch (err) {
    return null;
  }
}

/**
 *
 * @param {Message} msg
 * @param  {string[]} reactions
 */
const sendAndReact = async (msg, ...reactions) => {
  reactions.forEach(reaction => msg.react(reaction));
};

/**
 * Stop the function for the given ms.
 * @param {number} time
 * @return {Promise<void>}
 */
function wait(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}

module.exports = {
  getHTML,
  getImage,
  getJSON,
  wait,
  sendAndReact
};
