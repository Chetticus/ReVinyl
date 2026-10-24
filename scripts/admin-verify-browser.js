globalThis.revVerify = async () => { const report=revReport; const log=message=>{document.querySelector('#revinyl-import-status').textContent+='\n'+message;console.log('REVINYL_PROGRESS '+message);};
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
globalThis.revExportReport=()=>{if(!revReport.completedAt||revReport.summary.fieldDifferences)throw Error('Verification not complete');revReport.downloadFilename='ReVinyl-admin-import-report-2026-10-23-'+Date.now()+'.json';const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(revReport,null,2)],{type:'application/json'}));a.download=revReport.downloadFilename;document.body.append(a);a.click();a.remove();console.log('REVINYL_REPORT_DOWNLOADED '+revReport.downloadFilename);};console.log('REVINYL_VERIFICATION_READY');