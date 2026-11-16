// Minimal MATLAB v5 reader for the numeric/struct/cell visualization asset.
// Data remains in MATLAB column-major order; this does not execute MATLAB code.
import { inflateSync } from 'node:zlib';
import { readFileSync } from 'node:fs';

function element(buffer, offset) {
  const packed = buffer.readUInt32LE(offset);
  const smallSize = packed >>> 16;
  if (smallSize) return { type: packed & 65535, data: buffer.subarray(offset + 4, offset + 4 + smallSize), next: offset + 8 };
  const size = buffer.readUInt32LE(offset + 4);
  return { type: packed, data: buffer.subarray(offset + 8, offset + 8 + size), next: offset + 8 + Math.ceil(size / 8) * 8 };
}
function numbers(item) {
  const methods = { 1: ['readInt8', 1], 2: ['readUInt8', 1], 3: ['readInt16LE', 2], 4: ['readUInt16LE', 2], 5: ['readInt32LE', 4], 6: ['readUInt32LE', 4], 7: ['readFloatLE', 4], 9: ['readDoubleLE', 8], 12: ['readBigInt64LE', 8], 13: ['readBigUInt64LE', 8] };
  const method = methods[item.type];
  if (!method) throw new Error('Unsupported numeric type: ' + item.type);
  return Array.from({ length: item.data.length / method[1] }, (_, i) => Number(item.data[method[0]](i * method[1])));
}
function matrix(buffer) {
  let position = 0;
  const read = () => { const item = element(buffer, position); position = item.next; return item; };
  const flags = numbers(read());
  const kind = flags[0] & 255;
  const dimensions = numbers(read());
  const name = read().data.toString('utf8');
  const count = dimensions.reduce((a, b) => a * b, 1);
  if (kind === 2) {
    const fieldLength = numbers(read())[0];
    const fieldBytes = read().data;
    const fields = [];
    for (let start = 0; start < fieldBytes.length; start += fieldLength) fields.push(fieldBytes.subarray(start, start + fieldLength).toString().replace(/\0.*$/, ''));
    const values = Array.from({ length: count }, () => Object.fromEntries(fields.map(field => [field, matrix(read().data).value])));
    return { name, value: count === 1 ? values[0] : values };
  }
  if (kind === 1) return { name, value: Array.from({ length: count }, () => matrix(read().data).value) };
  if (kind === 4) return { name, value: String.fromCharCode(...numbers(read())) };
  return { name, value: { dimensions, values: count ? numbers(read()) : [] } };
}
export function readMat(path) {
  const buffer = readFileSync(path);
  if (buffer.subarray(126, 128).toString() !== 'IM') throw new Error('Expected little-endian MATLAB v5');
  const item = element(buffer, 128);
  return matrix(item.type === 15 ? element(inflateSync(item.data), 0).data : item.data);
}
if (process.argv[1]?.endsWith('read-mat.mjs')) {
  const parsed = readMat(process.argv[2]);
  const summarize = value => Array.isArray(value) ? value.map(summarize) : value?.dimensions ? { dimensions: value.dimensions, sample: value.values.slice(0, 8) } : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, summarize(v)])) : value;
  console.log(JSON.stringify({ name: parsed.name, value: summarize(parsed.value) }, null, 2));
}
