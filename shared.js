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
  let projectCountPromise;
  const cio = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      const el=e.target;
      if(e.isIntersecting && !el.dataset.done && !el.dataset.loading){
        el.dataset.loading='1';
        const count = el.dataset.countSource
          ? (projectCountPromise ||= fetch(el.dataset.countSource).then(response=>{
              if(!response.ok) throw new Error('Failed to load project count');
              return response.json();
            }).then(data=>data.projects.filter(project=>['live','completed'].includes(project.status.toLowerCase())).length))
          : Promise.resolve(+el.dataset.count);
        count.then(target=>{
          el.dataset.count=target;
          el.dataset.done='1';
          delete el.dataset.loading;
          const suf=el.dataset.suffix||'';
          const dur=1400, t0=performance.now();
          (function tick(now){
            const p=Math.min((now-t0)/dur,1), v=Math.floor((1-Math.pow(1-p,4))*target);
            el.textContent=v+suf; if(p<1) requestAnimationFrame(tick);
          })(t0);
        }).catch(error=>{
          delete el.dataset.loading;
          console.error('Error loading project count:', error);
        });
      }
    });
  },{threshold:.5});
  document.querySelectorAll('[data-count]').forEach(el=>cio.observe(el));
  document.querySelectorAll('[data-count-source]').forEach(el=>{
    projectCountPromise ||= fetch(el.dataset.countSource).then(response=>{
      if(!response.ok) throw new Error('Failed to load project count');
      return response.json();
    }).then(data=>data.projects.filter(project=>['live','completed'].includes(project.status.toLowerCase())).length);
    projectCountPromise.then(target=>{
      el.dataset.count=target;
      if(!el.dataset.done) el.textContent=target+(el.dataset.suffix||'');
    }).catch(error=>console.error('Error loading project count:',error));
  });

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
    document.querySelectorAll('#projGrid .proj-card').forEach(c=>{
      const show = cat==='all' || (c.dataset.cat||'').split(' ').includes(cat);
      c.style.display = show ? '' : 'none';
    });
  };

  /* ── Keyboard support for clickable cards ──────────────────── */
  document.querySelectorAll('[role="button"][data-id]').forEach(card => {
    card.addEventListener('keydown', e => {
      if(e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

});
