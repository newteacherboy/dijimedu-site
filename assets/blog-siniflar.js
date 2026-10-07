/* DijiMedu Blog — Sınıf filtreleme sistemi
   1-8. sınıf içeriklerini tek yerde toplar.
   Yeni sınıf/ünite yazıları eklendiğinde bu listeye eklenebilir.
*/
(function(){
  "use strict";

  const UNITELER = [
  {
    "sinif": 1,
    "unite": 1,
    "konu": "Greetings And Introductions",
    "slug": "ingilizce-1-sinif-1-unite-greetings-and-introductions"
  },
  {
    "sinif": 1,
    "unite": 2,
    "konu": "Numbers And Age",
    "slug": "ingilizce-1-sinif-2-unite-numbers-and-age"
  },
  {
    "sinif": 1,
    "unite": 3,
    "konu": "Classroom English",
    "slug": "ingilizce-1-sinif-3-unite-classroom-english"
  },
  {
    "sinif": 1,
    "unite": 4,
    "konu": "Colours And Shapes",
    "slug": "ingilizce-1-sinif-4-unite-colours-and-shapes"
  },
  {
    "sinif": 1,
    "unite": 5,
    "konu": "Family",
    "slug": "ingilizce-1-sinif-5-unite-family"
  },
  {
    "sinif": 1,
    "unite": 6,
    "konu": "My Body",
    "slug": "ingilizce-1-sinif-6-unite-my-body"
  },
  {
    "sinif": 1,
    "unite": 7,
    "konu": "Animals And Abilities",
    "slug": "ingilizce-1-sinif-7-unite-animals-and-abilities"
  },
  {
    "sinif": 1,
    "unite": 8,
    "konu": "Toys And Things",
    "slug": "ingilizce-1-sinif-8-unite-toys-and-things"
  },
  {
    "sinif": 2,
    "unite": 1,
    "konu": "School Life",
    "slug": "ingilizce-2-sinif-1-unite-school-life"
  },
  {
    "sinif": 2,
    "unite": 2,
    "konu": "Classroom Life",
    "slug": "ingilizce-2-sinif-2-unite-classroom-life"
  },
  {
    "sinif": 2,
    "unite": 3,
    "konu": "Personal Life",
    "slug": "ingilizce-2-sinif-3-unite-personal-life"
  },
  {
    "sinif": 2,
    "unite": 4,
    "konu": "Family Life",
    "slug": "ingilizce-2-sinif-4-unite-family-life"
  },
  {
    "sinif": 2,
    "unite": 5,
    "konu": "Home And Neighbourhood",
    "slug": "ingilizce-2-sinif-5-unite-home-and-neighbourhood"
  },
  {
    "sinif": 2,
    "unite": 6,
    "konu": "City And Places",
    "slug": "ingilizce-2-sinif-6-unite-city-and-places"
  },
  {
    "sinif": 2,
    "unite": 7,
    "konu": "Days And Celebrations",
    "slug": "ingilizce-2-sinif-7-unite-days-and-celebrations"
  },
  {
    "sinif": 2,
    "unite": 8,
    "konu": "Daily School Communication",
    "slug": "ingilizce-2-sinif-8-unite-daily-school-communication"
  },
  {
    "sinif": 3,
    "unite": 1,
    "konu": "School And Friends",
    "slug": "ingilizce-3-sinif-1-unite-school-and-friends"
  },
  {
    "sinif": 3,
    "unite": 2,
    "konu": "Seasons And Weather",
    "slug": "ingilizce-3-sinif-2-unite-seasons-and-weather"
  },
  {
    "sinif": 3,
    "unite": 3,
    "konu": "Clothes",
    "slug": "ingilizce-3-sinif-3-unite-clothes"
  },
  {
    "sinif": 3,
    "unite": 4,
    "konu": "Food And Drinks",
    "slug": "ingilizce-3-sinif-4-unite-food-and-drinks"
  },
  {
    "sinif": 3,
    "unite": 5,
    "konu": "Daily Routines",
    "slug": "ingilizce-3-sinif-5-unite-daily-routines"
  },
  {
    "sinif": 3,
    "unite": 6,
    "konu": "My Town",
    "slug": "ingilizce-3-sinif-6-unite-my-town"
  },
  {
    "sinif": 3,
    "unite": 7,
    "konu": "Hobbies And Abilities",
    "slug": "ingilizce-3-sinif-7-unite-hobbies-and-abilities"
  },
  {
    "sinif": 3,
    "unite": 8,
    "konu": "Weekend",
    "slug": "ingilizce-3-sinif-8-unite-weekend"
  },
  {
    "sinif": 4,
    "unite": 1,
    "konu": "My School",
    "slug": "ingilizce-4-sinif-1-unite-my-school"
  },
  {
    "sinif": 4,
    "unite": 2,
    "konu": "Appearance And Personality",
    "slug": "ingilizce-4-sinif-2-unite-appearance-and-personality"
  },
  {
    "sinif": 4,
    "unite": 3,
    "konu": "Clothes And Preferences",
    "slug": "ingilizce-4-sinif-3-unite-clothes-and-preferences"
  },
  {
    "sinif": 4,
    "unite": 4,
    "konu": "Hobbies And Past Abilities",
    "slug": "ingilizce-4-sinif-4-unite-hobbies-and-past-abilities"
  },
  {
    "sinif": 4,
    "unite": 5,
    "konu": "Weather And Nature",
    "slug": "ingilizce-4-sinif-5-unite-weather-and-nature"
  },
  {
    "sinif": 4,
    "unite": 6,
    "konu": "Family Jobs",
    "slug": "ingilizce-4-sinif-6-unite-family-jobs"
  },
  {
    "sinif": 4,
    "unite": 7,
    "konu": "Neighbourhood Services",
    "slug": "ingilizce-4-sinif-7-unite-neighbourhood-services"
  },
  {
    "sinif": 4,
    "unite": 8,
    "konu": "Comparisons And Descriptions",
    "slug": "ingilizce-4-sinif-8-unite-comparisons-and-descriptions"
  },
  {
    "sinif": 5,
    "unite": 1,
    "konu": "Personal Life",
    "slug": "ingilizce-5-sinif-1-unite-personal-life"
  },
  {
    "sinif": 5,
    "unite": 2,
    "konu": "Daily Routines",
    "slug": "ingilizce-5-sinif-2-unite-daily-routines"
  },
  {
    "sinif": 5,
    "unite": 3,
    "konu": "Food And Healthy Life",
    "slug": "ingilizce-5-sinif-3-unite-food-and-healthy-life"
  },
  {
    "sinif": 5,
    "unite": 4,
    "konu": "Sports And Free Time",
    "slug": "ingilizce-5-sinif-4-unite-sports-and-free-time"
  },
  {
    "sinif": 5,
    "unite": 5,
    "konu": "Past Events",
    "slug": "ingilizce-5-sinif-5-unite-past-events"
  },
  {
    "sinif": 5,
    "unite": 6,
    "konu": "Travel",
    "slug": "ingilizce-5-sinif-6-unite-travel"
  },
  {
    "sinif": 5,
    "unite": 7,
    "konu": "Shopping And Restaurants",
    "slug": "ingilizce-5-sinif-7-unite-shopping-and-restaurants"
  },
  {
    "sinif": 5,
    "unite": 8,
    "konu": "Experiences And Plans",
    "slug": "ingilizce-5-sinif-8-unite-experiences-and-plans"
  },
  {
    "sinif": 6,
    "unite": 1,
    "konu": "School And Learning",
    "slug": "ingilizce-6-sinif-1-unite-school-and-learning"
  },
  {
    "sinif": 6,
    "unite": 2,
    "konu": "Technology",
    "slug": "ingilizce-6-sinif-2-unite-technology"
  },
  {
    "sinif": 6,
    "unite": 3,
    "konu": "Social Media And Communication",
    "slug": "ingilizce-6-sinif-3-unite-social-media-and-communication"
  },
  {
    "sinif": 6,
    "unite": 4,
    "konu": "Environment",
    "slug": "ingilizce-6-sinif-4-unite-environment"
  },
  {
    "sinif": 6,
    "unite": 5,
    "konu": "Health And Lifestyle",
    "slug": "ingilizce-6-sinif-5-unite-health-and-lifestyle"
  },
  {
    "sinif": 6,
    "unite": 6,
    "konu": "Culture And Travel",
    "slug": "ingilizce-6-sinif-6-unite-culture-and-travel"
  },
  {
    "sinif": 6,
    "unite": 7,
    "konu": "Friendship And Problems",
    "slug": "ingilizce-6-sinif-7-unite-friendship-and-problems"
  },
  {
    "sinif": 6,
    "unite": 8,
    "konu": "Opinions And Suggestions",
    "slug": "ingilizce-6-sinif-8-unite-opinions-and-suggestions"
  },
  {
    "sinif": 7,
    "unite": 1,
    "konu": "Opinions And Arguments",
    "slug": "ingilizce-7-sinif-1-unite-opinions-and-arguments"
  },
  {
    "sinif": 7,
    "unite": 2,
    "konu": "Comparisons And Choices",
    "slug": "ingilizce-7-sinif-2-unite-comparisons-and-choices"
  },
  {
    "sinif": 7,
    "unite": 3,
    "konu": "Future And Predictions",
    "slug": "ingilizce-7-sinif-3-unite-future-and-predictions"
  },
  {
    "sinif": 7,
    "unite": 4,
    "konu": "Possibilities And Conditions",
    "slug": "ingilizce-7-sinif-4-unite-possibilities-and-conditions"
  },
  {
    "sinif": 7,
    "unite": 5,
    "konu": "Advice And Responsibility",
    "slug": "ingilizce-7-sinif-5-unite-advice-and-responsibility"
  },
  {
    "sinif": 7,
    "unite": 6,
    "konu": "Media And News",
    "slug": "ingilizce-7-sinif-6-unite-media-and-news"
  },
  {
    "sinif": 7,
    "unite": 7,
    "konu": "Society And Community",
    "slug": "ingilizce-7-sinif-7-unite-society-and-community"
  },
  {
    "sinif": 7,
    "unite": 8,
    "konu": "Discussion And Debate",
    "slug": "ingilizce-7-sinif-8-unite-discussion-and-debate"
  },
  {
    "sinif": 8,
    "unite": 1,
    "konu": "Communication",
    "slug": "ingilizce-8-sinif-1-unite-communication"
  },
  {
    "sinif": 8,
    "unite": 2,
    "konu": "Presentation",
    "slug": "ingilizce-8-sinif-2-unite-presentation"
  },
  {
    "sinif": 8,
    "unite": 3,
    "konu": "Work And Career",
    "slug": "ingilizce-8-sinif-3-unite-work-and-career"
  },
  {
    "sinif": 8,
    "unite": 4,
    "konu": "Job Interviews",
    "slug": "ingilizce-8-sinif-4-unite-job-interviews"
  },
  {
    "sinif": 8,
    "unite": 5,
    "konu": "Formal English",
    "slug": "ingilizce-8-sinif-5-unite-formal-english"
  },
  {
    "sinif": 8,
    "unite": 6,
    "konu": "Academic English",
    "slug": "ingilizce-8-sinif-6-unite-academic-english"
  },
  {
    "sinif": 8,
    "unite": 7,
    "konu": "Debate And Critical Thinking",
    "slug": "ingilizce-8-sinif-7-unite-debate-and-critical-thinking"
  },
  {
    "sinif": 8,
    "unite": 8,
    "konu": "Future Technology And Universe",
    "slug": "ingilizce-8-sinif-8-unite-future-technology-and-universe"
  }
];

  const sinifAdi = n => n + ". Sınıf";
  const okulAdi = n => n <= 4 ? "İlkokul" : "Ortaokul";

  function unitCard(x){
    const url = "/blog/" + x.slug + "/";
    return `
      <article class="card sinif-card" data-sinif="${x.sinif}" data-unit="${x.unite}">
        <small>${okulAdi(x.sinif)} · ${sinifAdi(x.sinif)}</small>
        <h2><a href="${url}">${sinifAdi(x.sinif)} İngilizce ${x.unite}. Ünite: ${x.konu}</a></h2>
        <p>${sinifAdi(x.sinif)} ${x.unite}. ünite için kelimeler, temel ifadeler, örnek cümleler ve tekrar çalışmaları.</p>
        <a href="${url}"><b>Üniteyi çalış →</b></a>
      </article>`;
  }

  function renderUnitCards(){
    const box=document.getElementById("sinifUniteleri");
    if(!box) return;
    box.innerHTML=UNITELER.map(unitCard).join("");
  }

  function classifyExistingCards(){
    document.querySelectorAll("article.card").forEach(card=>{
      if(card.dataset.sinif) return;
      const link=card.querySelector("a[href]");
      const href=link ? link.getAttribute("href") : "";
      const m=href.match(/(?:^|\\/)blog\\/.*?(?:ingilizce-)?([1-8])-sinif(?:-|\\/)/i);
      if(m) card.dataset.sinif=m[1];
      else card.dataset.sinif="genel";
    });
  }

  function closeMenus(){
    document.querySelectorAll(".sinif-dropdown.open").forEach(x=>x.classList.remove("open"));
  }

  function setFilter(value,label){
    document.querySelectorAll(".sinif-filter-card").forEach(card=>{
      const s=card.dataset.sinif;
      card.hidden = value !== "all" && String(s) !== String(value);
    });

    document.querySelectorAll(".sinif-filter-btn").forEach(btn=>{
      btn.classList.toggle("active", btn.dataset.filter===String(value));
    });

    const title=document.getElementById("sinifSeciliBaslik");
    if(title) title.textContent = value==="all" ? "Tüm İngilizce içerikleri" : sinifAdi(Number(value)) + " İngilizce içerikleri";

    const count=document.getElementById("sinifSonucSayisi");
    if(count){
      const visible=[...document.querySelectorAll(".sinif-filter-card")].filter(x=>!x.hidden).length;
      count.textContent=visible + " içerik";
    }
    closeMenus();
    const target=document.getElementById("sinifIcerik");
    if(target) target.scrollIntoView({behavior:"smooth",block:"start"});
  }

  function init(){
    renderUnitCards();

    document.querySelectorAll("#blogSinifNavigasyon article.card").forEach(card=>card.classList.add("sinif-filter-card"));
    classifyExistingCards();
    document.querySelectorAll("#sinifUniteleri .sinif-card").forEach(card=>card.classList.add("sinif-filter-card"));

    document.querySelectorAll(".sinif-filter-btn").forEach(btn=>{
      btn.addEventListener("click",()=>setFilter(btn.dataset.filter,btn.textContent.trim()));
    });

    document.querySelectorAll(".sinif-dropdown-toggle").forEach(btn=>{
      btn.addEventListener("click",e=>{
        e.stopPropagation();
        const parent=btn.closest(".sinif-dropdown");
        const wasOpen=parent.classList.contains("open");
        closeMenus();
        if(!wasOpen) parent.classList.add("open");
      });
    });

    document.addEventListener("click",closeMenus);
    document.querySelectorAll(".sinif-dropdown-menu").forEach(menu=>menu.addEventListener("click",e=>e.stopPropagation()));

    setFilter("all","Tümü");
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init);
  else init();
})();