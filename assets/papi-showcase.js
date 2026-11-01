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
let mode='2',unitIndex=0,step=0,points=0,answered=false,questionNumber=0;
const $=s=>root.querySelector(s);
const el={grades:$('#papi-grades'),levels:$('#papi-levels'),units:$('#papi-units'),stage:$('#papi-stage'),steps:$('#papi-steps'),progress:$('#papi-score')};
function safe(t){return String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function title(){return units[mode][unitIndex]}
function words(){return specific[title()]||topicWords[(unitIndex+(isNaN(Number(mode))?1:Number(mode)))%topicWords.length]}
function pickMode(value){mode=value;unitIndex=0;step=0;points=0;questionNumber=0;answered=false;render()}
function chooseUnit(i){unitIndex=i;step=0;points=0;questionNumber=0;answered=false;render()}
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
else if(step<4){
const label=step===1?'🏔️ Mini Parkur':step===2?'🎓 Ders Çalış':'⚽ Kelime Golü';
inner='<div style="width:min(100%,430px)"><div class="papi-bubble"><div style="font-size:30px">'+(step===3?'🥅 ⚽':'🦜')+'</div><div class="papi-question">'+label+'</div><p>“'+safe(word.en)+'” kelimesinin anlamı hangisi?</p></div><div class="papi-answers">'+ordered.map(o=>'<button type="button" class="papi-answer" data-answer="'+safe(o)+'">'+safe(o)+'</button>').join('')+'</div><div id="papi-feedback" class="papi-message" role="status"></div><button type="button" class="papi-primary" data-next hidden>Devam Et →</button></div>';
}else inner='<div class="papi-bubble"><div style="font-size:54px">🏆</div><div class="papi-question">Papi Demo Ligi</div><p>⭐ Sen: '+points+' puan · 🦜 Papi: 20 puan · 🐻 Mino: 10 puan</p><p><small>Bu sıralama yalnızca örnektir, gerçek oyuncuları göstermez.</small></p><p>Harikasın! Gerçek macera Diji Medu uygulamasında devam ediyor.</p><a class="papi-primary" href="https://app.dijimedu.com/ingilizce/">Tam Uygulamaya Geç ↗</a> <button type="button" class="papi-choice" data-reset>Tekrar Dene</button></div>';
el.stage.innerHTML='<div class="papi-stage-top"><span>'+safe(mode)+(isNaN(Number(mode))?' Seviyesi':'. Sınıf')+' · '+safe(title())+'</span><span class="papi-stars">⭐ '+points+'</span></div><div class="papi-scene">'+inner+'</div>';
}
root.addEventListener('click',e=>{
const modeBtn=e.target.closest('[data-mode]');if(modeBtn){pickMode(modeBtn.dataset.mode);return}
const u=e.target.closest('[data-unit]');if(u){chooseUnit(Number(u.dataset.unit));return}
const ans=e.target.closest('[data-answer]');if(ans&&!answered){answered=true;const correct=words()[questionNumber%3].tr,yes=ans.dataset.answer===correct;if(yes)points+=20;root.querySelectorAll('[data-answer]').forEach(b=>{b.disabled=true;if(b.dataset.answer===correct)b.classList.add('correct');else if(b===ans)b.classList.add('wrong')});$('#papi-feedback').textContent=yes?'🌟 Harika! Doğru cevap!':'💡 Doğru cevap: '+correct;el.stage.querySelector('[data-next]').hidden=false;el.progress.textContent='⭐ '+points;return}
if(e.target.closest('[data-reset]')){chooseUnit(unitIndex);return}
if(e.target.closest('[data-next]')){if(step===0){step=1;questionNumber=0}else if(step<4){step++;questionNumber++}answered=false;render()}
});
render();
})();
