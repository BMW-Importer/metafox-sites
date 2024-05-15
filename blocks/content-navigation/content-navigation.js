function isMobileOrTablet() {
  // Regular expression to detect mobile and tablet devices
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(navigator.userAgent);
}

function handleContentNavScroll() {
  const navigation = document.getElementById('navigation');
  const contentNavWrapper = document.querySelector('.cmp-contentnavigation-wrapper');
  const contentNavContainer = document.querySelector('.content-navigation-container');
  const offset = contentNavContainer?.offsetTop;
  if (window.pageYOffset >= offset) {
    navigation.classList.add('fixed-nav');
    contentNavContainer.classList.remove('hide');
  } else {
    navigation.classList.remove('fixed-nav');
    if (contentNavWrapper.classList.contains('visible')) {
      contentNavContainer.classList.remove('hide');
    } else {
      contentNavContainer.classList.add('hide');
    }
  }
}

function activeAnchor() {
  const links = document.querySelectorAll('.cmp-contentnavigation-list-link');
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('navdropdownMenuButton').textContent = e.target.textContent;
      e.target.parentElement.parentElement.classList.remove('visible-mobile');
    });
  });
}

function handleContenNav() {
  const buttonSelector = document.getElementById('navdropdownMenuButton');
  buttonSelector.addEventListener('click', (e) => {
    e.target.classList.toggle('visible-mobile-btn');
    e.target.nextSibling.nextSibling.nextSibling.classList.toggle('visible-mobile');
  });
}

export default function decorate(block) {
  const props = [...block.children].map((row) => row.firstElementChild);
  const [, , background, isEnabled, , btnLable, btnLink] = props;
  const mobileContentNavSelector = document.createElement('button');
  mobileContentNavSelector.classList.add('cmp-filter-toggle');
  mobileContentNavSelector.setAttribute('id', 'navdropdownMenuButton');
  mobileContentNavSelector.setAttribute('aria-expanded', false);
  mobileContentNavSelector.textContent = 'technical-data';

  const leftBtn = document.createElement('button');
  leftBtn.classList.add('cmp-contentnavigation-arrow-left');
  const rightBtn = document.createElement('button');
  rightBtn.classList.add('cmp-contentnavigation-arrow-right');
  const sections = document.querySelectorAll('div[data-contentnavigation="true"]');
  const wrapper = document.createElement('div');
  wrapper.classList.add('cmp-contentnavigation-wrapper');
  wrapper.id = 'navigation';
  const ul = document.createElement('ul');
  ul.classList.add('cmp-contentnavigation-list');
  sections?.forEach((section) => {
    const anchorLabel = section.getAttribute('data-anchorlabel');
    const anchorId = section.getAttribute('data-anchorid');
    const button = document.createElement('button');
    button.textContent = anchorLabel;
    button.classList.add('cmp-contentnavigation-list-link');
    button.dataset.anchor = `#${anchorId}`;
    const li = document.createElement('li');
    li.classList.add('cmp-contentnavigation-list-item');
    li.appendChild(button);
    ul.appendChild(li);
  });
  wrapper.appendChild(mobileContentNavSelector);
  wrapper.appendChild(leftBtn);
  wrapper.appendChild(rightBtn);
  wrapper.appendChild(ul);
  const navAnchorDivDesktop = document.createElement('div');
  navAnchorDivDesktop.classList.add('cmp-contentnavigation-anchor-container');
  navAnchorDivDesktop.classList.add('desktop-only');
  const navAnchorDesktop = document.createElement('a');
  navAnchorDesktop.classList.add('cmp-contentnavigation-anchor');
  navAnchorDesktop.textContent = btnLable.textContent;
  navAnchorDesktop.href = btnLink.textContent;
  navAnchorDivDesktop.append(navAnchorDesktop);

  const navAnchorDivMobile = document.createElement('div');

  navAnchorDivMobile.classList.add('cmp-contentnavigation-anchor-container');
  navAnchorDivMobile.classList.add('mobile-only');
  const navAnchorMobile = document.createElement('a');
  navAnchorMobile.classList.add('cmp-contentnavigation-anchor');
  navAnchorMobile.textContent = btnLable.textContent;
  navAnchorMobile.href = btnLink.textContent;
  navAnchorDivMobile.append(navAnchorMobile);

  ul.appendChild(navAnchorDivDesktop);
  wrapper.append(navAnchorDivMobile);
  block.textContent = '';
  block.appendChild(wrapper);
  if (isEnabled.children.length > 0) {
    const show = isEnabled.querySelector('p').textContent;
    const showInDom = show === 'true' ? 'visible' : 'hide';
    if (showInDom === 'hide') {
      const closestContainer = wrapper.closest('.content-navigation-container');
      if (closestContainer) {
        closestContainer.classList.add('hide');
      }
    }
    wrapper.classList.add(showInDom);
  }
  if (background.children.length > 0) {
    const backgroundSelctor = background.querySelector('p').textContent;
    const backgroundDom = backgroundSelctor === 'Transparent' ? 'transparent' : 'white';
    wrapper.classList.add(backgroundDom);
  }
  window.addEventListener('scroll', handleContentNavScroll);
  if (isMobileOrTablet()) {
    activeAnchor();
    handleContenNav();
  }
}
