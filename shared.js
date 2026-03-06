/* ══════════════════════════════════════════════════════════════════
   OKASHA BUKHARI — PORTFOLIO  |  shared.js
   ══════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Custom Cursor ─────────────────────────────────────────── */
  (function(){
    const dot  = document.getElementById('cur');
    const ring = document.getElementById('cur-ring');
    const arms = document.getElementById('cur-arms');
    if(!dot || !ring) return;
    if(window.matchMedia('(pointer:coarse)').matches) return;

    let mx=0,my=0, rx=0,ry=0;

    document.addEventListener('mousemove', e=>{
      mx=e.clientX; my=e.clientY;
      dot.style.left  = mx+'px';
      dot.style.top   = my+'px';
      if(arms){ arms.style.left=mx+'px'; arms.style.top=my+'px'; }
    });

    (function lerpRing(){
      rx += (mx-rx) * 0.13;
      ry += (my-ry) * 0.13;
      ring.style.left = rx+'px';
      ring.style.top  = ry+'px';
      requestAnimationFrame(lerpRing);
    })();

    document.addEventListener('mouseover', e=>{
      const t = e.target.closest('a,button,.card,.btn-primary,.btn-ghost,.pf-btn,.icon-box,.fsoc,.nav-cta,.proj-link-btn');
      const on = !!t;
      dot.classList.toggle('hover',on);
      ring.classList.toggle('hover',on);
      if(arms) arms.classList.toggle('hover',on);
    });
  })();

  /* ── Active nav link by filename ──────────────────────────── */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mob-menu a').forEach(a=>{
    const href = a.getAttribute('href');
    if(href===page || (page==='' && href==='index.html'))
      a.classList.add('active');
  });

  /* ── Hamburger menu ────────────────────────────────────────── */
  const ham   = document.getElementById('hamburger');
  const mob   = document.getElementById('mobMenu');
  if(ham && mob){
    ham.addEventListener('click',()=>{
      ham.classList.toggle('open');
      mob.classList.toggle('open');
      document.body.style.overflow = mob.classList.contains('open') ? 'hidden' : '';
    });
  }

  /* ── Scroll reveal ─────────────────────────────────────────── */
  const rio = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); rio.unobserve(e.target); }});
  },{threshold:.1,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal').forEach(el=>rio.observe(el));

  /* ── Counter animation ─────────────────────────────────────── */
  const cio = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting && !e.target.dataset.done){
        e.target.dataset.done='1';
        const el=e.target, target=+el.dataset.count, suf=el.dataset.suffix||'';
        const dur=1400, t0=performance.now();
        (function tick(now){
          const p=Math.min((now-t0)/dur,1), v=Math.floor((1-Math.pow(1-p,4))*target);
          el.textContent=v+suf; if(p<1) requestAnimationFrame(tick);
        })(t0);
      }
    });
  },{threshold:.5});
  document.querySelectorAll('[data-count]').forEach(el=>cio.observe(el));

  /* ── Skill bars ────────────────────────────────────────────── */
  const sio = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.querySelectorAll('.sb-fill').forEach(b=>b.style.width=b.dataset.w+'%');
        sio.unobserve(e.target);
      }
    });
  },{threshold:.2});
  document.querySelectorAll('.skills-animate').forEach(el=>sio.observe(el));

  /* ── Active nav on scroll (home page only) ─────────────────── */
  const navAs = document.querySelectorAll('.nav-links a');
  if(navAs.length && document.querySelectorAll('section[id]').length > 1){
    window.addEventListener('scroll',()=>{
      const y=window.scrollY+140;
      document.querySelectorAll('section[id]').forEach(s=>{
        if(y>=s.offsetTop && y<s.offsetTop+s.offsetHeight)
          navAs.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+s.id));
      });
    },{passive:true});
  }

  /* ── Project filter ────────────────────────────────────────── */
  window.filterProj = function(btn,cat){
    document.querySelectorAll('.pf-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.proj-card').forEach(c=>{
      const show = cat==='all' || (c.dataset.cat||'').split(' ').includes(cat);
      c.style.transition='opacity .3s,transform .3s';
      c.style.opacity = show?'1':'0.08';
      c.style.pointerEvents = show?'auto':'none';
    });
  };

  /* ── Contact form ──────────────────────────────────────────── */
  window.submitForm = function(){
    const name  = (document.getElementById('cf-name')||{}).value?.trim();
    const email = (document.getElementById('cf-email')||{}).value?.trim();
    const msg   = (document.getElementById('cf-msg')||{}).value?.trim();
    const status = document.getElementById('cf-status');
    if(!status) return;
    if(!name||!email||!msg){ status.style.color='#ff6b6b'; status.textContent='Please fill in name, email & message.'; return; }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ status.style.color='#ff6b6b'; status.textContent='Invalid email address.'; return; }
    const btn = document.querySelector('.cf-submit');
    btn.textContent='Sending…'; btn.disabled=true;
    setTimeout(()=>{
      status.style.color='var(--cyan)'; status.textContent='Message sent! I\'ll reply within 24 hrs.';
      btn.textContent='Sent!'; btn.style.opacity='.6';
      ['cf-name','cf-email','cf-msg'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
    },1200);
  };

});
