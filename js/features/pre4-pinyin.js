(()=>{'use strict';
 const map=window.KP_PRE4_PINYIN_DATA||{}, preferred=new Set(window.KP_PRE4_PINYIN_PREFERRED||[]);
 const han=c=>/^\p{Script=Han}$/u.test(c), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const chinese=s=>{s=String(s??'');return /\p{Script=Han}/u.test(s)&&!/[ぁ-ゟ゠-ヿ]/u.test(s)&&Array.from(s).filter(han).every(c=>map[c]);};
 function pairs(text){
  const a=Array.from(String(text??'')), out=[];
  for(let i=0;i<a.length;){
   if(!han(a[i])){out.push({c:a[i++],p:null});continue;}
   let word='';
   for(let n=Math.min(8,a.length-i);n>0;n--){const w=a.slice(i,i+n).join('');if(map[w]&&map[w].length===n){word=w;break;}}
   if(!word){out.push({c:a[i++],p:null});continue;}
   Array.from(word).forEach((c,j)=>out.push({c,p:map[word][j]}));i+=word.length;
  }
  // 一 / 不 before another tone: show the spoken reading in connected speech.
  const tone=p=>/[āēīōūǖ]/.test(p)?1:/[áéíóúǘ]/.test(p)?2:/[ǎěǐǒǔǚ]/.test(p)?3:/[àèìòùǜ]/.test(p)?4:0;
  for(let i=0;i<out.length-1;i++){
   const x=out[i],y=out[i+1],t=tone(y.p||'');
   if(x.c==='不'&&x.p==='bù'&&t===4)x.p='bú';
   if(x.c==='一'&&x.p==='yī'&&t&&out[i-1]?.c!=='第'&&!/[一二三四五六七八九十百千万零]/.test(y.c)&&out[i-1]?.c!== '星')x.p=t===4?'yí':'yì';
  }
  return out;
 }
 function html(text,aligned){return (aligned||pairs(text)).map(({c,p})=>p!==null?`<span class="pre4-ruby" lang="zh-CN" data-hanzi="${esc(c)}"><span class="pre4-syllable" aria-hidden="true">${esc(p)||'&#160;'}</span><span class="pre4-hanzi">${esc(c)}</span></span>`:(/[，。！？、；：,.!?;:]/.test(c)?`<span class="pre4-punct">${esc(c)}</span>`:esc(c))).join('');}
 // Mixed Japanese/Chinese targets are separated by an ideographic space in the station data.
 function target(text){const s=String(text??'');if(chinese(s))return html(s);const pos=s.lastIndexOf('　');if(pos>=0&&chinese(s.slice(pos+1)))return esc(s.slice(0,pos))+'<span class="pre4-target-zh">'+html(s.slice(pos+1))+'</span>';return esc(s);}
 function choice(text){return chinese(text)?html(text):esc(text);}
 // Never infer Japanese kanji readings from the Chinese dictionary. Only annotate explicitly Chinese full fields / quoted phrases known from course data.
 function explanation(text){return String(text??'').split('\n').map(line=>{
  if(chinese(line))return html(line);
  const i=line.indexOf('　');if(i>0&&chinese(line.slice(0,i)))return html(line.slice(0,i))+'　'+esc(line.slice(i+1));
  const j=line.indexOf('：');if(j>=0&&/^(あなたの答え|正しい順番|正しい答え|正しい簡体字|正解)$/.test(line.slice(0,j))&&chinese(line.slice(j+1)))return esc(line.slice(0,j+1))+html(line.slice(j+1));
  return esc(line).replace(/「([^」]+)」/g,(all,w)=>preferred.has(w)?'「'+html(w)+'」':all);
 }).join('<br>');}
 window.KP_PRE4_PINYIN={pairs,html,chinese,target,choice,explanation};
})();
