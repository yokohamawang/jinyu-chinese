/* Per-character pinyin ruby alignment: never silently guess on mismatch. */

(function(){
  const han = /\p{Script=Han}/u;
  function escapeText(v) {return String(v).replace(/[&<>"']/g, ch =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
  function makeRuby(text, reading){
    const syllables = reading.trim().split(/\s+/);
    const chars=[...text];
    const hanCount=chars.filter(ch=>han.test(ch)).length;
    if (hanCount!==syllables.length) return null; // Never silently misalign pinyin.
    let k=0;
    return chars.map(ch=>{
      if (han.test(ch)){
        const py=syllables[k++].replace(/[.,!?，。！？]/g,'');
        return '<ruby'+(py.length>=5?' class="long-reading"':'')+'><rb>'+escapeText(ch)+'</rb><rt>'+escapeText(py)+'</rt></ruby>';
      }
      if (/\s/.test(ch)) return '<span class="spacer"> </span>';
      return '<span class="punct">'+escapeText(ch)+'</span>';
    }).join('');
  }
  function updateAnnotations(){
    document.querySelectorAll('#app .zh').forEach(zh=>{
      const p=zh.nextElementSibling;
      if(!p || !p.classList.contains('py')) return;
      const ruby=makeRuby(zh.textContent.trim(),p.textContent.trim());
      if(!ruby) {console.warn('Pinyin alignment needs review',zh.textContent,p.textContent);return}
      zh.innerHTML=ruby;zh.classList.add('ruby-text');
      p.style.display='none';
    });
  }
  const container=document.getElementById('app');
  const observer=new MutationObserver(updateAnnotations);
  observer.observe(container,{childList:true,subtree:false});
  updateAnnotations();
})();

