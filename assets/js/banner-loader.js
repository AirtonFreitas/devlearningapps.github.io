/**
 * Banner Loader - Carrega automaticamente imagens da pasta home-carousel
 * 
 * Para adicionar um banner, suba a imagem em assets/home-carousel/ e 
 * (opcionalmente) adicione um bloco no captions.json com os textos.
 * 
 * Funcionalidades:
 * - Carregamento dinâmico de imagens da pasta
 * - Suporte a textos por imagem via captions.json
 * - Internacionalização (PT/EN)
 * - Acessibilidade completa (ARIA, navegação por teclado)
 * - Performance otimizada (preload + lazy loading)
 */

(function(){
  let captions = {};
  let currentLocale = 'pt';
  let imageFiles = [];
  
  // Detectar idioma atual
  function detectLocale() {
    const htmlLang = document.documentElement.lang || 'pt';
    return htmlLang.startsWith('en') ? 'en' : 'pt';
  }
  
  // Carregar captions.json
  async function loadCaptions() {
    try {
      const response = await fetch('assets/home-carousel/captions.json');
      if (response.ok) {
        captions = await response.json();
        console.log('Captions carregados:', captions);
      } else {
        console.error('Erro ao carregar captions.json:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Erro ao carregar captions.json:', error);
    }
  }
  
  // Listar arquivos de imagem da pasta
  async function getImageFiles() {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'avif'];
    const files = [];
    
    // Tentar carregar cada possível arquivo
    for (let i = 1; i <= 20; i++) {
      for (const ext of imageExtensions) {
        const fileName = `banner-${i.toString().padStart(2, '0')}.${ext}`;
        const imagePath = `assets/home-carousel/${fileName}`;
        
        try {
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = () => resolve(true);
            img.onerror = () => reject(false);
            img.src = imagePath;
          });
          files.push({
            fileName: fileName,
            path: imagePath,
            name: fileName.replace(/\.[^/.]+$/, ''),
            extension: ext
          });
          break; // Se encontrou a imagem, não precisa testar outras extensões
        } catch (e) {
          // Arquivo não existe, continuar
        }
      }
    }
    
    return files.sort((a, b) => a.fileName.localeCompare(b.fileName));
  }
  
  // Obter texto para uma imagem
  function getImageText(fileName) {
    console.log('Buscando texto para:', fileName, 'Locale:', currentLocale);
    console.log('Captions disponíveis:', Object.keys(captions));
    
    const imageCaptions = captions[fileName];
    if (!imageCaptions) {
      console.log('Nenhum caption encontrado para:', fileName);
      return {
        title: fileName.replace(/\.[^/.]+$/, '').replace(/-/g, ' '),
        subtitle: '',
        ctaText: '',
        ctaHref: '',
        alt: fileName.replace(/\.[^/.]+$/, '').replace(/-/g, ' ')
      };
    }
    
    const localeText = imageCaptions[currentLocale] || imageCaptions['pt'];
    console.log('Texto encontrado:', localeText);
    
    return {
      title: localeText.title || '',
      subtitle: localeText.subtitle || '',
      ctaText: localeText.ctaText || '',
      ctaHref: localeText.ctaHref || '',
      alt: localeText.alt || fileName.replace(/\.[^/.]+$/, '').replace(/-/g, ' ')
    };
  }
  
  // Criar slide com conteúdo
  function createSlide(imageFile, index, total) {
    const text = getImageText(imageFile.fileName);
    const isFirst = index === 0;
    
    const slide = document.createElement('div');
    slide.className = `hero-slide${isFirst ? ' is-active' : ''}`;
    slide.setAttribute('role', 'tabpanel');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `Slide ${index + 1} de ${total}`);
    
    slide.innerHTML = `
      <div class="hero-slide-image">
        <img 
          src="${imageFile.path}" 
          alt="${text.alt}"
          ${isFirst ? '' : 'loading="lazy"'}
          ${isFirst ? 'fetchpriority="high"' : ''}
        />
        <div class="hero-slide-overlay"></div>
      </div>
      <div class="hero-slide-content">
        <div class="hero-slide-text">
          ${text.title ? `<h1 class="hero-slide-title">${text.title}</h1>` : ''}
          ${text.subtitle ? `<p class="hero-slide-subtitle">${text.subtitle}</p>` : ''}
          ${text.ctaText ? `
            <div class="hero-slide-actions">
              <a href="${text.ctaHref}" 
                 class="hero-slide-cta primary"
                 aria-label="${text.ctaText} - ${text.title}">
                ${text.ctaText}
              </a>
            </div>
          ` : ''}
        </div>
      </div>
    `;
    
    return slide;
  }
  
  // Criar dot de navegação
  function createDot(index, total) {
    const dot = document.createElement('button');
    dot.className = `hero-dot${index === 0 ? ' is-active' : ''}`;
    dot.setAttribute('aria-label', `Ir para slide ${index + 1} de ${total}`);
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    dot.setAttribute('aria-controls', `slide-${index}`);
    return dot;
  }
  
  // Atualizar carrossel
  function updateCarousel(images) {
    const carousel = document.querySelector('.hero-carousel');
    if (!carousel || images.length === 0) return;
    
    const slidesContainer = carousel.querySelector('.hero-slides') || createSlidesContainer();
    const dotsContainer = carousel.querySelector('.hero-dots');
    
    // Limpar conteúdo existente
    slidesContainer.innerHTML = '';
    if (dotsContainer) dotsContainer.innerHTML = '';
    
    // Criar slides
    images.forEach((imageFile, index) => {
      const slide = createSlide(imageFile, index, images.length);
      slide.id = `slide-${index}`;
      slidesContainer.appendChild(slide);
      
      // Criar dot
      if (dotsContainer) {
        const dot = createDot(index, images.length);
        dotsContainer.appendChild(dot);
      }
    });
    
    // Adicionar preload para primeira imagem
    if (images.length > 0) {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'image';
      preloadLink.href = images[0].path;
      document.head.appendChild(preloadLink);
    }
    
    console.log(`Carregadas ${images.length} imagens do carrossel`);
  }
  
  // Criar container de slides se não existir
  function createSlidesContainer() {
    const carousel = document.querySelector('.hero-carousel');
    const slidesContainer = document.createElement('div');
    slidesContainer.className = 'hero-slides';
    slidesContainer.setAttribute('role', 'tablist');
    slidesContainer.setAttribute('aria-label', 'Carrossel de banners');
    
    // Inserir antes dos botões de navegação
    const navButtons = carousel.querySelector('.hero-nav');
    carousel.insertBefore(slidesContainer, navButtons);
    
    return slidesContainer;
  }
  
  // Inicializar carrossel
  async function initBannerCarousel() {
    currentLocale = detectLocale();
    console.log('Idioma detectado:', currentLocale);
    
    // Carregar captions primeiro
    await loadCaptions();
    
    // Depois carregar imagens
    imageFiles = await getImageFiles();
    console.log('Imagens encontradas:', imageFiles);
    
    updateCarousel(imageFiles);
    
    // Re-inicializar o carrossel se já existir
    if (window.initHeroCarousel) {
      const carousel = document.querySelector('.hero-carousel');
      if (carousel) {
        window.initHeroCarousel(carousel);
      }
    }
  }
  
  // Navegação por teclado
  function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
      const carousel = document.querySelector('.hero-carousel');
      if (!carousel || !carousel.contains(document.activeElement)) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          const prevBtn = carousel.querySelector('.hero-nav.prev');
          if (prevBtn) prevBtn.click();
          break;
        case 'ArrowRight':
          e.preventDefault();
          const nextBtn = carousel.querySelector('.hero-nav.next');
          if (nextBtn) nextBtn.click();
          break;
        case 'Home':
          e.preventDefault();
          const firstDot = carousel.querySelector('.hero-dot');
          if (firstDot) firstDot.click();
          break;
        case 'End':
          e.preventDefault();
          const lastDot = carousel.querySelector('.hero-dot:last-child');
          if (lastDot) lastDot.click();
          break;
      }
    });
  }
  
  // Pausar autoplay ao focar
  function setupAutoplayPause() {
    const carousel = document.querySelector('.hero-carousel');
    if (!carousel) return;
    
    carousel.addEventListener('focusin', function() {
      carousel.setAttribute('data-paused', 'true');
    });
    
    carousel.addEventListener('focusout', function() {
      carousel.removeAttribute('data-paused');
    });
  }
  
  // Inicializar quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initBannerCarousel();
      setupKeyboardNavigation();
      setupAutoplayPause();
    });
  } else {
    initBannerCarousel();
    setupKeyboardNavigation();
    setupAutoplayPause();
  }
  
  // Expor função para re-inicialização se necessário
  window.reloadBannerCarousel = initBannerCarousel;
})();