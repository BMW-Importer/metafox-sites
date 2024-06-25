import { generatebgImgDom } from '../background-image/background-image.js';
import { generatebgVideoDom } from '../background-video/background-video.js';

function generateCtaButtons(cta, btnContainer) {
  const [ctaButton, ctaBtnClass] = cta.children;
  cta.textContent = '';
  if (ctaButton) {
    const btClassName = ctaBtnClass?.textContent.split(' ');
    if (ctaBtnClass?.textContent) ctaButton.querySelector('a')?.classList.add(...btClassName);

    // if btClassName length is 2 then flex button style is selected so add class to parent
    if (btClassName.length > 1) {
      cta.classList.add('flex');
      btnContainer.classList.add('flex');
    } else {
      btnContainer.classList.add('no-flex');
    }
  }
  cta.append(ctaButton);
}

function generateTextProps(generalProps, generalPropIcon, copyTextContainer, gradientEffectClas) {
  // extracting eyebrow and headline
  let eyebrowText = generalProps.querySelectorAll('h4, h5, h6');
  const headlineText = generalProps.querySelector('p');
  const headLineClass = generalProps.querySelector('h2');

  eyebrowText = eyebrowText.length > 0 ? eyebrowText[0] : '';

  // appending heading class
  if (headLineClass) headlineText?.classList?.add(headLineClass?.textContent || '');

  // extracting subrand icon
  const [subBrancdIcon] = generalPropIcon ? generalPropIcon.children : '';

  // extracting copy text
  const [copytext] = copyTextContainer ? copyTextContainer.children : '';

  // extracting gradient classes
  let gradClas = '';
  let alignClass = '';

  if (gradientEffectClas?.children) {
    gradClas = gradientEffectClas.querySelector('p');
    alignClass = gradientEffectClas.querySelector('h3');
  }

  return [eyebrowText, headlineText, subBrancdIcon, copytext, gradClas, alignClass];
}

export default function decorate(block) {
  // binding no-padding class to closest parent section so that bg media will have width of 1920px
  block?.closest('.section')?.classList?.add('no-padding');

  // get children blocks
  const bgMediaChildrens = [...block.children];
  block.textContent = '';

  // loop through each children block to extract props of it
  bgMediaChildrens.forEach((childrenBlock) => {
    const [generalProps, generalPropIcon, copyTextContainer,
      gradientEffectClasName, vidOrImgPros, cta1, cta2,
      analyticscta1, analyticscta2] = childrenBlock.children;
    const [analyticsLabelcta1, analyticsCategorycta1,
      analyticsSubCategorycta1] = analyticscta1.children;
    const [analyticsLabelcta2, analyticsCategorycta2,
      analyticsSubCategorycta2] = analyticscta2.children;
    childrenBlock.removeChild(analyticscta1);
    childrenBlock.removeChild(analyticscta2);
    childrenBlock.textContent = '';
    childrenBlock.classList.add('background-media-item');

    generalProps?.classList.add('background-media-item-text');
    vidOrImgPros?.classList.add('background-media-item-vidimg');
    cta1?.classList.add('background-media-item-cta-money', 'bg-media-btns');
    cta2?.classList.add('background-media-item-cta-ghost', 'bg-media-btns');

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

    const [eyebrow, headline, brandIcon, copytext, gradClas, alignClass] = generateTextProps(
      generalProps,
      generalPropIcon,
      copyTextContainer,
      gradientEffectClasName,
    );

    // fetching eyebrow, headline, class list details
    generalProps.textContent = '';
    generalProps.classList.add(alignClass?.textContent || '');
    const listOfClasses = gradClas ? gradClas.textContent.split(',') : '';

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

    // button container
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('bg-media-btn-container');
    let isButtonPresent = false;

    // extracting classnames for cta and binding it to anchor link
    if (cta1?.children.length > 1) {
      generateCtaButtons(cta1, btnContainer);
      btnContainer.append(cta1);
      isButtonPresent = true;
    }

    if (cta2?.children.length > 1) {
      generateCtaButtons(cta2, btnContainer);
      btnContainer.append(cta2);
      isButtonPresent = true;
    }

    if (isButtonPresent) generalProps.append(btnContainer);

    const ctaElem = cta1.querySelector('a');
    const ctaElem2 = cta2.querySelector('a');

    if (ctaElem) {
      if (analyticscta1.children) {
        ctaElem.dataset.analyticsLabel = analyticsLabelcta1?.textContent?.trim() || '';
        ctaElem.dataset.analyticsCategory = analyticsCategorycta1?.textContent?.trim() || '';
        ctaElem.dataset.analyticsSubCategory = analyticsSubCategorycta1?.textContent?.trim() || '';
        ctaElem.dataset.analyticsCustomClick = 'true';
        ctaElem.dataset.analyticsBlockName = ctaElem.closest('.block').dataset.blockName;
        ctaElem.dataset.analyticsSectionId = ctaElem.closest('.section').dataset.analyticsLabel;
      }
      btnContainer?.append(ctaElem);
    }

    if (ctaElem2) {
      if (analyticscta1.children) {
        ctaElem2.dataset.analyticsLabel = analyticsLabelcta2?.textContent?.trim() || '';
        ctaElem2.dataset.analyticsCategory = analyticsCategorycta2?.textContent?.trim() || '';
        ctaElem2.dataset.analyticsSubCategory = analyticsSubCategorycta2?.textContent?.trim() || '';
        ctaElem2.dataset.analyticsCustomClick = 'true';
        ctaElem2.dataset.analyticsBlockName = ctaElem.closest('.block').dataset.blockName;
        ctaElem2.dataset.analyticsSectionId = ctaElem.closest('.section').dataset.analyticsLabel;
      }
      cta2?.append(ctaElem2);
    }

    childrenBlock.append(generalProps);

    // appending back child block back to main container
    block.append(childrenBlock);
  });
}
