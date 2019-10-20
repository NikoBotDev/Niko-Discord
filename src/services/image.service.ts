import { Canvas } from 'canvas-constructor';
/**
 * Create a palette image from the given colors
 */
async function getPalette(colors: Array<number[]>): Promise<Buffer> {
  const canvas = new Canvas(800, 160);
  let nextPos: number = 0;
  colors.forEach(async (rgb: number[]) => {
    const color = new Canvas(160, 160);
    const [red, green, blue] = rgb;
    color.setColor(`rgb(${red}, ${green}, ${blue}, 1)`);
    color.addRect(0, 0, color.height, color.width);
    const buffer: Buffer = await color.toBufferAsync();
    canvas.addImage(buffer, nextPos, 0);
    nextPos += 160;
  });
  return canvas.toBufferAsync();
}

export { getPalette };
