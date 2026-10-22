// Read PNG alpha bounds for CSS cropping. Does not modify the source images.
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const names = ['motor.png', 'properllers.png', 'flight controller.png', 'camera.png', 'frame arms.png', 'screw.png', 'sensors.png', 'sensor-sensor-wire-fixed.png', 'frame attachement.png', 'body-frame-bare-hd-v1.png', 'battery-theme-no-logo-v2.png', 'aerocadmy-logo.png'];
const output = {};
for (const name of names) {
  const filename = path.join('public', 'component images', name);
  if (!fs.existsSync(filename)) continue;
  const png = fs.readFileSync(filename);
  const width = png.readUInt32BE(16), height = png.readUInt32BE(20);
  if (png[24] !== 8 || ![2, 6].includes(png[25])) throw Error('Unsupported PNG: ' + name);
  const channels = png[25] === 6 ? 4 : 3;
  const chunks = [];
  for (let offset = 8; offset < png.length;) {
    const length = png.readUInt32BE(offset);
    if (png.toString('ascii', offset + 4, offset + 8) === 'IDAT') chunks.push(png.subarray(offset + 8, offset + 8 + length));
    offset += 12 + length;
  }
  const raw = zlib.inflateSync(Buffer.concat(chunks));
  const stride = width * channels, pixels = new Uint8Array(height * stride);
  const paeth = (a, b, c) => { const p = a + b - c; const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); return pa <= pb && pa <= pc ? a : pb <= pc ? b : c; };
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    for (let x = 0; x < stride; x++) {
      const i = y * stride + x, a = x >= channels ? pixels[i - channels] : 0, b = y ? pixels[i - stride] : 0, c = y && x >= channels ? pixels[i - stride - channels] : 0;
      const predicted = [0, a, b, (a + b) >> 1, paeth(a, b, c)][filter];
      pixels[i] = (raw[y * (stride + 1) + x + 1] + predicted) & 255;
    }
  }
  const mask = new Uint8Array(width * height), queue = new Int32Array(width * height);
  for (let i = 0; i < mask.length; i++) {
    const p = i * channels;
    mask[i] = (channels === 3 || pixels[p + 3] >= 96) && !(pixels[p] > 245 && pixels[p + 1] > 245 && pixels[p + 2] > 245) ? 1 : 0;
  }
  let best = { count: 0, x: 0, y: 0, right: width - 1, bottom: height - 1 };
  // A wordmark contains disconnected letters, so retain all its visible parts.
  let logoBounds = { x: width, y: height, right: 0, bottom: 0 };
  if (name === 'aerocadmy-logo.png') for (let i = 0; i < mask.length; i++) if (mask[i]) {
    const x = i % width, y = Math.floor(i / width);
    logoBounds.x = Math.min(logoBounds.x, x); logoBounds.y = Math.min(logoBounds.y, y);
    logoBounds.right = Math.max(logoBounds.right, x); logoBounds.bottom = Math.max(logoBounds.bottom, y);
  }
  for (let i = 0; i < mask.length; i++) {
    if (!mask[i]) continue;
    let head = 0, tail = 1, minX = width, minY = height, maxX = 0, maxY = 0;
    queue[0] = i; mask[i] = 0;
    while (head < tail) {
      const index = queue[head++], x = index % width, y = Math.floor(index / width);
      minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      const neighbors = [x ? index - 1 : -1, x < width - 1 ? index + 1 : -1, y ? index - width : -1, y < height - 1 ? index + width : -1];
      for (const n of neighbors) if (n >= 0 && mask[n]) { mask[n] = 0; queue[tail++] = n; }
    }
    if (tail > best.count) best = { count: tail, x: minX, y: minY, right: maxX, bottom: maxY };
  }
  if (name === 'aerocadmy-logo.png') best = { count: 1, ...logoBounds };
  const x = Math.max(0, best.x - 4), y = Math.max(0, best.y - 4);
  output[name] = { width, height, x, y, cropWidth: Math.min(width - 1, best.right + 4) - x + 1, cropHeight: Math.min(height - 1, best.bottom + 4) - y + 1 };
}
fs.writeFileSync('src/lib/image-bounds.json', JSON.stringify(output, null, 2) + '\n');
console.log(output);
