const photos = {
  "palace": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/5/5e/Forbidden_City_%2854448344157%29.jpg",
    "file": "https://commons.wikimedia.org/wiki/File:Forbidden_City_%2854448344157%29.jpg",
    "author": "Xiquinho Silva",
    "license": "by/2.0"
  },
  "gate": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/f/f6/Meridian_Gate_of_the_Forbidden_City.jpg",
    "file": "https://commons.wikimedia.org/wiki/File:Meridian_Gate_of_the_Forbidden_City.jpg",
    "author": "そらみみ",
    "license": "by-sa/4.0"
  },
  "hall": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/9/9c/Hall_of_Supreme_Harmony_%2854448353192%29.jpg",
    "file": "https://commons.wikimedia.org/wiki/File:Hall_of_Supreme_Harmony_%2854448353192%29.jpg",
    "author": "Xiquinho Silva",
    "license": "by/2.0"
  },
  "garden": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/a/ae/Imperial_Garden_%2854448349292%29.jpg",
    "file": "https://commons.wikimedia.org/wiki/File:Imperial_Garden_%2854448349292%29.jpg",
    "author": "Xiquinho Silva",
    "license": "by/2.0"
  },
  "huangshan": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/a/ae/Pine_of_Huangshan_20141109.jpg",
    "file": "https://commons.wikimedia.org/wiki/File:Pine_of_Huangshan_20141109.jpg",
    "author": "颐园居",
    "license": "by-sa/4.0"
  },
  "lijiang": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/f/f1/Guilin_Li_River.jpg",
    "file": "https://commons.wikimedia.org/wiki/File:Guilin_Li_River.jpg",
    "author": "xiquinhosilva",
    "license": "by/2.0"
  },
  "westlake": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/e/e5/Leifeng_Pagoda%2C_West_Lake.jpg",
    "file": "https://commons.wikimedia.org/wiki/File:Leifeng_Pagoda%2C_West_Lake.jpg",
    "author": "钉钉",
    "license": "by-sa/4.0"
  },
  "wall": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/6/64/The_Mutianyu_section_of_the_Great_Wall_of_China.jpg",
    "file": "https://commons.wikimedia.org/wiki/File:The_Mutianyu_section_of_the_Great_Wall_of_China.jpg",
    "author": "Lloyd Tudor",
    "license": "by-sa/4.0"
  },
  "taishan": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/c/cc/Mountain_Tai.jpg",
    "file": "https://commons.wikimedia.org/wiki/File:Mountain_Tai.jpg",
    "author": "煎饼卷",
    "license": "by-sa/4.0"
  },
  "qingdao": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/2/2b/Qingdao%EF%BC%8C%E9%9D%92%E5%B2%9B%E6%B5%B7%E6%BB%A8%EF%BC%8C%E9%9D%92%E5%B2%9B%E5%BB%BA%E7%AD%91%EF%BC%8C2019%E5%B9%B4.jpg",
    "file": "https://commons.wikimedia.org/wiki/File:Qingdao%EF%BC%8C%E9%9D%92%E5%B2%9B%E6%B5%B7%E6%BB%A8%EF%BC%8C%E9%9D%92%E5%B2%9B%E5%BB%BA%E7%AD%91%EF%BC%8C2019%E5%B9%B4.jpg",
    "author": "Trychmi",
    "license": "by-sa/4.0"
  }
};

const topics = [
  { id: 'mountain', title: ['山', 'shān', '中国の名山'], photo: 'huangshan', places: ['huangshan', 'taishan'] },
  { id: 'water', title: ['川', 'chuān', '川・湖・海'], photo: 'lijiang', places: ['lijiang', 'westlake', 'qingdao'] },
  { id: 'story', title: ['文', 'wén', '中国の物語'], places: [] },
  { id: 'travel', title: ['旅', 'lǚ', '名所を訪ねる'], photo: 'palace', places: ['palace', 'wall'] }
];

const places = {
  huangshan: {
    name: ['黄山', 'Huáng shān', '黄山 · 安徽省'], photo: 'huangshan',
    intro: [
      ['黄山在安徽省。', 'Huáng shān zài Ān huī shěng.', '黄山は安徽省にあります。'],
      ['这里的奇松、怪石和云海很有名。', 'Zhè lǐ de qí sōng, guài shí hé yún hǎi hěn yǒu míng.', '独特な姿の松、奇岩、雲海で知られています。']
    ],
    source: ['ユネスコ · 黄山', 'https://whc.unesco.org/en/list/547/']
  },
  taishan: {
    name: ['泰山', 'Tài shān', '泰山 · 山東省'], photo: 'taishan',
    intro: [
      ['泰山在山东省。', 'Tài shān zài Shān dōng shěng.', '泰山は山東省にあります。'],
      ['古代的皇帝曾到这里祭祀。', 'Gǔ dài de huáng dì céng dào zhè lǐ jì sì.', '昔、皇帝がここを訪れて祭祀を行いました。']
    ],
    source: ['ユネスコ · 泰山', 'https://whc.unesco.org/en/list/437/']
  },
  qingdao: {
    name: ['青岛海滨', 'Qīng dǎo hǎi bīn', '青島の海辺 · 黄海'], photo: 'qingdao',
    intro: [
      ['青岛在黄海沿岸。', 'Qīng dǎo zài Huáng hǎi yán àn.', '青島は黄海の沿岸にあります。'],
      ['在海边散步，可以看到帆船。', 'Zài hǎi biān sàn bù, kě yǐ kàn dào fān chuán.', '海沿いを歩くと、ヨットが見えます。']
    ]
  },
  lijiang: {
    name: ['漓江', 'Lí jiāng', '漓江 · 広西'], photo: 'lijiang',
    intro: [
      ['漓江流经桂林。', 'Lí jiāng liú jīng Guì lín.', '漓江は桂林を流れます。'],
      ['江的两岸有一座座山峰。', 'Jiāng de liǎng àn yǒu yí zuò zuò shān fēng.', '川の両岸に山々が連なります。']
    ]
  },
  westlake: {
    name: ['西湖', 'Xī hú', '西湖 · 杭州'], photo: 'westlake',
    intro: [
      ['西湖在杭州。', 'Xī hú zài Háng zhōu.', '西湖は杭州にあります。'],
      ['在湖边可以看到雷峰塔。', 'Zài hú biān kě yǐ kàn dào Léi fēng tǎ.', '湖畔から雷峰塔が見えます。']
    ],
    source: ['ユネスコ · 杭州西湖', 'https://whc.unesco.org/en/list/1334/']
  },
  palace: {
    name: ['北京故宫', 'Běi jīng Gù gōng', '北京の故宮'], photo: 'palace',
    intro: [
      ['北京故宫又叫紫禁城。', 'Běi jīng Gù gōng yòu jiào Zǐ jìn chéng.', '北京の故宮は紫禁城とも呼ばれます。'],
      ['这里曾是明清两代的皇宫。', 'Zhè lǐ céng shì Míng Qīng liǎng dài de huáng gōng.', 'かつて明・清の宮殿でした。']
    ],
    guide: [
      ['请提前通过故宫博物院的官方渠道预约门票。', 'Qǐng tí qián tōng guò Gù gōng Bó wù yuàn de guān fāng qú dào yù yuē mén piào.', '事前に故宮博物院の公式窓口で入場券を予約しましょう。'],
      ['从午门进入，可以从神武门或东华门离开。', 'Cóng Wǔ mén jìn rù, kě yǐ cóng Shén wǔ mén huò Dōng huá mén lí kāi.', '午門から入り、神武門か東華門から出ます。']
    ],
    route: [['午门', 'Wǔ mén', '入口'], ['太和殿', 'Tài hé diàn', '見学'], ['御花园', 'Yù huā yuán', '見学'], ['神武门', 'Shén wǔ mén', '出口']],
    sights: [
      { name: ['午门', 'Wǔ mén', '最初に通る南の門'], photo: 'gate',
        intro: [['午门是故宫南边的入口。', 'Wǔ mén shì Gù gōng nán biān de rù kǒu.', '午門は故宮の南側の入口です。']] },
      { name: ['太和殿', 'Tài hé diàn', '大きな儀式の舞台'], photo: 'hall',
        intro: [['这里曾举行重要的典礼。', 'Zhè lǐ céng jǔ xíng zhòng yào de diǎn lǐ.', 'かつてここで重要な儀式が行われました。']] },
      { name: ['御花园', 'Yù huā yuán', '宮殿の奥にある庭園'], photo: 'garden',
        intro: [['园里有古树、假山和亭子。', 'Yuán lǐ yǒu gǔ shù, jiǎ shān hé tíng zi.', '庭園には古木、築山、あずまやがあります。']] }
    ],
    scenes: [
      { situation: '入口を尋ねる', lines: [
        ['请问，故宫的入口在哪里？', 'Qǐng wèn, Gù gōng de rù kǒu zài nǎ lǐ?', 'すみません、故宮の入口はどこですか。'],
        ['请从午门进去。', 'Qǐng cóng Wǔ mén jìn qù.', '午門から入ってください。']
      ], choices: ['午門から入る', '神武門から入る'], answer: 0 },
      { situation: '予約を伝える', lines: [
        ['请出示您的预约信息。', 'Qǐng chū shì nín de yù yuē xìn xī.', '予約情報をご提示ください。'],
        ['好的，这是我的预约信息。', 'Hǎo de, zhè shì wǒ de yù yuē xìn xī.', 'はい、これが私の予約情報です。']
      ], choices: ['出口を尋ねる', '予約情報を見せる'], answer: 1 },
      { situation: '出口を尋ねる', lines: [
        ['请问，出口怎么走？', 'Qǐng wèn, chū kǒu zěn me zǒu?', 'すみません、出口までどう行きますか。'],
        ['往前走，从神武门出去。', 'Wǎng qián zǒu, cóng Shén wǔ mén chū qù.', '前に進んで、神武門から出てください。']
      ], choices: ['太和殿に戻る', '神武門から出る'], answer: 1 }
    ],
    source: ['故宮博物院 · 公式案内', 'https://www.dpm.org.cn/Visit.html'],
    booking: ['公式の予約・開館案内', 'https://ticket.dpm.org.cn/']
  },
  wall: {
    name: ['慕田峪长城', 'Mù tián yù Cháng chéng', '慕田峪長城 · 北京'], photo: 'wall',
    intro: [
      ['慕田峪长城在北京北部。', 'Mù tián yù Cháng chéng zài Běi jīng běi bù.', '慕田峪長城は北京の北部にあります。'],
      ['城墙沿着山脊延伸。', 'Chéng qiáng yán zhe shān jǐ yán shēn.', '城壁は山の尾根に沿って延びています。']
    ],
    source: ['ユネスコ · 万里の長城', 'https://whc.unesco.org/en/list/438/']
  }
};
