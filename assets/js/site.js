;(function(){
  // Rolagem suave para âncoras do cabeçalho
  document.addEventListener('click', function(e){
    var a = e.target.closest('a[href^="#"]');
    if(!a) return;
    var href = a.getAttribute('href');
    if(href.length <= 1) return;
    var target = document.querySelector(href);
    if(!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Destaque simples do link ativo com base no scroll
  var sections = ['#home','#apps','#ajuda','#sobre']
    .map(function(id){ return document.querySelector(id); })
    .filter(Boolean);

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.main-nav a'));

  function updateActive(){
    var fromTop = window.scrollY + 120; // compensa header fixo
    var current = sections.find(function(sec){ return sec.offsetTop <= fromTop && (sec.offsetTop + sec.offsetHeight) > fromTop; });
    navLinks.forEach(function(link){
      var match = current && link.getAttribute('href') === ('#' + current.id);
      link.classList.toggle('is-active', !!match);
    });
  }
  window.addEventListener('scroll', updateActive, { passive: true });
  window.addEventListener('load', updateActive);
})();

