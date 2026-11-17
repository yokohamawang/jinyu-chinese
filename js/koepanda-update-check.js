(function () {
  'use strict';

  var meta = document.querySelector('meta[name="koepanda-build"]');
  var current = meta ? meta.content : '';
  var checkInFlight = false;
  var latestFound = '';
  var notice;

  function makeNotice(version) {
    if (notice) return;
    notice = document.createElement('aside');
    notice.setAttribute('role', 'status');
    notice.setAttribute('aria-live', 'polite');
    notice.id = 'kpUpdateNotice';
    notice.innerHTML = '<span>Koepandaの新しい版が利用できます。</span><button type="button" id="kpUpdateNow">最新版に切り替える</button><button type="button" id="kpUpdateLater" aria-label="閉じる">×</button>';
    notice.style.cssText = 'position:fixed;z-index:2147483000;left:12px;right:12px;bottom:calc(16px + env(safe-area-inset-bottom));display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:12px 14px;background:#315f52;color:#fff;border:1px solid rgba(255,255,255,.25);border-radius:16px;box-shadow:0 8px 28px rgba(24,52,43,.25);font:700 14px/1.45 system-ui,-apple-system,sans-serif;';
    var buttons = notice.querySelectorAll('button');
    buttons[0].style.cssText = 'border:0;border-radius:999px;padding:10px 15px;background:#fff4c9;color:#315f52;font:800 14px/1.2 system-ui,-apple-system,sans-serif;cursor:pointer;';
    buttons[1].style.cssText = 'width:32px;height:32px;border:0;border-radius:50%;background:rgba(255,255,255,.16);color:#fff;font:700 20px/1 system-ui,-apple-system,sans-serif;cursor:pointer;';
    buttons[0].addEventListener('click', function () {
      var target = new URL(window.location.href);
      target.searchParams.set('kp_release', latestFound);
      window.location.replace(target.toString());
    });
    buttons[1].addEventListener('click', function () { notice.remove(); notice = null; });
    document.body.appendChild(notice);
  }

  function checkVersion() {
    if (checkInFlight || !current || document.visibilityState === 'hidden') return;
    checkInFlight = true;
    fetch('./version.json?check=' + Date.now(), { cache: 'no-store' })
      .then(function (response) { if (!response.ok) throw new Error('version check failed'); return response.json(); })
      .then(function (data) {
        var latest = data && String(data.version || '');
        if (!latest || latest === current) return;
        latestFound = latest;
        var attempted = '';
        try { attempted = sessionStorage.getItem('kpReleaseAttempt') || ''; } catch (e) {}
        if (attempted === latest) return;
        makeNotice(latestFound);
      })
      .catch(function () {})
      .finally(function () { checkInFlight = false; });
  }

  document.addEventListener('click', function (event) {
    if (event.target && event.target.id === 'kpUpdateNow' && latestFound) {
      try { sessionStorage.setItem('kpReleaseAttempt', latestFound); } catch (e) {}
    }
  }, true);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', checkVersion, { once: true });
  else checkVersion();
  document.addEventListener('visibilitychange', checkVersion);
  window.addEventListener('pageshow', checkVersion);
  window.setInterval(checkVersion, 300000);
})();
