const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const ts = require('typescript');

// Exercise the actual adapter without needing a Next server or a live backend.
function loadTypeScript(relativePath) {
  const filename = path.resolve(__dirname, '..', relativePath);
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  });
  const module = { exports: {} };
  vm.runInNewContext(
    outputText,
    {
      module,
      exports: module.exports,
      require: createRequire(filename),
      process,
    },
    { filename }
  );
  return module.exports;
}

const adapter = loadTypeScript('src/modules/archive/workbook.ts');
const { telephoneHref, contactDraftHref } =
  loadTypeScript('src/lib/contact.ts');
const source = require('../src/data/archive-workbook.json');
const content = require('../src/data/website-content.json');
const list = adapter.listWorkbookRecordings;
const all = list({ perPage: 100 }).data;
assert.equal(all.length, 30);
assert.equal(new Set(all.map(item => item.slug)).size, 30);
assert.equal(
  all.reduce((sum, item) => sum + item.translations.length, 0),
  60
);
assert(all.every(item => item.status === 'DRAFT'));
assert(all.every(item => item.audio.length === 0));
assert(all.every(item => item.references.length > 0));
assert(all.every(item => !item.updatedAt));

for (const locale of ['vi', 'en']) {
  const pages = [1, 2, 3].flatMap(page => list({ locale, page }).data);
  assert.equal(new Set(pages.map(item => item.slug)).size, 30);
  assert(pages.every(item => item.translation.locale === locale));
  for (const record of pages) {
    const detail = adapter.workbookRecordingDetail(record.slug, locale);
    assert.equal(detail.translation.title, record.translation.title);
    assert(detail.related.every(item => item.slug !== detail.slug));
    assert.deepEqual(
      JSON.stringify(detail.references),
      JSON.stringify(
        source.recordings.find(item => item.slug === record.slug).references
      )
    );
  }
  const eras = adapter.workbookTimeline(locale);
  const timelineRecords = eras.flatMap(era => era.recordings);
  assert.equal(timelineRecords.length, 30);
  assert.equal(new Set(timelineRecords.map(item => item.slug)).size, 30);
  assert(eras.every(era => era.translation.locale === locale));
  assert.deepEqual(
    Array.from(eras, era => era.startYear),
    Array.from(eras, era => era.startYear).sort((a, b) => a - b)
  );
  assert.equal(
    content[locale].footer.contactEmail,
    content[locale].contact.emailValue
  );
  assert.equal(
    content[locale].footer.contactPhone,
    content[locale].contact.phoneValue
  );
  assert(
    content[locale].contact.addressValue.includes(
      locale === 'vi' ? '133 Xuân Thủy' : '133, Xuan Thuy'
    )
  );
}

for (const [filter, kind] of Object.entries({
  artist: 'artists',
  album: 'albums',
  era: 'eras',
  genre: 'genres',
  region: 'regions',
  instrument: 'instruments',
})) {
  for (const lookup of adapter.workbookLookups[kind]) {
    const result = list({ [filter]: lookup.slug, perPage: 100 });
    const expected = all.filter(record =>
      filter === 'instrument'
        ? record.instruments.some(item => item.instrument.slug === lookup.slug)
        : record[filter]?.slug === lookup.slug
    );
    assert.equal(result.total, expected.length, `${filter}=${lookup.slug}`);
    assert.equal(result.data.length, expected.length);
  }
  assert.equal(list({ [filter]: 'does-not-exist' }).total, 0);
}
assert(list({ search: 'Tuan Ngoc' }).total > 0);
assert.equal(
  list({ search: 'TUẤN NGỌC' }).total,
  list({ search: 'tuan ngoc' }).total
);
assert.equal(
  list({ search: 'khuc thuy du' }).data[0].slug,
  'khuc-thuy-du-tuan-ngoc-2000'
);
assert.equal(list({ page: 999 }).data.length, 0);
assert.equal(list({ search: 'no-such-recording' }).total, 0);
assert.equal(list({ status: 'PUBLISHED' }).total, 0);
assert.equal(list({ page: -1, perPage: 0 }).data.length, 12);
assert.equal(
  list({ genre: all[0].genre.slug, artist: all[0].artist.slug, perPage: 100 })
    .total,
  all.filter(
    item =>
      item.genre.slug === all[0].genre.slug &&
      item.artist.slug === all[0].artist.slug
  ).length
);
assert.throws(
  () => adapter.workbookRecordingDetail('no-such-recording', 'vi'),
  /not found/
);
assert.equal(telephoneHref(content.vi.contact.phoneValue), 'tel:+84836110909');
const draft = new URL(
  contactDraftHref(content.vi.contact.emailValue, {
    name: 'A & B',
    email: 'user@example.com',
    topic: 'Question & source?',
    message: 'Line one\nLine two',
  })
);
assert.equal(draft.searchParams.get('subject'), 'Question & source?');
assert(draft.searchParams.get('body').includes('A & B\nuser@example.com'));
console.log(
  'Workbook verification passed: all 30 details, 60 translations, category filters, search, pagination, timeline, contact links and email encoding.'
);
