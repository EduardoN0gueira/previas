(function(){
  var d=document, root=d.documentElement;
  var reduce=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* aparecer ao rolar */
  if('IntersectionObserver' in window && !reduce){
    root.classList.add('js');
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -6% 0px',threshold:.06});
    d.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
  }

  /* cabeçalho sólido ao rolar */
  var top=d.getElementById('top');
  if(top && !top.classList.contains('always')){
    var onScroll=function(){top.classList.toggle('solid', window.scrollY>40);};
    onScroll(); window.addEventListener('scroll', onScroll, {passive:true});
  }

  /* menu do telemóvel */
  var drawer=d.getElementById('drawer'), burger=d.getElementById('burger'), dclose=d.getElementById('drawerClose');
  function setMenu(open){
    if(!drawer) return;
    drawer.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', open?'false':'true');
    burger.setAttribute('aria-expanded', open?'true':'false');
    d.body.classList.toggle('locked', open);
    if(open){ dclose.focus(); } else { burger.focus({preventScroll:true}); }
  }
  if(burger){
    burger.addEventListener('click', function(){setMenu(true);});
    dclose.addEventListener('click', function(){setMenu(false);});
    drawer.addEventListener('click', function(ev){ if(ev.target.closest('a')) { drawer.classList.remove('open'); d.body.classList.remove('locked'); } });
    d.addEventListener('keydown', function(ev){ if(ev.key==='Escape' && drawer.classList.contains('open')) setMenu(false); });
  }

  /* galeria com ampliação, setas e deslizar */
  var lb=d.getElementById('lb');
  var galleries=d.querySelectorAll('[data-gallery]');
  if(lb && galleries.length){
    var li=d.getElementById('lbImg'), lc=d.getElementById('lbCap'), list=[], idx=0;
    var visible=function(g){return Array.prototype.filter.call(g.querySelectorAll('.g'), function(b){return !b.hidden;});};
    var show=function(i){
      idx=(i+list.length)%list.length; var b=list[idx];
      li.src=b.getAttribute('data-full'); li.alt=b.querySelector('img').alt;
      lc.innerHTML=''; lc.appendChild(d.createTextNode(b.getAttribute('data-cap')));
      var s=d.createElement('small'); s.textContent=(idx+1)+' / '+list.length; lc.appendChild(s);
    };
    galleries.forEach(function(g){
      g.addEventListener('click', function(ev){
        var b=ev.target.closest('.g'); if(!b || !lb.showModal) return;
        list=visible(g); show(list.indexOf(b)); lb.showModal();
      });
    });
    d.getElementById('lbClose').addEventListener('click', function(){lb.close();});
    d.getElementById('lbPrev').addEventListener('click', function(){show(idx-1);});
    d.getElementById('lbNext').addEventListener('click', function(){show(idx+1);});
    lb.addEventListener('click', function(ev){ if(ev.target===lb || ev.target.classList.contains('lb-inner')) lb.close(); });
    lb.addEventListener('keydown', function(ev){ if(ev.key==='ArrowLeft') show(idx-1); if(ev.key==='ArrowRight') show(idx+1); });
    var x0=null;
    lb.addEventListener('touchstart', function(ev){x0=ev.touches[0].clientX;}, {passive:true});
    lb.addEventListener('touchend', function(ev){ if(x0===null) return; var dx=ev.changedTouches[0].clientX-x0; if(Math.abs(dx)>50) show(idx+(dx<0?1:-1)); x0=null; });
  }

  /* filtros dos trabalhos */
  var filters=d.getElementById('filters');
  if(filters){
    var grid=d.getElementById('gallery');
    var applyF=function(b){
      var f=b.getAttribute('data-f');
      filters.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed', x===b?'true':'false');});
      grid.querySelectorAll('.g').forEach(function(g){ g.hidden = !(f==='todos' || g.getAttribute('data-cat')===f); g.classList.add('in'); });
    };
    filters.addEventListener('click', function(ev){ var b=ev.target.closest('button'); if(b) applyF(b); });
    var hb=location.hash && filters.querySelector('button[data-f="'+location.hash.slice(1)+'"]');
    if(hb) applyF(hb);
  }

  /* submenu dos serviços: destaca a secção visível */
  var sub=d.getElementById('subnav');
  if(sub && 'IntersectionObserver' in window){
    var links={}; sub.querySelectorAll('a').forEach(function(a){links[a.getAttribute('href').slice(1)]=a;});
    var so=new IntersectionObserver(function(es){es.forEach(function(e){ if(e.isIntersecting){ Object.keys(links).forEach(function(k){links[k].classList.toggle('on', k===e.target.id);}); var a=links[e.target.id]; if(a && a.scrollIntoView){ var w=sub.firstElementChild; w.scrollTo({left:a.offsetLeft-16, behavior:reduce?'auto':'smooth'}); } } });},{rootMargin:'-45% 0px -50% 0px'});
    Object.keys(links).forEach(function(k){var s=d.getElementById(k); if(s) so.observe(s);});
  }

  /* formulário (protótipo: mostra a confirmação, não envia) */
  var form=d.getElementById('form');
  if(form){
    var p=new URLSearchParams(location.search).get('servico');
    if(p){ var r=form.querySelector('input[name="tipo"][value="'+p+'"]'); if(r) r.checked=true; }
    var file=form.querySelector('input[type="file"]'), fl=d.getElementById('fileLabel');
    if(file && fl){ file.addEventListener('change', function(){ fl.textContent = file.files.length ? file.files.length+' fotografia(s) escolhida(s)' : 'Adicionar fotografias do espaço (opcional)'; }); }
    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      if(!form.reportValidity || form.reportValidity()){
        form.classList.add('sent');
        form.scrollIntoView({behavior:reduce?'auto':'smooth', block:'center'});
      }
    });
    var again=d.getElementById('formAgain');
    if(again) again.addEventListener('click', function(){ form.reset(); form.classList.remove('sent'); });
  }
})();
