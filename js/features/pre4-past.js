(() => {
  'use strict';
  const {groups} = window.KP_PRE4_MOCK;
  const first = 110, last = 119;
  const archive = 'https://www.chuken.gr.jp/tcp/test';
  const explanation = 'https://www.chuken.gr.jp/study/text';
  const notes116 = {
    '3-1':'語末の n と ng を区別します。この漢字の韻尾は ng、声調は第4声です。',
    '3-2':'「少ない」という意味の読みは第3声。反り舌音の sh と韻母 ao を組み合わせます。',
    '3-3':'最初は息の弱い z。韻母は uo なので、ou と文字の順序を逆にしないようにしましょう。',
    '3-4':'最初の音節は f と ang。後ろは b から始まり、第4声で下げます。',
    '3-5':'行は意味によって読み分けます。商店や業種を連想すると、この語では háng だと判断できます。',
    '3-6':'柄を握って使う物には把。紙や切符のような薄く平らな物に使う张と区別します。',
    '3-7':'過去のことでも、形容詞で様子を述べるときは「不＋形容詞」で否定できます。',
    '3-8':'練習で身につけた能力には会。許可や条件を表す可以とは意味が違います。',
    '3-9':'「場所＋有＋物」で何があるかを示し、「物＋在＋場所」でその場所を示します。',
    '3-10':'すでに出た話題を受けて「～は？」と聞き返すときは、話題のあとに呢を置きます。',
    '3-11':'まず主語、次に「在＋場所」、最後に動作を置きます。場所は動詞より前です。',
    '3-12':'「～も」の也を先に置き、「みな」の都をそのあとに置いてから述語を続けます。',
    '3-13':'「教える」は「教＋相手＋内容」の順。教える内容が最後に来ます。',
    '3-14':'移動手段を表す動作を先に述べ、目的となる動作をあとに続けます。',
    '3-15':'誰のことかを先に言い、その人のどの面かを示してから、状態を述べます。',
    '4-1':'お金に関わる漢字の金へんは钅。新聞に使う漢字は右側の部品を形で覚えます。',
    '4-2':'暑さを表す漢字の下は灬。「買う」の簡体字は貝の形を使いません。',
    '4-3':'真ん中の部品を囲む門が、両方とも簡体字の门になっているか確かめましょう。',
    '4-4':'複雑な字体のまま書かないように、一字ずつ見本と比べます。二字目は羽をそのまま二つ並べた形ではありません。',
    '4-5':'動詞を先、対象をあとに書く二字の表現です。一字目の上の冠、二字目のにんべんを確認します。'
  };
  const external = 'target="_blank" rel="noopener noreferrer"';

  function render(main, heading) {
    main.innerHTML = heading('過去問で練習', '公式の問題冊子と答えは中検サイトで確認できます。画面で解いて自動採点するなら、KoePandaの模試へ。') +
      `<section class="pre4-card pre4-past-card">
      <a class="pre4-button pre4-primary" href="./pre4.html?unit=exam">画面で解く模試へ</a>
      <label for="pre4PastEdition">試験回</label>
      <select class="pre4-button" id="pre4PastEdition">${Array.from({length:last-first+1},(_,i) =>
        `<option value="${last-i}">第${last-i}回</option>`).join('')}</select>
      <nav class="pre4-tools" aria-label="公式資料">
        <a class="pre4-button pre4-primary" id="pre4OfficialPaper" ${external}>公式問題・解答</a>
        <a class="pre4-button" href="${explanation}" ${external}>公式の過去問解説案内</a>
      </nav>
      <p>公式ページの「準４級」欄を使います。採点後は、下で該当する出題形式を選んでください。</p>
      <nav class="pre4-tools" id="pre4PastDirect" aria-label="第116回 準4級の資料" hidden>
        <a class="pre4-button" href="https://www.chuken.gr.jp/tcp/test/116/T116_4J1.pdf" ${external}>問題冊子</a>
        <a class="pre4-button" href="https://www.chuken.gr.jp/tcp/test/116/A116_4J1.pdf" ${external}>公式解答</a>
      </nav>
      </section>
      <form class="pre4-card pre4-past-card" id="pre4PastForm">
        <h2>まちがえた問題を確認</h2>
        <label for="pre4PastNumber">問題番号（例：3-2）</label>
        <input class="pre4-button" id="pre4PastNumber" maxlength="24" required>
        <label for="pre4PastTopic">出題形式</label>
        <select class="pre4-button" id="pre4PastTopic">${groups.map(([id,title]) =>
          `<option value="${id}">${title}</option>`).join('')}</select>
        <button class="pre4-button pre4-primary" type="submit">復習に追加</button>
        <p>この一覧は、開いている間に使えます。</p>
      </form><div id="pre4PastReview" aria-live="polite"></div>`;

    const edition=main.querySelector('#pre4PastEdition');
    const official=main.querySelector('#pre4OfficialPaper');
    const review=main.querySelector('#pre4PastReview');
    const number=main.querySelector('#pre4PastNumber');
    const topic=main.querySelector('#pre4PastTopic');
    const entries=new Map();
    const source=() => edition.value===String(last)?archive:archive+'/'+edition.value;

    function update() {
      official.href=source();
      main.querySelector('#pre4PastDirect').hidden=edition.value!=='116';
      review.replaceChildren();
      for(const item of entries.values()){
        if(item.edition!==edition.value)continue;
        const section=document.createElement('section');
        section.className='pre4-card pre4-past-card';
        const title=document.createElement('h3');
        title.textContent=`第${item.edition}回 · ${item.number} · ${item.group[1]}`;
        const note=document.createElement('p');
        const specific = item.edition==='116' && notes116[item.number];
        note.textContent=specific || item.group[2];
        const start=document.createElement('a');
        start.className='pre4-button pre4-primary';
        start.href='./practice-session.html?'+new URLSearchParams({track:'pre4',unit:'mock',mode:item.group[0],from:'past',edition:item.edition});
        start.target='_blank';
        start.rel='noopener noreferrer';
        start.textContent='同じ形式を5問練習';
        const remove=document.createElement('button');
        remove.className='pre4-button';
        remove.type='button';
        remove.textContent='一覧から外す';
        remove.onclick=()=>{entries.delete(item.key);update();};
        const tools=document.createElement('div');
        tools.className='pre4-tools';
        tools.append(start,remove);
        section.append(title,note,tools);
        review.append(section);
      }
    }

    edition.onchange=update;
    main.querySelector('#pre4PastForm').onsubmit=event=>{
      event.preventDefault();
      const label=number.value.trim().normalize('NFKC').replace(/[()]/g,'')
        .replace(/[−ー–]/g,'-').replace(/\s/g,'');
      if(!label)return;
      const sections=label.split('-').map(Number);
      const auto = edition.value==='116' && notes116[label] &&
        (sections[0]===4?'writing':sections[1]<=5?'reading':sections[1]<=10?'grammar':'order');
      const group=groups.find(item=>item[0]===(auto||topic.value));
      if(!group)return;
      const key=[edition.value,label,group[0]].join(':');
      entries.set(key,{key,edition:edition.value,number:label,group});
      number.value='';
      update();
    };
    update();
  }

  window.KP_PRE4_PAST={render,first,last};
})();
