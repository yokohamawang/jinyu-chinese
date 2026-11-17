/* Recover Safari's page audio session before a new playback request. */
(function () {
  'use strict';
  var needsReconnect = true;
  var microphoneStreams = new Set(), pendingMicrophones = 0, captureGeneration = 0, microphoneWatch = null;
  var externalCaptures = new Set();
  function pruneMicrophones() {
    microphoneStreams.forEach(function (stream) {
      if (stream.getTracks().every(function (track) { return track.readyState === 'ended'; })) microphoneStreams.delete(stream);
    });
    if (!microphoneStreams.size && microphoneWatch !== null) {
      clearInterval(microphoneWatch); microphoneWatch = null;
    }
  }
  function otherMicrophoneActive() {
    var resources = window.KP134 && window.KP134.audioResources();
    return resources && (resources.microphoneStreams || resources.pendingMicrophones);
  }
  function restoreAfterRecording() {
    pruneMicrophones();
    if (pendingMicrophones || microphoneStreams.size || externalCaptures.size || otherMicrophoneActive()) return;
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (_) {}
  }
  function releaseMicrophone(stream) {
    if (stream) { stream.getTracks().forEach(function (track) { track.stop(); }); microphoneStreams.delete(stream); }
    restoreAfterRecording();
  }
  function getMicrophone(constraints) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return Promise.reject(new Error('microphone_unavailable'));
    var generation = captureGeneration;
    pendingMicrophones++;
    try {
      // Safari rejects audio capture while the page explicitly requests playback.
      if (navigator.audioSession) navigator.audioSession.type = 'play-and-record';
      return Promise.resolve(navigator.mediaDevices.getUserMedia(constraints || {audio:true})).then(function (stream) {
        pendingMicrophones--;
        if (generation !== captureGeneration) {
          releaseMicrophone(stream);
          throw new DOMException('Recording view closed', 'AbortError');
        }
        microphoneStreams.add(stream);
        stream.getTracks().forEach(function (track) { track.addEventListener('ended', restoreAfterRecording); });
        // Legacy recorders call track.stop(), which does not emit an ended event.
        if (microphoneWatch === null) microphoneWatch = setInterval(function () {
          pruneMicrophones();
          if (!microphoneStreams.size) restoreAfterRecording();
        }, 250);
        return stream;
      }, function (error) { pendingMicrophones--; restoreAfterRecording(); throw error; });
    } catch (error) { pendingMicrophones--; restoreAfterRecording(); return Promise.reject(error); }
  }
  function beginCapture() {
    if (navigator.audioSession) navigator.audioSession.type = 'play-and-record';
    var active = true;
    function release() {
      if (!active) return;
      active = false; externalCaptures.delete(release); restoreAfterRecording();
    }
    externalCaptures.add(release);
    return release;
  }
  function createRecorder(stream) {
    var Recorder = window.MediaRecorder;
    var mime = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm'].find(function (type) {
      return Recorder.isTypeSupported && Recorder.isTypeSupported(type);
    });
    return mime ? new Recorder(stream, {mimeType:mime}) : new Recorder(stream);
  }
  function microphoneErrorMessage(error) {
    if (error && error.name === 'NotAllowedError') return 'マイクの使用が許可されていません。Safariのサイト設定でマイクを許可して、もう一度押してください。';
    if (error && error.name === 'NotFoundError') return 'マイクが見つかりません。接続を確認して、もう一度押してください。';
    return '録音を開始できませんでした。もう一度、録音ボタンを押してください。';
  }
  function preparePlayback() {
    var session = navigator.audioSession;
    if (!session) return;
    var hadMicrophones = microphoneStreams.size;
    pruneMicrophones();
    if (hadMicrophones && !microphoneStreams.size) restoreAfterRecording();
    if (pendingMicrophones || microphoneStreams.size || externalCaptures.size) return;
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
  window.addEventListener('pagehide', function () {
    captureGeneration++;
    Array.from(externalCaptures).forEach(function (release) { release(); });
    Array.from(microphoneStreams).forEach(releaseMicrophone);
  });
  window.KP_AUDIO_SESSION = { preparePlayback: preparePlayback, getMicrophone: getMicrophone, releaseMicrophone: releaseMicrophone, createRecorder: createRecorder, microphoneErrorMessage: microphoneErrorMessage, beginCapture: beginCapture };
})();
