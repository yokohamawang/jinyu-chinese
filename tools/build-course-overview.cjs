/* Run with node tools/build-course-overview.cjs after changing course data. */
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const c={window:{}};vm.createContext(c);
for(const f of ['pre4-stations','pre4-grammar','pre4-examples','pre4-content','pre4-mock','pre4-pinyin-data','pre4-pinyin','pre4-lookup','grade4-lessons'])vm.runInContext(read('js/features/'+f+'.js'),c,{filename:f});
vm.runInContext(read('js/features/grade4-extension.js'),c);
if(fs.existsSync(path.join(root,'js/features/grade4-supplement-data.js')))vm.runInContext(read('js/features/grade4-supplement-data.js'),c);
const tidy=s=>String(s??'').normalize('NFC').replace(/[\s。！？；，、.!?,;：:「」“”]/gu,'');
const term=s=>{s=tidy(s);return /^\p{Script=Han}+$/u.test(s)?s:''};
const unique=a=>new Set(a.filter(Boolean));
const han=a=>unique(a.flatMap(s=>Array.from(s).filter(x=>/^\p{Script=Han}$/u.test(x))));
const sentences=a=>unique(a.flatMap(s=>String(s??'').split(/[。！？!?]+/u).map(tidy).filter(x=>/\p{Script=Han}/u.test(x))));
const concatSets=(...sets)=>new Set(sets.flatMap(s=>[...s]));
const vocab=['data/pre4-content-package-0.1.json','data/pre4-vocabulary.json'].flatMap(p=>JSON.parse(read(p)).vocabulary_entries);
const data={vocabulary_entries:vocab};
const p4words=unique(vocab.map(x=>term(x.simplified)));
const p4focus=new Set(),p4examples=[]; let p4count=0,p4questions=0;
const stations=c.window.KP_PRE4_STATIONS;
for(const [unit,items] of Object.entries(stations))for(const [i,item] of items.entries()){
 p4count++;
 if(item.sentences){for(const row of item.sentences){p4examples.push(row[0]);p4focus.add(term(row[2]));}}
 else{p4examples.push(item.ask.join(''),item.reply.join(''),...(item.supportingExamples||[]).map(x=>x[0]));p4focus.add(term(item.sound[0]));p4focus.add(term(item.options[0]));}
 p4questions+=c.window.KP_PRE4.build(data,unit,i+1,'station',a=>a).length;
}
p4focus.delete('');
const p4characters=han([...p4words,...p4focus,...p4examples]);
const p4sentences=sentences(p4examples);
const p4all=concatSets(p4words,p4focus);
const p4lookup=c.window.KP_PRE4_LOOKUP.words(vocab);
const grade=vm.runInContext('({lessons,stories,baseGlosses,transfer,sentenceOrder})',c);
const g4focus=unique(grade.lessons.map(x=>term(x[1]))),g4examples=grade.lessons.flatMap(x=>[x[4],x[6]]);
const g4texts=grade.stories.map(x=>x[1]);
const supplement=c.window.KP_G4_SUPPLEMENT||[];
for(const l of supplement){for(const w of l.words||[])g4focus.add(term(w[0]));for(const x of l.examples||[])g4examples.push(x.zh);}
g4focus.delete('');
vm.runInContext(read('js/features/grade4-vocabulary.js'),c);
const {words,examples}=vm.runInContext('({words:grade4Vocabulary,examples:[...grade4VocabularyContexts,...grade4SentenceLessons.flat()]})',c);
words.flat().forEach(row=>g4focus.add(row[0]));
examples.forEach(row=>g4examples.push(row[1]));
vm.runInContext(read('js/features/grade4-word-examples.js'),c);
const usage=vm.runInContext('grade4WordExamples',c);
usage.forEach((group,i)=>{if(group.length!==words[i].length)throw Error('Example count '+i);g4examples.push(...group);});
const g4chars=han([...g4focus,...g4examples,...g4texts]);
const g4sentences=sentences(g4examples);
const g4lookup=new Map([...c.window.KP_PRE4_LOOKUP.words(),...Object.entries(grade.baseGlosses),...words.flat().map(([w,p,m])=>[w,[p,m]]),...grade.lessons.map(x=>[x[1],[x[2],x[3]]]),...supplement.flatMap(l=>l.words.map(x=>[x[0],[x[1],x[2]]]))]);
function matched(texts,gloss){const out=new Set();for(const line of texts){let x=String(line);while(x){const len=Math.min(x.length,12);let match='';for(let i=len;i>0;i--){let w=x.slice(0,i);if(gloss.has(w)&&term(w)){match=w;break;}}if(match)out.add(match);x=x.slice(match.length||1);}}return out;}
const p4used=matched(p4examples,p4lookup),g4used=matched([...g4examples,...g4texts],g4lookup);
const p4papers=[1,2,3].map(n=>c.window.KP_PRE4_MOCK.build('paper',n,a=>a));
const p4mockKeys=unique(p4papers.flat().map(q=>q.reviewKey));
const g4supplementQuestions=supplement.reduce((n,l)=>n+(l.examples?.length||0)*4,0);
const result={schema:1,pre4:{characters:p4characters.size,words:p4all.size,registeredWords:p4words.size,focusWords:p4focus.size,sentenceWords:p4used.size,sentences:p4sentences.size,lessons:p4count,topics:Object.keys(stations).length,lessonQuestions:p4questions,mockQuestions:p4mockKeys.size,mockPapers:p4papers.filter(x=>x.length).length},grade4:{characters:g4chars.size,words:g4focus.size,focusWords:g4focus.size,sentenceWords:g4used.size,sentences:g4sentences.size,lessons:grade.lessons.length+supplement.length,topics:grade.stories.length+new Set(supplement.map(l=>l.group)).size,readingTexts:g4texts.length,lessonQuestions:grade.lessons.length*8+g4supplementQuestions,chapterQuestions:grade.stories.length*2,mockPapers:3,mockQuestions:180,vocabQuestions:words.flat().length*3,vocabGroups:words.reduce((n,w)=>n+Math.ceil(w.length/7),0),newWords:[...g4focus].filter(w=>!p4all.has(w)).length,cumulativeWords:concatSets(p4all,g4focus).size,cumulativeCharacters:concatSets(p4characters,g4chars).size,cumulativeSentences:concatSets(p4sentences,g4sentences).size}};
fs.writeFileSync(path.join(root,'js/features/course-overview-data.js'),'/* Generated by tools/build-course-overview.cjs. Do not edit counts by hand. */\nwindow.KP_COURSE_OVERVIEW_DATA='+JSON.stringify(result,null,2)+';\n');console.log(JSON.stringify(result,null,2));
