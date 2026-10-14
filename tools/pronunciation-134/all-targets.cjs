const QA_OUT=process.env.KP_QA_OUTPUT||require('path').join(require('os').tmpdir(),'koepanda-134-qa');require('fs').mkdirSync(QA_OUT,{recursive:true});
const {chromium}=require('playwright'),http=require('http'),fs=require('fs'),path=require('path'),assert=require('assert/strict');
(async()=>{
 const server=http.createServer((req,res)=>{let file=path.resolve('.','.'+decodeURIComponent(req.url.split('?')[0]));if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file+='/index.html';if(!fs.existsSync(file)){res.writeHead(404);res.end();return}res.setHeader('Content-Type',file.endsWith('.html')?'text/html':file.endsWith('.css')?'text/css':file.endsWith('.js')?'application/javascript':file.endsWith('.png')?'image/png':file.endsWith('.wav')?'audio/wav':'application/octet-stream');res.end(fs.readFileSync(file))});
 await new Promise(r=>server.listen(8771,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:process.env.KP_BROWSER_EXECUTABLE||chromium.executablePath(),args:['--no-sandbox','--no-zygote','--single-process','--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream']});
 const p=await browser.newPage({viewport:{width:393,height:852},isMobile:true});const errors=[],missing=[];let checks=0;
 p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.url().startsWith('http://127.0.0.1')&&r.status()>=400)missing.push(r.url())});
 await p.addInitScript(()=>{localStorage.setItem('koepandaDevUnlock12','1');const m=Object.fromEntries(['a','o','e','i','u','ü'].map(k=>[k,{passed:true,score:4,total:4}]));localStorage.setItem('koepandaVowelMastery69',JSON.stringify(m));});
 async function enter(id='P13') {await p.locator('#kidsEntryButton').click();await p.locator('[data-stage-id="P9-P13"] .pinyin-world-open').click();await p.locator('[data-unit-id="'+id+'"]').click()}



 const models=JSON.parse(fs.readFileSync(path.join(__dirname,'registry.json'))),units=[['P3','initials',['b','p','m','f']],['P4','dtnl',['d','t','n','l']],['P5','gkh',['g','k','h']],['P6','jqx',['j','q','x']],['P7','zhr',['zh','ch','sh','r']],['P8','zcs',['z','c','s']],['P9','cpv',['ai','ei','ui']],['P10','cpo',['ao','ou','iu']],['P11','cpn',['ie','üe','er']],['P12','nsv',['an','en','in','un','ün']],['P13','bnv',['ang','eng','ing','ong']]];
 let tts=[];await p.route('https://worker-xiaoshuang.wangjinyu00.workers.dev',route=>{tts.push(JSON.parse(route.request().postData()||'{}').text);return route.fulfill({status:403,body:'Blocked for offline course QA'})});
 await p.addInitScript(()=>{window.media=[];window.deviceSpeech=[];const original=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){media.push(this);return original.call(this)};speechSynthesis.speak=u=>{deviceSpeech.push(u.text);throw new Error('Unexpected device speech')};});
 async function boot(){await p.goto('http://127.0.0.1:8771/',{waitUntil:'domcontentloaded'});await p.locator('#kidsEntryButton').click()}
 async function open(id){const stage=Number(id.slice(1))<9?'P3-P8':'P9-P13';await p.locator('[data-stage-id="'+stage+'"] .pinyin-world-open').click();await p.locator('[data-unit-id="'+id+'"]').click()}
 function card(prefix,k){return prefix==='initials'||prefix==='dtnl'?p.locator('.'+prefix+'-letter-card[data-letter="'+k+'"]'):p.locator('#'+prefix+'LetterGrid [data-'+prefix+'-letter="'+k+'"]')}
 function listen(prefix){return prefix==='initials'?p.locator('#initialsToneButtons button'):prefix==='dtnl'?p.locator('#dtnlActions button'):p.locator('#'+prefix+'Model')}
 async function select(prefix,k){if(prefix==='nsv'||prefix==='bnv'){const group=(prefix==='nsv'?['an','en','in']:['ang','eng']).includes(k)?'plain':'rounded';await p.locator('.'+prefix+'-teaching [data-'+prefix+'-group="'+group+'"]').click()}await card(prefix,k).click()}
 async function end(){await p.waitForFunction(()=>media.length&&media.at(-1).ended)}
 const summary=[];
 for(const [id,prefix,keys] of units){await boot();await open(id);
  for(const k of keys){await select(prefix,k);await listen(prefix).click();await end();const state=await p.evaluate(()=>({src:media.at(-1).src,ended:media.at(-1).ended,muted:media.at(-1).muted,volume:media.at(-1).volume,overflow:document.documentElement.scrollWidth>innerWidth,text:document.querySelector('.is-roadmap-lesson-active').textContent}));assert.ok(state.src.includes(models[k].audio.split('?')[0].slice(2)));assert.equal(state.ended,true);assert.equal(state.muted,false);assert.equal(state.volume,1);assert.equal(state.overflow,false);assert.ok(!state.text.includes('undefined')&&!state.text.includes('NaN'));checks++;
   await listen(prefix).click();await end();assert.equal(await p.evaluate(()=>media.at(-1).muted),false);checks++;
   const studio=p.locator('.is-roadmap-lesson-active .kp134-studio');assert.equal(await studio.getAttribute('data-kp134-key'),k);
   await studio.locator('[data-kp134-view="position"]').click();assert.equal(await studio.locator('.kp134-position-view').isVisible(),true);await studio.screenshot({path:QA_OUT+'/'+k+'-position.png'});await studio.locator('[data-kp134-view="front"]').click();await studio.screenshot({path:QA_OUT+'/'+k+'-front.png'});checks++;
   const poses=await studio.locator('.kp134-front').evaluate(svg=>{svg.pauseAnimations();return [0,.5,1,1.5,2,2.5,3,4].map(t=>{svg.setCurrentTime(t);const p=svg.querySelector('.kp134-opening'),b=p.getBBox(),len=p.getTotalLength();return {t,b:{x:b.x,y:b.y,w:b.width,h:b.height},pts:Array.from({length:80},(_,i)=>{const v=p.getPointAtLength(i*len/80);return [v.x,v.y]})}})});
   function crosses(a,b,c,d){const o=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);return o(a,b,c)*o(a,b,d)<-1e-8&&o(c,d,a)*o(c,d,b)<-1e-8}
   for(const v of poses){assert.ok(v.b.x>=40&&v.b.w<=80&&v.b.h<=40&&v.b.y>=40);for(let a=0;a<80;a++)for(let b=a+2;b<80;b++){if(a===0&&b===79)continue;assert.ok(!crosses(v.pts[a],v.pts[(a+1)%80],v.pts[b],v.pts[(b+1)%80]),k+' oral opening self-cross')} }
   summary.push({key:k,first:true,replay:true,views:true,poses:poses.length,src:state.src});checks++;
  }
  console.log(id,'validated',keys.join(','));
 }
 // Vowels: all six, all four tones, from the real practice UI.
 for(const [id,keys] of [['P1',['a','o','e']],['P2',['i','u','ü']]]){
  for(const k of keys){await boot();await p.locator('[data-stage-id="P1-P2"] .pinyin-world-open').click();await p.locator('[data-unit-id="'+id+'"]').click();await p.locator('#kidsVowelGrid .kids-vowel-button[data-letter="'+k+'"]').click();
   const buttons=p.locator('#kidsVowelToneGrid .kids-vowel-tone-btn');assert.equal(await buttons.count(),4);
   for(let t=1;t<=4;t++){await buttons.nth(t-1).click();await end();const base=k==='i'?'yi':k==='u'?'wu':k==='ü'?'yu':k;assert.ok((await p.evaluate(()=>media.at(-1).src)).includes('/'+base+t+'.wav'));assert.equal(await buttons.nth(t-1).evaluate(b=>b.classList.contains('is-heard')),true);checks++}
   await p.locator('#kidsVowelMouth .kp134-studio').screenshot({path:QA_OUT+'/'+k+'-front.png'});await p.locator('#kidsVowelMouth [data-kp134-view="position"]').click();await p.locator('#kidsVowelMouth .kp134-studio').screenshot({path:QA_OUT+'/'+k+'-position.png'});summary.push({key:k,tones:4,views:true});checks++;
  }
 }
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);assert.deepEqual(await p.evaluate(()=>deviceSpeech),[]);assert.ok(tts.every(t=>t==='你好！'));fs.writeFileSync(QA_OUT+'/target-results.json',JSON.stringify({checks,summary,errors,missing,ttsStartupOnly:tts},null,2));await browser.close();server.close();console.log('PASS',checks,'all 45 targets, all 24 vowel tones, first/replay native recordings, both views and interpolation bounds/outline checks. Course did not depend on remote/device speech.');
})().catch(e=>{console.error(e);process.exit(1)});
