/**
 * Hero Carousel - Funcionalidade do carrossel principal
 * 
 * Funcionalidades:
 * - Navegação por botões e dots
 * - Autoplay com pausa ao hover/focus
 * - Acessibilidade completa (ARIA, navegação por teclado)
 * - Suporte a carregamento dinâmico de slides
 */

(function(){
  function initHeroCarousel(root){
    if(!root) return;
    
    var slides = Array.prototype.slice.call(root.querySelectorAll('.hero-slide'));
    var dotsContainer = root.querySelector('.hero-dots');
    var prevBtn = root.querySelector('.hero-nav.prev');
    var nextBtn = root.querySelector('.hero-nav.next');
    var autoplayMs = Number(root.getAttribute('data-autoplay') || 6000);
    var current = 0; 
    var timer = null;
    var isPaused = false;

    // Verificar se há slides para exibir
    if(slides.length === 0) {
      console.log('Nenhum slide encontrado no carrossel');
      return;
    }

    function goTo(index){
      // Atualizar slides
      slides.forEach(function(s, i){ 
        s.classList.toggle('is-active', i === index);
        s.setAttribute('aria-hidden', i !== index ? 'true' : 'false');
      });
      
      // Atualizar dots
      var dots = Array.prototype.slice.call(dotsContainer.children);
      dots.forEach(function(d, i){ 
        d.classList.toggle('is-active', i === index);
        d.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
      
      // Atualizar aria-label do carrossel
      root.setAttribute('aria-label', `Banner principal - Slide ${index + 1} de ${slides.length}`);
      
      current = index;
    }

    function next(){ 
      goTo((current + 1) % slides.length); 
    }
    
    function prev(){ 
      goTo((current - 1 + slides.length) % slides.length); 
    }

    // Configurar dots existentes
    var dots = Array.prototype.slice.call(dotsContainer.children);
    dots.forEach(function(dot, i){
      dot.addEventListener('click', function(){ 
        goTo(i); 
        restart(); 
      });
      
      // Adicionar suporte a teclado
      dot.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          goTo(i);
          restart();
        }
      });
    });

    // Configurar botões de navegação
    if(nextBtn) {
      nextBtn.addEventListener('click', function(){ 
        next(); 
        restart(); 
      });
      
      nextBtn.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          next();
          restart();
        }
      });
    }
    
    if(prevBtn) {
      prevBtn.addEventListener('click', function(){ 
        prev(); 
        restart(); 
      });
      
      prevBtn.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          prev();
          restart();
        }
      });
    }

    // Controle de autoplay
    function start(){ 
      if(timer) clearInterval(timer); 
      if(!isPaused) {
        timer = setInterval(next, autoplayMs); 
      }
    }
    
    function stop(){ 
      if(timer) clearInterval(timer); 
      timer = null;
    }
    
    function restart(){ 
      stop(); 
      start(); 
    }
    
    function pause(){
      isPaused = true;
      stop();
    }
    
    function resume(){
      isPaused = false;
      start();
    }

    // Pausar ao hover
    root.addEventListener('mouseenter', pause);
    root.addEventListener('mouseleave', resume);
    
    // Pausar ao focar em elementos interativos
    root.addEventListener('focusin', pause);
    root.addEventListener('focusout', resume);
    
    // Pausar quando a aba não está visível
    document.addEventListener('visibilitychange', function(){
      if(document.hidden) {
        pause();
      } else {
        resume();
      }
    });

    // Navegação por teclado no carrossel
    root.addEventListener('keydown', function(e){
      if(!root.contains(document.activeElement)) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          prev();
          restart();
          break;
        case 'ArrowRight':
          e.preventDefault();
          next();
          restart();
          break;
        case 'Home':
          e.preventDefault();
          goTo(0);
          restart();
          break;
        case 'End':
          e.preventDefault();
          goTo(slides.length - 1);
          restart();
          break;
        case ' ':
          e.preventDefault();
          if(isPaused) {
            resume();
          } else {
            pause();
          }
          break;
      }
    });

    // Inicializar
    goTo(0); 
    start();
    
    // Expor controles para uso externo
    root.heroCarousel = {
      goTo: goTo,
      next: next,
      prev: prev,
      pause: pause,
      resume: resume,
      restart: restart
    };
  }

  // Inicializar quando DOM estiver pronto
  function initAllCarousels(){
    Array.prototype.slice.call(document.querySelectorAll('.hero-carousel')).forEach(initHeroCarousel);
  }

  if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllCarousels);
  } else {
    initAllCarousels();
  }
  
  // Re-inicializar se necessário (para carregamento dinâmico)
  window.initHeroCarousel = initHeroCarousel;
  window.initAllHeroCarousels = initAllCarousels;
})();