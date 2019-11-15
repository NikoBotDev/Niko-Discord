'use strict';

import axios from 'axios';
import logger from '../classes/Logger';
import { Message, EmojiResolvable } from 'discord.js';
async function getHTML(url: string) {
  try {
    const res = await axios(url, { responseType: 'text' });
    return res.data;
  } catch (err) {
    return null;
  }
}

async function getImage(url: string, config = {}): Promise<Buffer> {
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

async function getJSON(url: string, config = {}) {
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

const sendAndReact = async (msg: Message, ...reactions: EmojiResolvable[]) => {
  reactions.forEach((reaction) => msg.react(reaction));
};

/**
 * Stop the function for the given ms.
 */
function wait(time: number): Promise<undefined> {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

export { getHTML, getImage, getJSON, wait, sendAndReact };
