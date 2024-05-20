const alignClassList = { center: 'alignment-center', right: 'alignment-right', left: 'alignment-left' };

function getAlignmentStyle(element, selector) {
  let alignClass = '';
  element.querySelectorAll(selector).forEach((childElemet) => {
    childElemet.classList.forEach((className) => {
      if (className.includes('alignment-')) {
        alignClass = className;
      }
    });
  });
  return alignClass;
}

function setAlignmentStyle(style, element) {
  if (alignClassList.left === style) {
    element.classList.add('button-align-left');
  } else if (alignClassList.right === style) {
    element.classList.add('button-align-right');
  } else {
    element.classList.add('button-align-center');
  }
}

export function addIcon(element, iconType, className = '') {
  if (iconType === 'arrow_chevron_right') {
    const iconSpan = document.createElement('span');
    iconSpan.innerHTML = '<i class="icon-gt" aria-hidden="true" data-icon="arrow_chevron_right"></i>';
    iconSpan.classList = className;
    element.append(iconSpan);
  }
}

export function decorateBMWButtons(element) {
  element.querySelectorAll('a').forEach((a) => {
    a.title = a.title || a.textContent;
    if (a.href !== a.textContent) {
      const up = a.parentElement;
      const twoup = a.parentElement.parentElement;
      if (!a.querySelector('img')) {
        if (
          up.childNodes.length === 1 && (up.tagName === 'P' || up.tagName === 'DIV')
        ) {
          // default
          up.ariaLabel = up.textContent;
          a.className = '';
          const alignment = getAlignmentStyle(element, 'div.section');
          setAlignmentStyle(alignment, up);
        }
        if (
          up.childNodes.length === 1 && up.tagName === 'STRONG' && twoup.childNodes.length === 1 && (twoup.tagName === 'P' || twoup.tagName === 'DIV')
        ) {
          a.className = 'button ghost-dark button-fixed-width';
          up.ariaLabel = up.textContent;
          twoup.classList.add('button-container');
          const alignment = getAlignmentStyle(element, 'div.section');
          setAlignmentStyle(alignment, twoup);
        }
        if (
          up.childNodes.length === 1 && up.tagName === 'EM' && twoup.childNodes.length === 1 && (twoup.tagName === 'P' || twoup.tagName === 'DIV')
        ) {
          a.className = 'button hyperlink';
          twoup.ariaLabel = up.textContent;
          twoup.classList.add('button-container');
          up.classList.add('align-icon');
          const alignment = getAlignmentStyle(element, 'div.section');
          setAlignmentStyle(alignment, twoup);
          addIcon(up, 'arrow_chevron_right', 'align-center');
        }
      }
    }
  });
}

export default decorateBMWButtons;
