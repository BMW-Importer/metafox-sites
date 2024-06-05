import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 1279)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      // // toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function handleHeaderLinkList(e) {
  const { target } = e;
  if (!isDesktop.matches) {
    if (target.classList.contains('expand')) {
      target.nextElementSibling.style.maxHeight = null;
      target.classList.remove('expand');
    } else {
      let listOfTitle;
      const parentElem = e.target.closest('.flyout-main-container');
      if (parentElem) {
        listOfTitle = parentElem.querySelectorAll('.link-list-wrapper.vertical .link-list-title.expand');
        for (let j = 0; j < listOfTitle.length; j += 1) {
          listOfTitle[j].classList.remove('expand');
          listOfTitle[j].nextElementSibling.style.maxHeight = null;
        }
        target.nextElementSibling.style.maxHeight = `${target.nextElementSibling.scrollHeight}px`;
        target.classList.add('expand');
      }
    }
  }
}

// function openOnKeydown(e) {
//   const focused = document.activeElement;
//   const isNavDrop = focused.className === 'nav-drop';
//   if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
//     const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
//     // eslint-disable-next-line no-use-before-define
//     // toggleAllNavSections(focused.closest('.section'));
//     focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
//   }
// }

// function focusNavSection() {
//   document.activeElement.addEventListener('keydown', openOnKeydown);
// }

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
/*
function toggleAllNavSections(sections, expanded = false) {
  // sections.querySelectorAll('.nav-wrapper .menu-link-wrapper').forEach((section) => {
  //   section.setAttribute('aria-expanded', expanded);
  // });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */

function resetFlyoutNavSection() {
  const navBrandSelector = document.querySelector('.nav-brand');
  navBrandSelector?.classList.remove('mobile-flyout');
  if (document.body.classList.contains('content-page')) {
    document.body.classList.remove('content-page');
  }
}

function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  document.body.style.width = (expanded || isDesktop.matches) ? '' : '100%';
  document.body.style.position = (expanded || isDesktop.matches) ? '' : 'fixed';
  document.body.style.top = (expanded || isDesktop.matches) ? '' : '0';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  // toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  // const navDrops = navSections.querySelectorAll('.nav-drop');
  // if (isDesktop.matches) {
  //   navDrops.forEach((drop) => {
  //     if (!drop.hasAttribute('tabindex')) {
  //       drop.setAttribute('role', 'button');
  //       drop.setAttribute('tabindex', 0);
  //       drop.addEventListener('focus', focusNavSection);
  //     }
  //   });
  // } else {
  //   navDrops.forEach((drop) => {
  //     drop.removeAttribute('role');
  //     drop.removeAttribute('tabindex');
  //     drop.removeEventListener('focus', focusNavSection);
  //   });
  // }
  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    resetFlyoutNavSection();
    window.removeEventListener('keydown', closeOnEscape);
  }
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          // toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
  // background related changes
  const headerType = getMetadata('headertype');
  const bodyClass = document.getElementsByTagName('body');
  const header = document.getElementsByTagName('header');
  if (headerType && headerType === 'whitebackground') {
    header[0].classList.add('white-background');
    bodyClass[0].classList.add('white-background');
  } else {
    header[0].classList.add('transparent');
  }
  const flyoutMainContainer = document.querySelector('.flyout-main-container');
  const menuFlyout = document.querySelectorAll('.menu-flyout-wrapper .menu-flyout.block>p');
  menuFlyout.forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      event.stopPropagation();
      event.preventDefault();
      const parentMenu = event.target.closest('.menu-flyout-wrapper');
      const mainParentMenu = event.target.closest('.menu-flyout-container');

      const bodyContent = document.querySelector('.appear');
      const isOpen = parentMenu.classList.contains('showfly');

      if (flyoutMainContainer) {
        const childCount = flyoutMainContainer.children.length;
        if (childCount < 4) {
          flyoutMainContainer.style.justifyContent = 'center';
        }
        // Selecting the first child and adding the style 'grid-column-start: 2'
        if (flyoutMainContainer.children[0]) {
          flyoutMainContainer.children[0].style.gridColumnStart = '2';
        }
      }
      document.querySelectorAll('.menu-flyout-wrapper').forEach((item) => {
        if (item !== parentMenu && item.classList.contains('showfly')) {
          item.classList.remove('showfly');
        }
      });
      parentMenu.classList.toggle('showfly', !isOpen);
      mainParentMenu.classList.toggle('mobile-flyout', !isOpen);
      bodyContent.classList.toggle('content-page', !isOpen);
      if (headerType && headerType === 'whitebackground' && event.target.parentNode.parentElement.parentElement.classList.contains('showfly')) {
        header[0].classList.remove('white-background');
        header[0].classList.add('transparent');
      } else {
        if (headerType === 'transparent') {
          return false;
        }
        header[0].classList.add('white-background');
        header[0].classList.remove('transparent');
      }
      return true;
    });
  });

  document.body.addEventListener('click', (event) => {
    const { target } = event;
    if (!target.closest('.header-wrapper') && !target.closest('.menu-flyout-wrapper.showfly')) {
      document.querySelectorAll('.menu-flyout-wrapper').forEach((item) => {
        item.classList.remove('showfly');
      });
      if (document.querySelector('.appear').classList.contains('content-page')) {
        document.querySelector('.appear').classList.remove('content-page');
      }
    }
  });

  const linkListSelector = document.querySelectorAll('.menu-flyout-wrapper .link-list-title');
  linkListSelector.forEach((anchor) => {
    anchor.addEventListener('click', (handleHeaderLinkList));
  });

  const flyoutContainers = document.querySelectorAll('.flyout-main-container');
  function debounce(func, delay) {
    let timeoutId;
    return function debouncedFunction(...args) {
      const context = this;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  }

  const handleScroll = debounce((event) => {
    const scrolledHeight = event.target.scrollTop;
    const targetElement = event.target.querySelector('.flyout-scroll-indicator-arrow');
    if (scrolledHeight > 0) {
      targetElement.style.opacity = '0';
      targetElement.style.transition = 'opacity 0.3s ease';
    } else {
      targetElement.style.opacity = '1';
      targetElement.style.transition = 'opacity 0.3s ease';
    }
  }, 200);

  flyoutContainers.forEach((container) => {
    container.addEventListener('scroll', handleScroll);
  });
}
