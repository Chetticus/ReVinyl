const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function load(relativePath) {
  const filename = path.resolve(__dirname, '..', relativePath);
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  const module = { exports: {} };
  vm.runInNewContext(outputText, { module, exports: module.exports }, { filename });
  return module.exports;
}

const { audioLeadIn, switchedPosition } = load('src/modules/archive/audio-timeline.ts');
const digital = { type: 'DIGITAL', originalFilename: 'source.mp3' };
const intro = { type: 'VINYLIZED', originalFilename: 'recording-vinylized-intro.mp3' };
const legacy = { type: 'VINYLIZED', originalFilename: 'recording-vinylized.mp3' };
assert.equal(audioLeadIn(intro), 4.5);
assert.equal(switchedPosition(60, digital, intro), 64.5);
assert.equal(switchedPosition(64.5, intro, digital), 60);
assert.equal(switchedPosition(2, intro, digital), 0);
assert.equal(switchedPosition(0, digital, intro), 0);
assert.equal(switchedPosition(60, legacy, digital), 60);

const { featuredSlugs, selectFeaturedRecordings } = load('src/modules/archive/featured.ts');
const records = featuredSlugs.map((slug, index) => ({ id: slug, slug, artist: { id: 'artist-' + index, slug: 'artist-' + index } }));
records.unshift({ id: 'extra', slug: 'extra', artist: records[0].artist });
const selected = selectFeaturedRecordings(records);
assert.deepEqual(Array.from(selected, row => row.slug), Array.from(featuredSlugs));
assert.equal(new Set(selected.map(row => row.artist.slug)).size, 4);
assert.equal(selectFeaturedRecordings([]).length, 0);
console.log('Player intro offsets and four-artist homepage selection passed.');
