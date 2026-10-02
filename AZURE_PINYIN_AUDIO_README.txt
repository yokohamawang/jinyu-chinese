Koepanda 10.107.62 — Azure 拼音标准音准备版

目的：
1. 不再让 Safari / iPhone 的系统 TTS 决定拼音发音。
2. 用 Azure Speech 一次生成固定 WAV，网站之后只播放本地文件。
3. 先生成并验听 a/o/e/i/u/ü × 四声 = 24 个样本。
4. 验听合格后，再按同一方式扩成完整拼音音库。

关键做法：
- Azure zh-CN 的 SAPI phoneme 直接指定拼音和声调，例如 a 1、a 2、o 3。
- i/u/ü 的零声母标准拼写使用 yi/wu/yu。
- 输出固定为 RIFF WAV / 24 kHz / 16-bit / mono。
- 默认语音：zh-CN-XiaoxiaoNeural。
- Key 与 Region 只从环境变量读取，不写进网页和项目文件。

生成：
  AZURE_SPEECH_KEY=... AZURE_SPEECH_REGION=... python tools/generate_azure_vowels.py
验证：
  python tools/validate_pinyin_audio.py

生成位置：assets/audio/pinyin/azure/
