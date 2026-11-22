/* 中上級の読み物。各行のピンインは漢字一字に一音節。 */
const features = {
  yangtze: {
    name: ['长江', 'Cháng jiāng', '青蔵高原から東シナ海へ'],
    photo: 'qutang', caption: '长江三峡 · 瞿塘峡',
    chapters: [
      ['河をたどる', [
        ['长江发源于青藏高原，在上海附近流入东海。', 'Cháng jiāng fā yuán yú Qīng Zàng gāo yuán, zài Shàng hǎi fù jìn liú rù Dōng hǎi.', '長江は青蔵高原に源を発し、上海付近で東シナ海に注ぎます。'],
        ['它是中国最长的河流，也是连接内陆与沿海的水路。', 'Tā shì Zhōng guó zuì cháng de hé liú, yě shì lián jiē nèi lù yǔ yán hǎi de shuǐ lù.', '中国最長の河川で、内陸と沿岸を結ぶ水路でもあります。'],
        ['三峡位于上游，洞庭湖和鄱阳湖都与长江相通。', 'Sān xiá wèi yú shàng yóu, Dòng tíng hú hé Pó yáng hú dōu yǔ Cháng jiāng xiāng tōng.', '三峡は上流にあり、洞庭湖と鄱陽湖はどちらも長江につながっています。'],
        ['从四川盆地到武汉，再到长江三角洲，沿江的地貌和城市不断变化。','Cóng Sì chuān pén dì dào Wǔ hàn, zài dào Cháng jiāng sān jiǎo zhōu, yán jiāng de dì mào hé chéng shì bú duàn biàn huà.','四川盆地から武漢、長江デルタへと進むにつれ、川沿いの地形や街が変わります。'],
        ['流域不只包括干流，还包括支流汇水的地方。', 'Liú yù bù zhǐ bāo kuò gàn liú, hái bāo kuò zhī liú huì shuǐ de dì fang.', '流域には本流だけでなく、支流に水が集まる地域も含まれます。']
      ]],
      ['夔門で李白の船を追う', [
        ['站在白帝城回望，夔门两侧的山崖像一扇巨大的门。','Zhàn zài Bái dì chéng huí wàng, Kuí mén liǎng cè de shān yá xiàng yí shàn jù dà de mén.','白帝城から見渡すと、夔門の両側の崖が大きな門のように見えます。'],
        ['朝辞白帝彩云间，千里江陵一日还。', 'Zhāo cí Bái dì cǎi yún jiān, qiān lǐ Jiāng líng yí rì huán.', '朝、彩雲の中の白帝城を発ち、千里先の江陵へ一日で帰る。'],
        ['两岸猿声啼不住，轻舟已过万重山。','Liǎng àn yuán shēng tí bú zhù, qīng zhōu yǐ guò wàn chóng shān.','両岸で猿が鳴きやまぬうちに、小舟は幾重もの山を通り過ぎた。'],
        ['诗中小船走得快，今天的货船也沿这条水路往下游走。','Shī zhōng xiǎo chuán zǒu de kuài, jīn tiān de huò chuán yě yán zhè tiáo shuǐ lù wǎng xià yóu zǒu.','詩では小舟が軽やかに進みます。今も貨物船が同じ水路を下流へ向かいます。']
      ], [["baidicheng", "白帝城 · 重庆奉节"]]],
      ['米と水が支えたまち', [
        ['在长江下游，良渚人种植水稻，也修建水利工程。', 'Zài Cháng jiāng xià yóu, Liáng zhǔ rén zhòng zhí shuǐ dào, yě xiū jiàn shuǐ lì gōng chéng.', '長江下流の良渚では、人々が稲を栽培し、水利施設も築きました。'],
        ['古城、玉器和水坝，让我们看见早期社会怎样组织生产和生活。', 'Gǔ chéng, yù qì hé shuǐ bà, ràng wǒ men kàn jiàn zǎo qī shè huì zěn yàng zǔ zhī shēng chǎn hé shēng huó.', '古城や玉器、ダムから、初期の社会が生産や暮らしをどう組織したかが見えてきます。'],
        ['今天，货物可以从四川宜宾沿江运到上海，再换船出海。', 'Jīn tiān, huò wù kě yǐ cóng Sì chuān Yí bīn yán jiāng yùn dào Shàng hǎi, zài huàn chuán chū hǎi.', '現在は四川の宜賓から上海まで川を使って貨物を運び、船を替えて海外へ送れます。']
      ]],
      ['白帝城から李白と旅する', [
        ['到重庆奉节看夔门时，不妨想象李白乘船顺流而下的心情。', 'Dào Chóng qìng Fèng jié kàn Kuí mén shí, bù fáng xiǎng xiàng Lǐ Bái chéng chuán shùn liú ér xià de xīn qíng.', '重慶の奉節で夔門を見るときは、船で川を下った李白の気持ちを想像してみましょう。']
      ]]
    ],
    words: [['流域','liú yù','流域'],['支流','zhī liú','支流'],['水利工程','shuǐ lì gōng chéng','治水・利水施設'],['顺流而下','shùn liú ér xià','流れに沿って下る']],
    check: ['良渚の人々は米づくりのほかに、水とどう付き合っていましたか。', '水利施設を築いていました。古城、玉器、ダムから、当時の社会の姿を読み取れます。'],
    task: ['どうして内陸の貨物を長江で海外へ運べるのでしょう。「沿江」「再」を使って説明しましょう。',
      ['货物先沿江到上海，再换船出海。','Huò wù xiān yán jiāng dào Shàng hǎi, zài huàn chuán chū hǎi.','貨物はまず川沿いに上海へ運ばれ、それから船を替えて海外へ向かいます。']],
    refs: [['中国科学院 · 長江の地理','https://www.igsnrr.cas.cn/cbkx/kpyd/zgdl/cnszy/202009/t20200910_5692425.html'],['ユネスコ · 良渚','https://whc.unesco.org/en/list/1592/'],['交通運輸部 · 長江の物流','https://www.mot.gov.cn/xinwen/jiaotongyaowen/202608/t20260827_4223270.html'],['重慶市 · 白帝城と瞿塘峡','https://cq.gov.cn/zjcq/cycq/zmjd/zqaaaaajjq/202606/t20260604_15729050.html'],['重慶市地方志 · 李白の詩','https://dfz.cq.gov.cn/zqlswh/ldmr/202502/t20250220_14324316.html']]
  },
  yellowriver: {
    name: ['黄河', 'Huáng hé', '黄土高原を越えて渤海へ'],
    photo: 'hukou', caption: '黄河 · 壶口瀑布',
    chapters: [
      ['大きく曲がる川', [
        ['黄河是中国第二长河，发源于青藏高原，最后在山东流入渤海。','Huáng hé shì Zhōng guó dì èr cháng hé, fā yuán yú Qīng Zàng gāo yuán, zuì hòu zài Shān dōng liú rù Bó hǎi.','黄河は中国で二番目に長い川です。青蔵高原に源を発し、山東省で渤海に注ぎます。'],
        ['干流流经九个省区，在河套一带画出一个大弯。','Gàn liú liú jīng jiǔ ge shěng qū, zài Hé tào yí dài huà chū yí ge dà wān.','本流は九つの省・自治区を流れ、河套付近で大きく曲がります。'],
        ['从上游的河套、中游的关中，到下游的齐鲁，沿河各地有不同的风土。','Cóng shàng yóu de Hé tào, zhōng yóu de Guān zhōng, dào xià yóu de Qí Lǔ, yán hé gè dì yǒu bù tóng de fēng tǔ.','上流の河套、中流の関中、下流の斉魯と、黄河沿いにはさまざまな風土があります。'],
        ['中游穿过黄土高原，支流带来的泥沙让河水变得浑浊。','Zhōng yóu chuān guò Huáng tǔ gāo yuán, zhī liú dài lái de ní shā ràng hé shuǐ biàn de hún zhuó.','中流は黄土高原を通り、支流から来る土砂が水を濁らせます。']
      ]],
      ['三門峡に残る大禹の話', [
        ['到三门峡，听听当地人怎样讲大禹的故事。','Dào Sān mén xiá, tīng ting dāng dì rén zěn yàng jiǎng Dà Yǔ de gù shi.','三門峡を訪れたら、地元に伝わる大禹の話を聞いてみましょう。'],
        ['传说大禹在山间劈开三道门，给洪水找到了出路。','Chuán shuō Dà Yǔ zài shān jiān pī kāi sān dào mén, gěi hóng shuǐ zhǎo dào le chū lù.','伝説では、大禹が山を割って三つの門をつくり、洪水の出口を開いたといいます。'],
        ['这个故事把治水说得像开门一样，讲的是怎样让水有路可走。','Zhè ge gù shi bǎ zhì shuǐ shuō de xiàng kāi mén yí yàng, jiǎng de shì zěn yàng ràng shuǐ yǒu lù kě zǒu.','治水を門を開けることにたとえ、水の通り道をどう作るかを伝える話です。']
      ]],
      ['農耕と治水', [
        ['关中地区的仰韶先民种过粟和黍，这些谷物适应较干燥的环境。','Guān zhōng dì qū de Yǎng sháo xiān mín zhòng guo sù hé shǔ, zhè xiē gǔ wù shì yìng jiào gān zào de huán jìng.','関中の仰韶文化の人々は、比較的乾燥した環境に適したアワやキビを栽培しました。'],
        ['从黄河流域的粟黍到长江流域的稻米，中华文明有多处源头。','Cóng Huáng hé liú yù de sù shǔ dào Cháng jiāng liú yù de dào mǐ, Zhōng huá wén míng yǒu duō chù yuán tóu.','黄河流域のアワ・キビから長江流域の米まで、中華文明には複数の源があります。'],
        ['河水能灌溉农田，但下游泥沙淤积也会增加洪水风险。','Hé shuǐ néng guàn gài nóng tián, dàn xià yóu ní shā yū jī yě huì zēng jiā hóng shuǐ fēng xiǎn.','川の水は農地を潤しますが、下流で土砂が堆積すると洪水の危険も高まります。'],
        ['河套的灌溉农业，把沿河的水资源变成了粮食生产的条件。','Hé tào de guàn gài nóng yè, bǎ yán hé de shuǐ zī yuán biàn chéng le liáng shi shēng chǎn de tiáo jiàn.','河套の灌漑農業は、川の水を食料生産に活かしています。']
      ]],
      ['壺口の水音と大禹の伝説', [
        ['壶口瀑布位于山西吉县与陕西宜川之间。','Hú kǒu pù bù wèi yú Shān xī Jí xiàn yǔ Shǎn xī Yí chuān zhī jiān.','壺口瀑布は山西省吉県と陝西省宜川の間にあります。'],
        ['在壶口，河道突然收窄，水从高处奔腾而下。','Zài Hú kǒu, hé dào tū rán shōu zhǎi, shuǐ cóng gāo chù bēn téng ér xià.','壺口では川幅が急に狭まり、水が高い所から勢いよく落ちます。'],
        ['传说大禹为了治水，三次经过家门却没有进去。','Chuán shuō Dà Yǔ wèi le zhì shuǐ, sān cì jīng guò jiā mén què méi yǒu jìn qù.','伝説では、大禹は治水のため三度も家の前を通りながら、中に入りませんでした。']
      ], [["hukouClose", "黄河壶口瀑布 · 奔腾而下的河水"]]]
    ],
    words: [['灌溉','guàn gài','灌漑'],['泥沙','ní shā','土砂'],['淤积','yū jī','堆積する'],['治水','zhì shuǐ','治水']],
    check: ['黄河の水は、中流でなぜ濁るのでしょう。', '黄土高原を流れる支流が、本流へ土砂を運び込むためです。'],
    task: ['なぜ黄河は農業を支えながら洪水の原因にもなるのでしょう。「能」「但」を使って旅行仲間に説明しましょう。',
      ['黄河能灌溉农田，但泥沙淤积会增加洪水风险。','Huáng hé néng guàn gài nóng tián, dàn ní shā yū jī huì zēng jiā hóng shuǐ fēng xiǎn.','黄河は農地を潤しますが、土砂の堆積は洪水の危険を高めます。']],
    refs: [['中国科学院 · 黄河の地理','https://www.igsnrr.cas.cn/cbkx/kpyd/zgdl/cnszy/202009/t20200910_5692424.html'],['中国社会科学網 · 仰韶の農耕','https://www.cssn.cn/kgxc/kgxc_xccz/202312/t20231221_5720492.shtml'],['新華網 · 壺口瀑布','https://www.xinhuanet.com/local/20260601/f0964a9aba7c42c5bc7074a1373a5b61/c.html'],['河南省档案館 · 三門峡の大禹伝説','https://www.hada.gov.cn/2022/06-29/154792.html'],['四川公共文化雲 · 禹の伝説','https://www.scc.org.cn/culturaldetail.fds?id=36398']]
  },
  wuyue: {
    name: ['五岳', 'Wǔ yuè', '方角で覚える中国の五つの名山'],
    photo: 'taishan', caption: '东岳泰山',
    chapters: [
      ['五岳を地図で覚える', [
        ['东岳泰山在山东，西岳华山在陕西。','Dōng yuè Tài shān zài Shān dōng, Xī yuè Huà shān zài Shǎn xī.','東岳の泰山は山東省、西岳の華山は陝西省にあります。'],
        ['南岳衡山在湖南，北岳恒山在山西。','Nán yuè Héng shān zài Hú nán, Běi yuè Héng shān zài Shān xī.','南岳の衡山は湖南省、北岳の恒山は山西省にあります。'],
        ['位于河南的嵩山是中岳。','Wèi yú Hé nán de Sōng shān shì Zhōng yuè.','河南省の嵩山が中岳です。'],
        ['衡山和恒山读音一样，却是两座不同的山。','Héng shān hé Héng shān dú yīn yí yàng, què shì liǎng zuò bù tóng de shān.','衡山と恒山は同じ発音ですが、別の山です。']
      ]],
      ['泰山の景色を杜甫の言葉で見る', [
        ['会当凌绝顶，一览众山小。','Huì dāng líng jué dǐng, yì lǎn zhòng shān xiǎo.','いつか頂に立ち、山々を見渡してその小ささを感じたい。'],
        ['杜甫在诗中写下了登顶的愿望。','Dù Fǔ zài shī zhōng xiě xià le dēng dǐng de yuàn wàng.','杜甫は詩の中で、頂上に登りたいという願いを詠みました。'],
        ['如果你站在泰山顶上，会怎样向朋友形容眼前的景色？','Rú guǒ nǐ zhàn zài Tài shān dǐng shàng, huì zěn yàng xiàng péng you xíng róng yǎn qián de jǐng sè?','泰山の頂に立ったら、目の前の景色を友達にどう伝えますか。']
      ]],
      ['皇帝が泰山に登った理由', [
        ['五岳有历史和礼仪上的地位，泰山尤其与封禅有关。','Wǔ yuè yǒu lì shǐ hé lǐ yí shàng de dì wèi, Tài shān yóu qí yǔ fēng shàn yǒu guān.','五岳には歴史や儀礼の上で重要な位置づけがあり、泰山は特に封禅と結びついています。'],
        ['古代皇帝登上泰山祭告天地，后人也在山上留下许多石刻。','Gǔ dài huáng dì dēng shàng Tài shān jì gào tiān dì, hòu rén yě zài shān shàng liú xià xǔ duō shí kè.','古代の皇帝は泰山に登って天地を祭り、後世の人々は山に多くの石刻を残しました。']
      ]]
    ],
    words: [['五岳','Wǔ yuè','五岳'],['封禅','fēng shàn','古代の皇帝が天地を祭る儀式'],['石刻','shí kè','石に刻んだ文字や図柄'],['读音','dú yīn','発音']],
    check: ['中岳はどの山ですか。', '河南省の嵩山です。少林寺があるのは嵩山の少室山一帯です。'],
    task: ['「Héngshānに行きたい」と聞いたら、どちらの山かどう確認しますか。',
      ['你说的是湖南的衡山，还是山西的恒山？','Nǐ shuō de shì Hú nán de Héng shān, hái shì Shān xī de Héng shān?','湖南省の衡山ですか、それとも山西省の恒山ですか。']],
    refs: [['コトバンク · 五岳','https://kotobank.jp/word/%E4%BA%94%E5%B2%B3-498636'],['ユネスコ · 泰山','https://whc.unesco.org/en/list/437/']]
  },
  songshan: {
    name: ['嵩山与少林寺', 'Sōng shān yǔ Shào lín sì', '中岳の寺と少林武術'],
    photo: 'shaolin', caption: '嵩山少林寺 · 山门',
    chapters: [
      ['少林寺の入り口から', [
        ['在河南登封，少林寺位于嵩山的少室山一带。','Zài Hé nán Dēng fēng, Shào lín sì wèi yú Sōng shān de Shào shì shān yí dài.','河南省登封にある少林寺は、嵩山の少室山一帯に位置します。'],
        ['从嵩山少室山一带走进少林寺，可以从山门一路看到寺院的殿堂。','Cóng Sōng shān Shào shì shān yí dài zǒu jìn Shào lín sì, kě yǐ cóng shān mén yí lù kàn dào sì yuàn de diàn táng.','嵩山の少室山一帯から少林寺に入り、山門から寺の堂宇へと進みます。'],
        ['山门是寺院的入口，塔林里的古塔则让人看见寺院的历史。','Shān mén shì sì yuàn de rù kǒu, tǎ lín lǐ de gǔ tǎ zé ràng rén kàn jiàn sì yuàn de lì shǐ.','山門は寺院の入口で、塔林の古い塔は寺の歴史を伝えます。'],
        ['少林寺是登封世界遗产的一部分。','Shào lín sì shì Dēng fēng shì jiè yí chǎn de yí bù fen.','少林寺は登封の世界遺産を構成する一部です。']
      ], [["shaolinForest", "河南登封 · 少林寺塔林"]]],
      ['千仏殿で武術を想像する', [
        ['走进千佛殿，可以留意地面上的凹坑。','Zǒu jìn Qiān fó diàn, kě yǐ liú yì dì miàn shàng de āo kēng.','千仏殿に入ったら、床のくぼみに注目してみましょう。'],
        ['人们常把这些凹坑和僧人练拳联系起来。','Rén men cháng bǎ zhè xiē āo kēng hé sēng rén liàn quán lián xì qǐ lái.','このくぼみは、僧侶の拳法の稽古と結びつけて語られます。'],
        ['看完壁画，再读一读碑文，你会发现同一个故事可以有不同的讲法。','Kàn wán bì huà, zài dú yi dú bēi wén, nǐ huì fā xiàn tóng yí ge gù shi kě yǐ yǒu bù tóng de jiǎng fǎ.','壁画を見てから碑文を読むと、同じ物語にも異なる語り方があると分かります。']
      ], [["shaolinPractice", "少林拳 · 武术演示"]]],
      ['碑文と映画で何が違う？', [
        ['电影让十三棍僧救唐王的故事广为流传。','Diàn yǐng ràng shí sān gùn sēng jiù Táng wáng de gù shi guǎng wéi liú chuán.','映画を通じて「十三人の棍僧が唐王を救う」という話が広く知られました。'],
        ['寺中的碑文记载了僧人协助李世民的事，但没有电影里那样的救人场面。','Sì zhōng de bēi wén jì zǎi le sēng rén xié zhù Lǐ Shì mín de shì, dàn méi yǒu diàn yǐng lǐ nà yàng de jiù rén chǎng miàn.','寺の碑文は僧侶が李世民を助けたことを伝えますが、映画のような救出場面は書かれていません。'],
        ['看过武术表演以后，可以再去看看碑刻和古塔。','Kàn guo wǔ shù biǎo yǎn yǐ hòu, kě yǐ zài qù kàn kan bēi kè hé gǔ tǎ.','武術の演武を見た後は、碑刻や古い塔にも足を運ぶとよいでしょう。']
      ]]
    ],
    words: [['山门','shān mén','寺院の正門'],['塔林','tǎ lín','塔が並ぶ一画'],['碑文','bēi wén','碑に刻んだ文章'],['武术表演','wǔ shù biǎo yǎn','武術の演武']],
    check: ['映画と碑文の両方に共通することは何ですか。', '僧侶が李世民を助けたことです。映画には、碑文には書かれていない救出場面があります。'],
    task: ['映画を見て少林寺に来た友人に、演武のほかに何を見に行けるか提案しましょう。',
      ['我们先看武术表演，再去塔林看看。','Wǒ men xiān kàn wǔ shù biǎo yǎn, zài qù tǎ lín kàn kan.','まず演武を見て、次に塔林へ行ってみましょう。']],
    refs: [['文化観光部 · 嵩山少林景区','https://sjfw.mct.gov.cn/site/dataservice/culdetails?curId=10&id=34956'],['ユネスコ · 登封の歴史建築群','https://whc.unesco.org/en/list/1305/']]
  },
  wudang: {
    name: ['武当山', 'Wǔ dāng shān', '道教の宮観と武当武術'],
    photo: 'wudanghall', caption: '武当山 · 金殿',
    chapters: [
      ['山の上の道教建築', [
        ['武当山在湖北十堰，以道教古建筑群闻名。','Wǔ dāng shān zài Hú běi Shí yàn, yǐ Dào jiào gǔ jiàn zhù qún wén míng.','湖北省十堰の武当山は、道教の古建築群で知られます。'],
        ['从山间的宫观到山顶的金殿，建筑顺着山势展开。','Cóng shān jiān de gōng guàn dào shān dǐng de Jīn diàn, jiàn zhù shùn zhe shān shì zhǎn kāi.','山中の道観から山頂の金殿まで、建物が地形に沿って広がっています。'],
        ['明代大规模修建武当山的宫观，留下了今天还能看到的建筑。','Míng dài dà guī mó xiū jiàn Wǔ dāng shān de gōng guàn, liú xià le jīn tiān hái néng kàn dào de jiàn zhù.','明代に大規模な造営が行われ、今も見られる建物が残りました。']
      ], [["wudangPalace", "湖北十堰 · 武当山紫霄宫"]]],
      ['金殿まで登り、山の形を見る', [
        ['在山下看金殿，只能看见一个小小的屋顶。','Zài shān xià kàn Jīn diàn, zhǐ néng kàn jiàn yí ge xiǎo xiǎo de wū dǐng.','山の下から金殿を見上げると、屋根は小さく見えます。'],
        ['登上天柱峰，回头看看来时的路，宫观随着山势高低错落。','Dēng shàng Tiān zhù fēng, huí tóu kàn kan lái shí de lù, gōng guàn suí zhe shān shì gāo dī cuò luò.','天柱峰に登って来た道を振り返ると、道観が地形に沿って高低をつけて並んでいます。'],
        ['一路走来，既能看古建筑，也能听当地人讲张三丰的传说。','Yí lù zǒu lái, jì néng kàn gǔ jiàn zhù, yě néng tīng dāng dì rén jiǎng Zhāng Sān fēng de chuán shuō.','この道をたどりながら、古建築を見たり、地元に伝わる張三豊の話を聞いたりできます。']
      ], [["wudanghall", "武当山 · 金殿"]]],
      ['張三豊の伝説と太極拳', [
        ['有人把武当武术的起源和张三丰联系起来，这个说法流传很广。','Yǒu rén bǎ Wǔ dāng wǔ shù de qǐ yuán hé Zhāng Sān fēng lián xì qǐ lái, zhè ge shuō fǎ liú chuán hěn guǎng.','武当武術の起源を張三豊と結びつける話が広く伝わっています。'],
        ['关于谁最早创立太极拳，还有不同的说法。','Guān yú shéi zuì zǎo chuàng lì tài jí quán, hái yǒu bù tóng de shuō fǎ.','太極拳を最初に創始した人物については、異なる説があります。'],
        ['看表演时，可以留意动作如何从缓慢过渡到快速。','Kàn biǎo yǎn shí, kě yǐ liú yì dòng zuò rú hé cóng huǎn màn guò dù dào kuài sù.','演武を見るときは、ゆっくりした動きがどのように速い動きへ変わるかに注目できます。']
      ]]
    ],
    words: [['宫观','gōng guàn','道教の寺院'],['山势','shān shì','山の地形'],['流传','liú chuán','語り継がれる'],['太极拳','tài jí quán','太極拳']],
    check: ['張三豊について、何が伝えられていますか。', '武当武術の起源と結びつける話が伝わっています。太極拳の起源には異なる説もあります。'],
    task: ['現地の案内係に、金殿までの道と、武当武術を見られる場所を尋ねましょう。',
      ['请问，金殿怎么走？在哪里能看到武术表演？','Qǐng wèn, Jīn diàn zěn me zǒu? Zài nǎ lǐ néng kàn dào wǔ shù biǎo yǎn?','金殿へはどう行きますか。どこで演武を見られますか。']],
    refs: [['ユネスコ · 武当山の古建築群','https://whc.unesco.org/en/list/705/'],['中国無形文化遺産網 · 武当武術','https://www.ihchina.cn/art/detail/id/13787.html']]
  }
};

const westLakeStory = [
  ['断橋で出会う', [
    ['传说白娘子化作一位女子，在西湖遇见了许仙。','Chuán shuō Bái niáng zǐ huà zuò yí wèi nǚ zǐ, zài Xī hú yù jiàn le Xǔ Xiān.','伝説では、白蛇が白娘子という女性に姿を変え、西湖で許仙に出会います。'],
    ['断桥边下起了雨，一把伞让两个人有了交谈的机会。','Duàn qiáo biān xià qǐ le yǔ, yì bǎ sǎn ràng liǎng ge rén yǒu le jiāo tán de jī huì.','断橋のそばで雨が降り出し、一本の傘が二人の会話のきっかけになります。']
  ], [["brokenBridge", "杭州西湖 · 断桥"]]],
  ['雷峰塔に残る物語', [
    ['在流传很广的版本里，法海把白娘子镇在雷峰塔下。','Zài liú chuán hěn guǎng de bǎn běn lǐ, Fǎ Hǎi bǎ Bái niáng zǐ zhèn zài Léi fēng tǎ xià.','広く伝わる版では、法海が白娘子を雷峰塔の下に封じます。'],
    ['从断桥走到雷峰塔，回想两人从相遇到分离的故事。','Cóng Duàn qiáo zǒu dào Léi fēng tǎ, huí xiǎng liǎng rén cóng xiāng yù dào fēn lí de gù shi.','断橋から雷峰塔へ。二人の出会いから別れまでの物語を思い返してみましょう。']
  ]],
  ['湖の西、霊隠寺へ', [
    ['灵隐寺在西湖西边，附近的飞来峰有石刻造像。','Líng yǐn sì zài Xī hú xī biān, fù jìn de Fēi lái fēng yǒu shí kè zào xiàng.','霊隠寺は西湖の西にあり、近くの飛来峰には石刻の仏像があります。'],
    ['在白蛇传的常见版本里，法海与镇江金山寺有关。','Zài Bái shé zhuàn de cháng jiàn bǎn běn lǐ, Fǎ Hǎi yǔ Zhèn jiāng Jīn shān sì yǒu guān.','『白蛇伝』のよく知られた版で、法海と結びつくのは鎮江の金山寺です。']
  ], [["lingyin", "杭州 · 灵隐寺"], ["feilai", "飞来峰 · 石刻造像"]]]
];

const lessonReview = {
  huangshan: {
    words: [['奇松','qí sōng','形の珍しい松'],['怪石','guài shí','奇岩'],['云海','yún hǎi','雲海'],['有名','yǒu míng','有名']],
    check: ['黄山の景観を特徴づけるものを三つ挙げましょう。','奇松・怪石・云海です。']
  },
  taishan: {
    words: [['古代','gǔ dài','古代'],['皇帝','huáng dì','皇帝'],['祭祀','jì sì','祭祀'],['山东省','Shān dōng shěng','山東省']],
    check: ['昔の皇帝はなぜ泰山を訪れましたか。','祭祀を行うためです。']
  },
  lijiang: {
    words: [['流经','liú jīng','を流れる'],['两岸','liǎng àn','両岸'],['山峰','shān fēng','山の峰'],['一座座','yí zuò zuò','いくつもの']],
    check: ['漓江はどこを流れ、両岸には何が見えますか。','桂林を流れ、両岸には山々が連なっています。']
  },
  qingdao: {
    words: [['海滨','hǎi bīn','海辺'],['沿岸','yán àn','沿岸'],['散步','sàn bù','散歩する'],['帆船','fān chuán','ヨット・帆船']],
    check: ['青島はどの海に面していますか。','黄海です。']
  },
  wall: {
    words: [['城墙','chéng qiáng','城壁'],['山脊','shān jǐ','山の尾根'],['沿着','yán zhe','に沿って'],['延伸','yán shēn','延びる']],
    check: ['慕田峪長城の城壁は何に沿って延びていますか。','山の尾根に沿って延びています。']
  },
  westlake: {
    words: [['传说','chuán shuō','伝説'],['相遇','xiāng yù','出会う'],['借伞','jiè sǎn','傘を借りる'],['分离','fēn lí','別れる'],['版本','bǎn běn','版'],['石刻造像','shí kè zào xiàng','石に刻んだ仏像'],['灵隐寺','Líng yǐn sì','霊隠寺'],['雷峰塔','Léi fēng tǎ','雷峰塔']],
    check: ['白娘子と許仙が出会う場所と、白娘子が封じられる場所を答えましょう。','出会いは断橋、封じられるのは雷峰塔の下です。'],
    task: ['「先」「后来」を使って、二人の出会いから別れまでを話しましょう。',['他们先在断桥相遇，后来白娘子被镇在雷峰塔下。','Tā men xiān zài Duàn qiáo xiāng yù, hòu lái Bái niáng zǐ bèi zhèn zài Léi fēng tǎ xià.','二人はまず断橋で出会い、その後、白娘子は雷峰塔の下に封じられました。']]
  },
  palace: {
    words: [['中轴线','zhōng zhóu xiàn','中軸線'],['入口','rù kǒu','入口'],['出口','chū kǒu','出口'],['预约','yù yuē','予約する'],['出示','chū shì','提示する'],['典礼','diǎn lǐ','儀式'],['殿试','diàn shì','科挙の最終試験'],['外朝','wài cháo','外朝'],['内廷','nèi tíng','内廷'],['假山','jiǎ shān','築山']],
    check: ['午門から入って、外朝・内廷・御花園をどの順に見ますか。','外朝、内廷、御花園の順です。']
  }
};

const additionalWords = {
  yangtze: [['干流','gàn liú','本流'],['入海口','rù hǎi kǒu','河口'],['峡谷','xiá gǔ','峡谷'],['货船','huò chuán','貨物船']],
  yellowriver: [['河道','hé dào','河道'],['收窄','shōu zhǎi','狭まる'],['奔腾','bēn téng','勢いよく流れる'],['瀑布','pù bù','滝']],
  wuyue: [['方位','fāng wèi','方角'],['山顶','shān dǐng','山頂'],['登顶','dēng dǐng','頂上に登る'],['形容','xíng róng','描写する']],
  songshan: [['僧人','sēng rén','僧侶'],['壁画','bì huà','壁画'],['碑刻','bēi kè','碑の刻文'],['凹坑','āo kēng','くぼみ']],
  wudang: [['道教','Dào jiào','道教'],['金殿','Jīn diàn','金殿'],['留意','liú yì','注意を向ける'],['起源','qǐ yuán','起源']]
};

const practiceVocabulary = {
  huangshan: [['山峰','shān fēng','峰'],['岩石','yán shí','岩石'],['观景台','guān jǐng tái','展望台'],['日出','rì chū','日の出']],
  taishan: [['石阶','shí jiē','石段'],['石刻','shí kè','石の彫刻・刻文'],['登山','dēng shān','山に登る'],['山顶','shān dǐng','山頂']],
  qingdao: [['海风','hǎi fēng','潮風'],['沙滩','shā tān','砂浜'],['港口','gǎng kǒu','港'],['海岸线','hǎi àn xiàn','海岸線']],
  lijiang: [['顺流而下','shùn liú ér xià','流れに沿って下る'],['倒影','dào yǐng','水に映る影'],['乘船','chéng chuán','船に乗る'],['河岸','hé àn','川岸']],
  westlake: [['断桥','Duàn qiáo','断橋'],['雨伞','yǔ sǎn','傘'],['封住','fēng zhù','封じる'],['湖畔','hú pàn','湖畔']],
  palace: [['石桥','shí qiáo','石橋'],['宫殿','gōng diàn','宮殿'],['庭院','tíng yuàn','中庭'],['检票','jiǎn piào','改札・チケット確認']],
  wall: [['烽火台','fēng huǒ tái','のろし台'],['关口','guān kǒu','関所'],['台阶','tái jiē','階段'],['防御','fáng yù','防御する']],
  yangtze: [['水运','shuǐ yùn','水上輸送'],['汇入','huì rù','合流する'],['稻作','dào zuò','稲作'],['上游','shàng yóu','上流']],
  yellowriver: [['河床','hé chuáng','川床'],['洪水','hóng shuǐ','洪水'],['灌溉','guàn gài','灌漑する'],['落差','luò chā','落差']],
  wuyue: [['山麓','shān lù','山のふもと'],['祭祀','jì sì','祭祀'],['海拔','hǎi bá','標高'],['登山道','dēng shān dào','登山道']],
  songshan: [['少室山','Shào shì shān','少室山'],['山门','shān mén','山門'],['塔林','tǎ lín','塔林'],['练功','liàn gōng','技を鍛える']],
  wudang: [['古建筑','gǔ jiàn zhù','歴史的建造物'],['山路','shān lù','山道'],['信仰','xìn yǎng','信仰'],['练拳','liàn quán','拳法を練習する']]
};

// Chinese gap, three options, correct index, Japanese explanation.
const lessonExercises = {
  huangshan: ['想看太阳升起来，可以起早看＿＿。', ['海风','日出','石桥'], 1, '「日出」は日の出。「看日出」で日の出を見る。'],
  taishan: ['沿着＿＿一步一步往山顶走。', ['石阶','沙滩','宫殿'], 0, '「沿着石阶」で、石段に沿って進むことを表す。'],
  qingdao: ['我们在＿＿上散步，听海浪的声音。', ['瀑布','山门','沙滩'], 2, '「沙滩」は砂浜。場所は「在沙滩上」と表現できる。'],
  lijiang: ['坐船时，可以看到山峰在水中的＿＿。', ['倒影','入口','落差'], 0, '「倒影」は水面に映った影のこと。'],
  westlake: ['断桥边下起了雨，一把＿＿让两个人有了交谈的机会。', ['石刻','雨伞','台阶'], 1, '「一把雨伞」は傘一本。「把」は傘を数える量詞。'],
  palace: ['我已经＿＿了门票，这是我的预约信息。', ['灌溉','汇入','预约'], 2, '「预约门票」で入場券を予約する。手続きが済んだことを「已经…了」で伝える。'],
  wall: ['城墙沿着＿＿延伸。', ['山脊','入海口','沙滩'], 0, '「山脊」は尾根。長城はここでは山の尾根に沿って延びる。'],
  yangtze: ['货船沿着长江驶向下游，这属于＿＿。', ['稻作','水运','祭祀'], 1, '船で貨物を運ぶことは「水运」。陸上輸送とは「陆运」と言う。'],
  yellowriver: ['河道变窄，又有明显的落差，水就从高处＿＿。', ['检票','练拳','奔腾而下'], 2, '「奔腾而下」は水が勢いよく流れ落ちる様子。'],
  wuyue: ['东岳、西岳、南岳、北岳和中岳的叫法与＿＿有关。', ['方位','水运','倒影'], 0, '東・西・南・北・中央は「方位」。地図と一緒に覚えよう。'],
  songshan: ['走进寺院之前，我们先经过＿＿。', ['烽火台','山门','沙滩'], 1, '「山门」は寺院の門。少林寺を歩く場面で使える。'],
  wudang: ['沿着＿＿往上走，可以去看金殿。', ['海岸线','入海口','山路'], 2, '「山路」は山道。「沿着山路」で山道に沿って進む。']
};

const expandedReadings = {
  '漓江': [
    ['船から山を眺める', [
      ['从桂林顺流而下，两岸的山峰时远时近。','Cóng Guì lín shùn liú ér xià, liǎng àn de shān fēng shí yuǎn shí jìn.','桂林から川を下ると、両岸の山々が近づいたり遠ざかったりします。'],
      ['经过九马画山时，不妨看看石壁上的花纹像什么。','Jīng guò Jiǔ mǎ huà shān shí, bù fáng kàn kan shí bì shàng de huā wén xiàng shén me.','九馬画山を通るときは、岩肌の模様が何に見えるか観察してみましょう。']
    ], [['xingping1','广西阳朔 · 兴坪江面']]],
    ['興坪で水面の山を探す', [
      ['风小的时候，山峰的倒影会映在江面上。','Fēng xiǎo de shí hou, shān fēng de dào yǐng huì yìng zài jiāng miàn shàng.','風が弱いときには、山の影が川面に映ります。'],
      ['在兴坪，可以先看看远处的山，再低头找水里的倒影。','Zài Xīng píng, kě yǐ xiān kàn kan yuǎn chù de shān, zài dī tóu zhǎo shuǐ lǐ de dào yǐng.','興坪では、まず遠くの山を見て、それから目を落として水面の影を探してみましょう。']
    ], [['xingping2','兴坪 · 江岸与山峰']]]
  ],
  '黄山': [
    ['松・岩・雲を見比べる', [
      ['有的松树长在岩石旁，枝条向外伸展。','Yǒu de sōng shù zhǎng zài yán shí páng, zhī tiáo xiàng wài shēn zhǎn.','岩のそばに生え、枝を外へ伸ばす松もあります。'],
      ['云雾升起来时，远处的山峰有时只露出山顶。','Yún wù shēng qǐ lái shí, yuǎn chù de shān fēng yǒu shí zhǐ lù chū shān dǐng.','霧が上がってくると、遠くの峰は頂上だけが見えることがあります。']
    ], [['huangshanCloud','黄山 · 云海']]]
  ],
  '泰山': [
    ['石段を上りながら見る', [
      ['登山时，可以一边走石阶，一边留意路旁的石刻。','Dēng shān shí, kě yǐ yì biān zǒu shí jiē, yì biān liú yì lù páng de shí kè.','登山中は石段を上りながら、道沿いの石刻にも注目してみましょう。'],
      ['到了高处再回头，就能比较山脚和山上的景色。','Dào le gāo chù zài huí tóu, jiù néng bǐ jiào shān jiǎo hé shān shàng de jǐng sè.','高い所まで来たら振り返り、ふもとと山の上の景色を比べられます。']
    ], [["taiStairs", "泰山 · 登山石阶"]]]
  ],
  '青岛海滨': [
    ['栈橋から海を見る', [
      ['沿着栈桥往前走，回头可以看到海岸线。','Yán zhe Zhàn qiáo wǎng qián zǒu, huí tóu kě yǐ kàn dào hǎi àn xiàn.','桟橋を進んで振り返ると、海岸線が見えます。'],
      ['海风大的时候，可以听到海浪拍打桥边的声音。','Hǎi fēng dà de shí hou, kě yǐ tīng dào hǎi làng pāi dǎ qiáo biān de shēng yīn.','風が強いときは、橋のそばに打ち寄せる波の音が聞こえます。']
    ], [['qingdaoPier','青岛 · 栈桥']]]
  ],
  '慕田峪长城': [
    ['城壁の上から地形を読む', [
      ['站在城墙上，可以看到长城随着山势起伏。','Zhàn zài chéng qiáng shàng, kě yǐ kàn dào Cháng chéng suí zhe shān shì qǐ fú.','城壁の上からは、長城が山の起伏に沿って続く様子が見えます。'],
      ['走过一段台阶，不妨回头看看刚才经过的城墙。','Zǒu guò yí duàn tái jiē, bù fáng huí tóu kàn kan gāng cái jīng guò de chéng qiáng.','階段を一つ過ぎたら、歩いてきた城壁を振り返ってみましょう。']
    ]]
  ]
};

expandedReadings['慕田峪长城'].unshift(
  ['長城はどこから見に行く？', [
    ['八达岭和慕田峪在北京，金山岭在河北。','Bā dá lǐng hé Mù tián yù zài Běi jīng, Jīn shān lǐng zài Hé běi.','八達嶺と慕田峪は北京、金山嶺は河北省にあります。'],
    ['司马台靠近古北水镇，山海关则靠近渤海。','Sī mǎ tái kào jìn Gǔ běi shuǐ zhèn, Shān hǎi guān zé kào jìn Bó hǎi.','司馬台は古北水鎮の近く、山海関は渤海の近くにあります。']
  ], [["wallBadaling", "北京 · 八达岭长城"]]],
  ['慕田峪の入口と十四号展望台', [
    ['从北检票口进景区，可以搭缆车到十四号观景平台。','Cóng běi jiǎn piào kǒu jìn jǐng qū, kě yǐ dā lǎn chē dào shí sì hào guān jǐng píng tái.','北側の改札から入ると、ロープウェイで14号展望台へ行けます。'],
    ['到了观景平台，先看看城墙沿着哪一道山脊延伸。','Dào le guān jǐng píng tái, xiān kàn kan chéng qiáng yán zhe nǎ yí dào shān jǐ yán shēn.','展望台に着いたら、まず城壁がどの尾根に沿って続くか眺めましょう。']
  ]],
  ['七号と六号の敵台を歩く', [
    ['在七号敌台向西望，可以看到城墙在群山之间弯曲。','Zài qī hào dí tái xiàng xī wàng, kě yǐ kàn dào chéng qiáng zài qún shān zhī jiān wān qū.','7号敵台から西を向くと、山々の間を曲がって続く城壁が見えます。'],
    ['走到六号敌台附近，可以按景区指引选择下山方式。','Zǒu dào liù hào dí tái fù jìn, kě yǐ àn jǐng qū zhǐ yǐn xuǎn zé xià shān fāng shì.','6号敵台付近に着いたら、現地案内を見て下山方法を選べます。']
  ], [["wallWatchtower", "慕田峪 · 敌台与石阶"]]]
);

const attractionGuides = {
  wall: [
    ['北京市 · 慕田峪のモデルルート','https://www.beijing.gov.cn/fuwu/bmfw/sy/jrts/202610/t20261022_4914353.html'],
    ['慕田峪長城 · 公式案内','https://www.mutianyugreatwall.com/cnInformation'],
    ['北京市文化観光局 · 長城の区間','https://www.beijing.gov.cn/renwen/zt/cjyjc/ldzn/xltj/202501/t20250117_3992088.html']
  ],
  lijiang: [['桂林漓江景区 · 船のルート','https://www.lijiangriver.com.cn/page/article/ylxl.ljpfy']]
};

features.lijiangTown = {
  name: ['丽江古城','Lì jiāng gǔ chéng','雲南 · 麗江の町と水路'],
  photo: 'lijiangOldTown',
  caption: '云南 · 丽江古城',
  chapters: [
    ['大研古城で水路をたどる', [
      ['云南的丽江古城由大研、束河和白沙等部分组成。','Yún nán de Lì jiāng gǔ chéng yóu Dà yán, Shù hé hé Bái shā děng bù fen zǔ chéng.','雲南の麗江古城は大研、束河、白沙などから成ります。'],
      ['在大研古城，可以沿着水渠走过一座座小桥。','Zài Dà yán gǔ chéng, kě yǐ yán zhe shuǐ qú zǒu guò yí zuò zuò xiǎo qiáo.','大研古城では水路沿いに小橋を渡りながら歩けます。']
    ]],
    ['黒龍潭から雪山へ', [
      ['玉龙雪山的水汇入黑龙潭，再流进古城的水渠。','Yù lóng xuě shān de shuǐ huì rù Hēi lóng tán, zài liú jìn gǔ chéng de shuǐ qú.','玉龍雪山からの水は黒龍潭に集まり、古城の水路に流れ込みます。'],
      ['走到黑龙潭时，不妨看看水面上有没有雪山的倒影。','Zǒu dào Hēi lóng tán shí, bù fáng kàn kan shuǐ miàn shàng yǒu méi yǒu xuě shān de dào yǐng.','黒龍潭に着いたら、水面に雪山の姿が映っているか探してみましょう。']
    ], [["lijiangPool", "云南丽江 · 黑龙潭"]]],
    ['束河と白沙にも足を延ばす', [
      ['除了大研，还可以去束河和白沙，看看不同的街巷和民居。','Chú le Dà yán, hái kě yǐ qù Shù hé hé Bái shā, kàn kan bù tóng de jiē xiàng hé mín jū.','大研に加えて束河や白沙にも足を延ばし、街路や民家の違いを見てみましょう。']
    ]]
  ],
  words: [['古城','gǔ chéng','歴史ある町'],['水渠','shuǐ qú','水路'],['雪山','xuě shān','雪山'],['街巷','jiē xiàng','通りと路地']],
  check: ['黒龍潭の水はどこから来て、黒龍潭の先ではどこに流れますか。','玉龍雪山から来て、黒龍潭を経て古城の水路へ流れます。'],
  task: ['友達に、麗江で先にどこを見て、そのあとどこへ行くか伝えましょう。',['我们先沿水渠逛古城，再去黑龙潭看倒影。','Wǒ men xiān yán shuǐ qú guàng gǔ chéng, zài qù Hēi lóng tán kàn dào yǐng.','まず水路沿いに古城を歩いて、それから黒龍潭へ水面の影を見に行きましょう。']],
  refs: [['ユネスコ · 麗江古城','https://whc.unesco.org/en/list/811/']]
};
practiceVocabulary.lijiangTown = [['民居','mín jū','民家'],['倒影','dào yǐng','水に映る影'],['汇入','huì rù','流れ込む'],['街道','jiē dào','通り']];
lessonExercises.lijiangTown = ['雪山的水先汇入黑龙潭，再流进古城的＿＿。',['城墙','水渠','石阶'],1,'「水渠」は水路。古城の中を水路が流れています。'];
