#!/usr/bin/env python3
from pathlib import Path
import wave, sys
ROOT = Path(__file__).resolve().parents[1]
DIR = ROOT / "assets" / "audio" / "pinyin" / "azure"
expected = [f"{s}{t}.wav" for s in ("a","o","e","i","u","yu") for t in range(1,5)]
errors=[]
for fn in expected:
    p=DIR/fn
    if not p.exists():
        errors.append(f"MISSING {fn}"); continue
    try:
        with wave.open(str(p), "rb") as w:
            props=(w.getnchannels(),w.getsampwidth(),w.getframerate(),w.getnframes())
        if props[0]!=1 or props[1]!=2 or props[2]!=24000 or props[3]<1000:
            errors.append(f"BAD {fn}: channels={props[0]} width={props[1]} rate={props[2]} frames={props[3]}")
        else:
            print(f"OK  {fn}: 24kHz mono 16-bit, {props[3]/24000:.2f}s")
    except Exception as e:
        errors.append(f"BAD {fn}: {e}")
if errors:
    print("\n"+"\n".join(errors)); sys.exit(1)
print("\nAll 24 Azure starter-vowel WAV files are present and structurally valid.")
