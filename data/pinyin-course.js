/* Koepanda Pinyin Course Roadmap — DEMO 10.107.63
   Course -> Stage -> Unit -> Lesson -> Activity
   Tone learning is woven through every pronunciation lesson from the beginning. */
window.KOEPANDA_PINYIN_COURSE = {
  id: 'pinyin-main-course',
  version: '10.107.63',
  title: '音からはじめる中国語',
  principles: {
    toneFromFirstLesson: true,
    lessonFlow: ['scene','sound','mouth','tone','imitate','play','review','reward']
  },
  stages: [
    {
      id:'P0', world:'🌱 はじめの島', title:'音のぼうけん', subtitle:'中国語の音と四声に出会おう', status:'current',
      units:[
        {id:'P0-U1', title:'四声を聞いてみよう', short:'四声の感じ', lessons:['tone-feel'], reward:'はじめの一歩'}
      ]
    },
    {
      id:'P1-P2', world:'🌼 声のお花畑', title:'単韻母', subtitle:'a・o・e・i・u・ü を音と声調で覚える', status:'next',
      units:[
        {id:'P1', title:'a・o・e', short:'a o e', lessons:['a','o','e'], reward:'はじめての音バッジ'},
        {id:'P2', title:'i・u・ü', short:'i u ü', lessons:['i','u','ü'], reward:'単韻母クリア'}
      ]
    },
    {
      id:'P3-P8', world:'🌲 声母の森', title:'声母', subtitle:'口の動きと息の違いを遊びながら身につける', status:'locked',
      units:[
        {id:'P3',title:'b・p・m・f',short:'b p m f'},
        {id:'P4',title:'d・t・n・l',short:'d t n l'},
        {id:'P5',title:'g・k・h',short:'g k h'},
        {id:'P6',title:'j・q・x',short:'j q x'},
        {id:'P7',title:'zh・ch・sh・r',short:'zh ch sh r'},
        {id:'P8',title:'z・c・s',short:'z c s'}
      ]
    },
    {
      id:'P9-P13', world:'🌊 韻母の湖', title:'複韻母・鼻韻母', subtitle:'音のつながりを耳と口で覚える', status:'locked',
      units:[
        {id:'P9',title:'ai・ei・ui',short:'ai ei ui'},
        {id:'P10',title:'ao・ou・iu',short:'ao ou iu'},
        {id:'P11',title:'ie・üe・er',short:'ie üe er'},
        {id:'P12',title:'an・en・in・un・ün',short:'前鼻韻母'},
        {id:'P13',title:'ang・eng・ing・ong',short:'後鼻韻母'}
      ]
    },
    {
      id:'P14-P18', world:'🏘️ 拼読の町', title:'音をつなげよう', subtitle:'整体認読・二拼・三拼・つづりのルール', status:'locked',
      units:[
        {id:'P14',title:'整体認読①',short:'zhi〜si'},
        {id:'P15',title:'整体認読②',short:'yi〜ying'},
        {id:'P16',title:'二拼',short:'声母＋韻母'},
        {id:'P17',title:'三拼',short:'三拼音節'},
        {id:'P18',title:'つづりのルール',short:'ü・y・w'}
      ]
    },
    {
      id:'P19-P21', world:'⛰️ 声調の山', title:'声調を使いこなそう', subtitle:'これまで使ってきた声調を整理して実戦へ', status:'locked',
      units:[
        {id:'P19',title:'四声＋軽声',short:'声調強化'},
        {id:'P20',title:'変調入門',short:'一・不・三声'},
        {id:'P21',title:'拼音卒業チャレンジ',short:'聞く・読む・話す', reward:'拼音卒業'}
      ]
    }
  ]
};
