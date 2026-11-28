/* Stroke medians from hanzi-writer-data, distributed under ARPHICPL.TXT. */
(() => {
  const distance = (a,b) => Math.hypot(a[0]-b[0], a[1]-b[1]);
  function samples(line) {
    const lengths = [0];
    for (let i=1;i<line.length;i++) lengths.push(lengths[i-1]+distance(line[i],line[i-1]));
    const total=lengths.at(-1);
    return Array.from({length:12},(_,i)=>{
      const at=total*i/11;
      let j=1;
      while(j<line.length-1 && lengths[j]<at) j++;
      const t=(at-lengths[j-1])/(lengths[j]-lengths[j-1]||1);
      return line[j-1].map((v,k)=>v+t*(line[j][k]-v));
    });
  }
  function normalized(lines) {
    const points=lines.flat();
    const x=points.map(p=>p[0]), y=points.map(p=>p[1]);
    const left=Math.min(...x), top=Math.min(...y);
    const width=Math.max(...x)-left, height=Math.max(...y)-top;
    const scale=Math.max(width,height,1);
    return lines.map(line=>samples(line).map(([x,y])=>[(x-left-width/2)/scale,(y-top-height/2)/scale]));
  }
  function matches(lines, model) {
    if(lines.length!==model.length || lines.some(s=>s.length<2)) return false;
    const points=lines.flat(), xs=points.map(p=>p[0]), ys=points.map(p=>p[1]);
    if(Math.max(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys))<45)return false;
    const reference=normalized(model), attempt=normalized(lines);
    const costs=attempt.map(stroke=>reference.map(target=>
      stroke.reduce((sum,p,j)=>sum+distance(p,target[j]),0)/stroke.length
    ));
    const errors=costs.map((row,i)=>row[i]);
    const fits=values=>Math.max(...values)<0.32 && values.reduce((a,b)=>a+b,0)/values.length<0.16;
    if(fits(errors)) return 'correct';
    const nearest=costs.map(row=>row.indexOf(Math.min(...row)));
    if(new Set(nearest).size===model.length && fits(costs.map((row,i)=>row[nearest[i]]))) return 'order';
    return false;
  }
  window.KP_HANDWRITE=(root,word,finish)=>{
    const symbols=Array.from(word);
    const isPunctuation=ch=>/^[，。？！、；：]$/u.test(ch);
    const chars=symbols.filter(ch=>!isPunctuation(ch));
    root.innerHTML='<div class="hw-word" aria-live="polite"></div><canvas class="hw-pad" width="400" height="400" aria-label="指で書くマス"></canvas><small aria-live="polite"></small><div class="hw-actions"><button type="button">一画戻す</button><button type="button">書き直す</button><button type="button">わからない</button></div>';
    root.classList.add('hw-root');
    const [slots,pad,status,actions]=root.children, [undo,clear,skip]=actions.children;
    const ctx=pad.getContext('2d');
    let index=0,lines=[],active=null,done=false;
    function render(){
      let letter=0;
      slots.replaceChildren(...symbols.flatMap(ch=>{
        if(isPunctuation(ch))return [ch];
        const position=letter++;
        if(position!==index)return [position<index?ch+' ':'□ '];
        const current=document.createElement('strong');
        current.textContent='□';
        current.style.borderBottom='3px solid currentColor';
        return [current,' '];
      }));
      ctx.clearRect(0,0,400,400);
      ctx.lineWidth=7;ctx.lineCap=ctx.lineJoin='round';ctx.strokeStyle='#215446';
      for(const stroke of lines){ctx.beginPath();ctx.moveTo(...stroke[0]);for(const p of stroke.slice(1))ctx.lineTo(...p);ctx.stroke();}
      undo.disabled=clear.disabled=!lines.length;
    }
    function hint(){status.textContent=(index+1)+'文字目を指で書こう';}
    function complete(ok){if(done)return;done=true;pad.hidden=actions.hidden=status.hidden=true;finish(ok,chars.slice(0,index).join(''));}
    function point(e){const r=pad.getBoundingClientRect();return [(e.clientX-r.left)*400/r.width,(e.clientY-r.top)*400/r.height];}
    pad.onpointerdown=e=>{
      if(done||active!==null||e.button!==0)return;
      active=e.pointerId;pad.setPointerCapture(active);lines.push([point(e)]);render();
    };
    pad.onpointermove=e=>{if(e.pointerId===active){lines.at(-1).push(point(e));render();}};
    pad.onpointercancel=e=>{if(e.pointerId===active){active=null;lines.pop();render();}};
    pad.onpointerup=e=>{
      if(active!==e.pointerId)return;
      active=null;lines.at(-1).push(point(e));
      const model=window.KP_WRITE_MEDIANS[chars[index]];
      const result=model && matches(lines,model);
      if(result){
        index++;lines=[];render();
        if(index===chars.length)complete(true);else {hint();if(result==='order')status.textContent='「'+chars[index-1]+'」を入力しました。筆順も確認しよう。'+status.textContent;}
      }else{
        render();
        if(model && lines.length>=model.length)status.textContent=(index+1)+'文字目の「'+chars[index]+'」を書いてみよう（'+model.length+'画）。';
      }
    };
    undo.onclick=()=>{lines.pop();hint();render();};clear.onclick=()=>{lines=[];hint();render();};
    skip.onclick=()=>complete(false);render();hint();
  };
})();
