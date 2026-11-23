(() => {
  let cachedPlace, words = new Map();
  function glossary() {
    if (cachedPlace === place) return words;
    cachedPlace = place;
    words = new Map();
    if (!place) return words;
    const id = Object.keys(lessons).find(key => lessons[key] === place);
    for (const [term, reading, gloss] of [
      place.name,
      ...(place.words || []),
      ...(lessonReview[id]?.words || []),
      ...(additionalWords[id] || []),
      ...(practiceVocabulary[id] || [])
    ]) {
      if (term && reading && gloss && !words.has(term)) words.set(term, [reading, gloss]);
    }
    return words;
  }
  window.KP_READING_LOOKUP.mount(app, '.feature-reading .copy-text .zh, .hero .copy-text .zh', {
    getLocal: glossary,
    beforeLookup: stopSpeaking
  });
})();
