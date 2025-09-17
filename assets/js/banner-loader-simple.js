// Banner Loader Simplificado - Para debug
(function(){
  let captions = {};
  let currentLocale = 'pt';
  
  // Detectar idioma atual
  function detectLocale() {
    const htmlLang = document.documentElement.lang || 'pt';
    if (htmlLang.startsWith('en')) return 'en';
    if (htmlLang.startsWith('es')) return 'es';
    return 'pt';
  }
  
  // Captions embutidos (fallback quando não consegue carregar o JSON)
  const embeddedCaptions = {
    "banner-01.png": {
      "pt": {
        "title": "Seu caminho, módulo a módulo.",
        "subtitle": "Trilhas guiadas em SQL, Python, Flutter e HTML — do zero ao avançado.",
        "ctaText": "Ver Apps",
        "ctaHref": "/apps.html",
        "alt": "Roadmap de estudo com ícones dos apps Dev Learning"
      },
      "en": {
        "title": "Your path, module by module.",
        "subtitle": "Guided tracks in SQL, Python, Flutter and HTML — from beginner to advanced.",
        "ctaText": "View Apps",
        "ctaHref": "/en/apps.html",
        "alt": "Study roadmap with Dev Learning app icons"
      },
      "es": {
        "title": "Tu camino, módulo a módulo.",
        "subtitle": "Rutas guiadas en SQL, Python, Flutter y HTML — de principiante a avanzado.",
        "ctaText": "Ver Apps",
        "ctaHref": "/es/apps.html",
        "alt": "Hoja de ruta de estudio con íconos de las apps de Dev Learning"
      }
    },
    "banner-02.png": {
      "pt": {
        "title": "Estude e codifique no mesmo lugar.",
        "subtitle": "IDE integrada: execute exemplos, teste códigos e aprenda mais rápido.",
        "ctaText": "Ver Apps",
        "ctaHref": "/apps.html",
        "alt": "Editor de código com saída dentro do app Dev Learning"
      },
      "en": {
        "title": "Study and code in one place.",
        "subtitle": "Integrated IDE: run examples, try code, learn faster.",
        "ctaText": "View Apps",
        "ctaHref": "/en/apps.html",
        "alt": "Code editor with output inside the Dev Learning app"
      },
      "es": {
        "title": "Estudia y programa en un solo lugar.",
        "subtitle": "IDE integrada: ejecuta ejemplos, prueba código y aprende más rápido.",
        "ctaText": "Ver Apps",
        "ctaHref": "/es/apps.html",
        "alt": "Editor de código con salida dentro de la app Dev Learning"
      }
    },
    "banner-03.png": {
      "pt": {
        "title": "Estude pelo celular, em qualquer lugar.",
        "subtitle": "Aulas curtas, áudio e progresso sincronizado entre dispositivos.",
        "ctaText": "Explorar apps",
        "ctaHref": "/apps.html",
        "alt": "Pessoa estudando pelos apps Dev Learning no celular"
      },
      "en": {
        "title": "Learn on your phone, anywhere.",
        "subtitle": "Short lessons, audio, and synced progress across devices.",
        "ctaText": "Explore apps",
        "ctaHref": "/en/apps.html",
        "alt": "Person learning with Dev Learning apps on a phone"
      },
      "es": {
        "title": "Estudia en tu celular, en cualquier lugar.",
        "subtitle": "Lecciones cortas, audio y progreso sincronizado entre dispositivos.",
        "ctaText": "Explorar apps",
        "ctaHref": "/es/apps.html",
        "alt": "Persona estudiando con las apps de Dev Learning en el móvil"
      }
    }
  };
  
  // Carregar captions.json
  async function loadCaptions() {
    try {
      const response = await fetch('assets/home-carousel/captions.json');
      if (response.ok) {
        captions = await response.json();
        console.log('✅ Captions carregados do JSON:', captions);
      } else {
        console.warn('⚠️ Usando captions embutidos (servidor não disponível)');
        captions = embeddedCaptions;
      }
    } catch (error) {
      console.warn('⚠️ Usando captions embutidos (erro ao carregar JSON):', error.message);
      captions = embeddedCaptions;
    }
  }
  
  // Obter texto para uma imagem
  function getImageText(fileName) {
    console.log('🔍 Buscando texto para:', fileName, 'Locale:', currentLocale);
    console.log('📋 Captions disponíveis:', Object.keys(captions));
    
    const imageCaptions = captions[fileName];
    if (!imageCaptions) {
      console.log('⚠️ Nenhum caption encontrado para:', fileName);
      return {
        title: fileName.replace(/\.[^/.]+$/, '').replace(/-/g, ' '),
        subtitle: '',
        ctaText: '',
        ctaHref: '',
        alt: fileName.replace(/\.[^/.]+$/, '').replace(/-/g, ' ')
      };
    }
    
    const localeText = imageCaptions[currentLocale] || imageCaptions['pt'] || imageCaptions['en'];
    console.log('✅ Texto encontrado:', localeText);
    
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
          console.log('✅ Imagem encontrada:', fileName);
          break; // Se encontrou a imagem, não precisa testar outras extensões
        } catch (e) {
          // Arquivo não existe, continuar
        }
      }
    }
    
    console.log('📋 Total de imagens encontradas:', files.length);
    return files.sort((a, b) => a.fileName.localeCompare(b.fileName));
  }
  
  // Atualizar carrossel
  function updateCarousel(images) {
    const carousel = document.querySelector('.hero-carousel');
    if (!carousel || images.length === 0) {
      console.log('❌ Carrossel não encontrado ou sem imagens');
      return;
    }
    
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
        const dot = document.createElement('button');
        dot.className = `hero-dot${index === 0 ? ' is-active' : ''}`;
        dot.setAttribute('aria-label', `Ir para slide ${index + 1} de ${images.length}`);
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
        dot.setAttribute('aria-controls', `slide-${index}`);
        dotsContainer.appendChild(dot);
      }
    });
    
    console.log(`✅ Carrossel atualizado com ${images.length} imagens`);
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
    console.log('🚀 Inicializando carrossel...');
    currentLocale = detectLocale();
    console.log('🌐 Idioma detectado:', currentLocale);
    
    // Carregar captions primeiro
    await loadCaptions();
    
    // Depois carregar imagens
    const imageFiles = await getImageFiles();
    console.log('🖼️ Imagens encontradas:', imageFiles);
    
    updateCarousel(imageFiles);
    
    // Re-inicializar o carrossel se já existir
    if (window.initHeroCarousel) {
      const carousel = document.querySelector('.hero-carousel');
      if (carousel) {
        window.initHeroCarousel(carousel);
      }
    }
  }
  
  // Inicializar quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBannerCarousel);
  } else {
    initBannerCarousel();
  }
  
  // Expor função para re-inicialização se necessário
  window.reloadBannerCarousel = initBannerCarousel;
})();
