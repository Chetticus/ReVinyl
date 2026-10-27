/* Narrow admin update: covers and VINYLIZED audio only. Session stays in the page. */
(() => {
  if (location.origin !== 'https://re-vinyl-iota.vercel.app') throw Error('Wrong origin');
  globalThis.vhReport = {before:[],covers:[],audio:[],errors:[]};
  globalThis.vhApi = async (path, method='GET', body) => {
    const token=JSON.parse(localStorage.getItem('auth-storage')||'{}').state?.token;
    if(!token) throw Error('Admin session missing');
    const response=await fetch('https://nestjs-vinyl-heritage-production.up.railway.app'+path,{method,headers:{Authorization:'Bearer '+token,'x-tenant-id':'VINYL'},body});
    const data=await response.json();if(!response.ok)throw Error(JSON.stringify({path,status:response.status,data}));return data;
  };
  document.getElementById('vh-panel')?.remove();
  const panel=document.createElement('section');panel.id='vh-panel';panel.style.cssText='position:fixed;inset:10px;z-index:2147483000;background:white;color:#222;padding:24px;overflow:auto;font:15px system-ui';
  const title=document.createElement('h1');title.textContent='Missing covers and 30% louder vinyl texture';
  const covers=document.createElement('input');covers.type='file';covers.multiple=true;covers.accept='.jpeg,.jpg,.png';covers.id='vh-covers';covers.setAttribute('aria-label','Select the four supplied cover files');
  const audio=document.createElement('input');audio.type='file';audio.multiple=true;audio.accept='.mp3';audio.id='vh-audio';audio.setAttribute('aria-label','Select the 28 louder crackle files');
  const log=document.createElement('pre');log.style.whiteSpace='pre-wrap';globalThis.vhLog=s=>{log.textContent+=s+'\n';console.log(s);};
  covers.onchange=()=>{globalThis.vhCovers=new Map([...covers.files].map(f=>[f.name,f]));vhLog('Covers selected: '+covers.files.length);};
  audio.onchange=()=>{globalThis.vhVinyl=new Map([...audio.files].map(f=>[f.name,f]));vhLog('Audio selected: '+audio.files.length);};
  panel.append(title,document.createTextNode('Covers: '),covers,document.createElement('hr'),document.createTextNode('Audio: '),audio,log);document.body.append(panel);
  globalThis.vhSnapshot=async()=>{const list=await vhApi('/admin/archive/recordings?perPage=100');if(list.data.length!==list.total)throw Error('Incomplete catalog');for(const r of list.data)vhReport.before.push(await vhApi('/admin/archive/recordings/'+r.slug));vhLog('Snapshot saved: '+vhReport.before.length);};
  const fingerprint=r=>JSON.stringify({...r,coverImage:null,audio:null,updatedAt:null});
  globalThis.vhApplyCovers=async()=>{
    const plan=[['khuc-hat-song-que-anh-tho-2005','KhucHatSongQue.jpeg'],['giac-mo-trua-thuy-chi-audio','ThuyChi.jpeg'],['chim-ngoi-bay-ve-audio','ThuyChi.jpeg'],['ru-doi-di-nhe-audio','TuanNgoc_2.jpeg'],['chieu-mot-minh-qua-pho-audio','TuanNgoc_1.jpeg'],['nho-mua-thu-ha-noi-audio',null]];
    if(vhCovers.size!==4)throw Error('Expected four cover files');
    for(const [slug,name] of plan){
      const before=await vhApi('/admin/archive/recordings/'+slug);if(before.coverImage)throw Error('Cover already exists: '+slug);
      let file=name?vhCovers.get(name):null;
      if(!name){const source=await vhApi('/admin/archive/recordings/dem-thay-ta-la-thac-do-tuan-ngoc-1995');const response=await fetch(source.coverImage);if(!response.ok)throw Error('Source cover unavailable');file=new File([await response.blob()],'dem-thay-ta-la-thac-do.jpg',{type:'image/jpeg'});}
      if(!file)throw Error('Missing cover file: '+name);
      const body=new FormData();body.append('file',file);await vhApi('/admin/archive/recordings/'+before.id+'/cover','POST',body);
      const after=await vhApi('/admin/archive/recordings/'+slug);
      if(!after.coverImage||fingerprint(before)!==fingerprint(after)||JSON.stringify(before.audio)!==JSON.stringify(after.audio))throw Error('Cover verification failed: '+slug);
      vhReport.covers.push({slug,filename:file.name,url:after.coverImage});vhLog('Cover verified: '+slug);
    }
    vhLog('COVERS_COMPLETE 6');
  };
  globalThis.vhUploadAudio=async()=>{
    if(vhManifest.records.length!==28||vhVinyl.size!==28)throw Error('Expected 28 audio files');
    for(let i=0;i<28;i++)if(vhVinyl.get((i+1)+'.mp3')?.size!==vhManifest.records[i].bytes)throw Error('File mismatch: '+i);
    let next=0;const failures=[];
    const worker=async()=>{while(next<28){const i=next++,item=vhManifest.records[i];try{
      const before=await vhApi('/admin/archive/recordings/'+item.slug);const digital=before.audio.find(a=>a.type==='DIGITAL');const prior=before.audio.find(a=>a.type==='VINYLIZED');
      if(prior?.originalFilename===item.filename&&prior?.fileSize===item.bytes){vhLog('Already uploaded: '+item.slug);continue;}
      if(!digital)throw Error('Digital missing');
      const body=new FormData();body.append('file',new File([vhVinyl.get((i+1)+'.mp3')],item.filename,{type:'audio/mpeg'}));body.append('sourceNote','Vinylize DSP with a 4.5-second crackle/pop intro. Recorded surface texture increased 30% (gain 0.27 to 0.351) during the intro and music; music gain unchanged.');body.append('rightsNote',prior?.rightsNote||digital.rightsNote||'');
      vhLog('Uploading '+item.slug);await vhApi('/admin/archive/recordings/'+before.id+'/audio/VINYLIZED','POST',body);
      const after=await vhApi('/admin/archive/recordings/'+item.slug);const asset=after.audio.find(a=>a.type==='VINYLIZED');
      if(asset?.originalFilename!==item.filename||asset?.fileSize!==item.bytes||fingerprint(before)!==fingerprint(after)||before.coverImage!==after.coverImage||JSON.stringify(digital)!==JSON.stringify(after.audio.find(a=>a.type==='DIGITAL')))throw Error('Audio verification failed');
      vhReport.audio.push({slug:item.slug,...asset});vhLog('Audio verified: '+item.slug);
    }catch(e){failures.push({slug:item.slug,error:String(e)});vhLog('ERROR '+item.slug+' '+e);}}};
    await Promise.all([worker(),worker(),worker()]);vhReport.errors.push(...failures);vhLog('AUDIO_COMPLETE '+vhReport.audio.length+' errors '+failures.length);
  };
  vhLog('Ready. No uploads started.');
})();
