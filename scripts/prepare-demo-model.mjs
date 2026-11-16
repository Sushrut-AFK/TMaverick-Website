// Convert licensed upstream CAD and wheel meshes to a self-contained browser GLB.
// All coordinates are metres. Source: MathWorks Formula-Student-Vehicle-Simscape,
// commit 6bcec3828e49102f21841b3239bfaf3632dfec8d (BSD licence beside output).
import { readFileSync, writeFileSync } from 'node:fs';
import { BufferGeometry, Float32BufferAttribute, CylinderGeometry, Quaternion, Vector3 } from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { readMat } from './read-mat.mjs';

const json = { asset: { version: '2.0', generator: 'Team Maverick licensed demo conversion' }, scene: 0, scenes: [{ nodes: [] }], nodes: [], meshes: [], materials: [], accessors: [], bufferViews: [], buffers: [{ byteLength: 0 }] };
const chunks = [];
let offset = 0;
function attribute(typed, type, componentType, bounds = false, target = 34962) {
  const data = Buffer.from(typed.buffer, typed.byteOffset, typed.byteLength);
  const view = json.bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: data.length, target }) - 1;
  chunks.push(data, Buffer.alloc((4 - data.length % 4) % 4));
  offset += data.length + (4 - data.length % 4) % 4;
  const count = typed.length / (type === 'VEC3' ? 3 : 1);
  const accessor = { bufferView: view, componentType, count, type };
  if (bounds) { accessor.min = [Infinity, Infinity, Infinity]; accessor.max = [-Infinity, -Infinity, -Infinity]; for (let i = 0; i < typed.length; i++) { const c = i % 3; accessor.min[c] = Math.min(accessor.min[c], typed[i]); accessor.max[c] = Math.max(accessor.max[c], typed[i]); } }
  return json.accessors.push(accessor) - 1;
}
function mesh(name, geometry, color, explode, focus, translation = [0, 0, 0], reuseMaterial) {
  geometry = mergeVertices(geometry, 0.00002);
  geometry.computeVertexNormals();
  const material = reuseMaterial ?? json.materials.push({ name, pbrMetallicRoughness: { baseColorFactor: [...color, 1], metallicFactor: name.includes('rim') ? 0.65 : 0.2, roughnessFactor: name.includes('tire') ? 0.9 : 0.48 }, doubleSided: true }) - 1;
  const attributes = { POSITION: attribute(geometry.getAttribute('position').array, 'VEC3', 5126, true), NORMAL: attribute(geometry.getAttribute('normal').array, 'VEC3', 5126) };
  const indices = attribute(Uint32Array.from(geometry.index.array), 'SCALAR', 5125, false, 34963);
  const index = json.meshes.push({ name, primitives: [{ attributes, indices, material }] }) - 1;
  node(name, index, translation, explode, focus);
  return index;
}
function node(name, index, translation, explode, focus) {
  json.scenes[0].nodes.push(json.nodes.push({ name, mesh: index, translation, extras: { explode, focus } }) - 1);
}
function cad(name) {
  const buffer = readFileSync(`research/models/${name}.stl`);
  const geometry = new STLLoader().parse(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.length));
  const pos = geometry.getAttribute('position');
  // Source CAD offset [-0.5375,0,0], and scene centre x +0.55.
  for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i); pos.setXYZ(i, x + 0.0125, z, -y); }
  geometry.deleteAttribute('normal');
  return geometry;
}
mesh('bodywork', cad('FSAE_Body'), [0.045, 0.37, 0.46], [0, 0.64, 0.45], [5, 6, 7]);
mesh('structure', cad('FSAE_Aero_Brackets'), [0.38, 0.43, 0.44], [0, 0, 0], [0]);
mesh('rollbar', cad('FSAE_Rollbar'), [0.7, 0.75, 0.74], [0, 0.2, 0], [0]);
mesh('seat', cad('FSAE_Seat'), [0.085, 0.1, 0.11], [-0.12, 0.92, -0.15], [0]);
const aero = cad('FSAE_Aero_Surfaces').getAttribute('position');
const partitions = { 'front-wing': [], 'rear-wing': [], floor: [] };
for (let i = 0; i < aero.count; i += 3) {
  const x = (aero.getX(i) + aero.getX(i + 1) + aero.getX(i + 2)) / 3;
  const y = (aero.getY(i) + aero.getY(i + 1) + aero.getY(i + 2)) / 3;
  const group = x > 0.65 ? 'front-wing' : y > 0.64 ? 'rear-wing' : 'floor';
  for (let j = 0; j < 3; j++) partitions[group].push(aero.getX(i + j), aero.getY(i + j), aero.getZ(i + j));
}
for (const [name, vertices] of Object.entries(partitions)) {
  const geometry = new BufferGeometry().setAttribute('position', new Float32BufferAttribute(vertices, 3));
  mesh(name, geometry, [0.11, 0.14, 0.16], name === 'front-wing' ? [0.48, 0.18, 0] : name === 'rear-wing' ? [-0.42, 0.68, 0] : [0, -0.15, 0], [2]);
}
const source = readMat('research/models/VehVisDataFSAE.mat').value.Wheel;
for (let p = 0; p < 3; p++) {
  const vertices = source.vertices[p], faces = source.faces[p];
  const count = vertices.dimensions[0], faceCount = faces.dimensions[0];
  const pos = [], indices = [];
  for (let i = 0; i < count; i++) pos.push(vertices.values[i], vertices.values[i + count * 2], -vertices.values[i + count]);
  for (let i = 0; i < faceCount; i++) indices.push(faces.values[i] - 1, faces.values[i + faceCount] - 1, faces.values[i + faceCount * 2] - 1);
  const geometry = new BufferGeometry().setAttribute('position', new Float32BufferAttribute(pos, 3)); geometry.setIndex(indices);
  const part = ['tire', 'hub', 'rim'][p];
  // Original wheel template, reused at wheel centres from Vehicle_data_dwpushrod.m.
  const placements = [[0.55, 0.23323, -0.619], [0.55, 0.23323, 0.619], [-0.98, 0.23323, -0.575], [-0.98, 0.23323, 0.575]];
  const first = mesh(`wheel-fl-${part}`, geometry, p === 0 ? [0.055, 0.065, 0.07] : [0.56, 0.61, 0.62], [0.06, 0.04, -0.58], p === 1 ? [1, 3] : [1, 4], placements[0]);
  for (let i = 1; i < 4; i++) node(`wheel-${['fl', 'fr', 'rl', 'rr'][i]}-${part}`, first, placements[i], [i < 2 ? 0.06 : -0.06, 0.04, i % 2 ? 0.58 : -0.58], p === 1 ? [1, 3] : [1, 4]);
}
// Parametric wishbone links use the upstream published hardpoints, not invented CAD.
const parameterText = readFileSync('research/models/vehicle-parameters.m', 'utf8');
function point(key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = parameterText.match(new RegExp(escaped + '\\.Value\\s*=\\s*(?:\\.\\.\\.\\s*)?\\[([^\\]]+)\\]'));
  if (!match) throw new Error('Missing hardpoint: ' + key);
  return match[1].trim().split(/\s+/).map(Number);
}
for (let axle = 1; axle <= 2; axle++) for (const side of [-1, 1]) for (const arm of ['LowerWishbone', 'UpperWishbone']) {
  const root = `Vehicle.Chassis.SuspA${axle}.Linkage.${arm}`;
  const out = point(root + '.sOutboard');
  for (const mount of ['sInboardF', 'sInboardR']) {
    const start = point(root + '.' + mount);
    const convert = p => new Vector3(p[0] + (axle === 1 ? 0.55 : -0.98), p[2], -p[1] * side);
    const a = convert(start), b = convert(out), dir = b.clone().sub(a);
    const geometry = new CylinderGeometry(0.009, 0.009, dir.length(), 8);
    geometry.applyQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), dir.normalize()));
    geometry.translate(...a.add(b).multiplyScalar(0.5).toArray());
    mesh(`suspension-${axle}-${side}-${arm}-${mount}`, geometry, [0.38, 0.43, 0.45], [0, 0.04, -side * 0.24], [1]);
  }
}
json.buffers[0].byteLength = offset;
const binary = Buffer.concat(chunks);
const rawJson = Buffer.from(JSON.stringify(json));
const jsonChunk = Buffer.concat([rawJson, Buffer.alloc((4 - rawJson.length % 4) % 4, 32)]);
const header = Buffer.alloc(12); header.writeUInt32LE(0x46546c67, 0); header.writeUInt32LE(2, 4); header.writeUInt32LE(12 + 8 + jsonChunk.length + 8 + binary.length, 8);
const jsonHeader = Buffer.alloc(8); jsonHeader.writeUInt32LE(jsonChunk.length); jsonHeader.writeUInt32LE(0x4e4f534a, 4);
const binHeader = Buffer.alloc(8); binHeader.writeUInt32LE(binary.length); binHeader.writeUInt32LE(0x004e4942, 4);
const output = Buffer.concat([header, jsonHeader, jsonChunk, binHeader, binary]);
writeFileSync('public/models/formula-student/demo.glb', output);
console.log(`Exported ${json.nodes.length} real CAD/parametric parts, ${json.meshes.length} shared meshes, ${(output.length / 1024 / 1024).toFixed(2)} MB`);
