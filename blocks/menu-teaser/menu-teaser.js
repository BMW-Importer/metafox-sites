export function generateMenuTeaserDOM(props) {
  const [menuTeaserImage, , altText, copyText, linkLabel] = props;
  menuTeaserImage.getElementsByTagName('img')[0].alt = altText.textContent;

  const menuteaserDOM = document.createRange().createContextualFragment(`
      <div class="flyout-menu-teaser">
          <div class="menu-teaser-image">
            ${menuTeaserImage ? menuTeaserImage?.outerHTML : ''}
          </div>
          <div class="copy-text">${copyText?.textContent}</div>
          <div class="link-label">
            <a class="link-url" aria-label="${linkLabel?.textContent}" href="${linkLabel?.href}">
              ${linkLabel?.textContent}
            </a>
          </div>
       </div>
    `);
  return menuteaserDOM;
}

export default function decorate(block) {
  const props = [...block.children].map((row) => row.firstElementChild);
  const menuteaserDOM = generateMenuTeaserDOM(props);
  block.textContent = '';
  block.append(menuteaserDOM);
}
