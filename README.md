# Dev Learning Apps

Site oficial dos apps educativos de programação Dev Learning Apps.

## 🚀 Deploy

### GitHub Pages
O site está configurado para deploy automático no GitHub Pages. O sitemap.xml será servido corretamente com Content-Type `application/xml`.

### Vercel
```bash
# Deploy automático via Vercel
# O arquivo vercel.json configura o Content-Type correto
```

### Netlify
```bash
# Deploy automático via Netlify
# O arquivo _headers configura o Content-Type correto
```

## 📄 Sitemap

O sitemap.xml é gerado automaticamente e inclui:
- URLs canônicas de todas as páginas
- Hreflang para PT-BR, EN e ES (quando implementadas)
- Lastmod, changefreq e priority otimizados
- Content-Type correto (application/xml)

### Gerar sitemap manualmente:
```bash
npm run generate-sitemap
```

### Validar sitemap:
```bash
npm run validate-sitemap
```

## 🔧 Configuração

### URLs do Site
Configure a URL base em `config.json`:
```json
{
  "site": {
    "url": "https://devlearningapps.com"
  }
}
```

### Rotas Internacionais
Para habilitar rotas em inglês/espanhol, edite `config.json`:
```json
{
  "international": {
    "hasEnRoutes": true,
    "hasEsRoutes": true
  }
}
```

## 📁 Estrutura

```
├── public/
│   └── sitemap.xml          # Sitemap estático
├── scripts/
│   └── generate-sitemap.mjs # Gerador de sitemap
├── vercel.json              # Config Vercel
├── _headers                 # Config Netlify
├── .htaccess               # Config Apache
└── config.json             # Configurações
```

## ✅ Checklist de Deploy

- [x] Sitemap.xml acessível via https://devlearningapps.com/sitemap.xml
- [x] Content-Type: application/xml; charset=utf-8
- [x] XML válido com estrutura <urlset>
- [x] Robots.txt aponta para sitemap
- [x] Hreflang configurado (pt-BR, en, es)
- [x] URLs canônicas consistentes
- [x] Nenhum processo sobrescreve o XML

## 🛠️ Desenvolvimento

```bash
# Instalar dependências
npm install

# Gerar sitemap
npm run generate-sitemap

# Validar sitemap
npm run validate-sitemap
```
