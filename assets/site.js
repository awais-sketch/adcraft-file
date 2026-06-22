/* Adcraft Studio — shared site behaviour (smooth scroll, reveals, menu) */
(function(){
  // anim-ready probe — enable animations only if the browser renders frames; else keep content visible
  var root=document.documentElement; root.classList.add('anim-ready');
  var fired=false; requestAnimationFrame(function(){fired=true});
  setTimeout(function(){
    if(fired) return;
    root.classList.remove('anim-ready');
    document.querySelectorAll('.page-hero>.wrap>*,.nav,.rv,.stg>*,.work-card,.work-img img').forEach(function(e){
      e.style.opacity='1';e.style.transform='none';e.style.animation='none';e.style.clipPath='none';
    });
  },250);
})();

document.addEventListener('DOMContentLoaded',function(){
  // smooth momentum scroll (Lenis)
  var lenis=null;
  if(window.Lenis){
    var ls=document.createElement('style');
    ls.textContent='html.lenis,html.lenis body{height:auto}.lenis.lenis-smooth{scroll-behavior:auto!important}.lenis.lenis-stopped{overflow:hidden}';
    document.head.appendChild(ls);
    lenis=new Lenis({duration:1.15,easing:function(t){return Math.min(1,1.001-Math.pow(2,-10*t))},smoothWheel:true});
    var raf=function(t){lenis.raf(t);requestAnimationFrame(raf)};requestAnimationFrame(raf);
  }
  // reveal
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.16,rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.rv,.stg').forEach(function(el){io.observe(el)});
  // per-card work reveal (image wipes up)
  var wio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('shown');wio.unobserve(e.target)}})},{threshold:.18,rootMargin:'0px 0px -10% 0px'});
  document.querySelectorAll('.work-card').forEach(function(el){wio.observe(el)});
  // image parallax
  var px=[].slice.call(document.querySelectorAll('[data-parallax]'));
  var updatePx=function(){var vh=innerHeight;px.forEach(function(el){var r=el.getBoundingClientRect();var off=(r.top+r.height/2-vh/2)/vh;var f=parseFloat(el.dataset.parallax)||.1;el.style.transform='translate3d(0,'+(-off*f*100).toFixed(2)+'px,0)';});};
  // scroll-aware nav + parallax
  var nav=document.getElementById('nav');
  var onScroll=function(){if(nav)nav.classList.toggle('scrolled',(lenis?lenis.scroll:scrollY)>24);updatePx();};
  if(lenis)lenis.on('scroll',onScroll);addEventListener('scroll',onScroll,{passive:true});onScroll();
  // smooth in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){var id=a.getAttribute('href');if(id.length>1){var t=document.querySelector(id);if(t){e.preventDefault();lenis?lenis.scrollTo(t,{offset:-72}):t.scrollIntoView({behavior:'smooth'});}}});});
  // mobile menu
  var burger=document.getElementById('burger'),mm=document.getElementById('mobileMenu');
  if(burger&&mm){
    var toggleMenu=function(open){var o=(open===undefined)?!burger.classList.contains('open'):open;burger.classList.toggle('open',o);mm.classList.toggle('open',o);burger.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':'';if(lenis){o?lenis.stop():lenis.start();}};
    burger.addEventListener('click',function(){toggleMenu();});
    mm.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){toggleMenu(false);});});
  }
});
