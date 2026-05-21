import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const rootDir = path.resolve('.');
const packageJson = JSON.parse(await readFile(path.join(rootDir, 'package.json'), 'utf8'));
const indexHtml = await readFile(path.join(rootDir, 'index.html'), 'utf8');

assert.equal(packageJson.build?.extraMetadata?.main, 'desktop/main.js');
assert.equal(packageJson.build?.directories?.output, 'release');
assert.equal(packageJson.build?.asar, false);
assert.equal(packageJson.build?.win?.signAndEditExecutable, false);
assert.equal(typeof packageJson.dependencies?.['electron-updater'], 'string');
assert.ok(Array.isArray(packageJson.build?.files));
assert.ok(packageJson.build.files.includes('desktop/**/*'));
assert.ok(packageJson.build.files.includes('server/**/*'));
assert.ok(packageJson.build.files.includes('src/**/*'));
assert.ok(packageJson.build.files.includes('dist/**/*'));

assert.match(indexHtml, /<link rel="stylesheet" href="\/src\/index\.css">/);
assert.ok(!indexHtml.includes('cdn.tailwindcss.com'));
assert.ok(!indexHtml.includes('tailwind.config ='));
assert.ok(!indexHtml.includes('aistudiocdn.com'));
assert.ok(!indexHtml.includes('fonts.googleapis.com'));
assert.ok(!indexHtml.includes('fonts.gstatic.com'));
