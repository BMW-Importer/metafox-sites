import {
  DEV, STAGE, PROD, disclaimerGQlEndpoint,
} from '../../scripts/common/constants.js';
import { propsData } from '../stock-locator-model-detail-definition-specification/stock-locator-model-detail-definition-specification.js';

async function getContentFragmentData(disclaimerCFPath, gqlOrigin) {
  const endpointUrl = gqlOrigin + disclaimerGQlEndpoint + disclaimerCFPath.innerText;
  const response = await fetch(endpointUrl);
  return response.json();
}


function updateCarousel(currentIndex,) {
  const content = document.querySelector('.card-container-slide');
  if (!content) return;

  const itemWidth = content.children[currentIndex]?.offsetWidth;
  const offset = -(currentIndex * (itemWidth));

  const totalItems = content.children.length;

  content.style.transition = "transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)";
  content.style.transform = `translate3d(${offset}px, 0px, 0px)`;
  content.style.transitionDuration = '750ms';
  content.style.transitionDelay = '100ms';

  const cards = content.children;
  const itemsToShow = 1;

  const dots = document.querySelectorAll('.dot');
   // eslint-disable-next-line no-plusplus
   for (let i = 0; i < cards.length; i++) {
    if (i === currentIndex) {
      cards[i].classList.remove('not-active');
      cards[i].classList.add('active');
      dots[i].classList.add('active');
    } else {
      cards[i].classList.add('not-active');
      cards[i].classList.remove('active');
      dots[i].classList.remove('active');
    }
  }

  const prevButton = document.querySelector('.slide-wrapper-lft-area');
  const nextButton = document.querySelector('.slide-wrapper-rth-area');

  if (!prevButton || !nextButton) return;

  if (currentIndex === 0) {
    prevButton.classList.add('hide-area');
  } else {
    prevButton.classList.remove('hide-area');
  }

  if (currentIndex >= totalItems - itemsToShow) {
    nextButton.classList.add('hide-area');
  } else {
    nextButton.classList.remove('hide-area');
  }
}

function dotClickHandler() {
  const index = Number(this.classList[1].split('-')[1]);
  updateCarousel(index);
}

function buttonClick(direction) {
  const mainContent = document.querySelector('.card-container-slide');
  const index = Array.from(mainContent.querySelectorAll('.locator-img-content')).findIndex((each) => each.classList.contains('active'));

  let newIndex = direction === 'left' ? index - 1 : index + 1;
  updateCarousel(newIndex);
}


function addButtons(slideLeftWrapper, slideRightWrapper) {
  // create buttons
  const prevButton = document.createElement('button');
  prevButton.classList.add('carousel-btn-prev');
  const nextButton = document.createElement('button');
  nextButton.classList.add('carousel-btn-next');

  slideLeftWrapper.addEventListener('click', () => buttonClick('left'));
  slideRightWrapper.addEventListener('click', () => buttonClick('right'));
  // add buttons to wrappers
  slideLeftWrapper.append(prevButton);
  slideRightWrapper.append(nextButton);
}

function addTouchSlideFunctionality() {
  const mainContent = document.querySelector('.carousels-container');
  if (!mainContent) return;
  const content = mainContent.querySelector('.card-container-slide');
  const totalItems = content.children.length;
  const itemsToShow = 1;
  let index = Array.from(content.querySelectorAll('.locator-img-content')).findIndex((each) => each.classList.contains('active'));
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  let startTime = 0;
  const gap = 0; // gap between images1
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

function generateLocatorDetails(stockLocatorDeatilsContainer) {
  const headline = document.createElement('div');
  headline.classList.add('locator-headline');

  const hTag = document.createElement('h1');
  hTag.classList.add('locator-heading');

  hTag.textContent = 'BMW ix xDrive40';
  headline.appendChild(hTag);

  const caption = document.createElement('div');
  caption.classList.add('locator-caption');
  const captionSpan = document.createElement('span');
  captionSpan.textContent = 'Reference number 653985',
  caption.appendChild(captionSpan);

  const priceContainer = document.createElement('div');
  priceContainer.classList.add('price-container');
  const iconDiv = document.createElement('div');
  iconDiv.classList.add('description-icon-div');
  const descriptionPopupButton = document.createElement('i');
  descriptionPopupButton.classList.add('description-popup-button', 'icon-info-i');
  iconDiv.append(descriptionPopupButton);

  const descriptionPopupContainer = document.createElement('div');
  descriptionPopupContainer.classList.add('description-popup-container');

  const descriptionPopupContent = document.createElement('div');
  descriptionPopupContent.classList.add('description-popup-content');

  const descriptionPopupContentHeader = document.createElement('div');
  descriptionPopupContentHeader.classList.add('description-popup-content-header');

  const descriptionPopupContentHeaderText = document.createElement('p');
  descriptionPopupContentHeader.appendChild(descriptionPopupContentHeaderText);
  descriptionPopupContentHeaderText.textContent = 'model';

  const descriptionPopupCloseButton = document.createElement('div');
  descriptionPopupCloseButton.classList.add('description-popup-close-button');
  descriptionPopupContentHeader.appendChild(descriptionPopupCloseButton);

  const descriptionPopupContentBody = document.createElement('div');
  descriptionPopupContentBody.classList.add('description-popup-content-body');
  descriptionPopupContent.appendChild(descriptionPopupContentBody);

  const descriptionPopupPriceInfo = document.createElement('div');
  descriptionPopupPriceInfo.classList.add('description-popup-price-info');

  const descriptionPopupPriceInfoText = document.createElement('span');
  const descriptionPopupPriceInfoPrice = document.createElement('span');
  descriptionPopupPriceInfoText.textContent = ' Preporučena maloprodajna cena ';
  descriptionPopupPriceInfoPrice.textContent = `105,000 EUR`;
  descriptionPopupPriceInfo.append(
    descriptionPopupPriceInfoText,
    descriptionPopupPriceInfoPrice,
  );

  const descriptionPopupDisclaimerWrapper = document.createElement('div');
  descriptionPopupDisclaimerWrapper.classList.add('description-popup-disclaimer-wrapper');
  descriptionPopupContentBody.appendChild(descriptionPopupDisclaimerWrapper);

  const descriptionPopupDisclaimer = document.createElement('div');
  descriptionPopupDisclaimer.classList.add('description-popup-disclaimer');

  const descriptionPopupDisclaimerText = document.createElement('p');
  descriptionPopupDisclaimerText.append('disclaimerContent?.textContent' || '');
  descriptionPopupDisclaimer.appendChild(descriptionPopupDisclaimerText);

  const popupToggleButtonContainer = document.createElement('div');
  popupToggleButtonContainer.classList.add('popup-toggle-button-container');
  descriptionPopupDisclaimerWrapper.append(
    descriptionPopupDisclaimer,
    popupToggleButtonContainer,
  );

  const popupToggleButton = document.createElement('div');
  popupToggleButton.classList.add('popup-toggle-button');

  popupToggleButtonContainer.appendChild(popupToggleButton);
  descriptionPopupDisclaimerWrapper.append(
    descriptionPopupDisclaimer,
    popupToggleButtonContainer,
  );

  descriptionPopupContentBody.append(
    descriptionPopupPriceInfo,
    descriptionPopupDisclaimerWrapper,
  );

  descriptionPopupContent.append(
    descriptionPopupContentHeader,
    descriptionPopupContentBody,
  );

  descriptionPopupContainer.appendChild(descriptionPopupContent);

  const price = document.createElement('span');
  price.classList.add('car-price');
  price.textContent = `105,000 EUR`;
  priceContainer.append(price, iconDiv, descriptionPopupContainer);

  const locatorAutoGrant = document.createElement('div');
  locatorAutoGrant.classList.add('locator-auto-grant');
  const span = document.createElement('span');
  span.textContent = 'Auto-Garant doo';
  locatorAutoGrant.appendChild(span);

  stockLocatorDeatilsContainer.append(headline, caption, priceContainer, locatorAutoGrant);

}

function popupButton() {
  console.log('called');
  const infoButtons = document.querySelectorAll('.description-popup-button');
  const popupTexts = document.querySelectorAll('.description-popup-container');
  const closeButtons = document.querySelectorAll('.description-popup-close-button');
  const toggleButtons = document.querySelectorAll('.popup-toggle-button');
  const descriptionPopupDisclaimers = document.querySelectorAll('.description-popup-disclaimer');

  infoButtons.forEach((infoButton, index) => {
    const popupText = popupTexts[index];
    const closeButton = closeButtons[index];
    const toggleButton = toggleButtons[index];
    const descriptionPopupDisclaimer = descriptionPopupDisclaimers[index];

    infoButton.addEventListener('click', () => {
      popupText.style.display = 'block';
    });

    closeButton.addEventListener('click', () => {
      popupText.style.display = 'none';
    });

    toggleButton.addEventListener('click', () => {
      if (descriptionPopupDisclaimer.style.height === '100px' || descriptionPopupDisclaimer.style.height === '') {
        descriptionPopupDisclaimer.style.height = 'max-content';
        toggleButton.classList.add('up-arrow');
        toggleButton.classList.remove('down-arrow');
      } else {
        descriptionPopupDisclaimer.style.height = '100px';
        toggleButton.classList.add('down-arrow');
        toggleButton.classList.remove('up-arrow');
      }
    });

    // Optional: Click outside to close the popup
    document.addEventListener('click', (event) => {
      if (!popupText.contains(event.target) && !infoButton.contains(event.target)) {
        popupText.style.display = 'none';
      }
    });
  });
}

function generateCosyImage(cardContainerSlide) {

  const imageUrls = [
    'https://imgd.aeplcdn.com/664x374/n/cw/ec/136217/x7-exterior-right-front-three-quarter-7.jpeg?isig=0&q=80',
    'https://imgd.aeplcdn.com/664x374/n/cw/ec/136217/x7-exterior-right-front-three-quarter-7.jpeg?isig=0&q=80',
    'https://imgd.aeplcdn.com/664x374/n/cw/ec/136217/x7-exterior-right-front-three-quarter-7.jpeg?isig=0&q=80',
    'https://imgd.aeplcdn.com/664x374/n/cw/ec/136217/x7-exterior-right-front-three-quarter-7.jpeg?isig=0&q=80',
    'https://imgd.aeplcdn.com/664x374/n/cw/ec/136217/x7-exterior-right-front-three-quarter-7.jpeg?isig=0&q=80',
    'https://imgd.aeplcdn.com/664x374/n/cw/ec/136217/x7-exterior-right-front-three-quarter-7.jpeg?isig=0&q=80',
  ];

  imageUrls.forEach(url => {

    const imgContent = document.createElement('div');
    imgContent.classList.add('locator-img-content');
    
    const img = document.createElement('img');
    img.classList.add('locator-image');
    img.src = url;
    img.alt = 'img';
    
    imgContent.append(img)
    cardContainerSlide.append(imgContent);
  });
}

function calculateImageWidth(viewportWidth) {
  if (viewportWidth <= 1199 && viewportWidth >= 1025) {
      return 683;
  } else if (viewportWidth <= 1024 && viewportWidth >= 992) {
      return 655 - (1024 - viewportWidth);
  } else if (viewportWidth <= 991 && viewportWidth >= 808) {
      return 768;
  } else if (viewportWidth <= 807 && viewportWidth >= 768) {
      return 767 - (807 - viewportWidth);
  } else if (viewportWidth <= 767 && viewportWidth >= 600) {
      return 600;
  } else if (viewportWidth <= 599 && viewportWidth >= 576) {
      return 576;
  } else if (viewportWidth <= 575) {
      return 555 - (575 - viewportWidth);
  } else {
      return 800; // Default width if none of the conditions are met
  }
}

function generateMapContent(mapContainer) {
  const mapHeadline = document.createElement('h2');
  mapHeadline.classList.add('locator-map-headline');
  mapHeadline.textContent = 'Diler.';

  const mapInnerContent = document.createElement('div');
  mapInnerContent.classList.add('locator-inner-content');

  const innerHeadline = document.createElement('h3');
  innerHeadline.classList.add('locator-inner-headline');
  innerHeadline.textContent = 'Delta Motors d.o.o.';

  const stockLocatorDealerSection = document.createElement('div');
  stockLocatorDealerSection.classList.add('stockcar-dealer-section');

  const details = [{
    address: '123 Main St, Springfield',
    Telefone: '12345678',
    email: 'example@example.com',
  }];
  
  details.forEach((item) => {

    // Create labels and values
    const createLabelValuePair = (label, value) => {
      const container = document.createElement('div');
      container.classList.add('dealer-info-container');

      const labelElement = document.createElement('div');
      labelElement.classList.add('dealer-info-label');
      labelElement.textContent = label;

      const valueElement = document.createElement('div');
      valueElement.classList.add('dealer-info-value');
      valueElement.textContent = value;

      container.append(labelElement, valueElement);
      return container;
    };
    stockLocatorDealerSection.append(
      createLabelValuePair('Address', item.address),
      createLabelValuePair('Telefone', item.Telefone),
      createLabelValuePair('Email', item.email),
    );
  });

  mapInnerContent.append(innerHeadline, stockLocatorDealerSection);
  mapContainer.append(mapHeadline, mapInnerContent);
}

function addDots(cardContainerSlide, dotsWrapper) {
  const numberOfImages = cardContainerSlide.querySelectorAll('.locator-img-content').length;
  for (let i = 0; i < numberOfImages; i++) {
    const dotButton = document.createElement('button');
    dotButton.classList.add('dot', `dot-${i}`);
    dotButton.addEventListener('click', dotClickHandler);
    dotsWrapper.appendChild(dotButton);
  }
}

export function resizeStockLocatorBlock() {
  const viewportWidth = window.innerWidth;
  const carousels = document.querySelectorAll('.card-container-slide');
  carousels.forEach((carouselContent) => {
    const cards = carouselContent.querySelectorAll('.locator-img-content');

    cards.forEach((card) => {
        const imageWidth = calculateImageWidth(viewportWidth);
        card.style.width = `${imageWidth}px`;
    });
  });
  updateCarousel(0);
  addTouchSlideFunctionality();
}

export function stockLocatorResizer() {
  resizeStockLocatorBlock();

  // windo resize event
  window.addEventListener('resize', () => {
    resizeStockLocatorBlock();
  });
}

export default function decorate(block) {

  const parentBlockLocator = document.createElement('div');
  parentBlockLocator.classList.add('stock-locator-parent-container');

  const cardContainerSlide = document.createElement('div');
  cardContainerSlide.classList.add('card-container-slide');

  const carouselsContainer = document.createElement('div');
  carouselsContainer.classList.add('carousels-container');

  const slideLeftWrapper = document.createElement('div');
  slideLeftWrapper.classList.add('slide-wrapper-lft-area');

  const slideRightWrapper = document.createElement('div');
  slideRightWrapper.classList.add('slide-wrapper-rth-area');

  const dotsWrapper = document.createElement('div');
  dotsWrapper.classList.add('dots-navigation-locator');

  const stockLocatorDeatilsContainer = document.createElement('div');
  stockLocatorDeatilsContainer.classList.add('stock-locator-details-container');

  addButtons(slideLeftWrapper, slideRightWrapper);

  const props = [...block.children].map((row) => row.firstElementChild);

  const [modelButtonTxt, countAndDisclaimer, bannerContent] = props;
  const pTags = countAndDisclaimer.querySelectorAll('p');
  const countText = pTags[0] || '';
  const disclaimerCF = pTags[1] || '';

  const env = document.querySelector('meta[name="env"]').content;
  let publishDomain = '';
  if (env === 'dev') {
    publishDomain = DEV.hostName;
  } else if (env === 'stage') {
    publishDomain = STAGE.hostName;
  } else {
    publishDomain = PROD.hostName;
  }
  window.gqlOrigin = window.location.hostname.match('^(.*.hlx\\.(page|live))|localhost$') ? publishDomain : '';
  getContentFragmentData(disclaimerCF, window.gqlOrigin).then((response) => {
    const cfData = response?.data;
    propsData(modelButtonTxt, countText, cfData, bannerContent);
  });

  const mapContainer = document.createElement('div');
  mapContainer.classList.add('map-container');

  generateLocatorDetails(stockLocatorDeatilsContainer);
  generateCosyImage(cardContainerSlide);
  generateMapContent(mapContainer);

  addDots(cardContainerSlide, dotsWrapper);
  
  carouselsContainer.append(cardContainerSlide, slideLeftWrapper, slideRightWrapper, dotsWrapper);
  parentBlockLocator.append(stockLocatorDeatilsContainer, carouselsContainer)
  block.textContent = '';
  block.append(parentBlockLocator, mapContainer);
  popupButton();
  resizeStockLocatorBlock();

}
