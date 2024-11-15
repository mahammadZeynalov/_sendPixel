import cuid from "cuid";

export function generatePixelsData() {
  const coordinatesArray: any[] = [];

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const color = {
        r: Math.floor(Math.random() * 256), // Random value between 0 and 255
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256),
      };

      const point = {
        id: cuid(),
        x: x,
        y: y,
        color: color,
      };

      coordinatesArray.push(point);
    }
  }

  return coordinatesArray;
}
