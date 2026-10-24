/* Run in the authorized admin page. The active session never leaves the page. */
(() => {
  if (location.origin !== 'https://re-vinyl-iota.vercel.app') throw Error('Wrong app origin');
  globalThis.vhReport = { startedAt: new Date().toISOString(), before: [], changes: [], uploaded: [], errors: [] };
  globalThis.vhApi = async (path, method = 'GET', data) => {
    if (location.origin !== 'https://re-vinyl-iota.vercel.app') throw Error('Wrong app origin');
    const session = JSON.parse(localStorage.getItem('auth-storage') || '{}').state;
    if (!session?.token) throw Error('No active admin session');
    const headers = { Authorization: 'Bearer ' + session.token, 'x-tenant-id': 'VINYL' };
    let body;
    if (data instanceof FormData) body = data;
    else if (data) { headers['Content-Type'] = 'application/json'; body = JSON.stringify(data); }
    const response = await fetch('https://nestjs-vinyl-heritage-production.up.railway.app' + path, { method, headers, body });
    const result = response.status === 204 ? null : await response.json();
    if (!response.ok) throw Error(JSON.stringify({ path, status: response.status, result }));
    return result;
  };
  const panel = document.createElement('section'); panel.id = 'vh-panel';
  panel.style.cssText = 'position:fixed;inset:10px;z-index:2147483000;background:white;color:#222;padding:24px;overflow:auto;font:15px system-ui';
  const title = document.createElement('h1'); title.textContent = 'Vinylize processing and artwork corrections';
  const cover = document.createElement('input'); cover.type = 'file'; cover.multiple = true; cover.accept = '.png'; cover.id = 'vh-covers'; cover.setAttribute('aria-label', 'Select three supplied cover images');
  const vinyl = document.createElement('input'); vinyl.type = 'file'; vinyl.multiple = true; vinyl.accept = '.mp3'; vinyl.id = 'vh-vinyl'; vinyl.setAttribute('aria-label', 'Select generated Vinylized MP3 files');
  const status = document.createElement('pre'); status.style.whiteSpace = 'pre-wrap';
  globalThis.vhLog = message => { status.textContent += message + '\n'; console.log('VH_PROGRESS ' + message); };
  cover.onchange = () => { globalThis.vhCovers = new Map([...cover.files].map(file => [file.name, file])); vhLog('Selected covers: ' + cover.files.length); };
  vinyl.onchange = () => { globalThis.vhVinyl = new Map([...vinyl.files].map(file => [file.name, file])); vhLog('Selected vinyl files: ' + vinyl.files.length); };
  panel.append(title, document.createTextNode('Cover images: '), cover, document.createElement('hr'), document.createTextNode('Generated audio: '), vinyl, status); document.body.append(panel);
  globalThis.vhRun = async operation => { try { await operation(); } catch(error) { vhReport.errors.push(String(error)); vhLog('STOPPED: ' + error); } };
  globalThis.vhList = async () => {
    const first = await vhApi('/admin/archive/recordings?page=1&perPage=100');
    const rows = [...first.data];
    for(let page = 2; page <= first.totalPages; page++) rows.push(...(await vhApi(`/admin/archive/recordings?page=${page}&perPage=100`)).data);
    if(rows.length !== first.total) throw Error('Incomplete catalog');
    return rows;
  };
  globalThis.vhSnapshot = async () => {
    const list = await vhList();
    vhReport.before = [];
    for(const record of list) vhReport.before.push(await vhApi('/admin/archive/recordings/' + record.slug));
    globalThis.vhLookups = await vhApi('/archive/lookups');
    vhLog('Snapshot complete: ' + list.length + ' recordings');
    console.log('VH_CATALOG ' + JSON.stringify(list.map(r => ({ slug: r.slug, status: r.status, artist: r.artist?.name, coverImage: r.coverImage }))));
  };
  globalThis.vhPayload = record => ({
    slug: record.slug, year: record.year ?? null, status: record.status, coverImage: record.coverImage || '',
    ...Object.fromEntries(['artist','album','era','genre','region'].map(key => [key + 'Id', record[key]?.id ?? null])),
    translations: record.translations.map(({locale,title,alternativeTitle,shortSummary,historicalContext,culturalContext,lyricsMeaning,lyricsNotes,whatToListenFor,preservationValue,fullLyrics,lyricsRightsStatus}) => ({locale,title,alternativeTitle,shortSummary,historicalContext,culturalContext,lyricsMeaning,lyricsNotes,whatToListenFor,preservationValue,fullLyrics,lyricsRightsStatus})),
    instruments: record.instruments.map(item => ({ instrumentId:item.instrument.id, roleVi:item.roleVi, roleEn:item.roleEn, confidence:item.confidence })),
    references: record.references.map(item => ({ ...Object.fromEntries(['title','url','type','publisher','publishedYear','notes'].map(key => [key,item.reference[key]])), verificationStatus:item.verificationStatus })),
  });
  globalThis.vhSave = async (slug, changes) => {
    const before = await vhApi('/admin/archive/recordings/' + slug);
    await vhApi('/admin/archive/recordings/' + before.id, 'PUT', { ...vhPayload(before), ...changes });
    const after = await vhApi('/admin/archive/recordings/' + slug);
    for(const [key, value] of Object.entries(changes)) {
      const actual = key.endsWith('Id') ? after[key.slice(0,-2)]?.id ?? null : after[key];
      if(actual !== value) throw Error('Update did not reconcile: ' + slug + '/' + key);
    }
    if(after.status !== before.status) throw Error('Publication status changed');
    vhReport.changes.push({slug, changes}); vhLog('Updated ' + slug);
    return after;
  };
  globalThis.vhApplyArtwork = async () => {
    const uploads = [
      ['khuc-hat-song-que-anh-tho-2005','anh-tho-tinh-em.png'],
      ['giac-mo-trua-thuy-chi-audio','thuy-chi.png'],
      ['ru-doi-di-nhe-audio','tuan-ngoc-ru-doi-di-nhe.png'],
    ];
    for(const [slug, filename] of uploads) {
      const file = vhCovers.get(filename); if(!file) throw Error('Missing cover: ' + filename);
      const record = await vhApi('/admin/archive/recordings/' + slug);
      const form = new FormData(); form.append('file', file);
      await vhApi('/admin/archive/recordings/' + record.id + '/cover','POST',form);
      const saved = await vhApi('/admin/archive/recordings/' + slug);
      if(!saved.coverImage || saved.coverImage === record.coverImage) throw Error('Cover upload did not change record');
      vhReport.changes.push({slug,coverImage:saved.coverImage,filename}); vhLog('Cover saved: ' + slug);
    }
    for(const [target, source] of [
      ['nho-mua-thu-ha-noi-audio','dem-thay-ta-la-thac-do-tuan-ngoc-1995'],
      ['chieu-mot-minh-qua-pho-audio','ao-lua-ha-dong-tuan-ngoc-1991'],
      ['chim-ngoi-bay-ve-audio','giac-mo-trua-thuy-chi-audio'],
    ]) {
      const record = await vhApi('/admin/archive/recordings/' + source);
      if(!record.coverImage) throw Error('Source cover missing: ' + source);
      await vhSave(target, {coverImage: record.coverImage});
    }
    const thuyChi = vhLookups.artists.find(a=>a.slug==='thuy-chi');
    const tuanNgoc = vhLookups.artists.find(a=>a.slug==='tuan-ngoc');
    if(!thuyChi || !tuanNgoc) throw Error('Artist lookup missing');
    await vhSave('chim-ngoi-bay-ve-audio',{artistId:thuyChi.id});
    await vhSave('giac-mo-trua-thuy-chi-audio',{artistId:thuyChi.id});
    await vhSave('ru-doi-di-nhe-audio',{artistId:tuanNgoc.id});
    vhLog('All artwork and artist corrections complete.');
  };
  globalThis.vhUploadVinyl = async () => {
    for(const item of vhManifest.records) {
      const record = await vhApi('/admin/archive/recordings/' + item.slug);
      if(record.audio.some(a=>a.type==='VINYLIZED'&&a.originalFilename===item.filename&&a.fileSize===item.bytes)) { vhLog('Already uploaded: '+item.slug); continue; }
      const file = vhVinyl.get(item.filename);
      if(!file || file.size !== item.bytes) throw Error('Missing/changed render: '+item.filename);
      const body = new FormData(); body.append('file', file);
      body.append('sourceNote','Derived from the supplied DIGITAL source using Vinylize DSP, 2026-10-24 worn-favorite preset: RIAA, stylus tracing, groove compliance, wow/flutter, crosstalk, recorded surface texture. Full length; no added lead-in.');
      body.append('rightsNote',record.audio.find(a=>a.type==='DIGITAL')?.rightsNote || 'Review the source recording rights before publication.');
      vhLog('Uploading VINYLIZED: '+item.slug);
      await vhApi(`/admin/archive/recordings/${record.id}/audio/VINYLIZED`,'POST',body);
      const saved=await vhApi('/admin/archive/recordings/'+item.slug);
      const audio=saved.audio.find(a=>a.type==='VINYLIZED');
      if(audio?.originalFilename!==item.filename||audio?.fileSize!==item.bytes||!audio?.url) throw Error('Audio verification failed: '+item.slug);
      vhReport.uploaded.push({slug:item.slug,...audio}); vhLog('Vinyl saved: '+item.slug);
    }
    vhLog('VINYL_UPLOAD_COMPLETE');
  };
  globalThis.vhExport = async () => {
    vhReport.after=[];
    for(const record of await vhList()) vhReport.after.push(await vhApi('/admin/archive/recordings/'+record.slug));
    vhReport.completedAt=new Date().toISOString();
    const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([JSON.stringify(vhReport,null,2)],{type:'application/json'}));a.download='ReVinyl-vinylize-update-report-2026-10-24.json';a.click();
    vhLog('AUDIT_EXPORTED');
  };
  vhLog('Helpers ready. No writes started.');
})();
