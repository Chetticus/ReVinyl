/* Replacement uploader for the 4.5-second intro renditions; three bounded workers. */
(() => {
  globalThis.vhUploadIntro = async () => {
    if(vhManifest.records.length !== 28 || vhVinyl.size < 28) throw Error('Incomplete file selection');
    const tasks = vhManifest.records;
    for(let i=0;i<tasks.length;i++) {
      const item=tasks[i], source=vhVinyl.get(String(i+1)+'.mp3');
      if(!source || source.size!==item.bytes) throw Error('Selected intro file mismatch: '+item.slug);
      vhVinyl.set(item.filename,new File([source],item.filename,{type:'audio/mpeg'}));
    }
    let next=0;
    const failures=[];
    const worker=async()=>{
      while(next<tasks.length) {
        const item=tasks[next++];
        try {
          const record=await vhApi('/admin/archive/recordings/'+item.slug);
          const existing=record.audio.find(a=>a.type==='VINYLIZED');
          if(existing?.originalFilename===item.filename&&existing?.fileSize===item.bytes) { vhLog('Intro already saved: '+item.slug);continue; }
          const digital=record.audio.find(a=>a.type==='DIGITAL');
          if(!digital) throw Error('Missing Digital original');
          const body=new FormData();body.append('file',vhVinyl.get(item.filename));
          body.append('sourceNote','Vinylize worn-favorite DSP with a 4.5-second crackle/pop lead-in from its recorded surface texture. The complete music follows at offset 4.5 seconds.');
          body.append('rightsNote',digital.rightsNote||'Review source recording rights before publication.');
          vhLog('Uploading intro: '+item.slug);
          await vhApi(`/admin/archive/recordings/${record.id}/audio/VINYLIZED`,'POST',body);
          const saved=await vhApi('/admin/archive/recordings/'+item.slug);
          const asset=saved.audio.find(a=>a.type==='VINYLIZED');
          const original=saved.audio.find(a=>a.type==='DIGITAL');
          if(asset?.originalFilename!==item.filename||asset?.fileSize!==item.bytes||!asset?.url) throw Error('Intro read-back mismatch');
          if(original?.url!==digital.url||original?.fileSize!==digital.fileSize||saved.status!==record.status) throw Error('Original audio/status changed');
          vhReport.uploaded.push({slug:item.slug,...asset});vhLog('Intro saved: '+item.slug);
        } catch(error) { failures.push({slug:item.slug,error:String(error)});vhLog('Intro failed: '+item.slug+' '+error); }
      }
    };
    await Promise.all([worker(),worker(),worker()]);
    vhReport.introFailures=failures;
    if(failures.length) throw Error('Intro failures: '+JSON.stringify(failures));
    vhLog('VINYL_INTRO_UPLOAD_COMPLETE 28');
  };
  vhLog('Intro uploader ready. No uploads started.');
})();
