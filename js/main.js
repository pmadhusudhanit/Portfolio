document.addEventListener("DOMContentLoaded",()=>{
  const menu=document.querySelector(".menu-btn"), links=document.querySelector(".nav-links");
  if(menu) menu.addEventListener("click",()=>links.classList.toggle("open"));
  document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>links.classList.remove("open")));
  const reveals=document.querySelectorAll(".hero .status-pill,.hero h1,.hero-role,.hero-sub,.hero-actions,.section,.page-hero>* ,footer");
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.animate([{opacity:0,transform:"translateY(28px)"},{opacity:1,transform:"translateY(0)"}],{duration:850,easing:"cubic-bezier(.16,1,.3,1)",fill:"forwards"});io.unobserve(e.target)}}),{threshold:.08});
  reveals.forEach(x=>io.observe(x));

  // About journey tabs — switch Experience, Education and Achievements without page reload.
  const journeyTabs=[...document.querySelectorAll('.journey-tab')];
  const journeyPanels=[...document.querySelectorAll('.journey-panel')];
  function setJourney(kind){
    journeyTabs.forEach(tab=>{
      const active=tab.dataset.journey===kind;
      tab.classList.toggle('active',active);
      tab.setAttribute('aria-selected',active?'true':'false');
    });
    journeyPanels.forEach(panel=>{
      const active=panel.dataset.panel===kind;
      panel.hidden=!active;
      if(active){
        panel.classList.remove('journey-panel-enter');
        void panel.offsetWidth;
        panel.classList.add('journey-panel-enter');
      }
    });
  }
  journeyTabs.forEach(tab=>tab.addEventListener('click',()=>setJourney(tab.dataset.journey)));

  const tabs=[...document.querySelectorAll(".process-tab")];
  const line=document.querySelector(".process-line span");
  const panel=document.querySelector("#process-panel");
  const number=document.querySelector("#process-number");
  const kicker=document.querySelector("#process-kicker");
  const title=document.querySelector("#process-title");
  const copy=document.querySelector("#process-copy");
  const list=document.querySelector("#process-list");
  const outcome=document.querySelector("#process-outcome");
  const image=document.querySelector("#process-image");
  const counter=document.querySelector("#process-counter");
  const prev=document.querySelector("#process-prev");
  const next=document.querySelector("#process-next");
  const data=[
    {kicker:"Discovery & Context",title:"Understand",copy:"Requirements, systems, dependencies and business flow. Start with clarity before implementation.",items:["Business requirement analysis","Identify systems and stakeholders","Integration touchpoints and constraints","Define success criteria"],outcome:"Clear integration roadmap",image:"assets/process/process-01.svg",alt:"Discovery and context engineering illustration"},
    {kicker:"Strategy & Architecture",title:"Architect",copy:"Map the landscape, select the right integration pattern and define the solution before implementation.",items:["Map source and target systems","Choose synchronous or asynchronous patterns","Define HLD and LLD boundaries","Plan security and connectivity"],outcome:"A clear solution blueprint",image:"assets/process/process-02.svg",alt:"Integration architecture planning illustration"},
    {kicker:"API & Contracts",title:"Design APIs",copy:"Create consistent contracts that make systems easier to expose, consume, secure and evolve.",items:["Define REST resources and operations","Document contracts with OpenAPI","Design APIM policies and boundaries","Plan authentication and error responses"],outcome:"Stable integration contracts",image:"assets/process/process-03.svg",alt:"API design and contract engineering illustration"},
    {kicker:"Integration & Workflow",title:"Build",copy:"Implement the integration flow using the right combination of Logic Apps, Functions, messaging and events.",items:["Build Logic Apps workflows","Use Functions for focused compute","Connect Service Bus and Event Grid","Handle transformations and routing"],outcome:"Working end-to-end integration",image:"assets/process/process-04.svg",alt:"Integration workflow implementation illustration"},
    {kicker:"Quality & Reliability",title:"Validate",copy:"Exercise both happy paths and failure paths so integrations behave predictably under real operating conditions.",items:["Test functional and negative paths","Validate retries and error handling","Check messaging and idempotency","Add logging and observability"],outcome:"Reliable production behavior",image:"assets/process/process-05.svg",alt:"Integration quality and reliability illustration"},
    {kicker:"Release & Operations",title:"Deploy",copy:"Move through environments with repeatable delivery, configuration discipline and production monitoring.",items:["Prepare environment configuration","Automate deployment workflows","Monitor production health","Iterate from operational feedback"],outcome:"Controlled cloud delivery",image:"assets/process/process-06.svg",alt:"Cloud deployment and operations illustration"}
  ];
  let current=0, timer;
  function setStep(i, animate=true){
    current=(i+data.length)%data.length;
    const d=data[current];
    tabs.forEach((t,n)=>{t.classList.toggle("active",n===current);t.setAttribute("aria-selected",n===current?"true":"false")});
    if(line) line.style.width=(current/5*100)+"%";
    if(animate && panel) panel.classList.add("is-changing");
    window.setTimeout(()=>{
      if(number) number.textContent=String(current+1).padStart(2,"0");
      if(kicker) kicker.textContent=d.kicker;
      if(title) title.textContent=d.title;
      if(copy) copy.textContent=d.copy;
      if(outcome) outcome.textContent=d.outcome;
      if(list) list.innerHTML=d.items.map(x=>`<li>${x}</li>`).join("");
      if(image){image.src=d.image;image.alt=d.alt;}
      if(counter) counter.textContent=`${String(current+1).padStart(2,"0")} / 06`;
      if(panel) panel.classList.remove("is-changing");
    },animate?180:0);
  }
  function restartAuto(){clearInterval(timer);timer=setInterval(()=>setStep(current+1),10000)}
  tabs.forEach((t,i)=>t.addEventListener("click",()=>{setStep(i);restartAuto()}));
  if(prev) prev.addEventListener("click",()=>{setStep(current-1);restartAuto()});
  if(next) next.addEventListener("click",()=>{setStep(current+1);restartAuto()});
  if(tabs.length){setStep(0,false);restartAuto()}
  if(panel){panel.addEventListener("mouseenter",()=>clearInterval(timer));panel.addEventListener("mouseleave",restartAuto)}

  // Featured projects carousel — intentionally data-driven so more projects can be added later.
  const projectTrack=document.querySelector('#projects-track');
  const projectCards=projectTrack?[...projectTrack.querySelectorAll('.project-card')]:[];
  const projectPrev=document.querySelector('#projects-prev');
  const projectNext=document.querySelector('#projects-next');
  const projectDots=document.querySelector('#project-dots');
  let projectIndex=0;
  function projectMetrics(){
    if(!projectTrack||!projectCards.length) return {step:0,max:0};
    const card=projectCards[0];
    const gap=parseFloat(getComputedStyle(projectTrack).gap)||0;
    const viewport=projectTrack.parentElement.clientWidth;
    const visible=Math.max(1,Math.floor((viewport+gap)/(card.getBoundingClientRect().width+gap)));
    const max=Math.max(0,projectCards.length-visible);
    const step=card.getBoundingClientRect().width+gap;
    return {step,max,visible};
  }
  function renderProjectDots(){
    if(!projectDots) return;
    const {max}=projectMetrics();
    const count=max+1;
    projectDots.innerHTML=Array.from({length:count},(_,i)=>`<button class="project-dot${i===projectIndex?' active':''}" type="button" aria-label="Show project group ${i+1}"></button>`).join('');
    [...projectDots.children].forEach((dot,i)=>dot.addEventListener('click',()=>setProject(i)));
  }
  function setProject(i){
    if(!projectTrack||!projectCards.length) return;
    const {step,max}=projectMetrics();
    projectIndex=Math.max(0,Math.min(i,max));
    projectTrack.style.transform=`translate3d(${-projectIndex*step}px,0,0)`;
    if(projectPrev) projectPrev.disabled=projectIndex===0;
    if(projectNext) projectNext.disabled=projectIndex===max;
    renderProjectDots();
  }
  if(projectTrack&&projectCards.length){
    setProject(0);
    if(projectPrev) projectPrev.addEventListener('click',()=>setProject(projectIndex-1));
    if(projectNext) projectNext.addEventListener('click',()=>setProject(projectIndex+1));
    window.addEventListener('resize',()=>setProject(projectIndex));
  }

  // Expand hidden project technology tags (+N) without leaving the page.
  document.querySelectorAll('.project-tags-more').forEach(button=>{
    button.addEventListener('click',()=>{
      const tags=button.closest('.project-tags');
      if(!tags) return;
      const expanded=tags.classList.toggle('is-expanded');
      button.setAttribute('aria-expanded',expanded?'true':'false');
      const extras=tags.querySelectorAll('.project-tag-extra').length;
      button.textContent=expanded?'Show less':`+${extras}`;
    });
  });

  document.querySelectorAll(".principle-grid article,.credential-grid article,.case-card,.edu-card").forEach((el,i)=>{
    el.addEventListener("pointermove",e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(700px) rotateX(${-y*2}deg) rotateY(${x*2}deg) translateY(-5px)`});
    el.addEventListener("pointerleave",()=>el.style.transform="");
  });
});

// Certification cards open the exact credential URL supplied for that certification.
// The action remains a button/JS navigation so the browser does not expose the URL on hover.
document.querySelectorAll('.certification-card').forEach(card=>{
  const openCredential=()=>{
    const url=card.dataset.certUrl;
    if(url) window.open(url,'_blank','noopener,noreferrer');
  };
  card.addEventListener('click',openCredential);
  card.addEventListener('keydown',e=>{
    if(e.key==='Enter' || e.key===' '){ e.preventDefault(); openCredential(); }
  });
});
document.querySelectorAll('.cert-view').forEach(button=>{
  button.addEventListener('click',e=>{
    e.stopPropagation();
    const url=button.dataset.certUrl;
    if(url) window.open(url,'_blank','noopener,noreferrer');
  });
});

document.querySelectorAll('[data-action]').forEach(el=>{
  el.addEventListener('click',()=>{
    const action=el.dataset.action;
    if(action==='email') window.location.href='mailto:pmadhusudhanit@gmail.com';
    if(action==='linkedin') window.open('https://www.linkedin.com/in/madhusudhanit/','_blank','noopener,noreferrer');
    if(action==='github') window.open('https://github.com/','_blank','noopener,noreferrer');
  });
});
