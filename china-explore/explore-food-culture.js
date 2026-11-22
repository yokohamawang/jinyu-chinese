/* Food and drink readings use the same Chinese, pinyin and Japanese rows as the travel readings. */
const cuisineReference = ['中国国家移民管理局 · 中国の食文化', 'https://www.nia.gov.cn/2022cn/files/basic-html/page29.html'];
const whiteLiquorReference = ['中国生態環境部 · 白酒の香型', 'https://www.mee.gov.cn/gkml/hbb/bgth/201611/W020230203355321728743.pdf'];

const foodCultureLessons = {
  winePoets: {
    name: ['诗人与酒', 'Shī rén yǔ jiǔ', '李白・蘇東坡・白居易の詩と酒'],
    chapters: [
      ['李白 · 月と影を招く', [
        ['举杯邀明月，对影成三人。', 'Jǔ bēi yāo míng yuè, duì yǐng chéng sān rén.', '杯を上げて月を招く。影と向き合えば三人になる。'],
        ['酒仙李白在《月下独酌》里，把月亮和自己的影子想象成朋友。', 'Jiǔ xiān Lǐ Bái zài Yuè xià dú zhuó lǐ, bǎ yuè liang hé zì jǐ de yǐng zi xiǎng xiàng chéng péng you.', '「酒仙」と呼ばれる李白は『月下独酌』で、月と自分の影を友に見立てました。'],
        ['还有一个民间传说，说李白伸手去捞江中的月亮。', 'Hái yǒu yí ge mín jiān chuán shuō, shuō Lǐ Bái shēn shǒu qù lāo jiāng zhōng de yuè liang.', '李白が川に映る月をすくおうと手を伸ばした、という民間伝説もあります。']
      ]],
      ['蘇東坡 · 離れた弟と同じ月を見る', [
        ['明月几时有？把酒问青天。', 'Míng yuè jǐ shí yǒu? Bǎ jiǔ wèn qīng tiān.', '明月はいつからあるのか。杯を手に青空に問う。'],
        ['苏轼在密州过中秋，想起远方的弟弟苏辙。', 'Sū Shì zài Mì zhōu guò Zhōng qiū, xiǎng qǐ yuǎn fāng de dì di Sū Zhé.', '蘇軾は密州で中秋を過ごし、遠く離れた弟の蘇轍を思い出しました。'],
        ['《水调歌头》最后写的是祝愿：相隔千里，也能共赏一轮明月。', 'Shuǐ diào gē tóu zuì hòu xiě de shì zhù yuàn: xiāng gé qiān lǐ, yě néng gòng shǎng yì lún míng yuè.', '『水調歌頭』の結びには、千里離れていても同じ月を眺められますように、という願いが込められています。']
      ]],
      ['白居易 · 雪の夜に友を待つ', [
        ['绿蚁新醅酒，红泥小火炉。', 'Lǜ yǐ xīn pēi jiǔ, hóng ní xiǎo huǒ lú.', '青みがかった泡の浮く新酒、小さな赤土の炉。'],
        ['“绿蚁”是新酒上细小的泡沫，像一只只小蚂蚁。', 'Lǜ yǐ shì xīn jiǔ shàng xì xiǎo de pào mò, xiàng yì zhī zhī xiǎo mǎ yǐ.', '「緑蟻」は新酒に浮かぶ、アリのように小さな泡のこと。'],
        ['在《问刘十九》里，天快下雪了，白居易邀朋友来围炉相聚。', 'Zài Wèn Liú shí jiǔ lǐ, tiān kuài xià xuě le, Bái Jū yì yāo péng you lái wéi lú xiāng jù.', '『劉十九に問う』では、雪が降りそうな夕方、白居易が友人を誘って炉を囲もうとします。']
      ]]
    ],
    refs: [
      ['李白 · 月下独酌', 'https://www.sastind.gov.cn/history/n152/n81023/n81097/c112089/content.html'],
      ['南京市緑化園林局 · 李白と捉月伝説', 'https://ylj.nanjing.gov.cn/ztzl/njcjjtsjzrbhqzxzl/kpxc/202404/t20240425_4216257.html'],
      ['上海市民政局 · 蘇軾の中秋詞', 'https://mzj.sh.gov.cn/lnb-wsws/20240918/db07bfa108f94ee29e706b9bbb646c1a.html'],
      ['香港教育局 · 問劉十九', 'https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/chi-edu/resources/primary/lang/jilei_shi_pdf/jilei_shi_055.pdf']
    ]
  },
  wineLegends: {
    name: ['酒圣与传说', 'Jiǔ shèng yǔ chuán shuō', '杜康・儀狄・劉伶をめぐる伝承'],
    chapters: [
      ['杜康と儀狄 · 酒の始まりを語る伝承', [
        ['民间把杜康尊为酒圣，也有仪狄造酒的传说。', 'Mín jiān bǎ Dù Kāng zūn wéi jiǔ shèng, yě yǒu Yí Dí zào jiǔ de chuán shuō.', '民間では杜康を「酒聖」とたたえます。儀狄が酒を造ったという伝承もあります。'],
        ['相传杜康把剩饭放进空树干，过了些日子，竟闻到了酒香。', 'Xiāng chuán Dù Kāng bǎ shèng fàn fàng jìn kōng shù gàn, guò le xiē rì zi, jìng wén dào le jiǔ xiāng.', '伝説では、杜康が残り飯を空洞のある木の幹に入れておくと、ある日、酒の香りがしたそうです。'],
        ['曹操在《短歌行》中用“杜康”来指酒。', 'Cáo Cāo zài Duǎn gē xíng zhōng yòng Dù Kāng lái zhǐ jiǔ.', '曹操は『短歌行』で「杜康」を酒の代名詞として使いました。']
      ]],
      ['劉伶 · 三年眠ったという民話', [
        ['在一个民间故事里，刘伶喝了杜家的酒，一睡就是三年。', 'Zài yí ge mín jiān gù shi lǐ, Liú Líng hē le Dù jiā de jiǔ, yí shuì jiù shì sān nián.', 'ある民話では、劉伶が杜家の酒を飲み、そのまま三年も眠ったと語られます。'],
        ['这个夸张的故事流传下来，讲的是人们对酒香的想象。', 'Zhè ge kuā zhāng de gù shi liú chuán xià lái, jiǎng de shì rén men duì jiǔ xiāng de xiǎng xiàng.', 'この大げさな物語は、酒の香りをめぐる人々の想像を伝えています。']
      ]]
    ],
    refs: [
      ['重慶市地方志 · 杜康の伝承', 'https://dfz.cq.gov.cn/zqlswh/rwby_417819/202407/t20240726_13432587.html'],
      ['文化観光部 · 杜康と短歌行', 'https://www.mct.gov.cn/preview/special/3578/3598/201203/t20120330_235434.html'],
      ['中国商務部 · 劉伶をめぐる民話', 'https://lzhbwg.mofcom.gov.cn/edi_ecms_web_front/thb/detail/c981c4f572c0462d8794dd64a796b598']
    ]
  },
  baijiu: {
    name: ['白酒的香型', 'Bái jiǔ de xiāng xíng', '茅台・汾酒・五糧液・西鳳など'],
    chapters: [
      ['貴州・山西 · 醤香と清香', [
        ['贵州仁怀的茅台酒是酱香型，香气厚重，余味较长。', 'Guì zhōu Rén huái de Máo tái jiǔ shì jiàng xiāng xíng, xiāng qì hòu zhòng, yú wèi jiào cháng.', '貴州省仁懐の茅台酒は醤香型で、厚みのある香りと長い余韻が特徴です。'],
        ['山西汾阳杏花村的汾酒是清香型，香气清雅，收口干净。', 'Shān xī Fén yáng Xìng huā cūn de Fén jiǔ shì qīng xiāng xíng, xiāng qì qīng yǎ, shōu kǒu gān jìng.', '山西省汾陽の杏花村で造られる汾酒は清香型。すっきりした香りと後味が特徴です。']
      ]],
      ['四川 · 酒蔵の香りを比べる', [
        ['宜宾五粮液和泸州老窖特曲都是浓香型，酒香浓郁，口感醇厚。', 'Yí bīn Wǔ liáng yè hé Lú zhōu Lǎo jiào Tè qū dōu shì nóng xiāng xíng, jiǔ xiāng nóng yù, kǒu gǎn chún hòu.', '宜賓の五糧液と瀘州老窖特曲はともに濃香型で、豊かな香りとコクがあります。'],
        ['“窖”指发酵用的窖池，四川浓香型白酒常让人联想到老窖。', 'Jiào zhǐ fā jiào yòng de jiào chí, Sì chuān nóng xiāng xíng bái jiǔ cháng ràng rén lián xiǎng dào lǎo jiào.', '「窖」は発酵に使う穴状の設備。四川の濃香型白酒は、代々使われてきた発酵槽でも知られます。']
      ]],
      ['陝西・広西 · 鳳香と米香', [
        ['陕西宝鸡的西凤酒是凤香型，口感甘润，余香悠长。', 'Shǎn xī Bǎo jī de Xī fèng jiǔ shì fèng xiāng xíng, kǒu gǎn gān rùn, yú xiāng yōu cháng.', '陝西省宝鶏の西鳳酒は鳳香型。まろやかさがあり、香りの余韻が長く続きます。'],
        ['广西桂林的三花酒是米香型，带有柔和的米香。', 'Guǎng xī Guì lín de Sān huā jiǔ shì mǐ xiāng xíng, dài yǒu róu hé de mǐ xiāng.', '広西・桂林の三花酒は米香型で、やわらかな米の香りがあります。']
      ]]
    ],
    refs: [whiteLiquorReference, ['中国商務部 · 西鳳酒', 'https://lzhbwg.mofcom.gov.cn/edi_ecms_web_front/thb/detail/39b63a3b51b3479d881ae8f269e48521']]
  },
  huangjiu: {
    name: ['绍兴黄酒', 'Shào xīng huáng jiǔ', '水郷・紹興の醸造酒'],
    chapters: [
      ['原料と風味', [
        ['浙江绍兴用糯米、麦曲和鉴湖水酿造黄酒。', 'Zhè jiāng Shào xīng yòng nuò mǐ, mài qū hé Jiàn hú shuǐ niàng zào huáng jiǔ.', '浙江省紹興ではもち米、小麦の麹、鑑湖の水を使って黄酒を醸します。'],
        ['元红偏干，加饭酒较醇厚，善酿和香雪则更甜。', 'Yuán hóng piān gān, Jiā fàn jiǔ jiào chún hòu, Shàn niàng hé Xiāng xuě zé gèng tián.', '元紅は辛口寄り、加飯はコクがあり、善醸と香雪は甘みが強めです。']
      ]],
      ['花雕の酒がめから食卓へ', [
        ['“花雕”这个名字让人想起画着花纹的酒坛。', 'Huā diāo zhè ge míng zi ràng rén xiǎng qǐ huà zhe huā wén de jiǔ tán.', '「花雕」という名から、模様を描いた酒がめが思い浮かびます。'],
        ['绍兴黄酒也用于烹饪，能给菜肴添上米酒的香气。', 'Shào xīng huáng jiǔ yě yòng yú pēng rèn, néng gěi cài yáo tiān shàng mǐ jiǔ de xiāng qì.', '紹興黄酒は料理にも使われ、米の醸造酒ならではの香りを料理に添えます。']
      ]]
    ],
    refs: [['紹興市柯橋区 · 黄酒の種類', 'https://wz.kq.gov.cn/art/2011/12/7/art_1605435_28782513.html']]
  },
  coastDrinks: {
    name: ['青岛啤酒与烟台葡萄酒', 'Qīng dǎo pí jiǔ yǔ Yān tái pú tao jiǔ', '山東の港町と近代の酒造り'],
    chapters: [
      ['青島 · 麦芽とホップ', [
        ['青岛啤酒常让人想到麦芽香和啤酒花带来的微苦。', 'Qīng dǎo pí jiǔ cháng ràng rén xiǎng dào mài yá xiāng hé pí jiǔ huā dài lái de wēi kǔ.', '青島ビールを特徴づけるのは、麦芽の香りとホップ由来のほのかな苦みです。'],
        ['在青岛啤酒博物馆，可以看到老厂房和过去的酿造设备。', 'Zài Qīng dǎo Pí jiǔ Bó wù guǎn, kě yǐ kàn dào lǎo chǎng fáng hé guò qù de niàng zào shè bèi.', '青島ビール博物館では、古い工場建築や当時の醸造設備を見ることができます。']
      ]],
      ['煙台 · ブドウの香りとワインの歴史', [
        ['烟台是中国近代葡萄酒产业的重要城市，张裕酒文化博物馆保存着这段历史。', 'Yān tái shì Zhōng guó jìn dài pú tao jiǔ chǎn yè de zhòng yào chéng shì, Zhāng yù Jiǔ Wén huà Bó wù guǎn bǎo cún zhe zhè duàn lì shǐ.', '煙台は中国近代ワイン産業の重要な都市。張裕酒文化博物館がその歴史を伝えています。'],
        ['干红的果香和涩感会随葡萄品种与酿造方法而变。', 'Gān hóng de guǒ xiāng hé sè gǎn huì suí pú tao pǐn zhǒng yǔ niàng zào fāng fǎ ér biàn.', '辛口赤ワインの果実香や渋みは、ブドウ品種や醸造法によって変わります。']
      ]]
    ],
    refs: [
      ['青島市 · 青島ビール博物館', 'https://www.qingdao.gov.cn/zwgk/xxgk/whly/gkml/gzxx/202405/t20240522_8030276.shtml'],
      ['煙台市芝罘区 · 張裕酒文化博物館', 'https://www.zhifu.gov.cn/art/2024/8/2/art_116145_2949635.html']
    ]
  }
};

const cuisines = {
  luCuisine: {
    name: ['鲁菜', 'Lǔ cài', '山東 · だしと葱の香り'],
    chapters: [
      ['味の特徴', [
        ['山东鲁菜讲究咸鲜，常用高汤提鲜。', 'Shān dōng Lǔ cài jiǎng jiu xián xiān, cháng yòng gāo tāng tí xiān.', '山東の魯菜は塩気とうま味を重んじ、だしで素材の味を引き立てます。']
      ]],
      ['代表料理と技法', [
        ['葱烧海参先把葱炸香，再用汤汁把海参烧入味。', 'Cōng shāo hǎi shēn xiān bǎ cōng zhá xiāng, zài yòng tāng zhī bǎ hǎi shēn shāo rù wèi.', 'ナマコの葱風味煮は、葱の香りを油に移してから、煮汁の味をナマコに含ませます。'],
        ['糖醋鲤鱼把鲤鱼炸酥，再浇上酸甜的糖醋汁。', 'Táng cù lǐ yú bǎ lǐ yú zhá sū, zài jiāo shàng suān tián de táng cù zhī.', '鯉の甘酢あんかけは、鯉をカリッと揚げ、甘酸っぱいあんをかけます。']
      ]]
    ]
  },
  chuanCuisine: {
    name: ['川菜', 'Chuān cài', '四川 · 麻辣から魚香まで'],
    chapters: [
      ['味の特徴', [
        ['四川川菜有麻辣、鱼香等多种味型。', 'Sì chuān Chuān cài yǒu má là, yú xiāng děng duō zhǒng wèi xíng.', '四川料理には、しびれる辛さの麻辣や甘酸っぱく香る魚香など、多彩な味付けがあります。']
      ]],
      ['代表料理と技法', [
        ['麻婆豆腐用豆瓣酱烧出鲜辣，再用花椒添麻香。', 'Má pó dòu fu yòng dòu bàn jiàng shāo chū xiān là, zài yòng huā jiāo tiān má xiāng.', '麻婆豆腐は豆板醤でうま味と辛みを出すように煮て、花椒のしびれる香りを加えます。'],
        ['宫保鸡丁用旺火快炒，花生带来酥脆的口感。', 'Gōng bǎo jī dīng yòng wàng huǒ kuài chǎo, huā shēng dài lái sū cuì de kǒu gǎn.', '宮保鶏丁は強火で手早く炒め、ピーナッツでカリッとした食感を加えます。']
      ]]
    ]
  },
  yueCuisine: {
    name: ['粤菜', 'Yuè cài', '広東 · 素材の鮮味を生かす'],
    chapters: [
      ['味の特徴', [
        ['广东粤菜重视食材本味，讲究火候。', 'Guǎng dōng Yuè cài zhòng shì shí cái běn wèi, jiǎng jiu huǒ hou.', '広東料理は素材そのものの味を大切にし、火加減を細かく調整します。']
      ]],
      ['代表料理と技法', [
        ['清蒸鱼用蒸汽把鱼蒸熟，保留鱼肉的鲜嫩。', 'Qīng zhēng yú yòng zhēng qì bǎ yú zhēng shú, bǎo liú yú ròu de xiān nèn.', '魚の清蒸は蒸気で火を通し、魚のうま味と身のやわらかさを保ちます。'],
        ['白切鸡在热汤里浸熟，切块后可蘸姜葱汁。', 'Bái qiē jī zài rè tāng lǐ jìn shú, qiē kuài hòu kě zhàn jiāng cōng zhī.', '白切鶏は熱いスープに浸して火を通し、切り分けて生姜と葱のたれを添えることがあります。']
      ]]
    ]
  },
  suCuisine: {
    name: ['苏菜', 'Sū cài', '江蘇 · 包丁さばきと煮込み'],
    chapters: [
      ['味の特徴', [
        ['江苏苏菜讲究刀工，淮扬菜尤其注重鲜味和细腻的口感。', 'Jiāng sū Sū cài jiǎng jiu dāo gōng, Huái yáng cài yóu qí zhù zhòng xiān wèi hé xì nì de kǒu gǎn.', '江蘇料理は包丁さばきを重視します。なかでも淮揚料理はうま味と繊細な食感を大切にします。']
      ]],
      ['代表料理と技法', [
        ['清炖狮子头把大肉丸用小火慢炖，口感松软。', 'Qīng dùn shī zi tóu bǎ dà ròu wán yòng xiǎo huǒ màn dùn, kǒu gǎn sōng ruǎn.', '清燉獅子頭は、大きな肉団子を弱火でじっくり煮て、ふんわり仕上げます。'],
        ['苏州松鼠鳜鱼把鱼肉切成花纹，炸开后再浇酸甜汁。', 'Sū zhōu Sōng shǔ guì yú bǎ yú ròu qiē chéng huā wén, zhá kāi hòu zài jiāo suān tián zhī.', '蘇州の松鼠桂魚は、魚に格子状の切り込みを入れ、揚げて切り口を開かせてから甘酢をかけます。']
      ]]
    ]
  },
  minCuisine: {
    name: ['闽菜', 'Mǐn cài', '福建 · 海の幸とスープ'],
    chapters: [
      ['味の特徴', [
        ['福建闽菜常用海产，擅长用汤衬托鲜味。', 'Fú jiàn Mǐn cài cháng yòng hǎi chǎn, shàn cháng yòng tāng chèn tuō xiān wèi.', '福建料理は海産物をよく使い、スープでうま味を引き立てるのが得意です。']
      ]],
      ['代表料理と技法', [
        ['福州佛跳墙把多种海味和肉料放进坛中慢煨。', 'Fú zhōu Fó tiào qiáng bǎ duō zhǒng hǎi wèi hé ròu liào fàng jìn tán zhōng màn wēi.', '福州の仏跳牆は、さまざまな海産物や肉をつぼに入れ、弱火でじっくり煮込みます。'],
        ['荔枝肉因切花的肉块炸后像荔枝而得名，常带酸甜味。', 'Lì zhī ròu yīn qiē huā de ròu kuài zhá hòu xiàng lì zhī ér dé míng, cháng dài suān tián wèi.', '茘枝肉は切り込みを入れて揚げた肉がライチに似ることから名がつき、甘酸っぱく味付けすることが多い料理です。']
      ]]
    ]
  },
  zheCuisine: {
    name: ['浙菜', 'Zhè cài', '浙江 · 季節の食材と香り'],
    chapters: [
      ['味の特徴', [
        ['浙江浙菜重视时令，河鲜、海味和茶叶都能入菜。', 'Zhè jiāng Zhè cài zhòng shì shí lìng, hé xiān, hǎi wèi hé chá yè dōu néng rù cài.', '浙江料理は旬を大切にし、川魚や海産物、茶葉も料理に使います。']
      ]],
      ['代表料理と技法', [
        ['龙井虾仁把虾仁和龙井茶搭配，滑炒出嫩滑口感和清香。', 'Lóng jǐng xiā rén bǎ xiā rén hé Lóng jǐng chá dā pèi, huá chǎo chū nèn huá kǒu gǎn hé qīng xiāng.', '龍井蝦仁はむきエビと龍井茶を合わせ、さっと炒めてエビのなめらかさと茶の香りを引き出します。'],
        ['杭州东坡肉用小火慢焖，五花肉变得软糯。', 'Háng zhōu Dōng pō ròu yòng xiǎo huǒ màn mèn, wǔ huā ròu biàn de ruǎn nuò.', '杭州の東坡肉は、豚バラ肉を弱火でじっくり蒸し煮にして、とろりと仕上げます。']
      ]]
    ]
  },
  xiangCuisine: {
    name: ['湘菜', 'Xiāng cài', '湖南 · 唐辛子・発酵・燻製'],
    chapters: [
      ['味の特徴', [
        ['湖南湘菜常见鲜辣、酸辣，也善用烟熏腊味。', 'Hú nán Xiāng cài cháng jiàn xiān là, suān là, yě shàn yòng yān xūn là wèi.', '湖南料理では唐辛子の鮮烈な辛さや酸味のある辛さがよく見られ、燻製の保存肉も活用します。']
      ]],
      ['代表料理と技法', [
        ['剁椒鱼头把剁碎腌制的辣椒铺在鱼头上蒸。', 'Duò jiāo yú tóu bǎ duò suì yān zhì de là jiāo pū zài yú tóu shàng zhēng.', '剁椒魚頭は、刻んで漬けた唐辛子を魚の頭に敷き詰めて蒸す料理です。'],
        ['腊味合蒸把几种腌腊食材一起蒸，让咸香相融。', 'Là wèi hé zhēng bǎ jǐ zhǒng yān là shí cái yì qǐ zhēng, ràng xián xiāng xiāng róng.', '腊味合蒸では何種類かの塩漬け・乾燥肉を一緒に蒸し、それぞれの香りをなじませます。']
      ]]
    ]
  },
  huiCuisine: {
    name: ['徽菜', 'Huī cài', '安徽・徽州 · 山里の食材と火加減'],
    chapters: [
      ['味の特徴', [
        ['徽菜以徽州风味为代表，善用山间食材，也讲究烧、炖和火候。', 'Huī cài yǐ Huī zhōu fēng wèi wéi dài biǎo, shàn yòng shān jiān shí cái, yě jiǎng jiu shāo, dùn hé huǒ hou.', '徽州を代表とする徽菜は山の食材を活用し、煮付けや煮込みの火加減を重視します。']
      ]],
      ['代表料理と技法', [
        ['臭鳜鱼先经过腌制，再红烧，味道鲜香，鱼肉呈蒜瓣状。', 'Chòu guì yú xiān jīng guò yān zhì, zài hóng shāo, wèi dao xiān xiāng, yú ròu chéng suàn bàn zhuàng.', '臭桂魚は桂魚を漬け込んでから醤油などで煮付ける料理。ほぐした身はニンニクの一片のような形です。'],
        ['问政山笋用嫩笋入馔，有的做法用火腿衬托笋的鲜味。', 'Wèn zhèng shān sǔn yòng nèn sǔn rù zhuàn, yǒu de zuò fǎ yòng huǒ tuǐ chèn tuō sǔn de xiān wèi.', '問政山筍は若いタケノコを使う料理。ハムでタケノコのうま味を引き立てる作り方もあります。']
      ]]
    ]
  }
};

for (const [id, cuisine] of Object.entries(cuisines)) {
  foodCultureLessons[id] = {
    ...cuisine,
    refs: [cuisineReference, ['中国国家移民管理局 · 江蘇・福建・安徽・湖南・浙江の料理', 'https://www.nia.gov.cn/2022cn/files/basic-html/page30.html'], ['央広網 · 八大菜系の代表料理', 'https://old.cnr.cn/2016csy/gundong/20190603/t20190603_524637275.shtml']]
  };
}

Object.assign(foodCultureLessons, {
  northernSnacks: {
    name: ['北方小吃', 'Běi fāng xiǎo chī', '蘭州・西安・天津の街の味'],
    chapters: [
      ['甘粛・蘭州牛肉麺', [
        ['兰州牛肉面以清汤和手拉面见长，常配白萝卜、辣椒油和香菜。', 'Lán zhōu niú ròu miàn yǐ qīng tāng hé shǒu lā miàn jiàn cháng, cháng pèi bái luó bo, là jiāo yóu hé xiāng cài.', '蘭州牛肉麺は澄んだスープと手延べ麺が持ち味。大根、ラー油、パクチーがよく添えられます。']
      ]],
      ['陝西・西安肉夾饃', [
        ['西安肉夹馍把炖得酥软的腊汁肉切碎，夹进烤过的白吉馍。', 'Xī ān ròu jiā mó bǎ dùn de sū ruǎn de là zhī ròu qiē suì, jiā jìn kǎo guo de bái jí mó.', '西安の肉夾饃は、やわらかく煮た豚肉を刻み、焼いた小麦のパン「白吉饃」に挟みます。']
      ]],
      ['天津・煎餅果子', [
        ['天津煎饼果子常用绿豆面摊饼，加鸡蛋，再卷进油条或脆薄的馃箅。', 'Tiān jīn jiān bing guǒ zi cháng yòng lǜ dòu miàn tān bǐng, jiā jī dàn, zài juǎn jìn yóu tiáo huò cuì báo de guǒ bì.', '天津の煎餅果子は、緑豆粉の生地を薄く焼いて卵をのせ、揚げパンや薄い揚げ生地を包むのが定番です。']
      ]]
    ],
    refs: [['中国農業農村部 · 各地の郷土料理', 'https://nmfsj.moa.gov.cn/xwzx_25646/ywjj/201809/t20180913_6157258.htm']]
  },
  southernNoodles: {
    name: ['一碗粉面的风味', 'Yì wǎn fěn miàn de fēng wèi', '武漢・柳州・蒙自の麺を比べる'],
    chapters: [
      ['湖北・武漢熱乾麺', [
        ['武汉人把吃早饭叫作“过早”，热干面拌上芝麻酱，香而浓稠。', 'Wǔ hàn rén bǎ chī zǎo fàn jiào zuò guò zǎo, rè gān miàn bàn shàng zhī ma jiàng, xiāng ér nóng chóu.', '武漢では朝食をとることを「過早」といいます。熱乾麺には香り豊かでとろりとしたゴマだれを絡めます。']
      ]],
      ['広西・柳州螺螄粉', [
        ['柳州螺蛳粉用螺蛳汤配米粉，酸笋带来发酵的酸香。', 'Liǔ zhōu luó sī fěn yòng luó sī tāng pèi mǐ fěn, suān sǔn dài lái fā jiào de suān xiāng.', '柳州の螺螄粉はタニシのだしと米麺を合わせ、発酵タケノコで独特の酸味と香りを加えます。']
      ]],
      ['雲南・蒙自の過橋米線', [
        ['蒙自过桥米线端上桌时，热汤、米线和配料分开，吃时再合在一起。', 'Méng zì guò qiáo mǐ xiàn duān shàng zhuō shí, rè tāng, mǐ xiàn hé pèi liào fēn kāi, chī shí zài hé zài yì qǐ.', '蒙自の過橋米線は熱いスープ、米麺、具が別々に出され、食べるときに合わせます。']
      ]]
    ],
    refs: [
      ['武漢市商務局 · よく知られる朝食', 'https://sw.wuhan.gov.cn/xwdt/mtbd/202510/t20251002_2656088.shtml'],
      ['中国商務部 · 柳州螺螄粉', 'https://lzhbwg.mofcom.gov.cn/edi_ecms_web_front/thb/detail/a2e5b2d399194441a3702f89c5e4b0d2'],
      ['中国無形文化遺産網 · 蒙自の過橋米線', 'https://www.ihchina.cn/Article/Index/detail?id=14760']
    ]
  },
  snackStalls: {
    name: ['蒸笼、烤炉和小吃摊', 'Zhēng lóng, kǎo lú hé xiǎo chī tān', '上海・福建・新疆の軽食'],
    chapters: [
      ['上海・小籠包', [
        ['上海南翔小笼包皮薄，蒸熟后馅里带着汤汁。', 'Shàng hǎi Nán xiáng xiǎo lóng bāo pí báo, zhēng shú hòu xiàn lǐ dài zhe tāng zhī.', '上海・南翔の小籠包は皮が薄く、蒸し上がると餡の中にスープがたまります。']
      ]],
      ['福建・沙県の軽食', [
        ['沙县小吃里的扁肉像小馄饨，常和拌面一起点。', 'Shā xiàn xiǎo chī lǐ de biǎn ròu xiàng xiǎo hún tun, cháng hé bàn miàn yì qǐ diǎn.', '沙県の扁肉は小さなワンタンに似ていて、和え麺と一緒によく注文されます。']
      ]],
      ['新疆・烤包子', [
        ['新疆烤包子常用羊肉和洋葱做馅，在馕坑里烤到外皮酥脆。', 'Xīn jiāng kǎo bāo zi cháng yòng yáng ròu hé yáng cōng zuò xiàn, zài náng kēng lǐ kǎo dào wài pí sū cuì.', '新疆の焼き包子は羊肉とタマネギの餡が定番。ナンを焼く窯で皮がパリッとするまで焼きます。']
      ]]
    ],
    refs: [
      ['中国無形文化遺産網 · 南翔小籠饅頭', 'https://www.ihchina.cn/project_details/14647'],
      ['三明市 · 沙県小吃', 'https://www.sm.gov.cn/zw/zwxx/sjdt/202505/t20250506_2120825.htm']
    ]
  }
});
