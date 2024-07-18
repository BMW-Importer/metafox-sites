function scrollFunction(backToTopBtn) {
  const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;

  if ((document.documentElement.scrollTop / scrollTotal) > 0.75) {
    backToTopBtn.classList.remove('speeddial-backtotop-hidden');
  } else {
    backToTopBtn.classList.add('speeddial-backtotop-hidden');
  }
}

// scroll to the top of the document
function topFunction() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

export default function decorate(block) {
  const speeddialBtn = document.createElement('button');
  const speeddialBackBtn = document.createElement('button');
  speeddialBtn.classList.add('speeddial-button', 'speeddial-button-hidden');
  speeddialBackBtn.classList.add('speeddial-backtotop', 'speeddial-backtotop-hidden');

  // creating a container for links
  const listOfLinkContainer = document.createElement('div');
  listOfLinkContainer.classList.add('list-of-containers');
  window.addEventListener('resize', () => {
    if (window.innerHeight < 466) {
      listOfLinkContainer.classList.add('item-reversed');
    } else {
      listOfLinkContainer.classList.remove('item-reversed');
    }
  });

  speeddialBackBtn.addEventListener('click', topFunction);
  speeddialBackBtn.setAttribute('title', 'Back to top');

  speeddialBtn.setAttribute('aria-expanded', false);
  speeddialBtn.setAttribute('title', 'Speed Dial Menu');
  speeddialBtn.addEventListener('click', () => {
    speeddialBtn.classList.toggle('speeddial-btn-clicked');
    listOfLinkContainer.classList.toggle('btn-opened');
    const btnExpanded = speeddialBtn.getAttribute('aria-expanded') === 'true' || false;
    speeddialBtn.setAttribute('aria-expanded', !btnExpanded);
  });

  const speeddialchildrens = [...block.children];
  speeddialchildrens.forEach((childrenBlockProps) => {
    const [content, analytics] = childrenBlockProps.children;
    childrenBlockProps.textContent = '';
    const [analyticsLinkType, analyticsOtherLinkType] = analytics.children;

    // extracting anchor tag
    const anchorLink = content.querySelector('a');
    // extracting icon
    const iconType = content.children[0];
    if (iconType) {
      anchorLink.classList.add(iconType.textContent);
    }
    const spanElem = document.createElement('span');
    spanElem.classList.add('cmp-speeddial-item-arrow');
    childrenBlockProps.classList.add('speed-dial-item');
    childrenBlockProps.addEventListener('click', () => {
      window.location = anchorLink.getAttribute('href');
    });

    if (anchorLink) {
      const { blockName } = block.dataset;
      const sectionId = block.closest('.section').dataset.analyticsLabel;
      if (analytics.children) {
        anchorLink.dataset.analyticsLinkType = analyticsLinkType?.textContent?.trim() || '';
        if (analyticsOtherLinkType) {
          anchorLink.dataset.analyticsLinkOtherType = analyticsOtherLinkType?.textContent?.trim() || '';
        }
        anchorLink.dataset.analyticsCustomClick = 'true';
        if (blockName) {
          anchorLink.dataset.analyticsBlockName = blockName;
        }
        if (sectionId) {
          anchorLink.dataset.analyticsSectionId = sectionId;
        }
      }
    }

    childrenBlockProps.append(anchorLink, spanElem);
    listOfLinkContainer.append(childrenBlockProps);
  });

  window.onscroll = () => { scrollFunction(speeddialBackBtn); };

  block.textContent = '';
  block.append(speeddialBackBtn);
  block.append(speeddialBtn);
  block.append(listOfLinkContainer);

  setTimeout(() => {
    speeddialBtn.classList.remove('speeddial-button-hidden');
  }, 4000);
}
