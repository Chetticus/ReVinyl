/* Runs in the signed-in ReVinyl admin tab. revApi and revPlan are supplied
   separately. Credentials remain inside the existing app session. */
(() => {
  if (location.origin !== 'https://re-vinyl-iota.vercel.app') throw Error('Wrong app origin');
  const report = globalThis.revReport = {
    source: revPlan.source, sourceSha256: revPlan.sourceSha256,
    startedAt: new Date().toISOString(), createdLookups: [], reusedLookups: [],
    updatedLookups: [], createdRecords: [], skippedRecords: [], uploadedAudio: [],
    skippedAudio: [], errors: [], verified: [], unresolvedAudio: revPlan.audioUnresolved,
    unmatchedFiles: revPlan.additionalRecords?.length ? [] : revPlan.unmatchedFiles,
    additionalRecords: revPlan.additionalRecords || [],
  };
  const panel = document.createElement('section');
  panel.id = 'revinyl-import-panel';
  panel.style.cssText = 'position:fixed;inset:10px;z-index:2147483000;background:#fff;color:#222;padding:24px;overflow:auto;font:15px system-ui';
  const heading = document.createElement('h1'); heading.textContent = `ReVinyl import — ${revPlan.records.length} draft records`;
  const note = document.createElement('p'); note.textContent = 'Select the MP3 files from D:\\ReVinyl_AudioFiles. Selecting files does not upload them.';
  const picker = document.createElement('input'); picker.type = 'file'; picker.multiple = true; picker.accept = '.mp3,audio/mpeg'; picker.id = 'revinyl-audio-picker'; picker.setAttribute('aria-label', 'Choose ReVinyl audio files');
  const status = document.createElement('pre'); status.id = 'revinyl-import-status'; status.style.cssText = 'white-space:pre-wrap;line-height:1.5';
  picker.onchange = () => { globalThis.revFiles = new Map([...picker.files].map(file => [file.name, file])); status.textContent = `${picker.files.length} files selected. No uploads started.`; };
  panel.append(heading, note, picker, status); document.body.append(panel);
  const log = message => { status.textContent += '\n' + message; console.log('REVINYL_PROGRESS ' + message); };
  const kinds = { artist: 'artists', album: 'albums', era: 'eras', genre: 'genres', region: 'regions' };
  globalThis.revRefresh = async () => {
    const first = await revApi('/admin/archive/recordings?page=1&perPage=100');
    const rows = [...first.data];
    for (let page = 2; page <= first.totalPages; page++) rows.push(...(await revApi(`/admin/archive/recordings?page=${page}&perPage=100`)).data);
    if (rows.length !== first.total) throw Error('Incomplete existing-record scan');
    globalThis.revExisting = rows;
    globalThis.revLookups = await revApi('/archive/lookups');
    return rows;
  };
  const norm = text => (text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  globalThis.revImportLookups = async () => {
    await revRefresh();
    for (const [kind, items] of Object.entries(revPlan.lookups)) {
      for (const item of items) {
        let found = revLookups[kind].find(existing => existing.slug === item.slug);
        if (!found) found = revLookups[kind].find(existing => norm(existing.name || existing.title) === norm(item.name));
        const payload = { name: item.name, slug: item.slug, ...(kind === 'eras' ? { startYear: item.startYear, endYear: item.endYear, translations: item.translations } : {}) };
        if (found) {
          if (kind === 'eras' && (found.startYear !== item.startYear || found.endYear !== item.endYear || item.translations.some(tr => {
            const old = found.translations?.find(t => t.locale === tr.locale);
            return !old || ['title', 'summary', 'musicalContext'].some(key => (old[key] || '') !== (tr[key] || ''));
          }))) {
            found = await revApi(`/admin/archive/lookups/${kind}/${found.id}`, 'PATCH', payload);
            report.updatedLookups.push({ kind, slug: item.slug, id: found.id });
          } else report.reusedLookups.push({ kind, slug: item.slug, id: found.id });
        } else {
          found = await revApi(`/admin/archive/lookups/${kind}`, 'POST', payload);
          report.createdLookups.push({ kind, slug: item.slug, id: found.id });
        }
        if (!found?.id) throw Error(`Missing lookup ID: ${kind}/${item.slug}`);
        item.systemId = found.id;
        log(`Category ready: ${kind}/${item.slug}`);
      }
    }
    log('All workbook categories mapped to system IDs.');
  };
  globalThis.revPayload = record => {
    const payload = {
      slug: record.slug, year: record.year, status: record.status,
      coverImage: record.coverImage, translations: record.translations,
      instruments: record.instruments.map(item => ({
        instrumentId: revPlan.lookups.instruments.find(i => i.slug === item.instrumentSlug)?.systemId,
        roleVi: item.roleVi, roleEn: item.roleEn, confidence: item.confidence,
      })), references: record.references,
    };
    for (const [field, slug] of Object.entries(record.lookupSlugs)) {
      payload[field + 'Id'] = revPlan.lookups[kinds[field]].find(item => item.slug === slug)?.systemId;
      if (!payload[field + 'Id']) throw Error(`Unresolved ${field}: ${slug}`);
    }
    if (payload.instruments.some(item => !item.instrumentId)) throw Error('Unresolved instrument');
    return payload;
  };
  globalThis.revImportRecords = async (start = 0, end = revPlan.records.length) => {
    await revRefresh();
    for (const record of revPlan.records.slice(start, end)) {
      const matches = revExisting.filter(old => old.slug === record.slug || (
        old.year === record.year && old.artist?.slug === record.lookupSlugs.artist && old.translations?.some(tr => norm(tr.title) === norm(record.translations[0].title))
      ));
      if (matches.length > 1) throw Error(`Ambiguous existing duplicate: ${record.slug}`);
      if (matches.length === 1) {
        record.systemId = matches[0].id;
        if (!report.createdRecords.some(item => item.id === record.systemId) && !report.skippedRecords.some(item => item.id === record.systemId)) report.skippedRecords.push({ slug: record.slug, id: record.systemId });
        log(`Existing record reused: ${record.slug}`); continue;
      }
      const created = await revApi('/admin/archive/recordings', 'POST', revPayload(record));
      if (!created?.id) throw Error(`Create returned no ID: ${record.slug}`);
      record.systemId = created.id; revExisting.push(created);
      report.createdRecords.push({ slug: record.slug, id: created.id });
      log(`Created draft: ${record.slug}`);
    }
    log(`Recording batch complete: ${start}–${end}.`);
  };
  globalThis.revUploadAudio = async () => {
    if (!revFiles?.size) throw Error('Select audio files first');
    for (const record of revPlan.records) {
      const match = revPlan.audio[record.slug]; if (!match) continue;
      const file = revFiles.get(match.filename);
      if (!file || file.size !== match.size) throw Error(`Selected file missing or changed: ${match.filename}`);
      const current = await revApi('/admin/archive/recordings/' + record.slug);
      const audio = current.audio?.find(item => item.type === 'DIGITAL');
      if (audio) {
        if (audio.originalFilename !== file.name) { report.skippedAudio.push({ slug: record.slug, reason: 'Existing DIGITAL asset preserved', filename: audio.originalFilename }); continue; }
        report.skippedAudio.push({ slug: record.slug, reason: 'Matching DIGITAL asset already present', filename: file.name }); continue;
      }
      const body = new FormData(); body.append('file', file); body.append('sourceNote', match.sourceNote); body.append('rightsNote', match.rightsNote);
      log(`Uploading DIGITAL audio: ${file.name}`);
      await revApi(`/admin/archive/recordings/${current.id}/audio/DIGITAL`, 'POST', body);
      report.uploadedAudio.push({ slug: record.slug, filename: file.name, bytes: file.size });
      log(`Audio saved: ${record.slug}`);
    }
    log('Audio upload batch complete.');
  };
  globalThis.revVerify = async () => {
    await revRefresh(); report.verified = [];
    for (const record of revPlan.records) {
      const found = revExisting.filter(item => item.slug === record.slug);
      if (found.length !== 1) throw Error(`Expected exactly one record: ${record.slug}`);
      const actual = await revApi('/admin/archive/recordings/' + record.slug);
      const issues = [];
      if (actual.status !== record.status) issues.push('status');
      if ((actual.year ?? null) !== (record.year ?? null)) issues.push('year');
      if ((actual.coverImage || '') !== (record.coverImage || '')) issues.push('coverImage');
      for (const [field, slug] of Object.entries(record.lookupSlugs)) if (actual[field]?.slug !== slug) issues.push(field);
      for (const expected of record.translations) {
        const tr = actual.translations?.find(item => item.locale === expected.locale);
        for (const [key, value] of Object.entries(expected)) if ((tr?.[key] || '') !== (value || '')) issues.push(`translation.${expected.locale}.${key}`);
      }
      if (actual.instruments?.length !== record.instruments.length) issues.push('instrument count');
      for (const expected of record.instruments) {
        const item = actual.instruments?.find(i => i.instrument.slug === expected.instrumentSlug);
        for (const key of ['roleVi', 'roleEn', 'confidence']) if ((item?.[key] ?? '') !== (expected[key] ?? '')) issues.push('instrument.' + expected.instrumentSlug + '.' + key);
      }
      if (actual.references?.length !== record.references.length) issues.push('reference count');
      for (const expected of record.references) {
        const item = actual.references?.find(i => i.reference.url === expected.url && i.reference.title === expected.title);
        for (const key of ['title', 'url', 'type', 'publisher', 'publishedYear', 'notes']) if ((item?.reference?.[key] ?? '') !== (expected[key] ?? '')) issues.push('reference.' + key);
        if (item?.verificationStatus !== expected.verificationStatus) issues.push('reference.verificationStatus');
      }
      const match = revPlan.audio[record.slug];
      if (match && !actual.audio?.some(item => item.type === 'DIGITAL' && item.originalFilename === match.filename && item.url)) issues.push('audio');
      if (match) {
        const asset = actual.audio?.find(item => item.type === 'DIGITAL');
        if (asset?.fileSize !== match.size) issues.push('audio.fileSize');
        if (asset?.mimeType !== 'audio/mpeg') issues.push('audio.mimeType');
        if (asset?.sourceNote !== match.sourceNote) issues.push('audio.sourceNote');
        if (asset?.rightsNote !== match.rightsNote) issues.push('audio.rightsNote');
      }
      report.verified.push({ slug: record.slug, id: actual.id, status: actual.status, translations: actual.translations.length, instruments: actual.instruments.length, references: actual.references.length, audio: actual.audio.map(item => ({ type: item.type, filename: item.originalFilename, url: item.url, fileSize: item.fileSize, mimeType: item.mimeType, sourceNote: item.sourceNote, rightsNote: item.rightsNote })), issues });
      log(`Verified ${record.slug}: ${issues.length ? issues.join(', ') : 'OK'}`);
    }
    report.completedAt = new Date().toISOString(); report.totalAfter = revExisting.length;
    report.existingBefore = revPreflight.records.data.map(item => ({ id: item.id, slug: item.slug, status: item.status }));
    report.originalRecordsPreserved = report.existingBefore.every(item => revExisting.some(current => current.id === item.id && current.slug === item.slug && current.status === item.status));
    report.lookupStateBefore = revPreflight.lookups;
    report.lookupStateAfter = revLookups;
    report.summary = {
      createdRecords: report.createdRecords.length,
      verifiedRecords: report.verified.length,
      draftRecords: report.verified.filter(item => item.status === 'DRAFT').length,
      audioFiles: report.verified.reduce((sum, item) => sum + item.audio.length, 0),
      fieldDifferences: report.verified.filter(item => item.issues.length).length,
      existingRecordsPreserved: report.originalRecordsPreserved,
      duplicateSlugs: report.verified.filter(item => revExisting.filter(current => current.slug === item.slug).length !== 1).map(item => item.slug),
    };
    console.log('REVINYL_REPORT ' + JSON.stringify(report));
    log(`Verification complete: ${report.verified.length} records; ${report.verified.filter(item => item.issues.length).length} with differences.`);
  };
  globalThis.revRun = async operation => { try { await operation(); } catch (error) { report.errors.push(error.message); log('STOPPED: ' + error.message); console.error('REVINYL_ERROR ' + error.message); } };
  log('Import helpers prepared. Nothing has been created or uploaded.');
})();
