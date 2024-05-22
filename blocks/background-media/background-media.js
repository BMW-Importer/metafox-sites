import { generatebgImgDom } from '../background-image/background-image.js';
import { generatebgVideoDom } from '../background-video/background-video.js';

function generateCtaButtons(cta) {
  const [ctaButton, ctaBtnClass] = cta.children;
  cta.textContent = '';
  if (ctaButton) {
    const btClassName = ctaBtnClass?.textContent.split(' ');
    if (ctaBtnClass?.textContent) ctaButton.querySelector('a')?.classList.add(...btClassName);

    // if btClassName length is 2 then flex button style is selected so add class to parent
    if (btClassName.length > 1) cta.classList.add('flex');
  }
  cta.append(ctaButton);
}

function generateTextProps(generalProps, generalPropIcon, copyTextContainer, gradientEffectClas) {
  // extracting eyebrow and headline
  let eyebrowText = generalProps.querySelectorAll('h4, h5, h6');
  let headlineText = generalProps.querySelectorAll('h1, h2, h3');

  eyebrowText = eyebrowText.length > 0 ? eyebrowText[0] : '';
  headlineText = headlineText.length > 0 ? headlineText[0] : '';

  // extracting subrand icon
  const [subBrancdIcon] = generalPropIcon ? generalPropIcon.children : '';

  // extracting copy text
  const [copytext] = copyTextContainer ? copyTextContainer.children : '';

  // extracting gradient classes
  const [classes] = gradientEffectClas ? gradientEffectClas.children : '';

  return [eyebrowText, headlineText, subBrancdIcon, copytext, classes];
}

export default function decorate(block) {
  // get children blocks
  const bgMediaChildrens = [...block.children];
  block.textContent = '';

  // loop through each children block to extract props of it
  bgMediaChildrens.forEach((childrenBlock) => {
    const [generalProps, generalPropIcon, copyTextContainer,
      gradientEffectClasName, vidOrImgPros, cta1, cta2] = childrenBlock.children;
    childrenBlock.textContent = '';
    childrenBlock.classList.add('background-media-item');

    generalProps?.classList.add('background-media-item-text');
    vidOrImgPros?.classList.add('background-media-item-vidimg');
    cta1?.classList.add('background-media-item-cta-money');
    cta2?.classList.add('background-media-item-cta-ghost');

    // checking whether current childBlock is background-image or background-video
    if (vidOrImgPros?.children?.length === 1) {
      vidOrImgPros.classList.add('image');
      vidOrImgPros.append(generatebgImgDom(vidOrImgPros));
      childrenBlock.append(vidOrImgPros);
    } else if (vidOrImgPros?.children?.length > 1) {
      vidOrImgPros.classList.add('video');
      generatebgVideoDom(vidOrImgPros);
      childrenBlock.append(vidOrImgPros);
    }

    const [eyebrow, headline, brandIcon, copytext, classes] = generateTextProps(
      generalProps,
      generalPropIcon,
      copyTextContainer,
      gradientEffectClasName,
    );

    // fetching eyebrow, headline, class list details
    generalProps.textContent = '';
    const listOfClasses = classes ? classes.textContent.split(',') : '';

    // adding class names to eyebrow and headline
    if (eyebrow) eyebrow.classList.add('background-media-item-text-eyebrow');
    if (headline) headline.classList.add('background-media-item-text-headline');
    if (copytext) copytext.classList.add('background-media-item-text-copytext');

    // if gradient is authored, then add it as classnames to image or video div
    if (listOfClasses) {
      listOfClasses.forEach((className) => {
        vidOrImgPros.classList.add(className);
      });
    }

    generalProps.append(eyebrow || '');
    generalProps.append(headline || '');

    const detailAndBrandDiv = document.createElement('div');
    detailAndBrandDiv.classList.add('background-media-item-details');

    // if subrand icon is selected then add it as class
    if (brandIcon) detailAndBrandDiv.classList.add(brandIcon.textContent);
    detailAndBrandDiv.append(copytext || '');

    // append copyText detail
    generalProps.append(detailAndBrandDiv);

    // extracting classnames for cta and binding it to anchor link
    if (cta1?.children.length > 1) {
      generateCtaButtons(cta1);
      generalProps.append(cta1);
    }

    if (cta2?.children.length > 1) {
      generateCtaButtons(cta2);
      generalProps.append(cta2);
    }

    childrenBlock.append(generalProps);

    // appending back child block back to main container
    block.append(childrenBlock);
  });
}
