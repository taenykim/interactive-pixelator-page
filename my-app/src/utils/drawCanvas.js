import { resizeImage } from "../utils/resizeImage";
import { averageColor } from "./averageColor";
import { averageLastPixelColor } from "./averageLastPixelColor";
const dataOffset = 4; // we can set how many pixels to skip
const borderSize = 2;

export const drawCanvas = (canvas, image, pixelSize, gridSize, gridColor) => {
  gridColor = gridColor || "#000000";
  console.log("drawCanvas ps", pixelSize);
  const ctx = canvas.getContext("2d");
  const [width, height] = resizeImage(image);
  canvas.width = width - borderSize;
  canvas.height = height - borderSize;
  const tileSize = pixelSize;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  const numTileRows = Math.ceil(canvas.height / tileSize);
  const numTileCols = Math.ceil(canvas.width / tileSize);
  ctx.drawImage(image, 0, 0, width, height);

  const grid = gridSize;
  const gridRed = parseInt(gridColor.substr(1, 2), 16);
  const gridGreen = parseInt(gridColor.substr(3, 2), 16);
  const gridBlue = parseInt(gridColor.substr(5, 2), 16);

  // Loop through each tile
  for (let r = 0; r < numTileRows; r++) {
    for (let c = 0; c < numTileCols; c++) {
      // Set the pixel values for each tile
      let average;
      if (c === numTileCols - 1 || r === numTileRows - 1) average = averageLastPixelColor(canvas, r, c, ctx, tileSize, dataOffset);
      else average = averageColor(r, c, ctx, tileSize, dataOffset);
      const rgb = average;

      const red = rgb.r;
      const green = rgb.g;
      const blue = rgb.b;

      // Loop through each tile pixel
      if (c === numTileCols - 1) {
        for (let tr = 0; tr < tileSize; tr++) {
          for (let tc = 0; tc < canvas.width - c * tileSize; tc++) {
            // Calculate the true position of the tile pixel
            const trueRow = r * tileSize + tr;
            const trueCol = c * tileSize + tc;

            // Calculate the position of the current pixel in the array
            const position = trueRow * (imageData.width * dataOffset) + trueCol * dataOffset;

            // console.log("position", position);
            // Assign the colour to each pixel
            if (tc < grid || tr < grid || tc > canvas.width - c * tileSize - grid || tr > canvas.height - r * tileSize - grid) {
              pixels[position + 0] = gridRed;
              pixels[position + 1] = gridGreen;
              pixels[position + 2] = gridBlue;
              pixels[position + 3] = 255;
            } else {
              pixels[position + 0] = red;
              pixels[position + 1] = green;
              pixels[position + 2] = blue;
              pixels[position + 3] = 255;
            }
          }
        }
      } else {
        for (let tr = 0; tr < tileSize; tr++) {
          for (let tc = 0; tc < tileSize; tc++) {
            // Calculate the true position of the tile pixel
            const trueRow = r * tileSize + tr;
            const trueCol = c * tileSize + tc;

            // Calculate the position of the current pixel in the array
            const position = trueRow * (imageData.width * dataOffset) + trueCol * dataOffset;

            // console.log("position", position);
            // Assign the colour to each pixel
            if (tc < grid || tr < grid || tr > canvas.height - r * tileSize - grid) {
              pixels[position + 0] = gridRed;
              pixels[position + 1] = gridGreen;
              pixels[position + 2] = gridBlue;
              pixels[position + 3] = 255;
            } else {
              pixels[position + 0] = red;
              pixels[position + 1] = green;
              pixels[position + 2] = blue;
              pixels[position + 3] = 255;
            }
          }
        }
      }
    }
  }

  // Draw image data to the canvas
  ctx.putImageData(imageData, 0, 0);
};
