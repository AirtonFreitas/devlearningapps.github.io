/**
 * Sistema de Internacionalização (i18n) para Dev Learning Apps
 * Suporta Português (pt), Inglês (en) e Espanhol (es)
 */

class I18nManager {
  constructor() {
    this.currentLanguage = this.detectLanguage();
    this.translations = {};
    this.loading = false;
    this.init();
  }

  /**
   * Detecta o idioma baseado na URL ou preferências do usuário
   */
  detectLanguage() {
    const path = window.location.pathname;
    
    // Verifica se há idioma na URL (/pt/, /en/, /es/)
    const urlMatch = path.match(/^\/(pt|en|es)\//);
    if (urlMatch) {
      return urlMatch[1];
    }
    
    // Verifica se está na raiz (padrão português)
    if (path === '/' || path === '/index.html') {
      return 'pt';
    }
    
    // Fallback para português
    return 'pt';
  }

  /**
   * Inicializa o sistema de i18n
   */
  async init() {
    try {
      await this.loadTranslations();
      this.applyTranslations();
      this.setupLanguageSwitcher();
    } catch (error) {
      console.error('Erro ao inicializar i18n:', error);
    }
  }

  /**
   * Carrega as traduções do idioma atual
   */
  async loadTranslations() {
    if (this.loading) return;
    
    this.loading = true;
    
    try {
      const response = await fetch(`/assets/i18n/${this.currentLanguage}.json`);
      if (!response.ok) {
        throw new Error(`Erro ao carregar traduções: ${response.status}`);
      }
      this.translations = await response.json();
    } catch (error) {
      console.error('Erro ao carregar traduções:', error);
      // Fallback para português em caso de erro
      if (this.currentLanguage !== 'pt') {
        this.currentLanguage = 'pt';
        const response = await fetch('/assets/i18n/pt.json');
        this.translations = await response.json();
      }
    } finally {
      this.loading = false;
    }
  }

  /**
   * Aplica as traduções aos elementos da página
   */
  applyTranslations() {
    // Atualiza meta tags
    this.updateMetaTags();
    
    // Atualiza elementos com data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.getTranslation(key);
      if (translation) {
        if (element.tagName === 'INPUT' && element.type === 'text') {
          element.placeholder = translation;
        } else {
          element.textContent = translation;
        }
      }
    });

    // Atualiza elementos com data-i18n-html (para HTML)
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
      const key = element.getAttribute('data-i18n-html');
      const translation = this.getTranslation(key);
      if (translation) {
        element.innerHTML = translation;
      }
    });

    // Atualiza atributos específicos
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      const translation = this.getTranslation(key);
      if (translation) {
        element.title = translation;
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      const translation = this.getTranslation(key);
      if (translation) {
        element.placeholder = translation;
      }
    });

    // Atualiza atributos alt das imagens
    document.querySelectorAll('[data-i18n-alt]').forEach(element => {
      const key = element.getAttribute('data-i18n-alt');
      const translation = this.getTranslation(key);
      if (translation) {
        element.alt = translation;
      }
    });
  }

  /**
   * Atualiza as meta tags da página
   */
  updateMetaTags() {
    const meta = this.translations.meta;
    if (!meta) return;

    // Título da página
    document.title = meta.title;

    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.content = meta.description;
    }

    // Meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.content = meta.keywords;
    }

    // Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.content = meta.title;
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.content = meta.description;
    }

    // Twitter Card
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.content = meta.title;
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.content = meta.description;
    }
  }

  /**
   * Obtém uma tradução usando notação de ponto (ex: 'home.banner_title')
   */
  getTranslation(key) {
    const keys = key.split('.');
    let translation = this.translations;
    
    for (const k of keys) {
      if (translation && typeof translation === 'object' && k in translation) {
        translation = translation[k];
      } else {
        console.warn(`Tradução não encontrada para: ${key}`);
        return key; // Retorna a chave se não encontrar a tradução
      }
    }
    
    return translation;
  }

  /**
   * Configura o seletor de idioma
   */
  setupLanguageSwitcher() {
    // Cria o seletor de idioma se não existir
    let languageSwitcher = document.querySelector('.language-switcher');
    
    if (!languageSwitcher) {
      languageSwitcher = document.createElement('div');
      languageSwitcher.className = 'language-switcher';
      languageSwitcher.innerHTML = `
        <select id="language-select">
          <option value="pt" ${this.currentLanguage === 'pt' ? 'selected' : ''}>🇧🇷 PT</option>
          <option value="en" ${this.currentLanguage === 'en' ? 'selected' : ''}>🇺🇸 EN</option>
          <option value="es" ${this.currentLanguage === 'es' ? 'selected' : ''}>🇪🇸 ES</option>
        </select>
      `;
      
      // Adiciona estilos
      languageSwitcher.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        background: rgba(0, 0, 0, 0.8);
        border-radius: 8px;
        padding: 8px;
        backdrop-filter: blur(10px);
      `;
      
      const select = languageSwitcher.querySelector('#language-select');
      select.style.cssText = `
        background: transparent;
        color: #00ffe0;
        border: 1px solid #00ffe0;
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 14px;
        cursor: pointer;
      `;
      
      document.body.appendChild(languageSwitcher);
    }

    // Adiciona evento de mudança de idioma
    const select = languageSwitcher.querySelector('#language-select');
    select.addEventListener('change', (e) => {
      this.changeLanguage(e.target.value);
    });
  }

  /**
   * Muda o idioma da página
   */
  async changeLanguage(newLanguage) {
    if (newLanguage === this.currentLanguage) return;
    
    this.currentLanguage = newLanguage;
    
    // Atualiza a URL
    const currentPath = window.location.pathname;
    const newPath = this.updateUrlForLanguage(currentPath, newLanguage);
    
    if (newPath !== currentPath) {
      window.history.pushState({}, '', newPath);
    }
    
    // Recarrega as traduções
    await this.loadTranslations();
    this.applyTranslations();
  }

  /**
   * Atualiza a URL para incluir o idioma
   */
  updateUrlForLanguage(path, language) {
    // Remove idioma atual se existir
    const cleanPath = path.replace(/^\/(pt|en|es)\//, '/');
    
    // Adiciona novo idioma (exceto para português que fica na raiz)
    if (language === 'pt') {
      return cleanPath === '/' ? '/' : cleanPath;
    } else {
      return `/${language}${cleanPath === '/' ? '' : cleanPath}`;
    }
  }

  /**
   * Obtém o idioma atual
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * Verifica se está carregando
   */
  isLoading() {
    return this.loading;
  }
}

// Inicializa o sistema quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.i18n = new I18nManager();
});

// Exporta para uso global
window.I18nManager = I18nManager;
