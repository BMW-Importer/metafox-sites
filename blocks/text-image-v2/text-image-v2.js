export function generateTextImageDOM(props) {
  // Extract properties, always same order as in model, empty string if not set
  const [pictureContainer, altText, textarea, imagePosition, showMeta, metaText] = props;
  const picture = pictureContainer.querySelector('picture');
  const image = picture.querySelector('image');
  if (Boolean(image) && Boolean(altText)) {
    image.alt = altText;
  }

  // Build DOM
  const textImageDOM = document.createRange().createContextualFragment(`
    <div style="height: 350px; background-color: khaki;">
        <div class='background' style='float:${imagePosition.innerHTML.indexOf('right') > -1 ? 'right' : 'left'}'>${picture ? picture.outerHTML : ''}</div>
        <div class='foreground'>
          <div class='text'>
            <div class='textarea'>${textarea.innerHTML}</div>
            <div style='display:${showMeta.innerHTML.indexOf('true') > -1 ? 'block' : 'none'}'>
                <p>${metaText.innerHTML}</p>
            </div>
          </div>
          <div class='spacer'>
          </div>
        </div>
    </div>
  `);

  // add final teaser DOM and classes if used as child component
  return textImageDOM;
}

export default function decorate(block) {
  // get the first and only cell from each row
  [...block.children].forEach((column) => {
    const [ImageWrapper, TextWrapper] = column.children;
    ImageWrapper.classList.add('tiv2-image');
    TextWrapper.classList.add('tiv2-text');
  });
}
