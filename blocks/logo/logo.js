export function generateLogoDOM(props) {
  const [greyImage, whiteImage, alt, link] = props;
  greyImage.getElementsByTagName('img')[0].alt = alt.textContent;
  const logoDOM = document.createRange().createContextualFragment(`
     <a href="${link.textContent}" title="${alt.textContent}" class="grey-image">
        ${greyImage ? greyImage.outerHTML : ''}
     </a>
     <a href="${link.textContent}" title="${alt.textContent}" class="white-image">
        ${whiteImage ? whiteImage.outerHTML : ''}
     </a>
    `);
  return logoDOM;
}

export default function decorate(block) {
  const props = [...block.children].map((row) => row.firstElementChild);
  const logoDOM = generateLogoDOM(props);
  block.textContent = '';
  block.append(logoDOM);
}
