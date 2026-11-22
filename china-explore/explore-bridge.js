/* Koepanda 中国探索 integration bridge, isolated from the existing story module. */
(function () {
  'use strict';
  function attach() {
    const features = window.KoepandaFeatures;
    if (!features || typeof features.story !== 'function') return false;
    if (features.story.__chinaExploreBridge) return true;
    const original = features.story;
    let mode = 'explore';
    let mountedContext = null;
    const safeOrigin = location.origin;
    function renderFeature(ctx) {
      if (mode === 'story') {
        return '<div class="cx-return"><button type="button" data-action="cx-return-explore">‹ 中国探索へ戻る</button></div>' + original(ctx);
      }
      return '<section class="cx-embed" aria-label="中国探索"><iframe title="中国探索" src="./china-explore/index.html?v=301.387&amp;embedded=1" loading="eager"></iframe></section>';
    }
    function wrapped(ctx) { return renderFeature(ctx); }
    wrapped.mount = function(ctx) {
      mountedContext = ctx;
      if (mode === 'story' && typeof original.mount === 'function') original.mount(ctx);
    };
    wrapped.actions = Object.assign({}, original.actions || {}, {
      'cx-return-explore': function(ctx) {
        mode = 'explore';
        ctx.root.scrollTop = 0;
        original.actions['story-back'](ctx);
      }
    });
    wrapped.change = original.change;
    wrapped.submit = original.submit;
    wrapped.__chinaExploreBridge = true;
    features.story = wrapped;
    document.addEventListener('click', function(e) {
      if (e.target.closest('#kpFeatureRoot [data-go]')) mode = 'explore';
    }, true);
    window.addEventListener('message', function(e) {
      if (e.origin !== safeOrigin || !e.data) return;
      const iframe = document.querySelector('#kpFeatureMain .cx-embed iframe');
      if (!iframe || iframe.contentWindow !== e.source) return;
      if (e.data.type === 'koepanda-explore-layout') {
        const height = e.data.height;
        if (Number.isFinite(height) && height > 0) iframe.style.height = Math.ceil(height) + 'px';
        if (e.data.reset && mountedContext) {
          const root = mountedContext.root;
          const nav = root.querySelector('.kp-feature-nav');
          root.scrollTop = Math.min(root.scrollTop, nav.offsetTop);
        }
        return;
      }
      if (e.data.type !== 'koepanda-open-existing-story') return;
      mode = 'story';
      if (mountedContext && typeof mountedContext.render === 'function') {
        // The original story handler resets to its existing lesson list.
        mountedContext.root.scrollTop = 0;
        const back = original.actions && original.actions['story-back'];
        if (back) back(mountedContext); else mountedContext.render();
      }
    });
    const button = document.querySelector('#kpFeatureRoot .kp-feature-nav [data-go="story"] span');
    if (button) button.textContent = '中国探索';
    if (new URLSearchParams(location.search).get('view') === 'story') {
      button?.closest('button')?.click();
      requestAnimationFrame(() => {
        const iframe = document.querySelector('#kpFeatureMain .cx-embed iframe');
        if (iframe) {
          mode = 'story';
          original.actions['story-back'](mountedContext);
        }
      });
    }
    return true;
  }
  if (!attach()) {
    document.addEventListener('DOMContentLoaded', attach, { once: true });
  }
})();
