'use strict';

const { Canvas } = require('canvas-constructor');
/**
 * Create a palette image from the given colors
 * @param {Array<Array<number>>} colors
 * @return {Promise<Buffer>}
 */
async function getPalette(colors) {
  const canvas = new Canvas(800, 160);
  let nextPos = 0;
  colors.forEach(async rgb => {
    const color = new Canvas(160, 160);
    const [red, green, blue] = rgb;
    color.setColor(`rgb(${red}, ${green}, ${blue}, 1)`);
    color.addRect(0, 0, color.height, color.width);
    const buffer = await color.toBufferAsync();
    canvas.addImage(buffer, nextPos, 0);
    nextPos += 160;
  });
  return canvas.toBufferAsync();
}

module.exports = {
  getPalette
};
