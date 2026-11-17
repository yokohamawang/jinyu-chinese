/* Recover Safari's page audio session before a new playback request. */
(function () {
  'use strict';
  var needsReconnect = true;
  function preparePlayback() {
    var session = navigator.audioSession;
    if (!session) return;
    var resources = window.KP134 && window.KP134.audioResources();
    if (resources && (resources.microphoneStreams || resources.pendingMicrophones)) return;
    // Never switch the session away from an active recording in another feature.
    if (session.type === 'play-and-record') return;
    try {
      // Reassigning the same category does not repair a stale Safari session.
      // Do this only on a new playback after a page lifecycle transition.
      if (needsReconnect && session.type === 'playback') session.type = 'auto';
      session.type = 'playback';
      needsReconnect = false;
    } catch (error) {
      console.warn('[Koepanda] audio session unavailable:', error.name);
    }
  }
  function reconnectOnNextPlay() { needsReconnect = true; }
  window.addEventListener('pageshow', reconnectOnNextPlay);
  window.addEventListener('focus', reconnectOnNextPlay);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) reconnectOnNextPlay();
  });
  // Includes reference clips and recorded-voice playback in standalone pages.
  document.addEventListener('play', preparePlayback, true);
  window.KP_AUDIO_SESSION = { preparePlayback: preparePlayback };
})();
