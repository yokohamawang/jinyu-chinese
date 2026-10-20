const fs=require('fs'),path=require('path'),assert=require('assert');
const html=fs.readFileSync('index.html','utf8');
assert(html.includes('33-two-spelling-p16-192.js?v=10.108.229'));
assert(html.includes('06-demo1010740-pinyin-roadmap.js?v=10.108.229'));
assert(html.includes('113-p16-p17-audio-cue-polish-229.css?v=10.108.229'));
const p16=fs.readFileSync('js/33-two-spelling-p16-192.js','utf8');
assert(p16.includes('p16-mnemonic-sprite-211.png'));
assert(p16.includes('Math.floor(current/4)*100/3'));
assert(!p16.includes('p16-word-cues'));
const sprite='assets/pinyin/p16-mnemonic-sprite-211.png';assert(fs.existsSync(sprite),'P16 mnemonic sprite must be included');
const p17=fs.readFileSync('js/06-demo1010740-pinyin-roadmap.js','utf8');
assert(p17.includes('kp223-cue-art'));assert(p17.includes("p17-word-cues/'+q.audioKey+'.svg?v=10.108.229"));
for(const name of ['gua','huo','jia','qiao']){
 const svg=fs.readFileSync(path.join('assets/pinyin/p17-word-cues',name+'.svg'),'utf8');
 assert(svg.includes('<svg')&&!/<text\b/.test(svg),name+' artwork must be pictorial, not a text placeholder');
 assert((svg.match(/<path\b/g)||[]).length>=2,name+' artwork has insufficient illustration paths');
}
console.log(JSON.stringify({cacheVersion:'10.108.229',p16:'original 4x4 mnemonic illustration sprite restored',p17:'4 pictorial SVG cue assets present and wired',assets:true}));
