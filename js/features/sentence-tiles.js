/* Shared sentence builder for touch, mouse and keyboard users. */
window.KP_SENTENCE_TILES = function ({words,bank,slots,choices,onChange}) {
  let values=Array(words.length).fill(null);
  let locked=false;
  function place(id,to){
    if(locked||to<0)return;
    const from=values.indexOf(id);
    if(from>=0)values[from]=values[to];
    values[to]=id;
    render();
  }
  function tile(label,id,index){
    const b=document.createElement('button');
    b.type='button';b.textContent=label;
    b.className=index<0?'ps-choice ps-order-choice':'ps-slot'+(id===null?' is-empty':'');
    if(index>=0)b.dataset.slot=index;
    b.disabled=locked||(index<0&&values.includes(id));
    b.setAttribute('aria-label',index<0?label:(index+1)+'番目 '+label);
    b.style.touchAction='none';
    let origin,drag=false;
    b.onpointerdown=e=>{
      if(id===null||e.button!==0)return;
      origin=[e.clientX,e.clientY];drag=false;b.setPointerCapture(e.pointerId);
    };
    b.onpointermove=e=>{
      if(!origin)return;
      if(Math.hypot(e.clientX-origin[0],e.clientY-origin[1])>5)drag=true;
      if(drag){b.style.transform='translate('+(e.clientX-origin[0])+'px,'+(e.clientY-origin[1])+'px)';b.style.position='relative';b.style.zIndex=3;}
    };
    b.onpointercancel=()=>{origin=null;drag=false;b.style.transform='';b.style.zIndex='';};
    b.onpointerup=e=>{
      if(!origin)return;
      origin=null;b.style.transform='';b.style.zIndex='';
      if(!drag)return;
      const drop=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-slot]');
      if(drop&&slots.contains(drop))place(id,Number(drop.dataset.slot));
    };
    b.onclick=()=>{
      if(drag){drag=false;return;}
      if(index<0)place(id,values.indexOf(null));
      else if(id!==null){values[index]=null;render();}
    };
    return b;
  }
  function render(){
    slots.replaceChildren(...values.map((id,i)=>tile(id===null?'＋':words[id],id,i)));
    choices.replaceChildren(...bank.map(id=>tile(words[id],id,-1)));
    onChange(values.slice());
  }
  render();
  return {lock(){locked=true;render();}};
};
