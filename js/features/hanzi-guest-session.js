/* 301.358: ephemeral, non-persistent visitor learning state. */
(()=>{
 'use strict';
 const rows=new Map(),completed=new Set();
 const copy=value=>JSON.parse(JSON.stringify(value));
 window.KP_HANZI_GUEST={
   checks:unit=>copy(rows.get(unit)||{}),
   update(unit,modify){const current=copy(rows.get(unit)||{});modify(current);rows.set(unit,current);window.dispatchEvent(new Event('kp-hanzi-guest-changed'));return copy(current)},
   complete(id){const fresh=!completed.has(id);completed.add(id);window.dispatchEvent(new Event('kp-hanzi-guest-changed'));return fresh},
   completed:()=>new Set(completed),
   clear(){rows.clear();completed.clear();window.dispatchEvent(new Event('kp-hanzi-guest-changed'))}
 };
})();
