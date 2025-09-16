#!/usr/bin/env node

/**
 * Sitemap Generator for Dev Learning Apps
 * Generates sitemap.xml with proper structure and hreflang
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

const SITE_URL = process.env.SITE_URL || 'https://devlearningapps.com';
const OUTPUT_DIR = process.env.OUTPUT_DIR || 'dist';
const PUBLIC_DIR = process.env.PUBLIC_DIR || 'public';

// Pages configuration
const pages = [
  {
    path: '/',
    priority: '1.0',
    changefreq: 'weekly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/apps.html',
    priority: '0.9',
    changefreq: 'weekly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/ajuda.html',
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/privacy-policy.html',
    priority: '0.5',
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0]
  }
];

// Check if international routes exist
const hasEnRoutes = false; // Set to true when /en/ routes are implemented
const hasEsRoutes = false; // Set to true when /es/ routes are implemented

function generateSitemap() {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

  pages.forEach(page => {
    const fullUrl = `${SITE_URL}${page.path}`;
    
    sitemap += `
  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>`;

    // Add hreflang links
    sitemap += `
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${fullUrl}"/>`;
    
    if (hasEnRoutes) {
      sitemap += `
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}/en${page.path}"/>`;
    }
    
    if (hasEsRoutes) {
      sitemap += `
    <xhtml:link rel="alternate" hreflang="es" href="${SITE_URL}/es${page.path}"/>`;
    }
    
    sitemap += `
    <xhtml:link rel="alternate" hreflang="x-default" href="${fullUrl}"/>
  </url>`;
  });

  sitemap += `
</urlset>`;

  return sitemap;
}

function main() {
  try {
    const sitemap = generateSitemap();
    
    // Write to dist directory
    writeFileSync(join(OUTPUT_DIR, 'sitemap.xml'), sitemap, 'utf8');
    console.log(`✅ Sitemap generated: ${join(OUTPUT_DIR, 'sitemap.xml')}`);
    
    // Write to public directory (for static hosting)
    writeFileSync(join(PUBLIC_DIR, 'sitemap.xml'), sitemap, 'utf8');
    console.log(`✅ Sitemap generated: ${join(PUBLIC_DIR, 'sitemap.xml')}`);
    
    console.log(`🌐 Sitemap URL: ${SITE_URL}/sitemap.xml`);
    console.log(`📄 Pages included: ${pages.length}`);
    console.log(`🌍 International routes: ${hasEnRoutes ? 'EN' : ''} ${hasEsRoutes ? 'ES' : ''}`);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

main();
