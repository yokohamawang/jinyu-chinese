/* DEMO 10.108.12 — hidden developer test mode.
   Five taps on the course title opens the panel. The stored switch only bypasses lesson locks;
   it does not mark lessons complete or alter scoring. */
(function(){
  var KEY='koepandaDevUnlock12';
  var taps=0,timer=null,panel=null,badge=null;
  function enabled(){try{return localStorage.getItem(KEY)==='1'}catch(e){return false}}
  function notify(){try{window.dispatchEvent(new CustomEvent('koepandaDevModeChanged',{detail:{unlock:enabled()}}))}catch(e){}}
  function setEnabled(on){try{on?localStorage.setItem(KEY,'1'):localStorage.removeItem(KEY)}catch(e){} sync();notify()}
  window.koepandaDevUnlockEnabled=enabled;
  window.koepandaSetDevUnlock=setEnabled;

  function makeButton(text,cls,fn){var b=document.createElement('button');b.type='button';b.className=cls||'';b.textContent=text;b.addEventListener('click',fn);return b}
  function closePanel(){if(panel)panel.hidden=true}
  function sync(){
    if(badge)badge.hidden=!enabled();
    if(!panel)return;
    var state=panel.querySelector('[data-dev-state]'); if(state){state.textContent=enabled()?'全部解锁：ON':'全部解锁：OFF';state.classList.toggle('is-on',enabled())}
    var toggle=panel.querySelector('[data-dev-toggle]'); if(toggle)toggle.textContent=enabled()?'恢复正常锁定':'全部解锁';
  }
  function resetProgress(){
    if(!confirm('学习进度会被清空，但测试模式设置会保留。确定重置吗？'))return;
    try{
      ['koepandaVowelProgress54','koepandaVowelMastery69','koepandaInitialP3Complete','koepandaInitialP4Complete'].forEach(function(k){localStorage.removeItem(k)});
      Object.keys(localStorage).forEach(function(k){if(/^koepanda.*(Progress|Mastery|Learning|Daily)/i.test(k)&&k!==KEY)localStorage.removeItem(k)});
    }catch(e){}
    location.reload();
  }
  function build(){
    if(document.getElementById('koepandaDevPanel'))return;
    badge=makeButton('TEST','koepanda-dev-badge',function(){panel.hidden=false;sync()});badge.id='koepandaDevBadge';badge.hidden=!enabled();document.body.appendChild(badge);
    panel=document.createElement('section');panel.id='koepandaDevPanel';panel.className='koepanda-dev-panel';panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-label','开发测试模式');
    var head=document.createElement('div');head.className='koepanda-dev-head';head.innerHTML='<div><b>开发测试模式</b><small>只绕过课程锁，不会自动判定完成</small></div>';
    head.appendChild(makeButton('×','koepanda-dev-close',closePanel)); panel.appendChild(head);
    var state=document.createElement('div');state.className='koepanda-dev-state';state.dataset.devState='1';panel.appendChild(state);
    var toggle=makeButton('全部解锁','koepanda-dev-primary',function(){setEnabled(!enabled())});toggle.dataset.devToggle='1';panel.appendChild(toggle);
    panel.appendChild(makeButton('重置学习进度','koepanda-dev-secondary',resetProgress));
    var hint=document.createElement('p');hint.className='koepanda-dev-hint';hint.textContent='以后在「音のぼうけん」标题上连续点 5 次，可再次打开这里。';panel.appendChild(hint);
    document.body.appendChild(panel);sync();
  }
  function bindSecret(){
    var title=document.getElementById('kidsCourseTitle');if(!title)return;
    title.addEventListener('click',function(){
      taps++; clearTimeout(timer); timer=setTimeout(function(){taps=0},1200);
      if(taps>=5){taps=0;clearTimeout(timer);panel.hidden=false;sync()}
    });
  }
  function init(){build();bindSecret()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
