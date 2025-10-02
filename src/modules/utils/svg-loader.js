/* ==============================
  ?렓 SVG 濡쒕뜑 紐⑤뱢
  ============================== */

import { createIconMap, getIconPath, fallbackIcon } from '../../../svg/icon/index.js';

export const SVGLoader = {
  cache: new Map(),
  
  get iconMap() {
    return createIconMap();
  },
  
  convertToCurrentColor(svgMarkup) {
    return svgMarkup
      .replace(/fill="(?!none|transparent)[^"]*"/gi, 'fill="currentColor"')
      .replace(/stroke="(?!none|transparent)[^"]*"/gi, 'stroke="currentColor"')
      .replace(/fill='(?!none|transparent)[^']*'/gi, "fill='currentColor'")
      .replace(/stroke='(?!none|transparent)[^']*'/gi, "stroke='currentColor'")
      .replace(/fill:\s*(?!none|transparent)[^;}\s]+/gi, 'fill: currentColor')
      .replace(/stroke:\s*(?!none|transparent)[^;}\s]+/gi, 'stroke: currentColor');
  },
  
  async preloadAllIcons() {
    const loadPromises = Object.entries(this.iconMap).map(async ([key, config]) => {
      try {
        const response = await fetch(config.path);
        if (!response.ok) throw new Error(`SVG not found: ${config.path}`);
        const svgMarkup = await response.text();
        this.cache.set(key, svgMarkup);
        console.log(`??Loaded ${key} icon`);
      } catch (error) {
        console.warn(`?좑툘 Failed to load ${key} icon from ${config.path}, using fallback`);
        try {
          const fallbackPath = getIconPath(fallbackIcon);
          const fallback = await fetch(fallbackPath);
          if (fallback.ok) {
            this.cache.set(key, await fallback.text());
          } else {
            this.cache.set(key, '');
          }
        } catch (fallbackError) {
          console.error(`??Fallback also failed for ${key}`);
          this.cache.set(key, '');
        }
      }
    });
    
    await Promise.all(loadPromises);
  },
  
  injectAllIcons() {
    Object.entries(this.iconMap).forEach(([key, config]) => {
      const svgMarkup = this.cache.get(key);
      if (!svgMarkup) {
        console.warn(`?좑툘 No cached SVG for ${key}`);
        return;
      }
      
      const processedSvg = this.convertToCurrentColor(svgMarkup);
      
      const targets = document.querySelectorAll(config.selector);
      if (targets.length === 0) {
        console.log(`?뱄툘 No elements found for selector: ${config.selector}`);
      }
      
      targets.forEach(el => {
        el.innerHTML = processedSvg;
      });
    });
    
    console.log('??All icons injected to DOM (converted to currentColor)');
  },
  
  async loadAndInject() {
    await this.preloadAllIcons();
    this.injectAllIcons();
  },
  
  getCached(key, convertColor = true) {
    const svg = this.cache.get(key) || '';
    return convertColor ? this.convertToCurrentColor(svg) : svg;
  }
};

