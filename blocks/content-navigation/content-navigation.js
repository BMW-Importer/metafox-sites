function handleContentNavScroll() {
  const navigation = document.getElementById('navigation');
  const contentNavWrapper = document.querySelector('.cmp-contentnavigation__wrapper');
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

export default function decorate(block) {
  const props = [...block.children].map((row) => row.firstElementChild);
  const [, contentLabel, background, isEnabled] = props;
  console.log(contentLabel);
  const leftBtn = document.createElement('button');
  leftBtn.classList.add('cmp-contentnavigation__arrow-left');
  const rightBtn = document.createElement('button');
  rightBtn.classList.add('cmp-contentnavigation__arrow-right');
  const sections = document.querySelectorAll('div[data-contentnavigation="true"]');
  const wrapper = document.createElement('div');
  wrapper.classList.add('cmp-contentnavigation__wrapper');
  wrapper.id = 'navigation';
  const ul = document.createElement('ul');
  ul.classList.add('cmp-contentnavigation__list');
  sections?.forEach((section) => {
    const anchorLabel = section.getAttribute('data-anchorlabel');
    const anchorId = section.getAttribute('data-anchorid');
    const button = document.createElement('button');
    button.textContent = anchorLabel;
    button.classList.add('cmp-contentnavigation__list-link');
    button.dataset.anchor = `#${anchorId}`;
    const li = document.createElement('li');
    li.classList.add('cmp-contentnavigation__list-item');
    li.appendChild(button);
    ul.appendChild(li);
  });
  wrapper.appendChild(leftBtn);
  wrapper.appendChild(rightBtn);
  wrapper.appendChild(ul);
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
}
