import {
  getPreConApiResponse, getPreConCosyImage, getResolutionKey, getCosyImageUrl,
} from '../../scripts/common/wdh-util.js';

export function getConfiguratorURL() {
  const url = document.querySelector('meta[name="configuratorurl"]')?.content;
  return url;
}

const configuratorURL = getConfiguratorURL();
// eslint-disable-next-line no-unused-vars
let iconClicked = false;
// eslint-disable-next-line no-unused-vars
function updateCarousel(content, currentIndex, gap) {
  const itemWidth = content?.children[currentIndex]?.offsetWidth;
  let offset = -(currentIndex * (itemWidth * 0.60));
  if (currentIndex === 0) offset = itemWidth * 0.50;
  const cards = content.children;
  if (currentIndex === cards.length - 1) offset -= itemWidth * 0.40;
  content.style.transform = `translate3d(${offset}px, 0px, 0px)`;
  content.style.transitionDuration = '750ms';
  content.style.transitionDelay = '100ms';

  const preconWrapper = document.querySelectorAll('.pre-content-outer-wrapper');

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < cards.length; i++) {
    if (i === currentIndex) {
      cards[i].classList.add('active');
      cards[i].classList.remove('not-active');
    } else {
      cards[i].classList.remove('active');
      cards[i].classList.add('not-active');
    }
  }
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < preconWrapper.length; i++) {
    if (i === currentIndex) {
      preconWrapper[i].classList.remove('in-active');
    } else {
      preconWrapper[i].classList.add('in-active');
    }
  }
}

function updateDots(dotsWrapper, currentIndex) {
  const dots = dotsWrapper.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    if (index === currentIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

function updateButtonVisibility(prevButton, nextButton, currentIndex, totalItems, itemsToShow) {
  if (!prevButton || !nextButton) return;
  const prevParent = prevButton.parentElement;
  const nextParent = nextButton.parentElement;
  if (!prevParent || !nextParent) return;

  if (currentIndex === 0) {
    prevButton.classList.add('hide-icon');
    prevParent.classList.add('hide-icon');
  } else {
    prevButton.classList.remove('hide-icon');
    prevParent.classList.remove('hide-icon');
  }

  if (currentIndex >= totalItems - itemsToShow) {
    nextButton.classList.add('hide-icon');
    nextParent.classList.add('hide-icon');
  } else {
    nextButton.classList.remove('hide-icon');
    nextParent.classList.remove('hide-icon');
  }
}

function addTouchSlideFunctionality(block, content, totalItems, itemsToShow, currentIndex, gap) {
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  let startTime = 0;
  let index = currentIndex;

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
    content.style.transitionDuration = '300ms';
    updateCarousel(content, index, gap);
    updateDots(block.querySelector('.dots-navigation'), index);
  });
}

function addDotsNavigation(block, content, totalItems, itemsToShow, gap) {
  let dotsWrapper = block.querySelector('.dots-navigation');
  if (dotsWrapper) {
    dotsWrapper.remove();
  }

  dotsWrapper = document.createElement('div');
  dotsWrapper.classList.add('dots-navigation');

  const preButton = block && block.querySelector('.carousel-btn-prev');
  const nexButton = block.querySelector('.carousel-btn-next');
  let currentIndex = 0;
  function updateDotCarousel() {
    updateCarousel(content, currentIndex, gap);
  }
  let totalDots;
  if (totalItems > 1) {
    totalDots = totalItems;
  } else {
    totalDots = 0;
  }
  function createClickHandler(index) {
    return function handleClick() {
      currentIndex = index;
      updateDotCarousel();
      updateDots(dotsWrapper, currentIndex);
      updateButtonVisibility(
        preButton,
        nexButton,
        currentIndex,
        totalItems,
        itemsToShow,
      );
      addTouchSlideFunctionality(block, content, totalItems, itemsToShow, currentIndex, gap);
    };
  }

  for (let i = 0; i < totalDots; i += 1) {
    const dotButton = document.createElement('button');
    dotButton.classList.add('dot');
    if (i === 1) dotButton.classList.add('active');
    dotButton.addEventListener('click', (createClickHandler(i)));
    dotsWrapper.append(dotButton);
  }

  block.append(dotsWrapper);
  block.dataset.dotsAdded = 'true';
}

function addIconCarouselControls(
  block,
  content,
  totalItems,
  itemsToShow,
  carouselLeftWrapper,
  carouselRightWrapper,
  gap,
) {
  let prevButton = block.querySelector('.carousel-btn-prev');
  let nextButton = block.querySelector('.carousel-btn-next');

  if (prevButton) {
    prevButton.remove();
  }

  if (nextButton) {
    nextButton.remove();
  }
  prevButton = document.createElement('button');
  prevButton.classList.add('carousel-btn-prev');

  nextButton = document.createElement('button');
  nextButton.classList.add('carousel-btn-next');

  carouselLeftWrapper.append(prevButton);
  carouselRightWrapper.append(nextButton);
  let currentIndex = 0;
  function updateIconCarousel() {
    updateCarousel(content, currentIndex, gap);
  }
  nextButton.style.display = 'none';
  prevButton.style.display = 'none';

  carouselRightWrapper.addEventListener('mouseover', () => {
    nextButton.style.display = 'block';
  });
  carouselRightWrapper.addEventListener('mouseleave', () => {
    nextButton.style.display = 'none';
  });

  carouselLeftWrapper.addEventListener('mouseover', () => {
    prevButton.style.display = 'block';
  });
  carouselLeftWrapper.addEventListener('mouseleave', () => {
    prevButton.style.display = 'none';
  });

  carouselLeftWrapper.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      iconClicked = true;
      updateDots(block.querySelector('.dots-navigation'), currentIndex);
      updateIconCarousel();
      updateButtonVisibility(
        prevButton,
        nextButton,
        currentIndex,
        totalItems,
        itemsToShow,
      );
    }
  });
  carouselRightWrapper.addEventListener('click', () => {
    if (currentIndex < totalItems - itemsToShow) {
      currentIndex += 1;
      iconClicked = true;
      updateDots(block.querySelector('.dots-navigation'), currentIndex);
      updateIconCarousel();
      updateButtonVisibility(
        prevButton,
        nextButton,
        currentIndex,
        totalItems,
        itemsToShow,
      );
    }
  });
  updateButtonVisibility(
    prevButton,
    nextButton,
    currentIndex,
    totalItems,
    itemsToShow,
  );
}

function updateItemsToShow(preconGalleryContent) {
  const viewport = window.innerWidth;

  const totalItems = preconGalleryContent.childElementCount;
  const computedStyle = getComputedStyle(preconGalleryContent);
  const paddingLeft = parseFloat(computedStyle.paddingLeft);
  const paddingRight = parseFloat(computedStyle.paddingRight);
  const desktopScreenWidth = viewport - (paddingLeft + paddingRight);

  // padding only for more than 1280 viewport
  const desktopContentPadding = document.querySelector('.section.precon-container');
  const computedStyleDesktop = getComputedStyle(desktopContentPadding);
  const paddingLeftDesktop = parseFloat(computedStyleDesktop.paddingLeft);
  const paddingRightDesktop = parseFloat(computedStyleDesktop.paddingRight);
  const ultraScreenWidth = viewport - (paddingLeftDesktop + paddingRightDesktop);

  const cardsToShow = 1;
  const availableWidth = viewport >= 1920 ? ultraScreenWidth : desktopScreenWidth;
  return { cardsToShow, availableWidth, totalItems };
}

export function resizePreconBlock() {
  const viewport = window.innerWidth;
  const carousels = document.querySelectorAll('.precon-image-container');
  carousels.forEach((carouselContent) => {
    const block = carouselContent.closest('.precon.block');
    const cards = carouselContent.querySelectorAll('.img-card-container');
    console.log(cards);
    const carouselLeftWrapper = block.querySelector('.precon-wrapper-lft-area');
    const carouselRightWrapper = block.querySelector('.precon-wrapper-rth-area');
    const gap = 0;
    const { cardsToShow, availableWidth, totalItems } = updateItemsToShow(carouselContent);

    cards.forEach((card) => {
      if (viewport < 768) {
        card.style.width = `${availableWidth * 0.625}px`;
      } else {
        card.style.width = `${(availableWidth * 0.454545) + 87.273}px`;
      }
      card.style.marginRight = `${gap}px`;
    });

    addTouchSlideFunctionality(
      block,
      carouselContent,
      totalItems,
      cardsToShow,
      1,
      gap,
    );
    if (viewport >= 1024 && totalItems > 1) {
      addIconCarouselControls(
        block,
        carouselContent,
        totalItems,
        cardsToShow,
        carouselLeftWrapper,
        carouselRightWrapper,
        gap,
      );
    }
    addDotsNavigation(block, carouselContent, totalItems, cardsToShow, gap);
    updateCarousel(carouselContent, 0, gap);
    updateDots(block.querySelector('.dots-navigation'), 0);
  });
}

export function preconResizer() {
  resizePreconBlock();

  // windo resize event
  window.addEventListener('resize', () => {
    resizePreconBlock();
  });
}

// eslint-disable-next-line max-len
function generatePrecon(wdhContext, linkTab, preConOuterWrapper, headLineDom, configureCTADom, configureLink, preConModelName, optionsCount) {
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
  resizePreconBlock();
}

function getBackgroundImgURL(backgroundImages, resolutionKey, quality) {
  // Replace this with the actual logic to generate the image URL based on resolutionKey and quality
  return `${backgroundImages}?res=${resolutionKey}&q=${quality}`;
}

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

  // Fallback img tag
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

async function generateCosyImage(imageDomContainer, preConCosyImage) {
  const imageCardContainer = document.createElement('div');
  imageCardContainer.classList.add('img-card-container');
  const imageCard = document.createElement('div');
  imageCard.classList.add('img-card');
  let preConImageDOM;

  if (preConCosyImage) { // cosy image to show for Pre-Con
    const screenWidth = window.innerWidth;
    const resolutionKey = getResolutionKey(screenWidth);
    const createPictureTag = (quality) => {
      const pictureTag = document.createElement('picture');
      const resolutions = [767, 1023, 1919];
      resolutions.forEach((resolution) => {
        const sourceTag = document.createElement('source');
        sourceTag.srcset = getCosyImageUrl(
          preConCosyImage,
          getResolutionKey(resolution),
          resolution === 768 ? 30 : quality,
        );
        sourceTag.media = `(min-width: ${resolution}px)`;
        pictureTag.appendChild(sourceTag);
      });

      // Fallback img tag
      const imgTag = document.createElement('img');
      imgTag.src = getCosyImageUrl(preConCosyImage, resolutionKey, 40);
      imgTag.alt = 'pre con Cosy Image';
      pictureTag.appendChild(imgTag);
      return pictureTag;
    };

    preConImageDOM = createPictureTag(40);
    imageCard.append(preConImageDOM);
    imageCardContainer.append(imageCard);
    imageDomContainer.append(imageCardContainer);
  }
  resizePreconBlock();
}

export default async function decorate(block) {
  const preconLeftWrapper = document.createElement('div');
  preconLeftWrapper.classList.add('precon-wrapper-lft-area');

  const contentData = document.createElement('div');
  contentData.classList.add('precon-content-data');

  const imageDomContainer = document.createElement('div');
  imageDomContainer.classList.add('precon-image-container');

  const parentBlock = document.createElement('div');
  parentBlock.classList.add('precon-swiper-initialized');

  const preconRightWrapper = document.createElement('div');
  preconRightWrapper.classList.add('precon-wrapper-rth-area');

  const backgroundImages = 'https://www.bmw.rs/etc.clientlibs/bmw-web/clientlibs/clientlib-site/resources/images/street-bg_1x_320.webp';
  const quality = 50;
  const pictureElement = createBgImgaeUrl(backgroundImages, quality);

  const bgImg = document.createElement('picture').appendChild(pictureElement);
  bgImg.classList.add('precon-background');

  const precon = [...block.children];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < precon.length; i++) {
    const preconData = precon[i];
    const [wdhContext, linkTab] = preconData.children;
    preconData.classList.add('pre-content-outer-wrapper', `pre-content-outer-wrapper-${i}`, 'in-active');
    preconData.children[0].classList.add('precon-wdh');
    preconData.children[1].classList.add('precon-link');

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
        if (preConModelResponse.responseJson[key].id === selectedPreConId);
        preConModeCode = preConModelResponse.responseJson[key]?.modelCode; // MODEL-CODE
        // eslint-disable-next-line max-len
        preConHeadLine = preConModelResponse.responseJson[key]?.headline; // Show the headline below cosy Image
        preConModelName = preConModelResponse.responseJson[key]?.modelName;
        optionsValue = preConModelResponse.responseJson[key]?.options; //
        configureLink = configureCTA(selctedModelData, preConModelResponse.responseJson[key]);
        break;
      }
      optionsCount = optionsValue.split(',').length;
      // eslint-disable-next-line no-await-in-loop
      preConCosyImage = await getPreConCosyImage(preConModeCode); // Calling PRECON Cosy Image
      headLineDom = document.createElement('div');
      headLineDom.classList.add('headerline-wrapper');
      headLineDom.textContent = `${preConHeadLine}` || '';
      configureCTADom = linkTab.querySelector('a') || '';
      if (configureCTADom) {
        configureCTADom.href = configureLink || (linkTab.querySelector('a').href || '');
        configureCTADom.textContent = linkTab.querySelectorAll('p')[1]?.textContent || '';
        linkTab.textContent = '';
      }
    }
    generateCosyImage(imageDomContainer, preConCosyImage);
    // eslint-disable-next-line max-len
    generatePrecon(wdhContext, linkTab, preconData, headLineDom, configureCTADom, configureLink, preConModelName, optionsCount);
    contentData.append(preconData);
  }
  parentBlock.append(bgImg, imageDomContainer);
  block.textContent = '';
  block.append(parentBlock, preconLeftWrapper, preconRightWrapper, contentData);
  resizePreconBlock();
}
