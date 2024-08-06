import {
  DEV, STAGE, PROD, disclaimerGQlEndpoint,
} from '../../scripts/common/constants.js';
import { propsData } from '../stock-locator-model-detail-definition-specification/stock-locator-model-detail-definition-specification.js';

async function getContentFragmentData(disclaimerCFPath, gqlOrigin) {
  const endpointUrl = gqlOrigin + disclaimerGQlEndpoint + disclaimerCFPath.innerText;
  const response = await fetch(endpointUrl);
  return response.json();
}

// const mockData = [{
//   name: 'BMW ix xDrive40',
//   refereceNum: 'Reference number 653985',
//   price: '105,000 EUR',
//   Auto-Garant doo: 'Auto-Garant doo'
// }
// ]


function dotClickHandler() {
  const index = Number(this.classList[1].split('-')[1]);
}

function updateCarousel(currentIndex) {
  const content = document.querySelector('.card-container-slide');
  if (!content) return;
  const imageContainer = content.querySelector('.locator-image-container');
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
  // const preconWrapper = document.querySelectorAll('.precon-content-data .pre-content-outer-wrapper');
  // const dots = content.querySelectorAll('.dot');
  const itemsToShow = 1;

  // eslint-disable-next-line no-plusplus
  // for (let i = 0; i < cards.length; i++) {
  //   if (i === currentIndex) {
  //     cards[i].classList.remove('not-active', 'blur-inactive');
  //     cards[i].classList.add('active');
  //     preconWrapper[i].classList.remove('in-active');
  //     dots[i].classList.add('active');
  //   } else {
  //     cards[i].classList.add('not-active');
  //     cards[i].classList.remove('active');
  //     preconWrapper[i].classList.add('in-active');
  //     dots[i].classList.remove('active');
  //   }
  // }

  const prevButton = document.querySelector('.slide-wrapper-lft-area');
  const nextButton = document.querySelector('.slide-wrapper-rth-area');

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

function buttonClick(direction) {
  const mainContent = document.querySelector('.card-container-slide');
  const content = mainContent.querySelector('.locator-image-container');
  const index = Array.from(content.querySelectorAll('.locator-img-content')).findIndex((each) => each.classList.contains('active'));
  if (direction === 'left') updateCarousel(index - 1);
  else updateCarousel(index + 1);
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

function generateCosyImage(cardContainerSlide) {

  const imageUrls = [
    'https://prod.cosy.bmw.cloud/bmwweb/cosySec?COSY-EU-100-73318jQYfFqIbPXnvzqUxEw8%25P6wBKM4adOKU2JBzcbt3aJqZvjDlwXYuw4sD9%25UHNMClix2t5JUABN745UXgtUDUCH1T3IjAeSw27BzcKX3aJQbAFKdqfkEramzOSs5m%2565ezICP4Ws86OG7c1QUDCJnxbZsCsluMw8m9hvU1AIs75Z',
    'https://prod.cosy.bmw.cloud/bmwweb/cosySec?COSY-EU-100-73318jQYfFqIbPXnvzqUxEw8%25P6wBKM4adOKU2JBzcbt3aJqZvjDlwXYuw4sD9%25UHNMClix2t5JUABN745UXgtUDUCH1T3IjAeSw27BzcKX3aJQbAFKdqfkEramzOSs5m%2565ezICP4Ws86OG7c1QUDCJnxbZsCsluMw8m9hvU1AIs75Z',
    'https://prod.cosy.bmw.cloud/bmwweb/cosySec?COSY-EU-100-73318jQYfFqIbPXnvzqUxEw8%25P6wBKM4adOKU2JBzcbt3aJqZvjDlwXYuw4sD9%25UHNMClix2t5JUABN745UXgtUDUCH1T3IjAeSw27BzcKX3aJQbAFKdqfkEramzOSs5m%2565ezICP4Ws86OG7c1QUDCJnxbZsCsluMw8m9hvU1AIs75Z',
    'https://prod.cosy.bmw.cloud/bmwweb/cosySec?COSY-EU-100-73318jQYfFqIbPXnvzqUxEw8%25P6wBKM4adOKU2JBzcbt3aJqZvjDlwXYuw4sD9%25UHNMClix2t5JUABN745UXgtUDUCH1T3IjAeSw27BzcKX3aJQbAFKdqfkEramzOSs5m%2565ezICP4Ws86OG7c1QUDCJnxbZsCsluMw8m9hvU1AIs75Z',
    'https://prod.cosy.bmw.cloud/bmwweb/cosySec?COSY-EU-100-73318jQYfFqIbPXnvzqUxEw8%25P6wBKM4adOKU2JBzcbt3aJqZvjDlwXYuw4sD9%25UHNMClix2t5JUABN745UXgtUDUCH1T3IjAeSw27BzcKX3aJQbAFKdqfkEramzOSs5m%2565ezICP4Ws86OG7c1QUDCJnxbZsCsluMw8m9hvU1AIs75Z',
  ];

  imageUrls.forEach(url => {
    const imageDomContainer = document.createElement('div');
    imageDomContainer.classList.add('locator-image-container');

    const imgContent = document.createElement('div');
    imgContent.classList.add('locator-img-content');
    
    const img = document.createElement('img');
    img.classList.add('locator-image');
    img.src = url;
    img.alt = 'img';
    
    imgContent.append(img)
    imageDomContainer.append(imgContent);
    cardContainerSlide.append(imageDomContainer);
  });
 
}

export default function decorate(block) {
  const cardContainerSlide = document.createElement('div');
  cardContainerSlide.classList.add('card-container-slide');

  const carouselsContainer = document.createElement('div');
  carouselsContainer.classList.add('carousels-container');

  const slideLeftWrapper = document.createElement('div');
  slideLeftWrapper.classList.add('slide-wrapper-lft-area');

  const slideRightWrapper = document.createElement('div');
  slideRightWrapper.classList.add('slide-wrapper-rth-area');

  const dotsWrapper = document.createElement('div');
  dotsWrapper.classList.add('dots-navigation');

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

  generateLocatorDetails(stockLocatorDeatilsContainer);
  generateCosyImage(cardContainerSlide);
  const dotButton = document.createElement('button');
  dotButton.classList.add('dot', `dot-${0}`);
  dotButton.addEventListener('click', dotClickHandler);
  dotsWrapper.append(dotButton);

  cardContainerSlide.append(slideLeftWrapper, slideRightWrapper, dotsWrapper);
  carouselsContainer.append(cardContainerSlide);
  block.textContent = '';
  block.append(stockLocatorDeatilsContainer, carouselsContainer);
  // resizeVideoBlock();
}
