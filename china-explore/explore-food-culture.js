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
        ["故事说，三年后他醒了过来，开口还在夸那坛酒。", "Gù shi shuō, sān nián hòu tā xǐng le guò lái, kāi kǒu hái zài kuā nà tán jiǔ.", "話では、三年後に目を覚ました劉伶が、口を開くなり、あの酒をほめたといいます。"],
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
    name: ['绍兴黄酒', 'Shào xīng huáng jiǔ', '水郷・紹興の醸造酒と女児紅'],
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
        ['山东鲁菜讲究咸鲜，常用高汤提鲜。', 'Shān dōng Lǔ cài jiǎng jiu xián xiān, cháng yòng gāo tāng tí xiān.', '山東の魯菜は塩気とうま味を重んじ、だしで素材の味を引き立てます。'],
        ["济南菜善于用高汤，胶东靠海，擅长烹制海鲜。", "Jǐ nán cài shàn yú yòng gāo tāng, Jiāo dōng kào hǎi, shàn cháng pēng zhì hǎi xiān.", "済南ではだしを使いこなし、海に面した膠東では魚介の調理に長けています。"],
        ["明清时期，不少山东厨师进了御膳房，鲁菜成为宫廷饮食的重要来源之一。", "Míng Qīng shí qī, bù shǎo Shān dōng chú shī jìn le yù shàn fáng, Lǔ cài chéng wéi gōng tíng yǐn shí de zhòng yào lái yuán zhī yī.", "明・清の時代には山東の料理人が宮廷の厨房に入り、魯菜は宮廷料理を形作った重要な流れの一つになりました。"],
        ["曲阜孔府的宴席另有一套家传做法，也吸收了地方菜和宫廷菜的长处。", "Qū fù Kǒng fǔ de yàn xí lìng yǒu yí tào jiā chuán zuò fǎ, yě xī shōu le dì fāng cài hé gōng tíng cài de cháng chu.", "曲阜の孔府の宴席には一族に伝わる作り方があり、土地の料理や宮廷料理のよいところも取り入れました。"]
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
        ['四川川菜有麻辣、鱼香等多种味型。', 'Sì chuān Chuān cài yǒu má là, yú xiāng děng duō zhǒng wèi xíng.', '四川料理には、しびれる辛さの麻辣や甘酸っぱく香る魚香など、多彩な味付けがあります。'],
        ["跟湘菜的剁椒鱼头相比，麻婆豆腐多了一层花椒带来的麻感。", "Gēn Xiāng cài de duò jiāo yú tóu xiāng bǐ, má pó dòu fu duō le yì céng huā jiāo dài lái de má gǎn.", "湖南の唐辛子蒸しの魚と比べると、麻婆豆腐には花椒のしびれが加わります。"],
        ["鱼香肉丝常用泡椒、糖和醋调味，酸甜中带辣，菜名里有鱼，菜里却常常没有鱼。", "Yú xiāng ròu sī cháng yòng pào jiāo, táng hé cù tiáo wèi, suān tián zhōng dài là, cài míng lǐ yǒu yú, cài lǐ què cháng cháng méi yǒu yú.", "魚香肉絲は漬け唐辛子、砂糖、酢をよく使い、甘酸っぱさの中に辛みがあります。名前に「魚」が入っていますが、普通は魚を使いません。"]
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
        ['广东粤菜重视食材本味，讲究火候。', 'Guǎng dōng Yuè cài zhòng shì shí cái běn wèi, jiǎng jiu huǒ hou.', '広東料理は素材そのものの味を大切にし、火加減を細かく調整します。'],
        ["同样是一条鱼，广式清蒸留住鱼肉的鲜嫩，鲁菜糖醋鲤鱼则先炸出脆皮，再浇糖醋汁。", "Tóng yàng shì yì tiáo yú, Guǎng shì qīng zhēng liú zhù yú ròu de xiān nèn, Lǔ cài táng cù lǐ yú zé xiān zhá chū cuì pí, zài jiāo táng cù zhī.", "同じ丸ごとの魚でも、広東の清蒸は身のみずみずしさを保ち、山東の糖醋鯉魚は皮をカリッと揚げてから甘酢をかけます。"],
        ["粤菜也有甜咸鲜明的叉烧，烤的时候刷上酱汁，表面带着焦香。", "Yuè cài yě yǒu tián xián xiān míng de chā shāo, kǎo de shí hou shuā shàng jiàng zhī, biǎo miàn dài zhe jiāo xiāng.", "広東料理には甘辛いチャーシューもあります。焼くときにたれを塗り、表面に香ばしさをつけます。"]
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
        ['江苏苏菜讲究刀工，淮扬菜尤其注重鲜味和细腻的口感。', 'Jiāng sū Sū cài jiǎng jiu dāo gōng, Huái yáng cài yóu qí zhù zhòng xiān wèi hé xì nì de kǒu gǎn.', '江蘇料理は包丁さばきを重視します。なかでも淮揚料理はうま味と繊細な食感を大切にします。'],
        ["淮扬菜有一道大煮干丝，把豆腐干切成细丝，再用汤煮入味，刀工和汤都很重要。", "Huái yáng cài yǒu yí dào dà zhǔ gān sī, bǎ dòu fu gān qiē chéng xì sī, zài yòng tāng zhǔ rù wèi, dāo gōng hé tāng dōu hěn zhòng yào.", "淮揚の大煮干絲は、硬めの豆腐を細く切り、だしで煮て味を含ませます。包丁さばきとだしの両方が大切です。"],
        ["苏州的松鼠鳜鱼和山东的糖醋鲤鱼都有酸甜汁，松鼠鳜鱼尤其能看出细密的花刀。", "Sū zhōu de sōng shǔ guì yú hé Shān dōng de táng cù lǐ yú dōu yǒu suān tián zhī, sōng shǔ guì yú yóu qí néng kàn chū xì mì de huā dāo.", "蘇州の松鼠桂魚も山東の糖醋鯉魚も甘酢を使います。松鼠桂魚では細かな飾り包丁に注目できます。"]
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
        ['福建闽菜常用海产，擅长用汤衬托鲜味。', 'Fú jiàn Mǐn cài cháng yòng hǎi chǎn, shàn cháng yòng tāng chèn tuō xiān wèi.', '福建料理は海産物をよく使い、スープでうま味を引き立てるのが得意です。'],
        ["粤菜的清蒸鱼让人留意鱼肉本身的鲜嫩，闽菜的佛跳墙则把几种食材的味道煨进一坛汤里。", "Yuè cài de qīng zhēng yú ràng rén liú yì yú ròu běn shēn de xiān nèn, Mǐn cài de fó tiào qiáng zé bǎ jǐ zhǒng shí cái de wèi dao wēi jìn yì tán tāng lǐ.", "広東の蒸し魚では身そのもののうま味に注目し、福建の仏跳牆では何種類もの食材の味がつぼの中のスープに溶け込みます。"],
        ["福建菜还用红糟调味，醉糟鸡就带着红糟的香气。", "Fú jiàn cài hái yòng hóng zāo tiáo wèi, zuì zāo jī jiù dài zhe hóng zāo de xiāng qì.", "福建では紅色の酒かす「紅糟」も調味に使い、醉糟鶏にはその香りが移ります。"]
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
        ['浙江浙菜重视时令，河鲜、海味和茶叶都能入菜。', 'Zhè jiāng Zhè cài zhòng shì shí lìng, hé xiān, hǎi wèi hé chá yè dōu néng rù cài.', '浙江料理は旬を大切にし、川魚や海産物、茶葉も料理に使います。'],
        ["龙井虾仁借新茶的清香，西湖醋鱼用糖醋衬鱼鲜，杭州菜的清爽有不同的做法。", "Lóng jǐng xiā rén jiè xīn chá de qīng xiāng, Xī hú cù yú yòng táng cù chèn yú xiān, Háng zhōu cài de qīng shuǎng yǒu bù tóng de zuò fǎ.", "龍井蝦仁は新茶の香り、西湖醋魚は甘酢で魚のうま味を引き立てます。杭州料理のすっきりした風味にも、いろいろな出し方があります。"],
        ["同在江南，淮扬大煮干丝用细切和高汤做出滋味，杭州龙井虾仁则从时令茶叶取香。", "Tóng zài Jiāng nán, Huái yáng dà zhǔ gān sī yòng xì qiē hé gāo tāng zuò chū zī wèi, Háng zhōu Lóng jǐng xiā rén zé cóng shí lìng chá yè qǔ xiāng.", "同じ江南でも、淮揚の大煮干絲は細切りとだしが味を支え、杭州の龍井蝦仁は旬の茶葉から香りを引き出します。"]
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
        ['湖南湘菜常见鲜辣、酸辣，也善用烟熏腊味。', 'Hú nán Xiāng cài cháng jiàn xiān là, suān là, yě shàn yòng yān xūn là wèi.', '湖南料理では唐辛子の鮮烈な辛さや酸味のある辛さがよく見られ、燻製の保存肉も活用します。'],
        ["比起麻婆豆腐的花椒麻香，剁椒鱼头更突出辣椒腌过后的鲜辣。", "Bǐ qǐ má pó dòu fu de huā jiāo má xiāng, duò jiāo yú tóu gèng tū chū là jiāo yān guo hòu de xiān là.", "麻婆豆腐の花椒が香るしびれに比べ、剁椒魚頭では漬け唐辛子の鮮烈な辛さが際立ちます。"],
        ["蒸鱼头时，剁椒的味道渗进鱼肉，蒸腊味时，几种腊肉的香气又会互相融合。", "Zhēng yú tóu shí, duò jiāo de wèi dao shèn jìn yú ròu, zhēng là wèi shí, jǐ zhǒng là ròu de xiāng qì yòu huì hù xiāng róng hé.", "魚の頭を蒸すと漬け唐辛子の味が身にしみ込み、保存肉を一緒に蒸すと互いの香りがなじみます。"]
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
        ['徽菜以徽州风味为代表，善用山间食材，也讲究烧、炖和火候。', 'Huī cài yǐ Huī zhōu fēng wèi wéi dài biǎo, shàn yòng shān jiān shí cái, yě jiǎng jiu shāo, dùn hé huǒ hou.', '徽州を代表とする徽菜は山の食材を活用し、煮付けや煮込みの火加減を重視します。'],
        ["同样用鳜鱼，苏州松鼠鳜鱼靠花刀和油炸做出脆皮，徽州臭鳜鱼先腌制，再烧入味。", "Tóng yàng yòng guì yú, Sū zhōu sōng shǔ guì yú kào huā dāo hé yóu zhá zuò chū cuì pí, Huī zhōu chòu guì yú xiān yān zhì, zài shāo rù wèi.", "同じケツギョでも、蘇州では飾り包丁を入れてカリッと揚げ、徽州では漬け込んでから煮て味を含ませます。"],
        ["徽州人也善用山笋和火腿。慢慢加热，火腿的咸鲜能衬出笋的清鲜。", "Huī zhōu rén yě shàn yòng shān sǔn hé huǒ tuǐ. Màn màn jiā rè, huǒ tuǐ de xián xiān néng chèn chū sǔn de qīng xiān.", "徽州では山のタケノコやハムも活用します。ゆっくり火を通すと、ハムの塩気とうま味がタケノコのすがすがしい味を引き立てます。"]
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

/* Story leads and details keep each reading short enough to finish on a phone. */
const foodCultureStories = {
  winePoets: ['月の下から雪の夜へ', [
    ['同样是一杯酒，李白邀来月亮，苏轼想念弟弟，白居易却盼朋友来敲门。', 'Tóng yàng shì yì bēi jiǔ, Lǐ Bái yāo lái yuè liang, Sū Shì xiǎng niàn dì di, Bái Jū yì què pàn péng you lái qiāo mén.', '同じ一杯でも、李白は月を招き、蘇軾は弟を思い、白居易は友が戸をたたくのを待ちました。']
  ]],
  wineLegends: ['空洞の木と、三年の眠り', [
    ['一个故事从树洞里飘出的香气说起，另一个故事则从一家酒坊门口说起。', 'Yí ge gù shi cóng shù dòng lǐ piāo chū de xiāng qì shuō qǐ, lìng yí ge gù shi zé cóng yì jiā jiǔ fāng mén kǒu shuō qǐ.', '一つの話は木のうろから漂う香りで始まり、もう一つは酒蔵の店先から始まります。']
  ]],
  baijiu: ['赤水河から杏花村へ', [
    ['从贵州的赤水河到山西的杏花村，同样是白酒，酒香却各有性格。', 'Cóng Guì zhōu de Chì shuǐ hé dào Shān xī de Xìng huā cūn, tóng yàng shì bái jiǔ, jiǔ xiāng què gè yǒu xìng gé.', '貴州の赤水河から山西の杏花村へ。同じ白酒でも、土地が変われば香りの個性も変わります。'],
    ['说到浓香，四川有宜宾与泸州；说到米香，路线又转向广西桂林。', 'Shuō dào nóng xiāng, Sì chuān yǒu Yí bīn yǔ Lú zhōu， shuō dào mǐ xiāng, lù xiàn yòu zhuǎn xiàng Guǎng xī Guì lín.', '濃香をたどれば四川の宜賓と瀘州へ。米香をたどれば、旅は広西の桂林へ向かいます。']
  ]],
  huangjiu: ['女児紅 · 娘が生まれた年の酒がめ', [
    ['绍兴流传着一个故事：一位裁缝在女儿出生那年酿了酒，把酒坛埋在桂花树下。', 'Shào xīng liú chuán zhe yí ge gù shi: yí wèi cái feng zài nǚ ér chū shēng nà nián niàng le jiǔ, bǎ jiǔ tán mái zài guì huā shù xià.', '紹興に伝わる話では、仕立屋が娘の生まれた年に酒を造り、キンモクセイの木の下に酒がめを埋めました。'],
    ['多年以后，女儿办婚礼，裁缝才想起树下的那坛酒。', 'Duō nián yǐ hòu, nǚ ér bàn hūn lǐ, cái feng cái xiǎng qǐ shù xià de nà tán jiǔ.', '何年もたち、娘の婚礼の日になって、仕立屋は木の下の酒がめを思い出しました。'],
    ['他挖出酒坛，开坛时酒香飘了出来，便拿这坛陈酒招待宾客。', 'Tā wā chū jiǔ tán, kāi tán shí jiǔ xiāng piāo le chū lái, biàn ná zhè tán chén jiǔ zhāo dài bīn kè.', '掘り出したかめを開けると酒の香りが漂い、その熟成酒で招いた人々をもてなしました。'],
    ['这就是“女儿红”的一种民间讲法。酒坛从出生留到婚礼，记下了一个家庭的岁月。', 'Zhè jiù shì Nǚ ér hóng de yì zhǒng mín jiān jiǎng fǎ. Jiǔ tán cóng chū shēng liú dào hūn lǐ, jì xià le yí ge jiā tíng de suì yuè.', 'これが「女児紅」をめぐる言い伝えの一つ。生まれた日から婚礼まで残した酒がめは、家族の年月を刻んでいます。']
  ]],
  coastDrinks: ['港町のレンガ工場と地下の酒蔵', [
    ['在青岛，旧厂房留下了啤酒工业的记忆；到了烟台，故事又延伸到葡萄酒窖。', 'Zài Qīng dǎo, jiù chǎng fáng liú xià le pí jiǔ gōng yè de jì yì; dào le Yān tái, gù shi yòu yán shēn dào pú tao jiǔ jiào.', '青島の古い工場にはビール産業の記憶が残り、煙台では物語がワインの貯蔵庫へ続きます。']
  ]],
  luCuisine: ['鯉の姿を丸ごと皿に', [
    ['一条鲤鱼端上桌，鱼身弯起，像刚跃出水面。', 'Yì tiáo lǐ yú duān shàng zhuō, yú shēn wān qǐ, xiàng gāng yuè chū shuǐ miàn.', '皿に載った一尾の鯉は、たった今水面から跳ねたように、体が反り返っています。'],
    ['同一桌鲁菜，可以从糖醋的酸甜，换到葱烧海参的咸鲜。', 'Tóng yì zhuō Lǔ cài, kě yǐ cóng táng cù de suān tián, huàn dào cōng shāo hǎi shēn de xián xiān.', '同じ山東料理の食卓で、鯉の甘酢から、葱で煮たナマコの塩気とうま味へ。']
  ]],
  chuanCuisine: ['成都の橋のそばから広まった豆腐', [
    ['关于麻婆豆腐的来历，成都有个流传很广的故事。', 'Guān yú Má pó dòu fu de lái lì, Chéng dū yǒu ge liú chuán hěn guǎng de gù shi.', '麻婆豆腐の由来について、成都には広く知られた話があります。'],
    ['据传，万福桥边的小饭馆里，陈家女主人做的豆腐出了名。', 'Jù chuán, Wàn fú qiáo biān de xiǎo fàn guǎn lǐ, Chén jiā nǚ zhǔ rén zuò de dòu fu chū le míng.', '言い伝えでは、万福橋のそばにあった小さな食堂で、陳家の女主人が作る豆腐が評判になりました。']
  ]],
  yueCuisine: ['ふたを取った瞬間に香る葱', [
    ['鱼刚蒸好，葱丝还绿，热油一淋就飘出香气。', 'Yú gāng zhēng hǎo, cōng sī hái lǜ, rè yóu yì lín jiù piāo chū xiāng qì.', '蒸し上がった魚の上で、細切りの葱はまだ青々としています。熱い油をかけると香りが立ちます。'],
    ['在广东，一条鱼蒸得嫩不嫩，往往就看最后那一点火候。', 'Zài Guǎng dōng, yì tiáo yú zhēng de nèn bu nèn, wǎng wǎng jiù kàn zuì hòu nà yì diǎn huǒ hou.', '広東の蒸し魚は、最後のわずかな火加減で身のやわらかさが変わります。']
  ]],
  suCuisine: ['魚なのに、どうして「リス」？', [
    ['鱼肉切成花刀，入油锅后张开，像松鼠蓬松的尾巴。', 'Yú ròu qiē chéng huā dāo, rù yóu guō hòu zhāng kāi, xiàng sōng shǔ péng sōng de wěi ba.', '切れ目を入れた魚を油で揚げると、リスのふさふさした尾のように開きます。'],
    ['苏州老店松鹤楼有不少乾隆南巡的传说，松鼠鳜鱼则是店里的名菜。', 'Sū zhōu lǎo diàn Sōng hè lóu yǒu bù shǎo Qián lóng nán xún de chuán shuō, Sōng shǔ guì yú zé shì diàn lǐ de míng cài.', '蘇州の老舗・松鶴楼には乾隆帝の南巡をめぐる伝説が伝わり、松鼠桂魚はこの店の名物です。']
  ]],
  minCuisine: ['酒がめから漂う香りが、壁を越える', [
    ['相传，福州厨师郑春发见过用酒坛煨菜的做法，后来又反复改进。', 'Xiāng chuán, Fú zhōu chú shī Zhèng Chūn fā jiàn guo yòng jiǔ tán wēi cài de zuò fǎ, hòu lái yòu fǎn fù gǎi jìn.', '福州の料理人・鄭春発は、酒がめで料理を煮込む作り方に出会い、工夫を重ねたと伝えられます。'],
    ['一种说法拿菜香开玩笑：香得连和尚都想翻墙来看看。', 'Yì zhǒng shuō fǎ ná cài xiāng kāi wán xiào: xiāng de lián hé shang dōu xiǎng fān qiáng lái kàn kan.', '料理名の由来を語る説の一つには、「あまりの香りにお坊さんも塀を乗り越えたくなる」という冗談が出てきます。']
  ]],
  zheCuisine: ['西湖の堤と東坡の豚肉', [
    ['杭州流传着一个故事：苏东坡疏浚西湖后，把烧好的肉分给修堤的人。', 'Háng zhōu liú chuán zhe yí ge gù shi: Sū Dōng pō shū jùn Xī hú hòu, bǎ shāo hǎo de ròu fēn gěi xiū dī de rén.', '杭州には、西湖を整備した蘇東坡が、堤を築いた人たちに煮込んだ肉を分けたという伝説があります。'],
    ["相传，大家吃了这道肉，便用苏东坡的名字叫它“东坡肉”。", "Xiāng chuán, dà jiā chī le zhè dào ròu, biàn yòng Sū Dōng pō de míng zi jiào tā Dōng pō ròu.", "言い伝えでは、肉を食べた人たちが蘇東坡の名を取って「東坡肉」と呼ぶようになりました。"],
    ["后来杭州的菜馆也做起了这道菜。如今说到杭州名菜，许多人就会想起这块烧得软糯的东坡肉。", "Hòu lái Háng zhōu de cài guǎn yě zuò qǐ le zhè dào cài. Rú jīn shuō dào Háng zhōu míng cài, xǔ duō rén jiù huì xiǎng qǐ zhè kuài shāo de ruǎn nuò de Dōng pō ròu.", "その後、杭州の料理店にも広まり、今では杭州の名物と聞いて、このとろりと煮込んだ東坡肉を思い浮かべる人がたくさんいます。"],
    ['从西湖边再走到茶山，又是另一种杭州味道：虾仁里添一缕龙井清香。', 'Cóng Xī hú biān zài zǒu dào chá shān, yòu shì lìng yì zhǒng Háng zhōu wèi dao: xiā rén lǐ tiān yì lǚ Lóng jǐng qīng xiāng.', '西湖畔から茶畑へ足を延ばすと、むきエビに龍井茶の香りを添えた、もう一つの杭州の味に出会います。']
  ]],
  xiangCuisine: ['赤い唐辛子の下に隠れた魚', [
    ['揭开蒸笼，鱼头几乎被一层鲜红的剁椒盖住。', 'Jiē kāi zhēng lóng, yú tóu jī hū bèi yì céng xiān hóng de duò jiāo gài zhù.', '蒸籠を開けると、魚の頭は鮮やかな赤い刻み唐辛子でほとんど見えません。'],
    ['蒸出的汁又鲜又辣，鱼肉吃完后，有人还会拿汤汁拌面。', 'Zhēng chū de zhī yòu xiān yòu là, yú ròu chī wán hòu, yǒu rén hái huì ná tāng zhī bàn miàn.', '蒸して出た汁にはうま味と辛みがあり、魚を食べた後、その汁を麺に絡める人もいます。']
  ]],
  huiCuisine: ['山里の食卓で、魚を箸でほぐす', [
    ['徽州一桌菜里，山笋是山里的鲜味，腌过的鳜鱼则是另一种鲜。', 'Huī zhōu yì zhuō cài lǐ, shān sǔn shì shān lǐ de xiān wèi, yān guo de guì yú zé shì lìng yì zhǒng xiān.', '徽州の食卓では、タケノコの山のうま味と、漬け込んだ桂魚のうま味が並びます。'],
    ['夹开红烧鳜鱼，鱼肉一瓣一瓣分开，像白色的蒜瓣。', 'Jiā kāi hóng shāo guì yú, yú ròu yí bàn yí bàn fēn kāi, xiàng bái sè de suàn bàn.', '煮付けた桂魚を箸でほぐすと、白いニンニクのかけらのように身が分かれます。']
  ]],
  northernSnacks: ['麺を伸ばす音、鉄板をこする音', [
    ['兰州的面馆里，师傅边拉边抖，面在手中越变越长。', 'Lán zhōu de miàn guǎn lǐ, shī fu biān lā biān dǒu, miàn zài shǒu zhōng yuè biàn yuè cháng.', '蘭州の麺屋では、職人が生地を引っ張りながら振るたびに、手の中の麺が長くなります。'],
    ['到了西安和天津，麦香又换了样子，一边是烤馍，一边是铁板上的薄饼。', 'Dào le Xī ān hé Tiān jīn, mài xiāng yòu huàn le yàng zi, yì biān shì kǎo mó, yì biān shì tiě bǎn shàng de báo bǐng.', '西安と天津へ行くと、小麦の香りも姿を変えます。西安では焼いた饃、天津では鉄板に広げた薄い生地です。']
  ]],
  southernNoodles: ['橋を渡っても冷めなかったスープ', [
    ['蒙自有个传说：书生在南湖的小岛读书，妻子每天提着饭篮过桥。', 'Méng zì yǒu ge chuán shuō: shū shēng zài Nán hú de xiǎo dǎo dú shū, qī zi měi tiān tí zhe fàn lán guò qiáo.', '蒙自の伝説では、南湖の小島で学ぶ書生のために、妻が毎日、食事のかごを下げて橋を渡りました。'],
    ['为了让米线吃起来还是热的，她把汤和米线分开带，过桥后才放进汤里。', 'Wèi le ràng mǐ xiàn chī qǐ lái hái shì rè de, tā bǎ tāng hé mǐ xiàn fēn kāi dài, guò qiáo hòu cái fàng jìn tāng lǐ.', '温かい麺を食べてもらえるよう、妻はスープと米麺を別々に運び、橋を渡ってから合わせたそうです。']
  ]],
  snackStalls: ['蒸気が消えると、小さな包子が見える', [
    ['在上海南翔，掀开蒸笼，小笼馒头的薄皮下藏着一口鲜汤。', 'Zài Shàng hǎi Nán xiáng, xiān kāi zhēng lóng, xiǎo lóng mán tou de báo pí xià cáng zhe yì kǒu xiān tāng.', '上海の南翔で蒸籠のふたを開けると、薄い皮の下にひと口分のスープを包んだ小籠包が現れます。'],
    ['同样是带馅的面食，沙县用水煮扁肉，新疆则把包子贴在馕坑内壁上烤。', 'Tóng yàng shì dài xiàn de miàn shí, Shā xiàn yòng shuǐ zhǔ biǎn ròu, Xīn jiāng zé bǎ bāo zi tiē zài náng kēng nèi bì shàng kǎo.', '餡を包んだ小麦料理でも、沙県の扁肉はゆで、新疆の包子は窯の内壁に貼り付けて焼きます。']
  ]]
};

for (const [id, [heading, lines]] of Object.entries(foodCultureStories)) {
  foodCultureLessons[id].chapters.unshift([heading, lines]);
}

foodCultureLessons.huangjiu.refs.push(['江南大学 · 花雕と女児紅の伝承', 'https://rctff.jiangnan.edu.cn/info/1071/1926.htm'], ['浙江広電 · 女児紅をめぐる民話', 'https://www.cztv.com/newsDetail/791151']);
foodCultureLessons.chuanCuisine.refs.push(['中国商務部 · 陳麻婆豆腐', 'https://lzhbwg.mofcom.gov.cn/edi_ecms_web_front/thb/detail/f7ab3a6e7ea0426d8fd104fc7c93df79']);
foodCultureLessons.suCuisine.refs.push(['蘇州市地方志 · 松鶴楼', 'https://dfzb.suzhou.gov.cn/dfzb/szdq/201511/16eff57279ec489487d8583568411cab.shtml']);
foodCultureLessons.minCuisine.refs.push(['福州市 · 聚春園と仏跳牆', 'https://gzw.fuzhou.gov.cn/zwgk/gqfc/202409/t20240923_4896963.htm']);
foodCultureLessons.zheCuisine.refs.push(['中国教育部 · 杭州の料理と東坡肉の伝承', 'https://www.moe.gov.cn/jyb_xwfb/xw_zt/moe_357/jyzt_2019n/2019_zt28/2019_zt28_ssfw/2019_zt28_sszn/201910/P020191014410281546053.pdf']);
foodCultureLessons.southernNoodles.refs.push(['紅河州 · 過橋米線の伝説', 'https://www.hh.gov.cn/info/9021/795922.htm']);

foodCultureLessons.winePoets.chapters[1][1].push(
  ['采石矶的传说还给他安排了一条鲸鱼，让诗人骑鲸远去。', 'Cǎi shí jī de chuán shuō hái gěi tā ān pái le yì tiáo jīng yú, ràng shī rén qí jīng yuǎn qù.', '采石磯の伝説ではさらにクジラが現れ、詩人はその背に乗って遠くへ去ります。']
);
foodCultureLessons.winePoets.chapters[2][1].push(
  ['李白把月亮请到身边，苏轼却让月亮把相隔千里的亲人连在一起。', 'Lǐ Bái bǎ yuè liang qǐng dào shēn biān, Sū Shì què ràng yuè liang bǎ xiāng gé qiān lǐ de qīn rén lián zài yì qǐ.', '李白は月を自分のそばへ招き、蘇軾は月に、遠く離れた家族をつなぐ役目を託しました。']
);
foodCultureLessons.winePoets.chapters[3][1].push(
  ['这首诗停在一问：雪就要下了，朋友会不会来？', 'Zhè shǒu shī tíng zài yí wèn: xuě jiù yào xià le, péng you huì bu huì lái?', '詩は問いかけで結ばれます。もうすぐ雪が降る。友は来てくれるだろうか。']
);

const foodCultureIllustrations = {
  winePoets: [
    ['li-bai', '月と影を招く李白'],
    ['catching-moon', '采石磯の月とクジラの伝説'],
    ['su-shi', '中秋の月を見上げる蘇軾'],
    ['bai-juyi', '雪の夕暮れ、炉を囲む支度']
  ],
  wineLegends: [['du-kang', '杜康の伝承に登場する木のうろ']],
  baijiu: [['baijiu-vessels', '山あいの白酒のかめとコウリャン']],
  huangjiu: [['shaoxing-jars', '紹興の水路と模様入りの酒がめ']],
  coastDrinks: [['coastal-drinks', 'レンガ造りの工場とホップ、ブドウ']],
  luCuisine: [['sweet-sour-carp', '山東の鯉の甘酢あんかけ']],
  chuanCuisine: [['mapo-tofu', '豆板醤と花椒が香る麻婆豆腐'], ['chengdu-bridge', '成都の橋のそばにあった食堂を描いた場面']],
  yueCuisine: [['steamed-fish', '葱と生姜をのせた広東の蒸し魚']],
  suCuisine: [['squirrel-fish', '切り身がリスの尾のように開く松鼠桂魚']],
  minCuisine: [['soup-jar', '陶器のつぼで煮込む仏跳牆'], ['fuzhou-kitchen', '福州の厨房と仏跳牆に使われる食材']],
  zheCuisine: [['dongpo-pork', '杭州の東坡肉'], ['west-lake-dike', '西湖の堤を築く人々と東坡肉の伝承']],
  xiangCuisine: [['chopped-chili-fish', '刻み唐辛子を敷き詰めた蒸し魚の頭']],
  huiCuisine: [['huizhou-fish', '徽州の町並みと煮付けた桂魚']],
  northernSnacks: [['hand-pulled-noodles', '蘭州の麺屋で手延べする職人'], ['northern-stall', '西安の肉夾饃と天津の煎餅果子']],
  southernNoodles: [['crossing-noodles', 'スープ・米麺・具を別々に並べる過橋米線'], [], [], ['mengzi-bridge', '食事を持って蒙自の橋を渡る伝説']],
  snackStalls: [['xiaolongbao', '竹の蒸籠で蒸した南翔の小籠包'], [], ['filled-snacks', '福建の扁肉と新疆の焼き包子']]
};

for (const [id, pictures] of Object.entries(foodCultureIllustrations)) {
  const lesson = foodCultureLessons[id];
  lesson.thumbnail = pictures[0][0];
  pictures.forEach(([key, caption], chapterIndex) => {
    if (!key) return;
    photos[key] = { url: `./photos/food-culture/${key}.webp`, illustrated: true, width: 480, height: 360 };
    lesson.chapters[chapterIndex][2] = [[key, caption]];
  });
}

foodCultureLessons.chuanCuisine.chapters[0][1].push(
  ["后来，这道豆腐以“麻婆豆腐”的名字传开，从成都的小饭馆走上了各地的餐桌。", "Hòu lái, zhè dào dòu fu yǐ Má pó dòu fu de míng zi chuán kāi, cóng Chéng dū de xiǎo fàn guǎn zǒu shàng le gè dì de cān zhuō.", "やがて「麻婆豆腐」の名で広まり、成都の小さな食堂から各地の食卓へと伝わりました。"],
  ['如今提起“陈麻婆”，不少人先想到的就是那碗又麻又辣的豆腐。', 'Rú jīn tí qǐ Chén Má pó, bù shǎo rén xiān xiǎng dào de jiù shì nà wǎn yòu má yòu là de dòu fu.', '今「陳麻婆」と聞いて、まず思い浮かぶのはあのしびれて辛い豆腐料理、という人も少なくありません。']
);
foodCultureLessons.minCuisine.chapters[0][1].push(
  ["按这个说法，人们就从“翻墙”的玩笑里取了菜名。后来，佛跳墙成了福州聚春园的招牌菜。", "Àn zhè ge shuō fǎ, rén men jiù cóng fān qiáng de wán xiào lǐ qǔ le cài míng. Hòu lái, Fó tiào qiáng chéng le Fú zhōu Jù chūn yuán de zhāo pái cài.", "この説では「塀を乗り越える」という冗談から料理名が生まれたといいます。やがて仏跳牆は福州の聚春園を代表する一品になりました。"],
  ['听到“佛跳墙”三个字，人们还没掀盖，就已经开始想象坛里的香气。', 'Tīng dào Fó tiào qiáng sān ge zì, rén men hái méi xiān gài, jiù yǐ jīng kāi shǐ xiǎng xiàng tán lǐ de xiāng qì.', '「仏跳牆」という名を聞くと、ふたを開ける前から、つぼの中の香りを想像してしまいます。']
);
foodCultureLessons.southernNoodles.chapters[0][1].push(
  ["传说里，那座每天要走过的桥，后来也留在了“过桥米线”这个名字里。", "Chuán shuō lǐ, nà zuò měi tiān yào zǒu guò de qiáo, hòu lái yě liú zài le Guò qiáo mǐ xiàn zhè ge míng zi lǐ.", "言い伝えの中で毎日渡ったあの橋が、やがて「過橋米線」という名前に残りました。"],
  ['今天在蒙自，热汤和米线分开上桌，还是这道菜最容易认出的地方。', 'Jīn tiān zài Méng zì, rè tāng hé mǐ xiàn fēn kāi shàng zhuō, hái shì zhè dào cài zuì róng yì rèn chū de dì fang.', '今も蒙自では、熱いスープと米麺が別々に出てくるのが、この料理の見分けやすい特徴です。']
);

foodCultureLessons.luCuisine.chapters.push(['済南・九転大腸の名がつくまで', [
  ['相传，清末济南九华楼端出一道烧大肠，席间有客人给它起名“九转大肠”。', 'Xiāng chuán, Qīng mò Jǐ nán Jiǔ huá lóu duān chū yí dào shāo dà cháng, xí jiān yǒu kè ren gěi tā qǐ míng Jiǔ zhuǎn dà cháng.', '清末の済南にあった九華楼で豚の大腸の煮込みが出され、客の一人が「九転大腸」と名付けたと伝わります。'],
  ['“九”呼应店名，“九转”又让人想到道家反复炼制的仙丹，借此夸厨师做得精细。', 'Jiǔ hū yìng diàn míng, jiǔ zhuǎn yòu ràng rén xiǎng dào Dào jiā fǎn fù liàn zhì de xiān dān, jiè cǐ kuā chú shī zuò de jīng xì.', '「九」は店名にちなんだもの。「九転」には道家が何度も練り上げる仙丹を重ね、料理人の手の込んだ仕事をたたえる意味もあったそうです。'],
  ['大肠先煮，再炸，最后用小火烧到收汁，成菜软嫩红亮。', 'Dà cháng xiān zhǔ, zài zhá, zuì hòu yòng xiǎo huǒ shāo dào shōu zhī, chéng cài ruǎn nèn hóng liàng.', '豚の大腸をまずゆで、次に揚げ、最後に弱火で煮汁を煮詰めます。つやのある赤褐色に、柔らかく仕上がります。'],
  ['醋、糖和香料层层入味，酸、甜、香、辣、咸都能尝到。', 'Cù, táng hé xiāng liào céng céng rù wèi, suān, tián, xiāng, là, xián dōu néng cháng dào.', '酢、砂糖、香辛料の風味が重なり、酸味、甘み、香り、辛み、塩気がそろいます。']
], [['nine-turns', '済南の九転大腸']]]);

photos['nine-turns'] = { url: './photos/food-culture/nine-turns.webp', illustrated: true, width: 480, height: 360 };
foodCultureLessons.luCuisine.refs.push(['中国地情網 · 九転大腸の技法と由来', 'https://zhongguodiqing.cn/msdg/201903/t20190321_4851276.shtml']);

foodCultureLessons.luCuisine.refs.push(
  ['山東地情档案 · 魯菜と宮廷の御膳', 'https://shandong-chorography.org/database/a/section/81/article/116/'],
  ['山東地情档案 · 孔府料理', 'https://shandong-chorography.org/database/a/section/81/article/120/']
);
