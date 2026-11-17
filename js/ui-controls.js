/* Shared touch feedback and font-independent navigation icons. */
(function () {
  'use strict';
  let pressed = null, releaseTimer = null;
  function clear() { if (pressed) pressed.classList.remove('is-pressed'); pressed = null; }
  function press(event) {
    if (event.type === 'keydown' && !['Enter',' '].includes(event.key)) return;
    const control = event.target.closest('button:not(:disabled),a[href]');
    if (!control) return;
    clearTimeout(releaseTimer); clear(); pressed = control; control.classList.add('is-pressed');
  }
  document.addEventListener('pointerdown', press, true);
  document.addEventListener('keydown', press, true);
  document.addEventListener('pointerup', () => { releaseTimer = setTimeout(clear, 100); }, true);
  document.addEventListener('keyup', () => { releaseTimer = setTimeout(clear, 100); }, true);
  document.addEventListener('pointercancel', clear, true);
  // Click acknowledgement survives a short tap, including immediate question changes.
  document.addEventListener('click', event => {
    press(event);
    clearTimeout(releaseTimer);
    releaseTimer = setTimeout(clear, 180);
  }, true);
  window.addEventListener('blur', clear);
  window.addEventListener('pagehide', clear);
  function icons(root) {
    root.querySelectorAll('button[aria-label],a[aria-label]').forEach(control => {
      const text = control.textContent.trim();
      if (control.dataset.navIconReady || !['‹','›','←','→'].includes(text)) return;
      control.dataset.navIconReady = 'true'; control.classList.add('kp-nav-icon');
      const left = text === '‹' || text === '←';
      control.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${left?'m14.5 5-7 7 7 7':'m9.5 5 7 7-7 7'}" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    });
  }
  let scheduled = false;
  function schedule() { if (!scheduled) { scheduled = true; requestAnimationFrame(() => { scheduled = false; icons(document); }); } }
  new MutationObserver(schedule).observe(document.documentElement, {childList:true,subtree:true});
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, {once:true}); else schedule();
})();
