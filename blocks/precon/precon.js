import {
  getPreConApiResponse, getPreConCosyImage, getResolutionKey, getCosyImageUrl,
} from '../../scripts/common/wdh-util.js';

let defaultIndex = 0;

function getBackgroundImgURL(backgroundImages, resolutionKey, quality) {
  return `${backgroundImages}?res=${resolutionKey}&q=${quality}`;
}

export function getConfiguratorURL() {
  const url = document.querySelector('meta[name="configuratorurl"]')?.content;
  return url;
}
const configuratorURL = getConfiguratorURL();

function createBgImgaeUrl(backgroundImages, quality) {
  const pictureTag = document.createElement('picture');
  const resolutions = [320, 768, 1024];
  resolutions.forEach((resolution) => {
    const sourceTag = document.createElement('source');
    // eslint-disable-next-line max-len
    sourceTag.srcset = getBackgroundImgURL(backgroundImages, getResolutionKey(resolution), resolution === 768 ? 30 : quality);
    sourceTag.media = `(min-width: ${resolution}px)`;
    pictureTag.appendChild(sourceTag);
  });

  const imgTag = document.createElement('img');
  imgTag.loading = 'lazy';
  imgTag.alt = 'pre con Image';
  imgTag.src = getBackgroundImgURL(backgroundImages, getResolutionKey(window.innerWidth), 40);
  pictureTag.appendChild(imgTag);

  return pictureTag;
}

function configureCTA(selectedModel, currentVechileData) {
  let selectedModelValue;
  if (selectedModel === 'modelRange') {
    // eslint-disable-next-line no-return-assign
    return selectedModelValue = `${configuratorURL}/${currentVechileData.modelRangeCode}`;
  }
  if (selectedModel === 'modelCode') {
    // eslint-disable-next-line no-return-assign
    return selectedModelValue = `${configuratorURL}/${currentVechileData.modelRangeCode}/${currentVechileData.modelCode}`;
  }
  if (selectedModel === 'allOptions') {
    // eslint-disable-next-line no-return-assign
    return selectedModelValue = `${configuratorURL}/${currentVechileData.modelRangeCode}/${currentVechileData.modelCode}/${currentVechileData.fabric}/${currentVechileData.paint}/${currentVechileData.options}`;
  }
  return selectedModelValue;
}

// eslint-disable-next-line max-len
function generatePrecon(wdhContext, preConOuterWrapper, headLineDom, configureCTADom, preConModelName, optionsCount) {
  const preTitle = document.createElement('div');
  preTitle.classList.add('precon-title');

  const preconPreiceDetails = document.createElement('div');
  preconPreiceDetails.classList.add('pre-price-details');

  const preConPriceDetailWrapper = document.createElement('div');
  preConPriceDetailWrapper.classList.add('price-details-wrapper');

  const preConPriceInnerWrapper = document.createElement('div');
  preConPriceInnerWrapper.classList.add('price-details-inner-wrapper');

  const preConswatches = document.createElement('div');
  preConswatches.classList.add('swatches');

  const preConWidget = document.createElement('div');
  preConWidget.classList.add('financial-widget-wrapper');

  const preLeasingWrapper = document.createElement('div');
  preLeasingWrapper.classList.add('leasing-wrapper');

  const img = document.createElement('img');
  img.classList.add('swatches-image');
  img.src = 'https://prod.cosy.bmw.cloud/bmwweb/cosySec?COSY-EU-100-73318jQYfFqIbPXnvzqUxEw8%25P6wBKM4adOKU2JBzcbt3aJqZvjDlwXYuw4sD9%25UHNMClix2t5JUABN745UXgtUDUCH1T3IjAeSw27BzcKX3aJQbAFKdqfkEramzOSs5m%2565ezICP4Ws86OG7c1QUDCJnxbZsCsluMw8m9hvU1AIs75Z';
  img.alt = 'img';

  const img2 = document.createElement('img');
  img2.classList.add('swatches-image');
  img2.src = 'https://prod.cosy.bmw.cloud/bmwweb/cosySec?COSY-EU-100-73318jQYfFqIbPXnvzqUxEw8%25P6wBKM4adOKU2JBzcbt3aJqZvjDlwXYuw4sD9%25UHNMClix2t5JUABN745UXgtUDUCH1T3IjAeSw27BzcKX3aJQbAFKdqfkEramzOSs5m%2565ezICP4Ws86OG7c1QUDCJnxbZsCsluMw8m9hvU1AIs75Z';
  img2.alt = 'alt';

  const optionCountDiv = document.createElement('span');
  optionCountDiv.classList.add('options-count', 'swatches-image');
  optionCountDiv.textContent = `+${optionsCount}`;
  preConswatches.append(img, img2, optionCountDiv);
  preConWidget.append(preLeasingWrapper);
  preConPriceInnerWrapper.append(preConswatches, preConWidget);

  preTitle.textContent = preConModelName || '';

  const preCtaWrap = document.querySelector('.precon-link');

  const preconDesWrapper = document.createElement('div');
  preconDesWrapper.classList.add('precon-description');
  preCtaWrap.append(configureCTADom);
  preconPreiceDetails.append(headLineDom, preConPriceInnerWrapper);
  preConPriceDetailWrapper.append(preconPreiceDetails, preCtaWrap);
  wdhContext.textContent = '';
  wdhContext.append(preTitle, preConPriceDetailWrapper);
  preConOuterWrapper.append(wdhContext);
}

async function generateCosyImage(imageDomContainer, preConCosyImage) {
  const imageCardContainer = document.createElement('div');
  imageCardContainer.classList.add('img-card-container');
  const imageCard = document.createElement('div');
  imageCard.classList.add('img-card');
  let preConImageDOM;

  if (preConCosyImage) {
    const screenWidth = window.innerWidth;
    const resolutionKey = getResolutionKey(screenWidth);
    const createPictureTag = () => {
      const pictureTag = document.createElement('picture');
      const resolutions = [767, 1023, 1919];
      resolutions.forEach((resolution) => {
        const quality = (resolution <= 767) ? 40 : 30;
        const sourceTag = document.createElement('source');
        sourceTag.srcset = getCosyImageUrl(
          preConCosyImage,
          resolutionKey,
          quality,
        );
        sourceTag.media = `(min-width: ${resolution}px)`;
        pictureTag.appendChild(sourceTag);
      });
      const imgTag = document.createElement('img');
      const quality = (screenWidth <= 767) ? 40 : 30;
      imgTag.src = getCosyImageUrl(preConCosyImage, resolutionKey, quality);
      imgTag.alt = 'pre con Cosy Image';
      pictureTag.appendChild(imgTag);
      return pictureTag;
    };

    preConImageDOM = createPictureTag();
    imageCard.append(preConImageDOM);
    imageCardContainer.append(imageCard);
    imageDomContainer.append(imageCardContainer);
  }
  // eslint-disable-next-line no-use-before-define
  resizePreconBlock();
}

function updateCarousel(currentIndex) {
  const content = document.querySelector('.precon-swiper-initialized');
  if (!content) return;
  const imageContainer = content.querySelector('.precon-image-container');
  const itemWidth = imageContainer.children[currentIndex]?.offsetWidth;

  const viewport = window.innerWidth;
  let multiplier = 0.60;
  if (viewport < 768) {
    multiplier = 0.3;
  } else if (viewport >= 768 && viewport < 1024) {
    multiplier = 0.2;
  } else if (viewport >= 1024 && viewport < 1280) {
    multiplier = 0.5;
  }

  const defaultOffset = itemWidth * multiplier;
  const offset = defaultOffset - (currentIndex * itemWidth);
  imageContainer.style.transform = `translate3d(${offset}px, 0px, 0px)`;
  imageContainer.style.transitionDuration = '750ms';
  imageContainer.style.transitionDelay = '100ms';

  const cards = imageContainer.children;
  const preconWrapper = document.querySelectorAll('.precon-content-data .pre-content-outer-wrapper');
  const dots = content.querySelectorAll('.dot');
  const itemsToShow = 1;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < cards.length; i++) {
    if (i === currentIndex) {
      cards[i].classList.remove('not-active', 'blur-inactive');
      cards[i].classList.add('active');
      preconWrapper[i].classList.remove('in-active');
      dots[i].classList.add('active');
    } else {
      cards[i].classList.add('not-active');
      cards[i].classList.remove('active');
      preconWrapper[i].classList.add('in-active');
      dots[i].classList.remove('active');
    }
  }

  const prevButton = document.querySelector('.precon-wrapper-lft-area');
  const nextButton = document.querySelector('.precon-wrapper-rth-area');

  if (!prevButton || !nextButton) return;

  if (currentIndex === 0) {
    prevButton.classList.add('hide-area');
  } else {
    prevButton.classList.remove('hide-area');
  }
  if (currentIndex >= cards.length - itemsToShow) {
    nextButton.classList.add('hide-area');
  } else {
    nextButton.classList.remove('hide-area');
  }
}

function addTouchSlideFunctionality() {
  const mainContent = document.querySelector('.precon-swiper-initialized');
  if (!mainContent) return;
  const content = mainContent.querySelector('.precon-image-container');
  const totalItems = content.children.length;
  const itemsToShow = 1;
  let index = Array.from(content.querySelectorAll('.img-card-container')).findIndex((each) => each.classList.contains('active'));
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  let startTime = 0;
  const gap = 0; // gap between images
  let endTime = 0;
  let moved = false;
  const maxClickDuration = 200;
  const minSlideDistance = 100;

  content.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX;
    startTime = new Date().getTime();
    isDragging = true;
    moved = false;
  });
  content.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].pageX;
    const dx = currentX - startX;

    if (Math.abs(dx) >= minSlideDistance) {
      moved = true;
      const itemWidth = content.children[index].offsetWidth;
      const offset = -(index * (itemWidth + gap)) + dx;
      content.style.transform = `translate3d(${offset}px, 0px, 0px)`;
    }
  });

  content.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    endTime = new Date().getTime();
    const dx = currentX - startX;
    const duration = endTime - startTime;
    if (!moved || (Math.abs(dx) < minSlideDistance && duration < maxClickDuration)) {
      return; // avoide small movements and quick touches (clicks)
    }
    const itemWidth = content.children[index].offsetWidth;
    const threshold = itemWidth * 0.6; // threshold to move to next/previous item

    if (Math.abs(dx) > threshold) {
      if (dx > 0 && index > 0) {
        index -= 1;
      } else if (dx < 0 && index < totalItems - itemsToShow) {
        index += 1;
      }
    }
    updateCarousel(index);
  });
}

function dotClickHandler() {
  const index = Number(this.classList[1].split('-')[1]);
  updateCarousel(index);
}

function buttonClick(direction) {
  const mainContent = document.querySelector('.precon-swiper-initialized');
  const content = mainContent.querySelector('.precon-image-container');
  const index = Array.from(content.querySelectorAll('.img-card-container')).findIndex((each) => each.classList.contains('active'));
  if (direction === 'left') updateCarousel(index - 1);
  else updateCarousel(index + 1);
}

function buttonHover(direction, start = true) {
  const mainContent = document.querySelector('.precon-swiper-initialized');
  const content = mainContent.querySelector('.precon-image-container');
  const cards = content.querySelectorAll('.img-card-container');
  const index = Array.from(cards).findIndex((each) => each.classList.contains('active'));

  if (direction === 'left') {
    if (start && index > 0) {
      cards[index - 1]?.classList.add('blur-inactive');
      cards[index - 1]?.querySelector('img').classList.add('card-animation-left');
    } else if (!start && index > 0) {
      cards[index - 1]?.classList.remove('blur-inactive');
      cards[index - 1]?.querySelector('img').classList.remove('card-animation-left');
    }
  } else if (direction === 'right') {
    if (start && index < cards.length - 1) {
      cards[index + 1]?.classList.add('blur-inactive');
      cards[index + 1]?.querySelector('img').classList.add('card-animation-right');
    } else if (!start && index < cards.length - 1) {
      cards[index + 1]?.classList.remove('blur-inactive');
      cards[index + 1]?.querySelector('img').classList.remove('card-animation-right');
    }
  }
}

function addButtons(preconLeftWrapper, preconRightWrapper) {
  // create buttons
  const prevButton = document.createElement('button');
  prevButton.classList.add('carousel-btn-prev');
  const nextButton = document.createElement('button');
  nextButton.classList.add('carousel-btn-next');

  preconLeftWrapper.addEventListener('click', () => buttonClick('left'));
  preconRightWrapper.addEventListener('click', () => buttonClick('right'));
  preconLeftWrapper.addEventListener('mouseover', () => buttonHover('left'));
  preconRightWrapper.addEventListener('mouseover', () => buttonHover('right'));
  preconLeftWrapper.addEventListener('mouseleave', () => buttonHover('left', false));
  preconRightWrapper.addEventListener('mouseleave', () => buttonHover('right', false));

  // add buttons to wrappers
  preconLeftWrapper.append(prevButton);
  preconRightWrapper.append(nextButton);
}

// function updateItemsToShow(preconGalleryContent) {
//   const viewport = window.innerWidth;

//   const totalItems = preconGalleryContent.childElementCount;
//   const computedStyle = getComputedStyle(preconGalleryContent);
//   const paddingLeft = parseFloat(computedStyle.paddingLeft);
//   const paddingRight = parseFloat(computedStyle.paddingRight);
//   const desktopScreenWidth = viewport - (paddingLeft + paddingRight);

//   // padding only for more than 1280 viewport
//   const desktopContentPadding = document.querySelector('.section.precon-container');
//   const computedStyleDesktop = getComputedStyle(desktopContentPadding);
//   const paddingLeftDesktop = parseFloat(computedStyleDesktop.paddingLeft);
//   const paddingRightDesktop = parseFloat(computedStyleDesktop.paddingRight);
//   const ultraScreenWidth = viewport - (paddingLeftDesktop + paddingRightDesktop);

//   const cardsToShow = 1;
//   const availableWidth = viewport >= 1920 ? ultraScreenWidth : desktopScreenWidth;
//   console.log(viewport);
//   return { cardsToShow, availableWidth, totalItems };
// }

export function resizePreconBlock() {
  const viewport = window.innerWidth;
  const carousels = document.querySelectorAll('.precon-image-container');
  carousels.forEach((carouselContent) => {
    const cards = carouselContent.querySelectorAll('.img-card-container');

    cards.forEach((card) => {
      let multiplier;
      if (viewport < 768) {
        multiplier = 0.625;
      } else if (viewport >= 768 && viewport < 1024) {
        multiplier = 0.588;
      } else if (viewport >= 1024 && viewport < 1280) {
        multiplier = 0.5;
      } else if (viewport >= 1280 && viewport < 1920) {
        multiplier = 0.454545;
      }
      card.style.width = `${multiplier ? multiplier * viewport : 872.727}px`;
    });
  });
  updateCarousel(defaultIndex);
  addTouchSlideFunctionality();
}

export function preconResizer() {
  resizePreconBlock();

  // windo resize event
  window.addEventListener('resize', () => {
    resizePreconBlock();
  });
}

export default async function decorate(block) {
  const parentBlock = document.createElement('div');
  parentBlock.classList.add('precon-swiper-initialized');

  const bgImg = document.createElement('picture');
  bgImg.classList.add('precon-background');

  const imageDomContainer = document.createElement('div');
  imageDomContainer.classList.add('precon-image-container');

  const preconLeftWrapper = document.createElement('div');
  preconLeftWrapper.classList.add('precon-wrapper-lft-area');

  const preconRightWrapper = document.createElement('div');
  preconRightWrapper.classList.add('precon-wrapper-rth-area');

  const dotsWrapper = document.createElement('div');
  dotsWrapper.classList.add('dots-navigation');

  const contentData = document.createElement('div');
  contentData.classList.add('precon-content-data');

  // add background image
  const backgroundImages = 'https://www.bmw.rs/etc.clientlibs/bmw-web/clientlibs/clientlib-site/resources/images/street-bg_1x_320.webp';
  const quality = 50;
  const pictureElement = createBgImgaeUrl(backgroundImages, quality);

  bgImg.appendChild(pictureElement);

  addButtons(preconLeftWrapper, preconRightWrapper);

  const precon = [...block.children];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < precon.length; i++) {
    const preconData = precon[i];
    const [linkTab, wdhContext] = preconData.children;

    preconData.classList.add('pre-content-outer-wrapper', `pre-content-outer-wrapper-${i}`, 'in-active');
    preconData.children[0].classList.add('precon-link');
    preconData.children[1].classList.add('precon-wdh');

    let preConModelResponse;
    let preConCosyImage;
    let headLineDom;
    let preConHeadLine;
    let optionsValue;
    let configureLink;
    let configureCTADom;
    let optionsCount;
    let preConModeCode;
    let preConModelName;

    const splitPreconData = wdhContext.querySelectorAll('p')[0]?.textContent.split(',') || '';
    const selctedModelData = wdhContext.querySelectorAll('p')[1]?.textContent || '';
    const selectedModelRange = splitPreconData[2]?.trim() || ''; // authored selected ModelRange G21
    const selectedPreConId = splitPreconData[3]?.trim() || ''; // authored selected PRECODN-ID
    try {
      if (selectedModelRange) {
        // eslint-disable-next-line no-await-in-loop
        preConModelResponse = await getPreConApiResponse(selectedModelRange); // calling PRECon API
      }
    } catch (error) {
      console.error(error);
    }
    if (preConModelResponse) {
      // eslint-disable-next-line no-restricted-syntax, guard-for-in, no-unreachable-loop
      for (const key in preConModelResponse.responseJson) {
        // eslint-disable-next-line eqeqeq
        if (preConModelResponse.responseJson[key].id == selectedPreConId) {
          preConModeCode = preConModelResponse.responseJson[key]?.modelCode; // MODEL-CODE
          // eslint-disable-next-line max-len
          preConHeadLine = preConModelResponse.responseJson[key]?.headline; // Show the headline below cosy Image
          preConModelName = preConModelResponse.responseJson[key]?.modelName;
          optionsValue = preConModelResponse.responseJson[key]?.options; //
          configureLink = configureCTA(selctedModelData, preConModelResponse.responseJson[key]);
          break;
        }
      }
      optionsCount = optionsValue.split(',').length;
      // eslint-disable-next-line no-await-in-loop
      preConCosyImage = await getPreConCosyImage(preConModeCode); // Calling PRECON Cosy Image
      headLineDom = document.createElement('div');
      headLineDom.classList.add('headerline-wrapper');
      headLineDom.textContent = `${preConHeadLine}` || '';
      configureCTADom = linkTab?.querySelector('a') || '';
      const isHighlited = linkTab.querySelectorAll('p')[1]?.textContent.trim() === 'true';
      if (configureCTADom) {
        configureCTADom.href = configureLink || (linkTab.querySelector('a').href || '');
        linkTab.textContent = '';
      }
      if (isHighlited) {
        defaultIndex = i;
      }
    }
    // eslint-disable-next-line max-len
    generatePrecon(wdhContext, preconData, headLineDom, configureCTADom, preConModelName, optionsCount);
    contentData.append(preconData);
    generateCosyImage(imageDomContainer, preConCosyImage);
    const dotButton = document.createElement('button');
    dotButton.classList.add('dot', `dot-${i}`);
    dotButton.addEventListener('click', dotClickHandler);
    dotsWrapper.append(dotButton);
  }
  parentBlock.append(bgImg, imageDomContainer, preconLeftWrapper, preconRightWrapper, dotsWrapper);
  block.textContent = '';
  block.append(parentBlock, contentData);
  resizePreconBlock();
}
