/* ==============================
  🎨 팔레트 관리자
  ============================== */

export const PaletteManager = {
  generateCSS() {
    const buttons = document.querySelectorAll('.button');
    const discoveredPalettes = new Set();
    
    buttons.forEach(button => {
      const classList = Array.from(button.classList);
      const palette = classList.find(cls => !['button', 'pressed', 'toggle', 'dynamic'].includes(cls));
      if (palette) discoveredPalettes.add(palette);
    });
    
    let lightThemeCSS = '', darkThemeCSS = '', selectorsCSS = '';
    
    discoveredPalettes.forEach(palette => {
      const isExisting = ['primary1', 'primary2', 'primary3', 'secondary1', 'secondary2', 'secondary3', 'custom'].includes(palette);
      
      [
        { name: 'default', selector: '', disabled: false },
        { name: 'pressed', selector: '.pressed:not(.toggle)', disabled: false },
        { name: 'pressed', selector: '.pressed.toggle', disabled: false },
        { name: 'disabled', selector: '[aria-disabled="true"]', disabled: true }
      ].forEach(({name: state, selector: stateSelector, disabled}) => {
        const baseSelector = palette === 'primary1' && state === 'default' && !disabled ? `&${stateSelector}` : null;
        const paletteSelector = `&.${palette}${stateSelector}`;
        
        if (baseSelector) {
          selectorsCSS += `
    ${baseSelector} {
      & .background.dynamic {
        background: var(--${palette}-background-color-${state});
        outline-color: var(--${palette}-border-color-${state});
        outline-style: var(--border-style-default);
        
        & .content {
          color: var(--${palette}-content-color-${state});
        }
      }
    }`;
        }
        
        const backgroundProperty = (palette === 'primary3' || palette === 'secondary3') 
          ? `var(--${palette}-background1-color-${state})` 
          : `var(--${palette}-background-color-${state})`;
        
        selectorsCSS += `
    ${paletteSelector} {
      & .background.dynamic {
        background: ${backgroundProperty};
        outline-color: var(--${palette}-border-color-${state});
        ${state === 'default' ? 'outline-style: var(--border-style-default);' : ''}
        ${state === 'pressed' ? 'outline-style: var(--border-style-pressed); outline-width: var(--border-style-pressed);' : ''}
        ${state === 'disabled' ? 'outline-style: var(--border-style-disabled);' : ''}
        
        & .content {
          color: var(--${palette}-content-color-${state});
        }
      }
      ${state === 'pressed' ? '&.toggle { & .content.icon.pressed { display: var(--content-icon-display-pressed-toggle); } }' : ''}
      ${disabled ? 'cursor: var(--button-cursor-disabled);' : ''}
    }`;
      });
      
      if (!isExisting) {
        const customProperties = [
          'content-color-default', 'content-color-pressed', 'content-color-disabled',
          'background-color-default', 'background-color-pressed', 'background-color-disabled',
          'border-color-default', 'border-color-pressed', 'border-color-disabled'
        ];
        
        customProperties.forEach(property => {
          lightThemeCSS += `  --${palette}-${property}: var(--custom-${property});\n`;
          darkThemeCSS += `  --${palette}-${property}: var(--custom-${property});\n`;
        });
      }
    });
    
    const cssContent = `
/* HTML 클래스 기반 수정자 시스템 - CSS 상속 활용 */
${lightThemeCSS ? `:root {\n${lightThemeCSS}}` : ''}

${darkThemeCSS ? `.dark {\n${darkThemeCSS}}` : ''}

@layer components {
  .button {${selectorsCSS}
  }
}
`;
    
    window.AppUtils.CSSInjector.inject('palette-system-styles', cssContent, '팔레트 시스템');
    return discoveredPalettes;
  }
};
