/* Explicit user corrections; artwork values and publication statuses are preserved. */
globalThis.vhCleanup = async () => {
  const lookups=await vhApi('/archive/lookups');
  for(const [slug, artistSlug] of [
    ['chim-ngoi-bay-ve-audio','thuy-chi'],
    ['giac-mo-trua-thuy-chi-audio','thuy-chi'],
    ['ru-doi-di-nhe-audio','tuan-ngoc'],
  ]) {
    const before=await vhApi('/admin/archive/recordings/'+slug);
    const artist=lookups.artists.find(item=>item.slug===artistSlug);
    if(!artist)throw Error('Artist missing: '+artistSlug);
    if(before.artist?.id!==artist.id) {
      const payload={...vhPayload(before),coverImage:before.coverImage,artistId:artist.id};
      await vhApi('/admin/archive/recordings/'+before.id,'PUT',payload);
      const saved=await vhApi('/admin/archive/recordings/'+slug);
      if(saved.artist?.id!==artist.id||saved.coverImage!==before.coverImage||saved.status!==before.status)throw Error('Artist update failed: '+slug);
      vhReport.changes.push({slug,artistId:artist.id});
    }
    vhLog('Artist verified: '+slug+' / '+artistSlug);
  }
  const list=await vhList();
  const mock=list.find(item=>item.slug==='trong-com');
  if(mock) {
    if(mock.id!=='e4420b4d-e0cd-4937-8859-01a3c217b06b')throw Error('Mock record ID changed; stopping removal');
    await vhApi('/admin/archive/recordings/'+mock.id,'DELETE');
    if((await vhList()).some(item=>item.slug==='trong-com'))throw Error('Mock removal failed');
    vhReport.removedMock={id:mock.id,slug:mock.slug};
    vhLog('Removed user-identified mock: trong-com');
  }
  vhLog('CATALOG_CLEANUP_COMPLETE');
};
