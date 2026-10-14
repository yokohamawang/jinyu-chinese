# Koepanda pronunciation QA 10.108.134

Run from the extracted k134 website directory, with Node.js and Playwright installed:

```sh
node tools/pronunciation-134/all-targets.cjs
node tools/pronunciation-134/acceptance.cjs
node tools/pronunciation-134/misc.cjs
node tools/pronunciation-134/render.cjs
```

Set KP_BROWSER_EXECUTABLE if Chromium is outside Playwright's install. KP_QA_OUTPUT selects the local output folder; default is a temporary directory. Internal browser screenshots are generated only for developer inspection and are not shipped in this package.

The tests start localhost fixtures, use development unlock only in a browser test context, and simulate audio/microphone failure and permission states. Target coverage uses a passed-mastery fixture for all vowel cards; acceptance also tests fresh normal vowel progression. They do not alter production student locks. The audio tests verify real HTMLMediaElement playback/ended with nonzero volume; this does not certify pronunciation by human listening or physical iPhone Safari.

The renderer is an original teaching diagram, not recorded internal anatomy. The audio clock controls progress, but the relative instructional phase timings are reference cues rather than measured phoneme timestamps.

KP_SKIP_ASSESSMENT=1 / KP_SKIP_LAYOUT=1 are optional focused rerun switches in acceptance.cjs. Full acceptance is the default. Test-result JSON files supplied here are the observed results from this review. A changed implementation needs an appropriate rerun.
