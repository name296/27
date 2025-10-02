/* ==============================
  ?렓 踰꾪듉 ?ㅽ???愿由ъ옄
  ============================== */

export const StyleManager = {
  scheduleUpdate() {
    this.waitForRenderCompletion().then(() => {
      this.updateButtonLabels();
    });
  },
  
  async waitForRenderCompletion() {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            resolve();
          }, 16);
        });
      });
    });
  },
  
  setupUpdateManager() {
    const observer = new MutationObserver((mutations) => {
      let needsUpdate = false;
      
      mutations.forEach(mutation => {
        const target = mutation.target;
        
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          if (target.classList.contains('button')) {
            needsUpdate = true;
          }
        }
        
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          if (target === document.documentElement) {
            needsUpdate = true;
          }
        }
      });
      
      if (needsUpdate) {
        this.scheduleUpdate();
      }
    });
    
    document.querySelectorAll('.button').forEach(button => {
      observer.observe(button, {
        attributes: true,
        attributeFilter: ['class']
      });
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    });
    return observer;
  },
  
  calculateContrastRGBA(r1, g1, b1, r2, g2, b2) {
    const getLuminance = (r, g, b) => {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };
    
    const lum1 = getLuminance(r1, g1, b1);
    const lum2 = getLuminance(r2, g2, b2);
    
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    const contrastRatio = (brightest + 0.05) / (darkest + 0.05);
    
    return contrastRatio;
  },

  calculateContrast(color1, color2) {
    const getRGB = (color) => {
      if (!color || color === 'transparent') {
        throw new Error('?좏슚?섏? ?딆? ?됱긽 媛믪엯?덈떎');
      }
      
      const rgbaMatch = color.match(/rgba?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)/);
      if (rgbaMatch) {
        return [
          Math.round(parseFloat(rgbaMatch[1])),
          Math.round(parseFloat(rgbaMatch[2])),
          Math.round(parseFloat(rgbaMatch[3]))
        ];
      }
      
      if (color.startsWith('#')) {
        const hex = color.replace('#', '');
        if (hex.length >= 6) {
          return [
            parseInt(hex.substr(0, 2), 16),
            parseInt(hex.substr(2, 2), 16),
            parseInt(hex.substr(4, 2), 16)
          ];
        }
      }
      
      throw new Error(`?됱긽 ?뚯떛 ?ㅽ뙣: ${color}`);
    };
    
    const [r1, g1, b1] = getRGB(color1);
    const [r2, g2, b2] = getRGB(color2);
    
    return this.calculateContrastRGBA(r1, g1, b1, r2, g2, b2);
  },
  
  updateButtonLabels() {
    const allButtons = document.querySelectorAll('.button');
    
    allButtons.forEach(button => {
      const background = button.querySelector('.background.dynamic');
      const content = button.querySelector('.content');
      const label = button.querySelector('.content.label');
      
      if (background && content && label) {
        background.offsetHeight;
        content.offsetHeight;
        
        const backgroundStyle = getComputedStyle(background);
        const contentStyle = getComputedStyle(content);
        const backgroundColor = backgroundStyle.backgroundColor;
        const textColor = contentStyle.color;
        
        const contrast = this.calculateContrast(textColor, backgroundColor);
        const contrastRatio = contrast.toFixed(2);
        
        let labelText = label.innerHTML.split('<br>')[0];
        label.innerHTML = `${labelText}<br>${contrastRatio}`;
      }
    });
  },
  
  applyDynamicStyles() {
    const allButtons = document.querySelectorAll('.button');
    if (allButtons.length === 0) return;
    
    let processedCount = 0;
    
    for (const button of allButtons) {
      const background = button.querySelector(".background");
      if (!background) continue;

      const rect = button.getBoundingClientRect();
      const minSide = Math.min(rect.width, rect.height);

      const buttonPadding = minSide * window.ButtonSystem.CONSTANTS.BUTTON_PADDING;
      const buttonBorderRadius = minSide * window.ButtonSystem.CONSTANTS.BUTTON_BORDER_RADIUS;
      const buttonOutlineWidth = minSide * window.ButtonSystem.CONSTANTS.BUTTON_OUTLINE_WIDTH;
      const buttonOutlineOffset = minSide * window.ButtonSystem.CONSTANTS.BUTTON_OUTLINE_OFFSET;
      const backgroundBorderRadius = minSide * window.ButtonSystem.CONSTANTS.BACKGROUND_BORDER_RADIUS;
      const backgroundOutlineWidth = minSide * window.ButtonSystem.CONSTANTS.BACKGROUND_OUTLINE_WIDTH;
      const iconSelectedSize = minSide * window.ButtonSystem.CONSTANTS.SELECTED_ICON_SIZE;

      const cached = window.ButtonSystem.state.styleCache.get(button) || {};
      const needsUpdate = (
        (cached.minSide || 0) !== minSide || (cached.buttonPadding || 0) !== buttonPadding ||
        (cached.buttonBorderRadius || 0) !== buttonBorderRadius || (cached.buttonOutlineWidth || 0) !== buttonOutlineWidth ||
        (cached.buttonOutlineOffset || 0) !== buttonOutlineOffset || (cached.backgroundBorderRadius || 0) !== backgroundBorderRadius ||
        (cached.backgroundOutlineWidth || 0) !== backgroundOutlineWidth || (cached.iconSelectedSize || 0) !== iconSelectedSize
      );

      if (!needsUpdate) continue;

      button.style.padding = `${buttonPadding}px`;
      button.style.borderRadius = `${buttonBorderRadius}px`;
      button.style.outlineWidth = `${buttonOutlineWidth}px`;
      button.style.outlineOffset = `${buttonOutlineOffset}px`;

      background.style.borderRadius = `${backgroundBorderRadius}px`;
      background.style.outlineWidth = `${backgroundOutlineWidth}px`;

      const iconPressed = button.querySelector('.content.icon.pressed');
      if (iconPressed) {
        iconPressed.style.width = `${iconSelectedSize}px`;
        iconPressed.style.height = `${iconSelectedSize}px`;
        iconPressed.style.top = `${buttonPadding}px`;
        iconPressed.style.right = `${buttonPadding}px`;
      }

      window.ButtonSystem.state.styleCache.set(button, {
        minSide, buttonPadding, buttonBorderRadius, buttonOutlineWidth, buttonOutlineOffset,
        backgroundBorderRadius, backgroundOutlineWidth, iconSelectedSize
      });
      
      processedCount++;
    }
    
    this.updateButtonLabels();
  },
  
  async setupIconInjection() {
    await this.waitForRenderCompletion();
    
    const allButtons = document.querySelectorAll('.button');
    
    for (const button of allButtons) {
      const background = button.querySelector('.background');
      if (!background) continue;
      
      const isToggleButton = button.classList.contains('toggle');
      
      if (isToggleButton) {
        let iconPressedSpan = background.querySelector('.content.icon.pressed');
        
        if (!iconPressedSpan) {
          iconPressedSpan = document.createElement('span');
          iconPressedSpan.className = 'content icon pressed';
          
          const iconEl = background.querySelector('.content.icon:not(.pressed)');
          if (iconEl && iconEl.parentNode) {
            background.insertBefore(iconPressedSpan, iconEl);
          } else {
            background.insertBefore(iconPressedSpan, background.firstChild);
          }
        }
      }
    }
    
    for (const button of allButtons) {
      const isToggleButton = button.classList.contains('toggle');
      const isInitiallyPressed = button.classList.contains('pressed');
      
      if (isToggleButton) {
        button.dataset.isToggleButton = 'true';
        button.setAttribute('aria-pressed', isInitiallyPressed ? 'true' : 'false');
      }
    }
  },
  
  scheduleContrastUpdate() {
    this.scheduleUpdate();
  }
};

