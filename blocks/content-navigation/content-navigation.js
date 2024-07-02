const { body } = document;
const sections = document.querySelectorAll('div[data-contentnavigation="true"],:not([data-contentnavigation])');

// if it is true or if it is data attr is not avilable
// in case of false it should not select
const viewPortWidth = window.innerWidth;

function handleOnScrollActiveLink() {
  const scrollPosition = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const navigation = document.getElementById('navigation');
  const navigationHeight = navigation ? navigation.offsetHeight : 0;
  let activeSectionId = null;

  sections.forEach((section) => {
    const sectionId = section.getAttribute('data-anchorid');
    const sectionOffset = section.offsetTop - navigationHeight;
    const sectionHeight = section.offsetHeight;
    const anchorElement = document.querySelector(`[data-anchor="#${sectionId}"]`);
    const parentElement = anchorElement?.parentNode;

    if (scrollPosition >= sectionOffset && scrollPosition < sectionOffset + sectionHeight) {
      parentElement?.classList.add('active');
      activeSectionId = sectionId;
      document.getElementById('navdropdownMenuButton').textContent = parentElement?.textContent.trim();
    } else {
      parentElement?.classList.remove('active');
    }
  });

  if (activeSectionId) {
    if (window.location.hash !== `#${activeSectionId}`) {
      window.history.replaceState(null, null, `#${activeSectionId}`);
    }
  } else if (scrollPosition <= 0 || scrollPosition + windowHeight >= documentHeight) {
    window.history.replaceState(null, null, ' ');
  }
}

function scrollToHash() {
  const { hash } = window.location;
  if (hash) {
    const navigation = document.getElementById('navigation');
    const navigationHeight = navigation ? navigation.offsetHeight : 0;
    const targetSection = document.querySelector(`[data-anchorid="${hash.substring(1)}"]`);
    if (targetSection) {
      window.scrollTo({
        top: targetSection.offsetTop - navigationHeight,
        behavior: 'smooth',
      });
    }
  }
}

function handleOnScrollContentNavHeader() {
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

  handleOnScrollActiveLink();
}

function handleDropDownContenNavMobile() {
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

function handleOnclickscrollToTop() {
  const links = document.querySelectorAll('.cmp-contentnavigation-list-link');
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      body.style.overflowY = 'auto';
      document.getElementById('navdropdownMenuButton').textContent = e.target.textContent;
      e.target.closest('.cmp-contentnavigation-list').classList.remove('visible-mobile');
      document.getElementById('navdropdownMenuButton').classList.remove('visible-mobile-btn');

      const targetId = e.target.getAttribute('data-anchor').replace('#', '');
      const targetSection = document.querySelector(`[data-anchorid=${targetId}]`);
      if (targetSection) {
        const navigation = document.getElementById('navigation');
        const navigationHeight = navigation ? navigation.offsetHeight : 0;
        window.scrollTo({
          top: targetSection.offsetTop - navigationHeight,
          behavior: 'smooth',
        });
      }
    });
  });
}

let scrollAmount = 0;

function updateButtons(leftBtn, rightBtn, list) {
  if (scrollAmount > 0) {
    leftBtn.style.display = 'block';
    list.classList.add('left-mask');
  } else {
    leftBtn.style.display = 'none';
    list.classList.remove('left-mask');
  }

  if (-scrollAmount < list.scrollWidth - list.clientWidth) {
    rightBtn.style.display = 'none';
    list.classList.remove('right-mask');
  } else {
    rightBtn.style.display = 'block';
    list.classList.add('right-mask');
  }
}

function updateButtonsWithVariation(leftBtn, rightBtn) {
  leftBtn.style.display = scrollAmount > 0 ? 'block' : 'none';
  rightBtn.style.display = -scrollAmount < 0 ? 'none' : 'block';
}

function scrollLeft() {
  const list = document.querySelector('.cmp-contentnavigation-list');
  const leftArrowSelector = document.querySelector('.cmp-contentnavigation-arrow-left');
  const rightArrowSelector = document.querySelector('.cmp-contentnavigation-arrow-right');
  leftArrowSelector.addEventListener('click', (e) => {
    if (e.target.parentElement.classList.contains('variation-btn')) {
      scrollAmount = -10;
      list.style.transition = 'margin-left 0.60s ease-in';
      list.style.marginLeft = '0px';
      updateButtonsWithVariation(leftArrowSelector, rightArrowSelector);
    } else {
      scrollAmount = list.scrollWidth - list.clientWidth;
      list.style.transition = 'margin-left 0.60s ease-in';
      list.style.marginLeft = scrollAmount;
      updateButtons(leftArrowSelector, rightArrowSelector, list);
    }
  });
}

function scrollRight() {
  const rightArrowSelector = document.querySelector('.cmp-contentnavigation-arrow-right');
  const leftArrowSelector = document.querySelector('.cmp-contentnavigation-arrow-left');
  const list = document.querySelector('.cmp-contentnavigation-list');
  rightArrowSelector.addEventListener('click', (e) => {
    scrollAmount = list.scrollWidth - list.clientWidth;
    if (e.target.parentElement.classList.contains('variation-btn')) {
      list.style.transition = 'margin-left 0.60s ease-in';
      list.style.marginLeft = `-${scrollAmount + 60}px`;
      updateButtons(leftArrowSelector, rightArrowSelector, list, e.target.parentElement.classList.contains('variation-btn'));
    } else {
      list.style.transition = 'margin-left 0.60s ease-in';
      list.style.marginLeft = `-${scrollAmount}px`;
      updateButtons(leftArrowSelector, rightArrowSelector, list);
    }
  });
}

function checkAnchorLinkOverflow(ul, wrapper) {
  if (wrapper?.scrollWidth > viewPortWidth) {
    ul.classList.add('list-overflow', 'right-mask');
    wrapper.classList.add('wrapper-overflow');
  } else {
    ul.classList.remove('list-overflow');
    wrapper.classList.remove('wrapper-overflow');
  }
}

/*

function checkAnchorLinkOverflow(ul, wrapper) {
  const isBtnVariation = wrapper.classList.contains('variation-btn');
  if (!isBtnVariation) {
    if (ul?.scrollWidth > viewPortWidth) {
      ul.classList.add('list-overflow');
      wrapper.classList.add('wrapper-overflow');
    } else {
      ul.classList.remove('list-overflow');
      wrapper.classList.remove('wrapper-overflow');
    }
  } else if (wrapper?.scrollWidth > viewPortWidth) {
    ul.classList.add('list-overflow');
    wrapper.classList.add('wrapper-overflow');
  } else {
    ul.classList.remove('list-overflow');
    wrapper.classList.remove('wrapper-overflow');
  }
}

*/

export default function decorate(block) {
  const getTextContent = (selector) => Array.from(selector).map((p) => p.textContent);

  const generealTabSelector = block.querySelectorAll('p:not([class])');
  const generalTabValues = getTextContent(generealTabSelector);
  const [contentnavigationLabel, background, isEnabled, analyticsLabel,
    analyticsCategory, analyticsSubCategory] = generalTabValues;

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
      const isTabletView = viewPortWidth >= 768 && viewPortWidth <= 1024;
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
      if (analyticsLabel) {
        anchor.dataset.analyticsLabel = analyticsLabel;
      }
      if (analyticsCategory) {
        anchor.dataset.analyticsCategory = analyticsCategory;
      }
      if (analyticsSubCategory) {
        anchor.dataset.analyticsSubCategory = analyticsSubCategory;
      }
      anchor.dataset.analyticsCustomClick = 'true';
      const { blockName } = block.dataset;
      if (blockName) {
        anchor.dataset.analyticsBlockName = blockName;
      }
      const sectionId = block.closest('.section').dataset.analyticsLabel;
      if (sectionId) {
        anchor.dataset.analyticsSectionId = sectionId;
      }
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
  window.addEventListener('scroll', handleOnScrollContentNavHeader);
  handleDropDownContenNavMobile();
  handleOnclickscrollToTop();
  scrollLeft();
  scrollRight();
  setTimeout(() => { checkAnchorLinkOverflow(ul, wrapper); }, 400);
  window.addEventListener('hashchange', scrollToHash);
}
