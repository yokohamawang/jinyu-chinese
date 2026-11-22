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
      ]],
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
        ['在壶口，河道突然收窄，水从高处奔腾而下。','Zài Hú kǒu, hé dào tū rán shōu zhǎi, shuǐ cóng gāo chù bēn téng ér xià.','壺口では川幅が急に狭まり、水が高い所から勢いよく落ちます。'],
        ['传说大禹为了治水，三次经过家门却没有进去。','Chuán shuō Dà Yǔ wèi le zhì shuǐ, sān cì jīng guò jiā mén què méi yǒu jìn qù.','伝説では、大禹は治水のため三度も家の前を通りながら、中に入りませんでした。']
      ]]
    ],
    words: [['灌溉','guàn gài','灌漑'],['泥沙','ní shā','土砂'],['淤积','yū jī','堆積する'],['治水','zhì shuǐ','治水']],
    check: ['黄河の水は、中流でなぜ濁るのでしょう。', '黄土高原を流れる支流が、本流へ土砂を運び込むためです。'],
    task: ['なぜ黄河は農業を支えながら洪水の原因にもなるのでしょう。「能」「但」を使って旅行仲間に説明しましょう。',
      ['黄河能灌溉农田，但泥沙淤积会增加洪水风险。','Huáng hé néng guàn gài nóng tián, dàn ní shā yū jī huì zēng jiā hóng shuǐ fēng xiǎn.','黄河は農地を潤しますが、土砂の堆積は洪水の危険を高めます。']],
    refs: [['中国科学院 · 黄河の地理','https://www.igsnrr.cas.cn/cbkx/kpyd/zgdl/cnszy/202009/t20200910_5692424.html'],['中国社会科学網 · 仰韶の農耕','https://www.cssn.cn/kgxc/kgxc_xccz/202312/t20231221_5720492.shtml'],['河南省档案館 · 三門峡の大禹伝説','https://www.hada.gov.cn/2022/06-29/154792.html'],['四川公共文化雲 · 禹の伝説','https://www.scc.org.cn/culturaldetail.fds?id=36398']]
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
        ['山门是寺院的入口，塔林里的古塔则让人看见寺院的历史。','Shān mén shì sì yuàn de rù kǒu, tǎ lín lǐ de gǔ tǎ zé ràng rén kàn jiàn sì yuàn de lì shǐ.','山門は寺院の入口で、塔林の古い塔は寺の歴史を伝えます。'],
        ['少林寺是登封世界遗产的一部分。','Shào lín sì shì Dēng fēng shì jiè yí chǎn de yí bù fen.','少林寺は登封の世界遺産を構成する一部です。']
      ]],
      ['千仏殿で武術を想像する', [
        ['走进千佛殿，可以留意地面上的凹坑。','Zǒu jìn Qiān fó diàn, kě yǐ liú yì dì miàn shàng de āo kēng.','千仏殿に入ったら、床のくぼみに注目してみましょう。'],
        ['人们常把这些凹坑和僧人练拳联系起来。','Rén men cháng bǎ zhè xiē āo kēng hé sēng rén liàn quán lián xì qǐ lái.','このくぼみは、僧侶の拳法の稽古と結びつけて語られます。'],
        ['看完壁画，再读一读碑文，你会发现同一个故事可以有不同的讲法。','Kàn wán bì huà, zài dú yi dú bēi wén, nǐ huì fā xiàn tóng yí ge gù shi kě yǐ yǒu bù tóng de jiǎng fǎ.','壁画を見てから碑文を読むと、同じ物語にも異なる語り方があると分かります。']
      ]],
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
      ]],
      ['金殿まで登り、山の形を見る', [
        ['在山下看金殿，只能看见一个小小的屋顶。','Zài shān xià kàn Jīn diàn, zhǐ néng kàn jiàn yí ge xiǎo xiǎo de wū dǐng.','山の下から金殿を見上げると、屋根は小さく見えます。'],
        ['登上天柱峰，回头看看来时的路，宫观随着山势高低错落。','Dēng shàng Tiān zhù fēng, huí tóu kàn kan lái shí de lù, gōng guàn suí zhe shān shì gāo dī cuò luò.','天柱峰に登って来た道を振り返ると、道観が地形に沿って高低をつけて並んでいます。'],
        ['一路走来，既能看古建筑，也能听当地人讲张三丰的传说。','Yí lù zǒu lái, jì néng kàn gǔ jiàn zhù, yě néng tīng dāng dì rén jiǎng Zhāng Sān fēng de chuán shuō.','この道をたどりながら、古建築を見たり、地元に伝わる張三豊の話を聞いたりできます。']
      ]],
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
