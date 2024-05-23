const { body } = document;
const sections = document.querySelectorAll('div[data-contentnavigation="true"]');

function activeAnchor() {
  sections.forEach((section) => {
    const scrollPosition = window.scrollY;
    const sectionId = section.getAttribute('data-anchorid');
    const sectionOffset = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    if (scrollPosition >= sectionOffset && scrollPosition < sectionOffset + sectionHeight) {
      document.querySelector(`[data-anchor="#${sectionId}"]`)?.parentNode.classList.add('active');
      document.getElementById('navdropdownMenuButton').textContent = document.querySelector(`[data-anchor="#${sectionId}"]`)?.parentNode.textContent;
    } else {
      document.querySelector(`[data-anchor="#${sectionId}"]`)?.parentNode.classList.remove('active');
    }
  });
}

function handleContentNavFixedHeader() {
  const navigation = document.getElementById('navigation');
  const contentNavWrapper = document.querySelector('.cmp-contentnavigation-wrapper');
  const contentNavContainer = document.querySelector('.content-navigation-container');
  const ulList = document.querySelector('.cmp-contentnavigation-list');
  const offset = contentNavContainer?.offsetTop;
  activeAnchor();
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
  if (contentNavWrapper.classList.contains('fixed-nav')) {
    ulList.style = '';
  }
}

function handleContenNavMobile() {
  const buttonSelector = document.getElementById('navdropdownMenuButton');
  buttonSelector.addEventListener('click', (e) => {
    const contentNavWrapper = e.target.closest('.cmp-contentnavigation-wrapper');
    const checkScrollPosition = contentNavWrapper.classList.contains('fixed-nav');
    if (checkScrollPosition) {
      e.target.classList.toggle('visible-mobile-btn');
      e.target.nextSibling.nextSibling.nextSibling.classList.toggle('visible-mobile');
      if (e.target.classList.contains('visible-mobile-btn')) {
        body.style.overflowY = 'hidden';
      } else {
        body.style.overflowY = 'auto';
      }
    } else {
      setTimeout(() => {
        contentNavWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    }
  });
}

function handleContenNavDesktop() {
  const links = document.querySelectorAll('.cmp-contentnavigation-list-link');
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const contentNavWrapper = e.target.closest('.cmp-contentnavigation-wrapper');
      const checkScrollPosition = contentNavWrapper.classList.contains('fixed-nav');
      if (!checkScrollPosition) {
        setTimeout(() => {
          contentNavWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
      } else {
        e.preventDefault();
        body.style.overflowY = 'auto';
        document.getElementById('navdropdownMenuButton').textContent = e.target.textContent;
        e.target.closest('.cmp-contentnavigation-list').classList.remove('visible-mobile');
        document.getElementById('navdropdownMenuButton').classList.remove('visible-mobile-btn');
        activeAnchor();
        const targetId = e.target.getAttribute('data-anchor').replace('#', '');
        const targetSection = document.querySelector(`[data-anchorid=${targetId}]`);
        if (targetSection) {
          window.scrollBy(0, 100);
          setTimeout(() => {
            window.scrollBy(0, 0);
          }, 400);
          setTimeout(() => {
            targetSection.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
            }, 500);
          }, 400);
        }
      }
    });
  });
}

let scrollAmount = 0;
const step = 200;

function updateButtons(leftBtn, rightBtn, list) {
  leftBtn.style.display = scrollAmount > 0 ? 'block' : 'none';
  rightBtn.style.display = scrollAmount < list.scrollWidth - list.clientWidth ? 'block' : 'none';
}

function scrollLeft() {
  const list = document.querySelector('.cmp-contentnavigation-list');
  const leftArrowSelector = document.querySelector('.cmp-contentnavigation-arrow-left');
  const rightArrowSelector = document.querySelector('.cmp-contentnavigation-arrow-right');

  leftArrowSelector.addEventListener('click', () => {
    scrollAmount = Math.max(scrollAmount - step, 0);
    list.style.transition = 'transform 0.60s ease-in';
    list.style.transform = `translateX(${-scrollAmount}px)`;
    updateButtons(leftArrowSelector, rightArrowSelector, list);
  });
}

function scrollRight() {
  const rightArrowSelector = document.querySelector('.cmp-contentnavigation-arrow-right');
  const leftArrowSelector = document.querySelector('.cmp-contentnavigation-arrow-left');
  const list = document.querySelector('.cmp-contentnavigation-list');

  rightArrowSelector.addEventListener('click', () => {
    scrollAmount = Math.min(scrollAmount + step, list.scrollWidth - list.clientWidth);
    list.style.transition = 'transform 0.60s ease-in';
    list.style.transform = `translateX(${-scrollAmount - 100}px)`;
    updateButtons(leftArrowSelector, rightArrowSelector, list);
  });
}

export default function decorate(block) {
  const getTextContent = (selector) => Array.from(selector).map((p) => p.textContent);

  const generealTabSelector = block.querySelectorAll('p:not([class])');
  const generalTabValues = getTextContent(generealTabSelector);
  const [contentnavigationLabel, background, isEnabled] = generalTabValues;

  const getButtonTabValues = (selector) => Array.from(selector).map((p) => {
    const anchor = p.querySelector('a');
    return anchor ? { link: anchor.href, text: anchor.textContent } : undefined;
  }).filter((item) => item !== undefined);

  const btnTabSelector = block.querySelectorAll('p[class]');
  const buttonTabValues = btnTabSelector.length ? getButtonTabValues(btnTabSelector) : [];
  const [{ text: btnLable, link: btnLink }] = buttonTabValues.length ? buttonTabValues : [{ text: '', link: '' }];

  const leftBtn = document.createElement('button');
  leftBtn.classList.add('cmp-contentnavigation-arrow-left');
  const rightBtn = document.createElement('button');
  rightBtn.classList.add('cmp-contentnavigation-arrow-right');
  const wrapper = document.createElement('div');
  wrapper.classList.add('cmp-contentnavigation-wrapper');
  wrapper.id = 'navigation';
  const ul = document.createElement('ul');
  ul.classList.add('cmp-contentnavigation-list');
  ul.setAttribute('aria-label', contentnavigationLabel);
  sections?.forEach((section, index) => {
    if (index === 0) {
      const firstAnchor = section.getAttribute('data-anchorlabel');
      const mobileContentNavSelector = document.createElement('button');
      mobileContentNavSelector.classList.add('cmp-filter-toggle');
      mobileContentNavSelector.setAttribute('id', 'navdropdownMenuButton');
      mobileContentNavSelector.setAttribute('aria-expanded', false);
      mobileContentNavSelector.textContent = `${firstAnchor}`;
      wrapper.appendChild(mobileContentNavSelector);
    }
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
    function handleTabletView() {
      const isTabletView = window.innerWidth >= 768 && window.innerWidth <= 1024;
      ul.classList.toggle('tablet-only', isTabletView && index >= 5);
      wrapper.classList.toggle('tablet-only', isTabletView && index >= 5);
    }
    handleTabletView();
  });

  wrapper.appendChild(leftBtn);
  wrapper.appendChild(rightBtn);
  wrapper.appendChild(ul);
  if (btnLable) {
    const createNavAnchor = (label, link, containerClass) => {
      const anchorDiv = document.createElement('div');
      anchorDiv.classList.add('cmp-contentnavigation-anchor-container');
      anchorDiv.classList.add(containerClass);
      const anchor = document.createElement('a');
      anchor.classList.add('cmp-contentnavigation-anchor');
      anchor.textContent = label;
      anchor.href = link;
      anchorDiv.appendChild(anchor);
      return anchorDiv;
    };
    const mobileNavAnchor = createNavAnchor(btnLable, btnLink, 'mobile-only');
    wrapper.classList.add('variation-btn');
    wrapper.appendChild(mobileNavAnchor);
  }

  block.textContent = '';
  block.appendChild(wrapper);
  if (isEnabled) {
    const showInDom = isEnabled === 'true' ? 'visible' : 'hide';
    if (showInDom === 'hide') {
      const closestContainer = wrapper.closest('.content-navigation-container');
      if (closestContainer) {
        closestContainer.classList.add('hide');
      }
    }
    wrapper.classList.add(showInDom);
  }
  if (background) {
    const backgroundDom = background === 'Transparent' ? 'transparent' : 'white';
    wrapper.classList.add(backgroundDom);
  }
  window.addEventListener('scroll', handleContentNavFixedHeader);
  window.addEventListener('resize', this.handleTabletView);
  handleContenNavMobile();
  handleContenNavDesktop();
  scrollLeft();
  scrollRight();
}
