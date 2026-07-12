// Mobile menu
const menuBtn=document.getElementById('menuBtn');
const navLinks=document.getElementById('navLinks');
if(menuBtn&&navLinks){
  menuBtn.addEventListener('click',()=>navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>navLinks.classList.remove('open')));
}

// Scroll reveal
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}});
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Framework stepper (homepage only)
const steps=[...document.querySelectorAll('.fw-step')];
if(steps.length){
  let current=0,timer;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function activate(i){
    steps.forEach((s,idx)=>s.classList.toggle('active',idx===i));
    current=i;
    const bar=steps[i].querySelector('.bar');
    bar.style.transition='none';bar.style.width='0';
    requestAnimationFrame(()=>{bar.style.transition='';bar.offsetWidth;bar.style.width='';});
  }
  function restart(){
    clearInterval(timer);
    if(!reduced){timer=setInterval(()=>activate((current+1)%steps.length),4500);}
  }
  steps.forEach((s,i)=>s.addEventListener('click',()=>{activate(i);restart();}));
  restart();
}
