import { generateMenuTeaserDOM } from '../menu-teaser/menu-teaser.js';
import { generateHeaderLinkList } from '../link-list/link-list.js';

export function generateMenuFlyoutLink(props) {
  const [menuflyoutText] = props;
  const menuFlyoutLinkDOM = document.createRange().createContextualFragment(`
    <span id="${menuflyoutText.textContent}"
 class="${menuflyoutText.textContent} menu-flyout-link">
      ${menuflyoutText.textContent}
    </span>
  `);
  return menuFlyoutLinkDOM;
}

export default function decorate(block) {
  const panels = [...block.children];
  const menuProps = [...block.children].map((row) => row.firstElementChild);
  const menuFlyoutLinkDOM = generateMenuFlyoutLink(menuProps);
  const wrapperDiv = document.createElement('div');
  wrapperDiv.classList.add('flyout-main-container');
  block.textContent = '';

  // Append menu flyout link and panels to the wrapper div
  block.appendChild(menuFlyoutLinkDOM);
  [...panels].forEach((panel) => {
    const [, , , field4] = panel.children;
    const classesText = field4?.textContent.trim();
    const classes = (classesText ? classesText.split(',') : [])
      .map((c) => c && c.trim()).filter((c) => !!c);
    if ([...classes].includes('link-list')) {
      const props = [...panel.children].map((row) => row.firstElementChild);
      panel.textContent = '';
      wrapperDiv.appendChild(generateHeaderLinkList(props));
    }
  });
  [...panels].forEach((panel) => {
    const [, field2, ,] = panel.children;
    const classesText = field2?.textContent.trim();
    const classes = (classesText ? classesText.split(',') : [])
      .map((c) => c && c.trim()).filter((c) => !!c);
    if ([...classes].includes('menu-teaser')) {
      const props = [...panel.children].map((row) => row.firstElementChild);
      panel.textContent = '';
      wrapperDiv.appendChild(generateMenuTeaserDOM(props));
    }
  });
  const flyoutWrapperDiv = document.createElement('div');
  flyoutWrapperDiv.classList.add('flyout-wrapper');

  flyoutWrapperDiv.appendChild(wrapperDiv);
  block.appendChild(flyoutWrapperDiv);
}
