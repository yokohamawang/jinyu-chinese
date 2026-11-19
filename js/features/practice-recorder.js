/* Shared local recording lifecycle for daily phrases and scenario follow-along. */
(function () {
  'use strict';
  window.KoepandaPracticeRecorder = { create: function (options) {
    const button = options.button, replay = options.replay, note = options.note;
    let recorder = null, stream = null, url = '', player = null, timer = null;
    let meterContext = null, meterSource = null, meterTimer = null;
    let pending = false, closed = false, stopping = false;
    const label = options.label || button.textContent;
    const audio = () => window.KP_AUDIO_SESSION;
    function message(text) { if (!closed && note) { note.textContent = text; note.hidden = !text; } }
    function stopMeter() {
      clearInterval(meterTimer); meterTimer = null;
      if (meterSource) { try { meterSource.disconnect(); } catch (_) {} meterSource = null; }
      if (meterContext) { const context = meterContext; meterContext = null; context.close().catch(() => {}); }
    }
    function watchSilence(activeStream) {
      stopMeter();
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      try {
        meterContext = new AudioContextClass();
        meterSource = meterContext.createMediaStreamSource(activeStream);
        const analyser = meterContext.createAnalyser(); analyser.fftSize = 1024;
        meterSource.connect(analyser);
        const samples = new Uint8Array(analyser.fftSize);
        const startedAt = performance.now(); let spoke = false, quietSince = 0;
        meterTimer = setInterval(() => {
          if (!recorder || recorder.state !== 'recording' || closed) return;
          analyser.getByteTimeDomainData(samples);
          let sum = 0;
          for (let i = 0; i < samples.length; i++) { const sample = (samples[i] - 128) / 128; sum += sample * sample; }
          const level = Math.sqrt(sum / samples.length), now = performance.now();
          if (level > 0.025) { spoke = true; quietSince = 0; }
          else if (spoke) { if (!quietSince) quietSince = now; if (now - quietSince >= 1300 && now - startedAt >= 1200) stop(); }
        }, 100);
        meterContext.resume().catch(() => {});
      } catch (_) { stopMeter(); } // Recording still ends using the maximum-duration timer.
    }
    function update(recording) {
      if (closed) return;
      button.disabled = pending || stopping;
      button.classList.toggle('is-recording', recording);
      button.setAttribute('aria-pressed', String(recording));
      button.setAttribute('aria-busy', String(pending || stopping));
      button.textContent = pending ? 'マイクを準備中…' : stopping ? '録音を保存中…' : recording ? '■ 録音を止める' : url ? '● もう一度録音' : label;
      replay.hidden = !url;
      replay.disabled = pending || stopping || recording;
      (options.listenButtons || []).forEach(b => { b.disabled = pending || stopping || recording; });
    }
    function release(activeStream) { if (activeStream) audio().releaseMicrophone(activeStream); if (stream === activeStream) stream = null; }
    function stop() {
      clearTimeout(timer); timer = null;
      stopMeter();
      if (recorder && recorder.state !== 'inactive') {
        stopping = true; update(false);
        try { recorder.stop(); } catch (error) { fail(error, stream); }
      }
    }
    function fail(error, activeStream) {
      clearTimeout(timer); timer = null;
      stopMeter();
      const old = recorder; recorder = null;
      if (old) { old.ondataavailable = old.onstop = old.onerror = null; try { if (old.state !== 'inactive') old.stop(); } catch (_) {} }
      release(activeStream); pending = stopping = false;
      console.warn('[Koepanda] practice recording failed:', error.name || error.message);
      message(audio().microphoneErrorMessage(error)); update(false);
    }
    async function toggle() {
      if (closed || pending || stopping) return;
      if (recorder && recorder.state === 'recording') { stop(); return; }
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
        message('このブラウザーでは録音を利用できません。Safariで開いてください。'); return;
      }
      pending = true; update(false); message('マイクの使用を許可してください。');
      if (player) player.pause();
      let acquired = null;
      try {
        if (options.beforeRecord) options.beforeRecord();
        acquired = await audio().getMicrophone({audio:true});
        if (closed || document.hidden) { release(acquired); pending = false; update(false); return; }
        stream = acquired;
        const active = audio().createRecorder(acquired), chunks = [];
        recorder = active;
        active.ondataavailable = event => { if (event.data && event.data.size) chunks.push(event.data); };
        active.onerror = event => fail(event.error || new Error('recording_failed'), acquired);
        active.onstop = () => {
          clearTimeout(timer); timer = null; stopMeter(); release(acquired);
          if (recorder === active) recorder = null;
          pending = stopping = false;
          if (closed) return;
          const mime = active.mimeType || chunks.find(part => part.type)?.type || '';
          const blob = new Blob(chunks, mime ? {type:mime} : {});
          if (!blob.size) { message('音声を保存できませんでした。もう一度録音してください。'); update(false); return; }
          if (url) URL.revokeObjectURL(url);
          url = URL.createObjectURL(blob);
          message('録音できました。再生して確認しよう。'); update(false);
        };
        active.start(); pending = false; update(true);
        message('録音中… 話し終えると自動で止まります。');
        watchSilence(acquired);
        timer = setTimeout(stop, 10000);
      } catch (error) { fail(error, acquired); }
    }
    function play() {
      if (closed || !url || pending || stopping || recorder) return;
      if (options.beforeReplay) options.beforeReplay();
      audio().preparePlayback();
      if (!player) { player = new Audio(); player.playsInline = true; }
      player.pause(); player.src = url; player.volume = 1; player.muted = false;
      player.onended = () => message('自分の声を聞けました。もう一度録音することもできます。');
      message('自分の声を再生しています…');
      try { const result = player.play(); if (result && result.catch) result.catch(() => message('録音を再生できませんでした。もう一度押してください。')); }
      catch (_) { message('録音を再生できませんでした。もう一度押してください。'); }
    }
    function dispose() {
      if (closed) return;
      closed = true; clearTimeout(timer); stopMeter();
      if (player) { player.pause(); player.onended = null; }
      if (recorder && recorder.state !== 'inactive') { try { recorder.stop(); } catch (_) {} }
      release(stream);
      if (url) { URL.revokeObjectURL(url); url = ''; }
      document.removeEventListener('visibilitychange', onVisibility);
    }
    function onVisibility() { if (document.hidden) stop(); }
    document.addEventListener('visibilitychange', onVisibility);
    button.onclick = toggle; replay.onclick = play; update(false);
    if (note) { note.setAttribute('role', 'status'); note.setAttribute('aria-live', 'polite'); }
    return { stop:stop, dispose:dispose };
  }};
})();
