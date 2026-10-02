/* Koepanda kids course data — DEMO 10.107.53
   P0/P1 starter content. Tone is present from lesson one.
   Single-vowel cards begin visualized learning with scene associations.
   Chinese sound is primary; Japanese explanation is supportive. */
window.KOEPANDA_KIDS_FIRST_LESSON = {
  id: 'kids-001-tone-vowels',
  title: '四声の感じ + a / o / e / i / u / ü',
  tones: [
    { tone: 1, mark: 'ā', label: '1声', jp: '高く平ら', audioText: '妈', audioFile: './assets/audio/pinyin/a1.wav', example: '妈' },
    { tone: 2, mark: 'á', label: '2声', jp: '低めから一気に上へ', audioText: '麻', audioFile: './assets/audio/pinyin/a2.wav', example: '麻' },
    { tone: 3, mark: 'ǎ', label: '3声', jp: '低く下げてから上がる', audioText: '马', audioFile: './assets/audio/pinyin/a3.wav', example: '马' },
    { tone: 4, mark: 'à', label: '4声', jp: '高い所から一気に下げる', audioText: '骂', audioFile: './assets/audio/pinyin/a4.wav', example: '骂' }
  ],
  vowels: [
    {
      letter: 'a',
      image: './assets/pinyin/a.png',
      audioFile: './assets/audio/pinyin/a1.wav',
      audioText: '啊',
      readAs: 'a は口を大きく開けて、はっきり「a」',
      buttonHint: 'あっ！',
      tip: '口を大きく開けよう',
      note: '口をしっかり大きく開けて、声を前に出す感じで明るく「a」。',
      mouth: '大きく開く',
      sceneEmoji: '😮',
      sceneTitle: '大きく口を開けて「a！」',
      sceneText: 'a は口を大きく開けるのがポイント。小さく開けず、はっきり声を出してみよう。'
    },
    {
      letter: 'o',
      image: './assets/pinyin/o.png',
      audioFile: './assets/audio/pinyin/o1.wav',
      audioText: '喔',
      readAs: 'o は「欧」ではなく、丸い口で出す「喔」の音',
      buttonHint: 'にわとり',
      tip: '唇を丸くしよう',
      note: '口を開けて鳴くにわとりの「喔〜」をイメージ。日本語の「オウ」にしない。',
      mouth: '丸くする',
      sceneEmoji: '🐔',
      sceneTitle: '口を開けたにわとりが「喔〜」',
      sceneText: 'o は「欧」ではなく、丸いくちで出す「喔」の感じ。朝のにわとりを思い浮かべよう。'
    },
    {
      letter: 'e',
      image: './assets/pinyin/e.png',
      audioFile: './assets/audio/pinyin/e1.wav',
      audioText: '鹅',
      readAs: 'e は「鹅（がちょう）」の最初の音',
      buttonHint: 'がちょう',
      tip: '口を少し横にして、奥から声を出そう',
      note: '池のがちょう「鹅」の出だしの音をイメージしてみよう。',
      mouth: '少し横に',
      sceneEmoji: '🦢',
      sceneTitle: '池のがちょう「鹅」',
      sceneText: 'e は日本語の「エ」と少し違う音。がちょう「鹅」の出だしの音をまねしよう。'
    },
    {
      letter: 'i',
      image: './assets/pinyin/i.png',
      audioFile: './assets/audio/pinyin/i1.wav',
      audioText: '衣',
      readAs: 'i は「衣（yī）」の音をイメージ',
      buttonHint: 'ふく',
      tip: '口を左右に少しひいて、明るく出そう',
      note: '大きな服「衣」を見ながら、細く前に出る i の音を感じよう。',
      mouth: '横にひく',
      sceneEmoji: '👕',
      sceneTitle: 'きれいな服「衣」',
      sceneText: 'i は日本語の「い」に近いけれど、中国語の口の形で少しキリッと出す音。大きな服「衣」を合図に覚えよう。'
    },
    {
      letter: 'u',
      image: './assets/pinyin/u.png',
      audioFile: './assets/audio/pinyin/u1.wav',
      audioText: '屋',
      readAs: 'u は「屋（wū）」の「u」をイメージ',
      buttonHint: 'いえ',
      tip: 'くちびるを前に丸くつき出そう',
      note: '「屋（wū）」を合図に、くちびるを前へ丸く集めて「u」。',
      mouth: '前に丸く',
      sceneEmoji: '🏠',
      sceneTitle: 'おうち「屋（wū）」',
      sceneText: 'u は日本語の「う」より、くちびるを前にしっかり丸める。おうち「屋（wū）」で覚えよう。'
    },
    {
      letter: 'ü',
      image: './assets/pinyin/u-umlaut.png',
      audioFile: './assets/audio/pinyin/yu1.wav',
      audioText: '鱼',
      readAs: 'ü（u の上に点が2つ）は「鱼（yú）」の音',
      buttonHint: 'さかな',
      tip: '「イ」の口で、くちびるだけ丸くしよう',
      note: 'ü は u とは別の母音。u の上に2つの点を書き、「鱼（yú）」の音で覚えよう。',
      mouth: 'イの口＋丸い唇',
      sceneEmoji: '🐟',
      sceneTitle: '小さな魚「鱼」',
      sceneText: 'ü は日本語にない大事な音。「イ」の口を作ってから、くちびるを丸くすると近づくよ。魚「鱼」で楽しく覚えよう。'
    }
  ]
};
