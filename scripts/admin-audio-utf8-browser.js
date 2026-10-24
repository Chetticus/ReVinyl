/* Preserve Unicode filenames through multipart parsers that default to Latin-1. */
(() => {
  const standardApi = revApi;
  globalThis.revApi = async (path, method = 'GET', data) => {
    if (!(method === 'POST' && /\/audio\/DIGITAL$/.test(path) && data instanceof FormData)) return standardApi(path, method, data);
    if (location.origin !== 'https://re-vinyl-iota.vercel.app') throw Error('Wrong app origin');
    const session = JSON.parse(localStorage.getItem('auth-storage') || '{}').state;
    if (!session?.token) throw Error('No admin session');
    const boundary = 'ReVinylImport' + crypto.randomUUID().replaceAll('-', '');
    const parts = [];
    for (const [name, value] of data.entries()) {
      parts.push(`--${boundary}\r\n`);
      if (value instanceof File) {
        const filename = encodeURIComponent(value.name).replace(/[!'()*]/g, char => '%' + char.charCodeAt(0).toString(16).toUpperCase());
        parts.push(`Content-Disposition: form-data; name="${name}"; filename="recording.mp3"; filename*=UTF-8''${filename}\r\nContent-Type: ${value.type || 'audio/mpeg'}\r\n\r\n`, value, '\r\n');
      } else parts.push(`Content-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`);
    }
    parts.push(`--${boundary}--\r\n`);
    const response = await fetch('https://nestjs-vinyl-heritage-production.up.railway.app' + path, {
      method, headers: { Authorization: 'Bearer ' + session.token, 'x-tenant-id': 'VINYL', 'Content-Type': 'multipart/form-data; boundary=' + boundary },
      body: new Blob(parts),
    });
    const body = await response.json();
    if (!response.ok) throw Error(JSON.stringify({ path, status: response.status, body }));
    return body;
  };
  revReport.filenameEncoding = 'RFC 5987 UTF-8 multipart filenames';
  globalThis.revRepairAudioFilenames = async () => {
    revReport.correctedAudio = [];
    for (const record of revPlan.records) {
      const match = revPlan.audio[record.slug]; if (!match) continue;
      const current = await revApi('/admin/archive/recordings/' + record.slug);
      const audio = current.audio.find(item => item.type === 'DIGITAL');
      if (!audio || audio.originalFilename === match.filename) continue;
      const file = revFiles.get(match.filename);
      if (!file || file.size !== match.size) throw Error('Selected source changed');
      const body = new FormData(); body.append('file', file); body.append('sourceNote', match.sourceNote); body.append('rightsNote', match.rightsNote);
      document.querySelector('#revinyl-import-status').textContent += '\nCorrecting filename: ' + record.slug;
      await revApi(`/admin/archive/recordings/${current.id}/audio/DIGITAL`, 'POST', body);
      const saved = await revApi('/admin/archive/recordings/' + record.slug);
      const updated = saved.audio.find(item => item.type === 'DIGITAL');
      if (updated.originalFilename !== match.filename || updated.fileSize !== file.size) throw Error('Audio filename/size repair did not reconcile: ' + record.slug);
      revReport.correctedAudio.push({ slug: record.slug, filename: match.filename });
      console.log('REVINYL_FILENAME_FIXED ' + record.slug);
    }
    console.log('REVINYL_FILENAME_REPAIR_COMPLETE ' + revReport.correctedAudio.length);
  };
  console.log('REVINYL_UTF8_UPLOAD_READY');
})();
