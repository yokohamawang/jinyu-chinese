const fs=require('fs'),vm=require('vm'),assert=require('assert');
class El {
  constructor(tag='div',cls=''){this.tag=tag;this.className=cls;this.children=[];this.listeners={};this.attrs={};this.textContent='';this.hidden=false;this.disabled=false;this.dataset={};this.style={};this.classList={add:(...a)=>a.forEach(x=>this._set(x,true)),remove:(...a)=>a.forEach(x=>this._set(x,false)),toggle:(x,on)=>this._set(x,on),contains:x=>(this.className||'').split(/\s+/).includes(x)}}
  _set(x,on){let s=new Set((this.className||'').split(/\s+/).filter(Boolean));on?s.add(x):s.delete(x);this.className=[...s].join(' ')}
  set innerHTML(v){this._html=v;if(v.includes('kp202-three-count'))this._buildThree()} get innerHTML(){return this._html}
  _buildThree(){for(const [k,v] of Object.entries({'.kp202-three-count':new El(),'.kp202-question':new El(),'.kp202-blend-board':new El('div','kp202-blend-board'),'.kp202-three-tip':new El(),'.kp202-three-answers':new El(),'.kp202-sound':new El('button'),'.kp202-next':new El('button')}))this.map.set(k,v);let b=this.map.get('.kp202-blend-board');b.spans=[new El('span'),new El('span'),new El('span')];b.strong=new El('strong');b.querySelectorAll=s=>s==='span'?b.spans:[];b.querySelector=s=>s==='strong'?b.strong:null}
  appendChild(x){this.children.push(x);x.parent=this;return x} replaceChildren(...x){this.children=x}
  querySelector(s){if(this.map?.has(s))return this.map.get(s);if(this.tag==='section'&&s==='.kp202-three-game')return null;return null}
  querySelectorAll(s){return s==='button'?this.children.filter(x=>x.tag==='button'):[]}
  addEventListener(k,f){(this.listeners[k]||=[]).push(f)} setAttribute(k,v){this.attrs[k]=v}
  click(){if(this.disabled||this.hidden)return;for(const f of this.listeners.click||[])f({target:this})}
}
const host=new El(),audios=[],warms=[],events={};
class AudioMock{constructor(src){this.src=src;this.playCalls=0;this.onended=null;this.onerror=null;audios.push(this)}play(){this.playCalls++;return Promise.resolve()}pause(){}end(){this.onended?.()}error(){this.onerror?.()}}
const win={location:{origin:'https://koepanda.test'},setTimeout(fn){return setTimeout(fn,0)},clearTimeout,koepandaWarmP17Speech(text){warms.push(text);return Promise.resolve('blob:'+text)},addEventListener(k,f){(events[k]||=[]).push(f)},dispatchEvent(){}};
const document={createElement(t){let x=new El(t);if(t==='div')x.map=new Map();return x}};
const ctx={window:win,document,Audio:AudioMock,URL,localStorage:{setItem(){}},Event:function(n){this.type=n},console,Promise,setTimeout,clearTimeout};
const indexHtml=fs.readFileSync('index.html','utf8');assert(indexHtml.includes('01-features.js?v=10.108.221'),'TTS bridge cache is invalidated together with P17');assert(indexHtml.includes('06-demo1010740-pinyin-roadmap.js?v=10.108.221'),'P17 cache is invalidated');assert(indexHtml.includes('108-p17-three-part-style-217.css?v=10.108.221'),'P17 styles cache is invalidated');
const src=fs.readFileSync('js/06-demo1010740-pinyin-roadmap.js','utf8'),a=src.indexOf('    var three=make('),b=src.indexOf('    var neutral=',a);assert(a>=0&&b>a);
vm.runInNewContext(src.slice(a,b),{...ctx,make(id){let x=new El('section');x.id=id;x.map=new Map();host.appendChild(x);return x}});
const game=host.children[0].children[0],answers=game.querySelector('.kp202-three-answers'),next=game.querySelector('.kp202-next'),sound=game.querySelector('.kp202-sound'),count=game.querySelector('.kp202-three-count'),tip=game.querySelector('.kp202-three-tip');
const flush=async()=>{for(let i=0;i<8;i++)await Promise.resolve()};
async function endBoth(word,hasAnswer){let x=audios.at(-1);assert(x.src.startsWith('https://koepanda.test/assets/audio/p17-sequence/'));x.end();await flush();assert.equal(x.src,'blob:'+word,'same Audio element continues to warmed result');assert.equal(x.playCalls,2);x.end();assert.equal(next.disabled,!hasAnswer)}
async function run(){
 await flush();assert.equal(count.textContent,'1 / 4');assert.equal(next.hidden,true,'Next hidden before answer');assert.equal(audios.length,0,'hidden lesson does not autoplay');assert.equal(answers.children.length,3);
 const toneRE=/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/;assert(answers.children.every(x=>toneRE.test(x.textContent)),'all options include tone marks');
 events.koepandaP17Open.forEach(f=>f());assert.equal(audios.length,1,'opening the lesson auto-plays the pinyin');audios.at(-1).error();assert(tip.textContent.includes('読み込めませんでした'),'audio failure is shown');assert.equal(next.hidden,true,'audio failure does not allow skipping unanswered question');sound.click();assert.equal(audios.length,2,'replay recovers after an audio error');await endBoth('瓜',false);
 answers.children[1].click();assert.equal(answers.children.filter(x=>x.disabled).length,3,'answers lock after one choice');assert.equal(next.hidden,false);assert(tip.textContent.includes('正解は'));
 next.click();await flush();assert.equal(count.textContent,'2 / 4');assert.equal(audios.length,3,'Next starts the next question audio');await endBoth('火',false);
 const correct=[1,0,0];for(let round=1;round<4;round++){let idx=correct[round-1];answers.children[idx].click();assert.equal(next.disabled,false);assert.equal(next.textContent,round===3?'結果を見る':'次へ →');if(round===3){next.click();break}let before=audios.length;next.click();await flush();assert.equal(count.textContent,`${round+2} / 4`);assert.equal(audios.length,before+1,'each Next auto-plays next question');await endBoth(['瓜','火','家','桥'][round+1],false)}
 assert(count.textContent.includes('3 / 4'),'score counts wrong choice');assert.equal(next.textContent,'もう一度練習');next.click();await flush();assert.equal(count.textContent,'1 / 4');assert.equal(audios.length,6,'restart auto-plays again');
 assert.equal(new URL('https://koepanda.test/assets/audio/p17-sequence/gua.wav?v=10.108.221').searchParams.get('v'),'10.108.221');
 console.log(JSON.stringify({cacheBustAllRuntimeFiles:true,lessonOpenAutoplay:true,audioErrorRecovery:true,autoplayOnEveryNext:true,allOptionsToned:true,answersLockAfterPick:true,feedbackAndNextGating:true,resultButtonOnlyAfterAnswer:true,sameAudioPlayerForSequenceAndResult:true,score:'3/4',restartAutoplay:true,warmedWords:[...new Set(warms)].length}));
}
run().catch(e=>{console.error(e);process.exitCode=1});
