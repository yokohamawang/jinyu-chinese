#!/usr/bin/env python3
"""Generate Koepanda's 24 starter-vowel WAV files with Azure Speech REST.

Environment variables required:
  AZURE_SPEECH_KEY     Azure Speech resource key
  AZURE_SPEECH_REGION  e.g. japaneast, eastasia
Optional:
  AZURE_SPEECH_VOICE   default: zh-CN-XiaoxiaoNeural

The script uses Azure's zh-CN SAPI phoneme alphabet so the requested sound is
explicitly the Pinyin syllable + tone, instead of asking TTS to infer a reading
from a Chinese character.
"""
from __future__ import annotations
import os, sys, time, urllib.request, urllib.error
from pathlib import Path
from xml.sax.saxutils import escape

KEY = os.environ.get("AZURE_SPEECH_KEY", "").strip()
REGION = os.environ.get("AZURE_SPEECH_REGION", "").strip()
VOICE = os.environ.get("AZURE_SPEECH_VOICE", "zh-CN-XiaoxiaoNeural").strip()
if not KEY or not REGION:
    sys.exit("Set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION first. The key is never written to project files.")

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "audio" / "pinyin" / "azure"
OUT.mkdir(parents=True, exist_ok=True)

# App labels -> Azure zh-CN SAPI whole-syllable pronunciation.
# For zero-initial i/u/ü, standard Pinyin spelling is yi/wu/yu.
SYLLABLES = {
    "a": ("a", "啊"),
    "o": ("o", "噢"),
    "e": ("e", "鹅"),
    "i": ("yi", "衣"),
    "u": ("wu", "屋"),
    "yu": ("yu", "迂"),
}

ENDPOINT = f"https://{REGION}.tts.speech.microsoft.com/cognitiveservices/v1"
HEADERS = {
    "Ocp-Apim-Subscription-Key": KEY,
    "Content-Type": "application/ssml+xml",
    "X-Microsoft-OutputFormat": "riff-24khz-16bit-mono-pcm",
    "User-Agent": "Koepanda-Pinyin-Audio-Builder",
}

def ssml(sapi: str, tone: int, fallback: str) -> bytes:
    # Keep prosody neutral: the tone itself is controlled by the SAPI phoneme.
    body = (
        "<speak version='1.0' xml:lang='zh-CN'>"
        f"<voice name='{escape(VOICE)}'>"
        f"<phoneme alphabet='sapi' ph='{escape(sapi)} {tone}'>{escape(fallback)}</phoneme>"
        "</voice></speak>"
    )
    return body.encode("utf-8")

def synthesize(name: str, sapi: str, tone: int, fallback: str) -> None:
    path = OUT / f"{name}{tone}.wav"
    req = urllib.request.Request(ENDPOINT, data=ssml(sapi, tone, fallback), headers=HEADERS, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            audio = resp.read()
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", "replace")
        raise RuntimeError(f"Azure HTTP {exc.code} for {name}{tone}: {detail[:400]}") from exc
    if len(audio) < 1000 or audio[:4] != b"RIFF":
        raise RuntimeError(f"Unexpected audio response for {name}{tone}: {len(audio)} bytes")
    path.write_bytes(audio)
    print(f"OK  {path.relative_to(ROOT)}  {len(audio)} bytes")

for name, (sapi, fallback) in SYLLABLES.items():
    for tone in range(1, 5):
        synthesize(name, sapi, tone, fallback)
        time.sleep(0.08)

print("\nGenerated 24 WAV files. Run: python tools/validate_pinyin_audio.py")
