/* Self-contained demo. No Supabase, cookies or network writes. */
(()=>{'use strict';
const root=document.querySelector('#papi-deneyim');if(!root)return;
const units={
1:['Greetings','Classroom','Colors','Numbers','Animals','Toys'],
2:['School Life','My Classroom','My Family','My Toys','Animals','Food & Drinks'],
3:['Greeting','My Family','People I Love','Feelings','Toys and Games','My House','In My City','Transportation'],
4:['Classroom Rules','Nationality','Cartoon Characters','Free Time','My Day','Fun with Science','Jobs','My Clothes'],
5:['Hello!','My Town','Games and Hobbies','My Daily Routine','Health','Movies','Party Time','Fitness','The Animal Shelter','Festivals'],
6:['Life','Yummy Breakfast','Downtown','Weather and Emotions','At the Fair','Occupations','Holidays','Bookworms','Saving the Planet','Democracy'],
7:['Appearance and Personality','Sports','Biographies','Wild Animals','Television','Celebrations','Dreams','Public Buildings','Environment','Planets'],
8:['Friendship','Teen Life','In the Kitchen','On the Phone','The Internet','Adventures','Tourism','Chores','Science','Natural Forces'],
A1:['Greetings','Numbers and Colors','Family','Daily Life','Food','Places','Hobbies','Shopping'],
A2:['Daily Routines','Travel','Past Events','Health','Shopping','Describing People','Free Time','Plans'],
B1:['Experiences','Opinions','Work and School','Travel Stories','Environment','Communication','Future Plans','Culture'],
B2:['Discussion','Media and Technology','Culture and Society','Environment','Education','Argumentation','Global Issues','Creative Thinking']
};
const topicWords=[
[{en:'hello',tr:'merhaba'},{en:'friend',tr:'arkadaş'},{en:'school',tr:'okul'}],
[{en:'teacher',tr:'öğretmen'},{en:'book',tr:'kitap'},{en:'classroom',tr:'sınıf'}],
[{en:'mother',tr:'anne'},{en:'father',tr:'baba'},{en:'family',tr:'aile'}],
[{en:'play',tr:'oynamak'},{en:'ball',tr:'top'},{en:'game',tr:'oyun'}],
[{en:'cat',tr:'kedi'},{en:'dog',tr:'köpek'},{en:'bird',tr:'kuş'}],
[{en:'apple',tr:'elma'},{en:'water',tr:'su'},{en:'milk',tr:'süt'}],
[{en:'happy',tr:'mutlu'},{en:'sad',tr:'üzgün'},{en:'smile',tr:'gülümsemek'}],
[{en:'city',tr:'şehir'},{en:'park',tr:'park'},{en:'house',tr:'ev'}]
];
const specific={ 'School Life':topicWords[0],'My Classroom':topicWords[1],'My Family':topicWords[2],'My Toys':topicWords[3],'Animals':topicWords[4],'Food & Drinks':topicWords[5],'Friendship':topicWords[0],'Life':topicWords[5],'Hello!':topicWords[0],'My Town':topicWords[7],'Yummy Breakfast':topicWords[5],'Greetings':topicWords[0],'Family':topicWords[2],'Numbers and Colors':[{en:'red',tr:'kırmızı'},{en:'blue',tr:'mavi'},{en:'green',tr:'yeşil'}]};
let mode='2',unitIndex=0,step=0,points=0,answered=false,questionNumber=0,game='goal',gameRound=0,gameResult='',gameFinished=false;
const $=s=>root.querySelector(s);
const el={grades:$('#papi-grades'),levels:$('#papi-levels'),units:$('#papi-units'),stage:$('#papi-stage'),steps:$('#papi-steps'),progress:$('#papi-score')};
function safe(t){return String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function title(){return units[mode][unitIndex]}
function words(){return specific[title()]||topicWords[(unitIndex+(isNaN(Number(mode))?1:Number(mode)))%topicWords.length]}
function pickMode(value){mode=value;unitIndex=0;step=0;points=0;questionNumber=0;answered=false;gameRound=0;gameResult='';gameFinished=false;render()}
function chooseUnit(i){unitIndex=i;step=0;points=0;questionNumber=0;answered=false;gameRound=0;gameResult='';gameFinished=false;render()}
function render(){
el.grades.innerHTML=Array.from({length:8},(_,i)=>'<button type="button" class="papi-choice '+(mode===String(i+1)?'selected':'')+'" data-mode="'+(i+1)+'" aria-pressed="'+(mode===String(i+1))+'">'+(i+1)+'</button>').join('');
el.levels.innerHTML=['A1','A2','B1','B2'].map(v=>'<button type="button" class="papi-choice '+(mode===v?'selected':'')+'" data-mode="'+v+'" aria-pressed="'+(mode===v)+'">'+v+'</button>').join('');
el.units.innerHTML=units[mode].map((u,i)=>'<button type="button" class="papi-unit '+(unitIndex===i?'selected':'')+'" data-unit="'+i+'" aria-pressed="'+(unitIndex===i)+'">'+(i+1)+'. '+safe(u)+' ›</button>').join('');
el.steps.innerHTML=['Konu','Parkur','Ders Çalış','Oyun','Lig'].map((s,i)=>'<span class="papi-step '+(step===i?'active':'')+'">'+['📖','🏔️','🎓','🎮','🏆'][i]+' '+s+'</span>').join('');
el.progress.textContent='⭐ '+points;
const w=words(), word=w[questionNumber%3], options=[word.tr,...w.filter(x=>x.tr!==word.tr).map(x=>x.tr),'ev'].slice(0,4);
const ordered=options.slice().sort((a,b)=>a.localeCompare(b,'tr'));
let inner='';
if(step===0)inner='<div class="papi-bubble"><img class="papi-papi" src="/assets/papi-launch.webp" alt="Papi maskotu"><div class="papi-question">'+safe(title())+'</div><p>Merhaba! Ben Papi. Önce üç kelime öğrenelim.</p><div>'+w.map(x=>'<span style="display:inline-block;margin:5px;padding:7px 10px;background:#dcf5ff;border-radius:11px"><b>'+safe(x.en)+'</b> = '+safe(x.tr)+'</span>').join('')+'</div><button type="button" class="papi-primary" data-next>Parkura Başla →</button></div>';
else if(step===3){
const games=[{id:'goal',name:'⚽ Kelime Golü',tip:'Topu doğru köşeye şutla!'},{id:'monster',name:'👾 Canavar Avcısı',tip:'Doğru kelimeyle canavarı yakala!'},{id:'tower',name:'🧱 Dengesiz Kule',tip:'Doğru blokları biriktir!'}];
const active=games.find(g=>g.id===game);
const target=w[gameRound%w.length];
const choices=[target.tr,...w.filter(x=>x.tr!==target.tr).map(x=>x.tr),'ev'].slice(0,4).sort((a,b)=>a.localeCompare(b,'tr'));
const gameChoices=choices.map((o,i)=>'<button type="button" class="mini-game-target '+(gameResult?(o===target.tr?'correct':o===gameResult?'wrong':''):'')+'" data-game-answer="'+safe(o)+'" '+(gameResult?'disabled':'')+'>'+safe(o)+'</button>').join('');
inner='<div class="mini-game-wrap"><div class="mini-game-tabs">'+games.map(g=>'<button type="button" data-game="'+g.id+'" class="'+(game===g.id?'on':'')+'">'+g.name+'</button>').join('')+'</div><div class="mini-game-board mini-game-'+game+'"><div class="mini-game-title">'+active.name+' <small>🎯 '+(gameRound+1)+'/3</small></div><p class="mini-game-tip">'+active.tip+'</p><div class="mini-game-art">'+(game==='goal'?'<div class="mini-goal-net">🥅</div><div class="mini-ball '+(gameResult?'shot':'')+'">⚽</div>':game==='monster'?'<div class="mini-monsters">'+['👾','👹','👻'].slice(gameRound).join(' ')+'</div>':'<div class="mini-tower-stack">'+Array.from({length:gameRound+1},(_,i)=>'<span>🟦</span>').join('')+'</div>')+'</div><div class="mini-game-word">'+safe(target.en.toUpperCase())+'</div><div class="mini-game-targets">'+gameChoices+'</div><div class="mini-game-feedback" role="status">'+(gameResult?(gameResult===target.tr?'🎉 Süper! '+(game==='goal'?'GOOOL!':game==='monster'?'Canavar yakalandı!':'Kule yükseldi!'):'💡 Doğru cevap: '+safe(target.tr)):'Doğru anlamı seç!')+'</div>'+(gameResult?'<button type="button" class="papi-primary" data-game-next>'+(gameRound===2?'Mini Lige Geç →':'Sonraki Tur →')+'</button>':'')+'</div><p class="mini-game-note">Ücretsiz tanıtım · Üye olmadan oyna · Gerçek hesap veya puan kaydı oluşturulmaz</p></div>';
}else if(step<3){
const label=step===1?'🏔️ Mini Parkur':'🎓 Ders Çalış';
inner='<div style="width:min(100%,430px)"><div class="papi-bubble"><div class="papi-question">'+label+'</div><p>“'+safe(word.en)+'” kelimesinin anlamı hangisi?</p></div><div class="papi-answers">'+ordered.map(o=>'<button type="button" class="papi-answer" data-answer="'+safe(o)+'">'+safe(o)+'</button>').join('')+'</div><div id="papi-feedback" class="papi-message" role="status"></div><button type="button" class="papi-primary" data-next hidden>Devam Et →</button></div>';
}else inner='<div class="papi-bubble"><div style="font-size:54px">🏆</div><div class="papi-question">Papi Demo Ligi</div><p>⭐ Sen: '+points+' puan · 🦜 Papi: 20 puan · 🐻 Mino: 10 puan</p><p><small>Bu sıralama yalnızca örnektir, gerçek oyuncuları göstermez.</small></p><p>Harikasın! Gerçek macera Diji Medu uygulamasında devam ediyor.</p><a class="papi-primary" href="https://app.dijimedu.com/ingilizce/">Tam Uygulamaya Geç ↗</a> <button type="button" class="papi-choice" data-reset>Tekrar Dene</button></div>';
el.stage.innerHTML='<div class="papi-stage-top"><span>'+safe(mode)+(isNaN(Number(mode))?' Seviyesi':'. Sınıf')+' · '+safe(title())+'</span><span class="papi-stars">⭐ '+points+'</span></div><div class="papi-scene">'+inner+'</div>';
}
root.addEventListener('click',e=>{
const gb=e.target.closest('[data-game]');if(gb){game=gb.dataset.game;gameRound=0;gameResult='';render();return}
const ga=e.target.closest('[data-game-answer]');if(ga&&!gameResult){gameResult=ga.dataset.gameAnswer;if(gameResult===words()[gameRound%3].tr)points+=25;render();return}
if(e.target.closest('[data-game-next]')){if(gameRound===2){step=4}else{gameRound++;}gameResult='';render();return}

const modeBtn=e.target.closest('[data-mode]');if(modeBtn){pickMode(modeBtn.dataset.mode);return}
const u=e.target.closest('[data-unit]');if(u){chooseUnit(Number(u.dataset.unit));return}
const ans=e.target.closest('[data-answer]');if(ans&&!answered){answered=true;const correct=words()[questionNumber%3].tr,yes=ans.dataset.answer===correct;if(yes)points+=20;root.querySelectorAll('[data-answer]').forEach(b=>{b.disabled=true;if(b.dataset.answer===correct)b.classList.add('correct');else if(b===ans)b.classList.add('wrong')});$('#papi-feedback').textContent=yes?'🌟 Harika! Doğru cevap!':'💡 Doğru cevap: '+correct;el.stage.querySelector('[data-next]').hidden=false;el.progress.textContent='⭐ '+points;return}
if(e.target.closest('[data-reset]')){chooseUnit(unitIndex);return}
if(e.target.closest('[data-next]')){if(step===0){step=1;questionNumber=0}else if(step<3){step++;questionNumber++}answered=false;render()}
});
root.querySelectorAll('[data-open-game]').forEach(b=>b.addEventListener('click',()=>{game=b.dataset.openGame;gameRound=0;gameResult='';step=3;render();document.getElementById('papi-stage')?.scrollIntoView({behavior:'smooth',block:'center'});}));
render();
const phone=document.querySelector('#phone-lesson .pl-phone-display'),demo=document.getElementById('papi-stage');if(phone&&demo){phone.appendChild(demo);const lesson=document.getElementById('phone-body'),top=document.querySelector('#phone-lesson .pl-phone-top'),bar=document.querySelector('#phone-lesson .pl-progress'),heading=document.querySelector('#phone-lesson .pl-screen-title');const toggle=gameMode=>{demo.hidden=!gameMode;for(const x of [lesson,top,bar,heading])if(x)x.hidden=gameMode;};toggle(false);document.querySelectorAll('[data-open-game]').forEach(b=>b.addEventListener('click',()=>{toggle(true);phone.scrollIntoView({block:'center',behavior:'smooth'});}));document.getElementById('phone-modules')?.addEventListener('click',e=>{if(e.target.closest('[data-mode]'))toggle(false);});}
})();
