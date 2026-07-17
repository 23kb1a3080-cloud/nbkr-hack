/**
 * NBKR Hackathon 2026 – main.js
 * Futuristic Glassmorphism + Cyberpunk Neon
 * Vanilla JS — no dependencies.
 */

const HACK_START   = new Date(2026, 8, 26, 9, 0, 0);
const TERMINAL_MSG = "nbkrhack --duration 24h --open-to all-colleges --mode offline --meals included";

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initHamburger();
  initParticleCanvas();
  initTerminalTyping();
  initCountdown();
  initReveal();
  initJudgingBars();
  initFAQ();
  initSmoothScroll();
  initRegOverlay();
});

function initNavbar() {
  const nav = document.getElementById("navbar");
  if (!nav) return;
  const upd = () => nav.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", upd, { passive: true });
  upd();
}

function initHamburger() {
  const btn  = document.getElementById("hamburger-btn");
  const menu = document.getElementById("nav-mobile");
  if (!btn || !menu) return;
  btn.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    btn.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-hidden", String(!open));
  });
  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    menu.classList.remove("open"); btn.classList.remove("open");
    btn.setAttribute("aria-expanded","false"); menu.setAttribute("aria-hidden","true");
  }));
}

function initParticleCanvas() {
  const canvas = document.getElementById("pcb-canvas");
  if (!canvas) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { canvas.style.display="none"; return; }
  const ctx = canvas.getContext("2d");
  let W, H, particles, animId;
  const MAX_DIST = 140;
  const count = () => Math.min(Math.floor((W*H)/14000), 90);

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    particles = [];
    for (let i = 0; i < count(); i++) {
      particles.push({
        x: Math.random()*W, y: Math.random()*H,
        vx: (Math.random()-0.5)*0.45, vy: (Math.random()-0.5)*0.45,
        r: 1.5+Math.random()*1.5,
        hue: Math.random()<0.6?186:(Math.random()<0.5?270:210),
        alpha: 0.4+Math.random()*0.5
      });
    }
  }

  function draw() {
    ctx.clearRect(0,0,W,H);
    for (let i=0;i<particles.length;i++) {
      for (let j=i+1;j<particles.length;j++) {
        const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if (d<MAX_DIST) {
          const op=(1-d/MAX_DIST)*0.3, h=(particles[i].hue+particles[j].hue)/2;
          ctx.strokeStyle=`hsla(${h},100%,65%,${op})`; ctx.lineWidth=0.7;
          ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y); ctx.lineTo(particles[j].x,particles[j].y); ctx.stroke();
        }
      }
    }
    particles.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`hsla(${p.hue},100%,70%,${p.alpha})`;
      ctx.shadowColor=`hsla(${p.hue},100%,65%,0.8)`; ctx.shadowBlur=6;
      ctx.fill(); ctx.shadowBlur=0;
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<-10)p.x=W+10; if(p.x>W+10)p.x=-10;
      if(p.y<-10)p.y=H+10; if(p.y>H+10)p.y=-10;
    });
    animId=requestAnimationFrame(draw);
  }

  const ro=new ResizeObserver(()=>{ cancelAnimationFrame(animId); resize(); draw(); });
  ro.observe(canvas); resize(); draw();
  document.addEventListener("visibilitychange",()=>{ if(document.hidden) cancelAnimationFrame(animId); else draw(); });
}

function initTerminalTyping() {
  const el=document.getElementById("terminal-text");
  if(!el) return;
  let i=0;
  function type(){ if(i<=TERMINAL_MSG.length){ el.textContent=TERMINAL_MSG.slice(0,i++); setTimeout(type,i<5?80:26); } }
  setTimeout(type,700);
}

function initCountdown() {
  const dEl=document.getElementById("cd-days"), hEl=document.getElementById("cd-hours");
  const mEl=document.getElementById("cd-minutes"), sEl=document.getElementById("cd-seconds");
  const container=document.getElementById("countdown-container");
  if(!dEl) return;
  const pad=n=>String(Math.floor(n)).padStart(2,"0");
  let tid;
  function tick(){
    const rem=HACK_START.getTime()-Date.now();
    if(rem<=0){ if(container) container.innerHTML='<span class="cd-expired">🚀 Hackathon is Live!</span>'; clearInterval(tid); return; }
    dEl.textContent=pad(rem/86400000); hEl.textContent=pad((rem%86400000)/3600000);
    mEl.textContent=pad((rem%3600000)/60000); sEl.textContent=pad((rem%60000)/1000);
  }
  tick(); tid=setInterval(tick,1000);
  document.addEventListener("visibilitychange",()=>{ if(document.hidden) clearInterval(tid); else { tick(); tid=setInterval(tick,1000); } });
}

function initReveal() {
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){
    document.querySelectorAll(".reveal").forEach(el=>el.classList.add("visible")); return;
  }
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("visible"); obs.unobserve(e.target); } });
  },{threshold:0.12});
  document.querySelectorAll(".reveal").forEach(el=>obs.observe(el));
}

function initJudgingBars() {
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){
    document.querySelectorAll(".jbar").forEach(el=>el.classList.add("visible")); return;
  }
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("visible"); obs.unobserve(e.target); } });
  },{threshold:0.3});
  document.querySelectorAll(".jbar").forEach(el=>obs.observe(el));
}

function initFAQ() {
  const items=document.querySelectorAll(".faq-item");
  items.forEach(item=>{
    const btn=item.querySelector(".faq-q"), ans=item.querySelector(".faq-a");
    if(!btn||!ans) return;
    btn.addEventListener("click",()=>{
      const open=btn.getAttribute("aria-expanded")==="true";
      items.forEach(it=>{ const q=it.querySelector(".faq-q"),a=it.querySelector(".faq-a"); if(q)q.setAttribute("aria-expanded","false"); if(a)a.hidden=true; });
      if(!open){ btn.setAttribute("aria-expanded","true"); ans.hidden=false; }
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener("click",e=>{
      const href=a.getAttribute("href"); if(!href||href==="#") return;
      const target=document.querySelector(href); if(!target) return;
      e.preventDefault();
      const navH=document.getElementById("navbar")?.offsetHeight||64;
      window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY-navH-8,behavior:"smooth"});
    });
  });
}

function initRegOverlay() {
  const overlay=document.getElementById("reg-overlay"), closeBtn=document.getElementById("reg-overlay-close");
  const iframe=document.getElementById("reg-iframe");
  if(!overlay||!closeBtn) return;
  const triggers=document.querySelectorAll(".reg-trigger");
  let isOpen=false;

  function open(e){
    e.preventDefault(); if(isOpen) return; isOpen=true;
    if(iframe&&!iframe.getAttribute("src")) iframe.setAttribute("src",iframe.dataset.src);
    overlay.hidden=false; document.body.classList.add("overlay-open");
    overlay.getBoundingClientRect(); overlay.classList.add("open"); closeBtn.focus();
  }
  function close(){
    if(!isOpen) return; isOpen=false;
    overlay.classList.remove("open"); document.body.classList.remove("overlay-open");
    const inner=overlay.querySelector(".reg-overlay-inner");
    function done(ev){ if(ev.target!==inner) return; inner.removeEventListener("transitionend",done); overlay.hidden=true; }
    inner.addEventListener("transitionend",done);
  }
  triggers.forEach(el=>el.addEventListener("click",open));
  closeBtn.addEventListener("click",close);
  overlay.addEventListener("click",e=>{ if(e.target===overlay) close(); });
  document.addEventListener("keydown",e=>{ if(e.key==="Escape"&&isOpen) close(); });
}
