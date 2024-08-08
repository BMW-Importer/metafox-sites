// eslint-disable-next-line import/no-cycle
import {
  getStockLocatorFiltersData, getStockLocatorVehiclesData, getShowMoreCards, getVehicleDetails,
  getVehicleGroupReference,
} from '../../scripts/common/wdh-util.js';
import {
  DEV, STAGE, PROD, disclaimerGQlEndpoint,
} from '../../scripts/common/constants.js';
import { fetchPlaceholders } from '../../scripts/aem.js';

const lang = document.querySelector('meta[name="language"]').content;
const placeholders = await fetchPlaceholders(`/${lang}`);
console.log(placeholders);

let currentlyOpenDropdown = null;
const viewport = window.innerWidth;
function handleToggleFilterDropDown() {
  const filterSelectors = document.querySelectorAll('.filter-label-heading');
  filterSelectors.forEach((item) => {
    item.addEventListener('click', (e) => {
      const dropdown = e.target.nextElementSibling;
      if (currentlyOpenDropdown && currentlyOpenDropdown !== dropdown) {
        currentlyOpenDropdown.style.display = 'none';
        currentlyOpenDropdown.previousElementSibling.classList.remove('show-dropdown');
      }
      if (dropdown) {
        e.target.classList.toggle('show-dropdown');
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        currentlyOpenDropdown = dropdown.style.display === 'block' ? dropdown : null;
      }
    });
  });
  // eslint-disable-next-line no-use-before-define, no-unused-expressions
  viewport >= 1024 && handleCheckBoxSelection();
}

function handleCancelSelectedValue(values) {
  const cancelSelectors = document.querySelectorAll('.cancel-filter');
  cancelSelectors.forEach((item) => {
    item.addEventListener('click', () => {
      const valueElement = item.parentElement;
      valueElement.remove();
      const fromRemove = document.querySelector('.appear').getAttribute('data-vehicle-url');
      // eslint-disable-next-line no-use-before-define
      removeLastSelectedValue(values, fromRemove, encodeURI(valueElement.textContent));
      // eslint-disable-next-line max-len, no-use-before-define
      removeValueFromCommaSeparatedQueryString(fromRemove, encodeURI(valueElement.textContent));
    });
  });
}

function removeLastSelectedValue(values, fromRemove, itemValue) {
  // eslint-disable-next-line no-restricted-syntax
  for (const [heading, valuesArray] of Object.entries(values)) {
    if (valuesArray.length > 0) {
      // Remove the last value from the array
      valuesArray.pop();
      if (valuesArray.length === 0) {
        delete values[heading];
      }
      break;
    }
  }
  // eslint-disable-next-line no-use-before-define
  removeValueFromCommaSeparatedQueryString(fromRemove, itemValue);
  // eslint-disable-next-line no-use-before-define
  getStockLocatorVehiclesData(vehicleURL);
  if (Object.entries(values).length === 0 && values.constructor === Object) {
    const checkboxes = document.querySelectorAll('.filter-checkbox');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });

    const filterLabels = document.querySelectorAll('.filter-label-heading');
    filterLabels.forEach((label) => {
      label.classList.remove('is-active');
    });
  }
}

function removeValueFromCommaSeparatedQueryString(queryString, valueToRemove) {
  const keyValuePairs = queryString.split('&');
  const processedPairs = keyValuePairs.map((pair) => {
    const [key, value] = pair.split('=');
    if (value.includes(',')) {
      const values = value.split(',');
      const filteredValues = values.filter((v) => v !== valueToRemove);
      return filteredValues.length > 0 ? `${key}=${filteredValues.join(',')}` : null;
    }
    return value !== valueToRemove ? pair : null;
  }).filter(Boolean);
  const resetURL = processedPairs.join('&');
  document.querySelector('.appear').setAttribute('data-vehicle-url', resetURL);
  const hasEmptyValue = processedPairs.length;
  if (hasEmptyValue === 0) {
    // eslint-disable-next-line no-use-before-define
    removeResetFilterDOM();
    // eslint-disable-next-line no-use-before-define
    removeFallbackBannerDOM();
    document.querySelector('.appear').removeAttribute('data-selected-vehicle');
    // resetAllFilters();
    // eslint-disable-next-line no-use-before-define
    createStockLocatorFilter(globalFilterData, dropDownContainer);
    // eslint-disable-next-line no-use-before-define
    vehicleFiltersAPI();
    // eslint-disable-next-line no-use-before-define
    handleCheckBoxSelection();
  }
  // Update the vehicle URL and make an API call
  // eslint-disable-next-line no-use-before-define
  vehicleURL = resetURL;
  // eslint-disable-next-line no-use-before-define
  const resetResponse = getStockLocatorVehiclesData(vehicleURL);
  // eslint-disable-next-line no-use-before-define
  vehicleFiltersAPI(resetResponse?.data);

  // Update the browser's URL with the new query parameters
  // eslint-disable-next-line no-use-before-define
  updateBrowserURL(resetURL);

  return resetURL;
}

function updateBrowserURL(queryString) {
  const baseUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
  const newUrl = `${baseUrl}?${queryString}`;
  window.history.pushState({ path: newUrl }, '', newUrl);
}

function removeResetFilterDOM() {
  // Logic to remove the reset filter DOM element
  const resetFilterElement = document.querySelector('.reset-filter');
  if (resetFilterElement) {
    resetFilterElement.remove();
  }
}

function removeFallbackBannerDOM() {
  // Logic to remove the reset filter DOM element
  const removeFallbackDomElement = document.querySelector('.fallback-container');
  if (removeFallbackDomElement) {
    removeFallbackDomElement.remove();
  }
}

// eslint-disable-next-line import/no-mutable-exports
export let vehicleURL;
// eslint-disable-next-line no-unused-vars
let detailBtn; let cfDetails; let fallbackBanner;

export function propsData(modelButtonTxt, countText, cfData, bannerContent) {
  detailBtn = modelButtonTxt;
  cfDetails = cfData;
  fallbackBanner = bannerContent.textContent;
}

function cardTiles(getStockLocatorVehicles) {
  const cardWrapper = document.querySelector('.card-tile-wrapper') || document.createElement('div');
  cardWrapper.innerHTML = '';
  cardWrapper.classList.add('card-tile-wrapper');
  const cardList = document.createElement('ul');
  cardList.classList.add('card-tile-list');
  const cardContainer = document.createElement('div');
  cardContainer.classList.add('card-tile-container');
  const seeDetailBtn = 'See details';
  let disclaimerContent;
  if (document.querySelector('.section.stock-locator-model-detail-definition-specification-container.stock-locator-model-overview-properties-container')) {
    if (cfDetails) {
      const disclaimerHtml = cfDetails?.disclaimercfmodelByPath?.item?.disclaimer?.html;
      disclaimerContent = document.createElement('div');
      disclaimerContent.innerHTML = disclaimerHtml;
    }
    // seeDetailBtn = detailBtn?.querySelector('p') || '';
  }
  const vehicleData = getStockLocatorVehicles?.data;
  // eslint-disable-next-line array-callback-return
  vehicleData?.map((vehicle) => {
    const {
      // eslint-disable-next-line max-len
      model, powerKw, powerPs, priceInformation: { baseCurrencyCodeA, finalPriceWithTax }, groupReference,
    } = vehicle.attributes;
    const cardListElement = document.createElement('li');
    cardListElement.classList.add('card-tile-list-ele');
    const stockLocatorCard = document.createElement('div');
    stockLocatorCard.classList.add('stock-locator-card');
    const modelCard = document.createElement('div');
    modelCard.classList.add('model-card');

    const cardImgContainer = document.createElement('div');
    cardImgContainer.classList.add('image-container', 'stock-image');

    const pictureTag = document.createElement('picture');
    const anchorWrapper = document.createElement('a');
    anchorWrapper.classList.add('anchor-image-wrapper');
    anchorWrapper.href = `#/details/${groupReference}`;
    anchorWrapper.setAttribute('data-reference', groupReference);

    const imgElem = document.createElement('img');
    imgElem.classList.add('stocklocator-card-img', 'stock-locator-details');
    imgElem.src = 'data:image/webp;base64,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';
    imgElem.alt = 'img';

    const modelDetailsWrapper = document.createElement('div');
    modelDetailsWrapper.classList.add('model-details-wrapper');

    const modelContainer = document.createElement('div');
    modelContainer.classList.add('model-container');

    const modelName = document.createElement('h4');
    modelName.classList.add('model-name');
    modelName.textContent = model;
    modelContainer.append(modelName);

    const cardLayerInfoContainer = document.createElement('div');
    cardLayerInfoContainer.classList.add('card-layer-info-container');

    const stockLocatorCardButton = document.createElement('div');
    stockLocatorCardButton.classList.add('stock-locator-card-button');

    const stockLocatorCardButtonContainer = document.createElement('div');
    stockLocatorCardButtonContainer.classList.add('stock-locator-card-button-container');

    const stockLocatorHideButton = document.createElement('div');
    stockLocatorHideButton.classList.add('stock-locator-hide-button');

    const stockLocatorHideButtonLink = document.createElement('a');
    stockLocatorHideButtonLink.setAttribute('data-reference', groupReference);
    stockLocatorHideButtonLink.classList.add('btn-stock-locator-details');
    stockLocatorHideButtonLink.href = `#/details/${groupReference}`;
    const stockLocatorHideButtonText = document.createElement('span');
    stockLocatorHideButtonLink.appendChild(stockLocatorHideButtonText);
    stockLocatorHideButton.appendChild(stockLocatorHideButtonLink);
    stockLocatorCardButtonContainer.appendChild(stockLocatorHideButton);
    stockLocatorHideButtonText.append(seeDetailBtn);
    stockLocatorHideButtonLink.append(stockLocatorHideButtonText);

    const cardLayerInfoItem = document.createElement('div');
    cardLayerInfoItem.classList.add('card-layer-info-item');

    const infoSpan = document.createElement('span');
    infoSpan.textContent = `${powerKw} kW (${powerPs} KS)`;

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
    descriptionPopupContentHeaderText.textContent = model;

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
    descriptionPopupPriceInfoPrice.textContent = `${finalPriceWithTax.min} ${baseCurrencyCodeA}`;
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
    descriptionPopupDisclaimerText.append(disclaimerContent?.textContent || '');
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
    price.textContent = `${finalPriceWithTax.min} ${baseCurrencyCodeA}`;

    priceContainer.append(price, iconDiv, descriptionPopupContainer);
    cardLayerInfoItem.append(infoSpan);
    cardLayerInfoContainer.append(cardLayerInfoItem);
    modelDetailsWrapper.append(modelContainer, cardLayerInfoContainer, priceContainer);
    pictureTag.append(imgElem);
    cardImgContainer.append(anchorWrapper);
    anchorWrapper.append(imgElem);
    cardImgContainer.append(pictureTag);
    stockLocatorCard.appendChild(cardImgContainer);
    stockLocatorCard.appendChild(cardImgContainer);
    stockLocatorCard.appendChild(modelDetailsWrapper);
    stockLocatorCard.appendChild(stockLocatorCardButtonContainer);
    cardListElement.appendChild(stockLocatorCard);
    cardList.append(cardListElement);
  });
  cardContainer.append(cardList);
  cardWrapper.append(cardContainer);
  document.querySelector('.stock-locator-model-detail-definition-specification.block').appendChild(cardWrapper);
  // eslint-disable-next-line no-use-before-define
  pagination(getStockLocatorVehicles.meta, getStockLocatorVehicles);
  // eslint-disable-next-line no-use-before-define
  popupButton();
}

function stockCar() {
  const stockDetailsWrapper = document.createElement('div');
  stockDetailsWrapper.classList.add('stock-details-wrapper');
  document.querySelector('.stock-locator-model-overview-properties-wrapper').appendChild(stockDetailsWrapper);

  const engineDetailsWrapper = document.createElement('div');
  engineDetailsWrapper.classList.add('engine-details-wrapper');

  const engineTitleText = document.createElement('h2');
  engineTitleText.classList.add('engine-title-text');
  engineTitleText.textContent = 'Engin';

  const engineDetailsContainer = document.createElement('div');
  engineDetailsContainer.classList.add('engine-details-container');

  const engineDetailsEle = document.createElement('div');
  engineDetailsEle.classList.add('engine-details-elements');

  for (let i = 0; i <= 4; i += 1) {
    const engineEleContainer = document.createElement('div');
    engineEleContainer.classList.add('engine-elements-Container');
    const engineEleTitle = document.createElement('div');
    engineEleTitle.classList.add('engine-elements-title');
    engineEleTitle.textContent = 'Engine power';
    const engineEleText = document.createElement('div');
    engineEleText.classList.add('engine-elements-text');
    engineEleText.textContent = '100 kW 136 hp';

    engineEleContainer.append(engineEleTitle, engineEleText);
    engineDetailsEle.append(engineEleContainer);
  }
  // const speedUpContainer = document.createElement('div');
  // speedUpContainer.classList.add('speedUp-container');
  // const speedUpTitle = document.createElement('div');
  // speedUpTitle.classList.add('speedUp-title');
  // const speedUpText = document.createElement('div');
  // speedUpText.classList.add('speedUp-text');

  // speedUpContainer.append(speedUpTitle, speedUpText);

  const designDetailsWrapper = document.createElement('div');
  designDetailsWrapper.classList.add('design-details-wrapper');

  const ElementsDesignContainer = document.createElement('div');
  ElementsDesignContainer.classList.add('elements-design-container');

  for (let j = 0; j < 2; j += 1) {
    const designEle = document.createElement('div');
    designEle.classList.add('design-elements');

    const designElementsTitle = document.createElement('h2');
    designElementsTitle.classList.add('design-elements-title');
    designElementsTitle.textContent = 'Exterior.';

    const designEleWrapper = document.createElement('div');
    designEleWrapper.classList.add('design-elements-wrapper');

    for (let i = 0; i < 2; i += 1) {
      const elementsContainer = document.createElement('div');
      elementsContainer.classList.add('elements-container');

      const elementsImageContainer = document.createElement('div');
      elementsImageContainer.classList.add('elements-image-container');

      const img = document.createElement('img');
      img.classList.add('elements-image');
      img.src = 'https://picsum.photos/200/100';
      elementsImageContainer.appendChild(img);

      const elementsTextContainer = document.createElement('div');
      elementsTextContainer.classList.add('elements-text-container');
      const elementsTextTitle = document.createElement('span');
      elementsTextTitle.classList.add('elements-text-title');
      elementsTextTitle.textContent = ' Felna ';
      const elementsTextDec = document.createElement('h4');
      elementsTextDec.classList.add('elements-text-dec');
      elementsTextDec.textContent = '  Alu. felne M V-Spoke style 18" 554 M  ';

      elementsTextContainer.append(elementsTextTitle, elementsTextDec);
      elementsContainer.append(elementsImageContainer, elementsTextContainer);

      designEleWrapper.appendChild(elementsContainer);
    }
    designEle.append(designElementsTitle, designEleWrapper);
    ElementsDesignContainer.append(designEle);
  }
  engineDetailsWrapper.append(engineTitleText, engineDetailsEle);

  const carSpecPackagesWrapper = document.createElement('div');
  carSpecPackagesWrapper.classList.add('car-spec-packages-wrapper');

  const carSpecPackagesTitle = document.createElement('h2');
  carSpecPackagesTitle.classList.add('car-spec-packages-title');
  carSpecPackagesTitle.textContent = 'Packages.';

  const carSpecPackagesContainer = document.createElement('div');
  carSpecPackagesContainer.classList.add('car-spec-packages-container');

  const packagesAccordionContainer = document.createElement('div');
  packagesAccordionContainer.classList.add('packages-accordion-container');
  const packagesAccordionHeader = document.createElement('div');
  packagesAccordionHeader.classList.add('packages-accordion-header');
  const accordionToggleIcon = document.createElement('i');
  accordionToggleIcon.classList.add('accordion-toggle-icon');

  const accordionToggleText = document.createElement('span');
  accordionToggleText.classList.add('accordion-toggle-text');
  accordionToggleText.textContent = '"M Sport" package';
  packagesAccordionHeader.append(accordionToggleIcon, accordionToggleText);

  const packagesAccordionContentWrapper = document.createElement('div');
  packagesAccordionContentWrapper.classList.add('packages-accordion-content-wrapper');

  const packagesAccordionContentImg = document.createElement('div');
  packagesAccordionContentImg.classList.add('packages-accordion-content-img');

  const accordionContentImg = document.createElement('img');
  accordionContentImg.classList.add('accordion-content-img');
  accordionContentImg.src = 'https://picsum.photos/200/100';
  packagesAccordionContentImg.append(accordionContentImg);

  const packagesAccordionContentText = document.createElement('div');
  packagesAccordionContentText.classList.add('packages-accordion-content-text');

  const accordionContentTextTitle = document.createElement('p');
  accordionContentTextTitle.classList.add('accordion-content-text-title');
  accordionContentTextTitle.textContent = '"M Sport" package';

  const accordionContentText = document.createElement('p');
  accordionContentText.classList.add('accordion-content-text');
  accordionContentText.textContent = 'package contents';

  const accordionContentList = document.createElement('ul');
  for (let i = 0; i < 10; i += 1) {
    const accordionContentListEle = document.createElement('li');
    accordionContentListEle.textContent = '+ Stof "Trigon" / Sensatec | Black';
    accordionContentList.append(accordionContentListEle);
  }
  packagesAccordionContentText.append(
    accordionContentTextTitle,
    accordionContentText,
    accordionContentList,
  );

  packagesAccordionContentWrapper.append(packagesAccordionContentImg, packagesAccordionContentText);
  packagesAccordionContainer.append(packagesAccordionHeader, packagesAccordionContentWrapper);
  carSpecPackagesContainer.append(packagesAccordionContainer);

  carSpecPackagesWrapper.append(carSpecPackagesTitle, carSpecPackagesContainer);

  // Options---------->
  const carSpecDetailsWrapper = document.createElement('div');
  carSpecDetailsWrapper.classList.add('car-spec-details-wrapper');

  const carSpecDetailsTitle = document.createElement('h2');
  carSpecDetailsTitle.classList.add('car-spec-details-title');
  carSpecDetailsTitle.textContent = 'Options.';

  const specDetailsContainer = document.createElement('div');
  specDetailsContainer.classList.add('spec-details-container');

  const specDetailsContainerWrapper = document.createElement('div');
  specDetailsContainerWrapper.classList.add('spec-details-container-wrapper');

  for (let i = 0; i <= 12; i += 1) {
    const carSpecDetailsContainer = document.createElement('div');
    carSpecDetailsContainer.classList.add('car-spec-details-container');

    const specDetailsImg = document.createElement('div');
    specDetailsImg.classList.add('spec-details-img');

    const specImg = document.createElement('img');
    specImg.classList.add('spec-img');
    specImg.src = 'https://picsum.photos/200/100';
    specDetailsImg.append(specImg);

    const specDetailsTextContainer = document.createElement('div');
    specDetailsTextContainer.classList.add('spec-details-text-container');
    const specDetailsIcon = document.createElement('div');
    specDetailsIcon.classList.add('spec-details-Icon');
    const specDetailsIconButton = document.createElement('i');
    specDetailsIconButton.classList.add('spec-details-Icon-Button', 'icon-info-i');
    specDetailsIcon.append(specDetailsIconButton);
    const specDetailsText = document.createElement('span');
    specDetailsText.classList.add('spec-details-text');
    specDetailsText.textContent = 'Attachment for child seat i-Size passenger seat (S0478)';

    const specPopoverWrapper = document.createElement('span');
    specPopoverWrapper.classList.add('spec-popover-wrapper');

    const specPopoverContainer = document.createElement('div');
    specPopoverContainer.classList.add('spec-popover-container');

    const specPopoverTitle = document.createElement('div');
    specPopoverTitle.classList.add('spec-popover-title');
    specPopoverTitle.textContent = 'Attachment for child seat i-Size passenger seat (S0478)';

    const specPopoverImg = document.createElement('img');
    specPopoverImg.classList.add('spec-popover-img');
    specPopoverImg.src = 'https://picsum.photos/200/100';

    const specPopoverDec = document.createElement('div');
    specPopoverDec.classList.add('spec-popover-dec');
    specPopoverDec.textContent = 'Connection for a child seat i-Size seat in the passenger seat';

    const specPopoverCloseButton = document.createElement('div');
    specPopoverCloseButton.classList.add('spec-popover-close-button');

    specPopoverContainer.append(
      specPopoverTitle,
      specPopoverImg,
      specPopoverDec,
      specPopoverCloseButton,
    );

    specPopoverWrapper.append(specPopoverContainer);

    specDetailsTextContainer.append(specDetailsIcon, specDetailsText, specPopoverWrapper);

    carSpecDetailsContainer.append(specImg, specDetailsTextContainer);
    specDetailsContainerWrapper.append(carSpecDetailsContainer);
  }
  const specDetailsShowMoreContainer = document.createElement('div');
  specDetailsShowMoreContainer.classList.add('spec-details-showMore-container');

  const specDetailsShowMoreButton = document.createElement('i');
  specDetailsShowMoreButton.classList.add('spec-details-showMore-button');

  const specDetailsShowMoreText = document.createElement('span');
  specDetailsShowMoreText.classList.add('spec-details-showMore-text');
  specDetailsShowMoreText.textContent = 'Show more';

  specDetailsShowMoreContainer.append(specDetailsShowMoreButton, specDetailsShowMoreText);

  specDetailsContainer.append(specDetailsContainerWrapper, specDetailsShowMoreContainer);
  carSpecDetailsWrapper.append(carSpecDetailsTitle, specDetailsContainer);
  stockDetailsWrapper.append(
    engineDetailsWrapper,
    ElementsDesignContainer,
    carSpecPackagesWrapper,
    carSpecDetailsWrapper,
  );
}

function pagination(meta, getStockLocatorVehicles) {
  const pageOffset = meta.offset;
  const pageLimit = meta.limit;
  const pageCount = meta.count;
  const totalPages = Math.ceil(pageCount / pageLimit);
  const currentPage = Math.floor(pageOffset / pageLimit) + 1;

  const vehicleCountWrapper = document.querySelector('.vehicle-count-wrapper');
  if (vehicleCountWrapper) {
    vehicleCountWrapper.remove();
  }
  // eslint-disable-next-line no-use-before-define
  createVehicleCountWrapper(pageOffset, pageLimit, pageCount);
  if (getStockLocatorVehicles.data.length === 0) {
    const noDataDiv = document.createElement('div');
    noDataDiv.classList.add('fallback-container');
    if (!document.querySelector('.fallback-container')) {
      noDataDiv.textContent = fallbackBanner;
      document.querySelector('.dropdown-container').appendChild(noDataDiv);
    }
  } else {
    removeFallbackBannerDOM();
  }
  if (pageCount > pageLimit) {
    // eslint-disable-next-line no-use-before-define
    loadMorePage(
      currentPage,
      totalPages,
      pageOffset,
      pageLimit,
      pageCount,
      getStockLocatorVehicles,
    );
  } else {
    const showMoreButton = document.querySelector('.show-more-button');
    if (showMoreButton) {
      showMoreButton.remove();
    }
  }
}

function createVehicleCountWrapper(pageOffset, pageLimit, pageCount) {
  const vehicleCountWrapper = document.createElement('div');
  vehicleCountWrapper.classList.add('vehicle-count-wrapper');
  vehicleCountWrapper.textContent = `${Math.min(pageOffset + pageLimit, pageCount)} out of ${pageCount} vehicles`;
  document.querySelector('.card-tile-wrapper').appendChild(vehicleCountWrapper);
}

function loadMorePage(
  currentPage,
  totalPages,
  pageOffset,
  pageLimit,
  pageCount,
  getStockLocatorVehicles,
) {
  let showMoreContainer = document.querySelector('.show-more-container');
  if (showMoreContainer) {
    showMoreContainer.remove();
  }
  showMoreContainer = document.createElement('div');
  showMoreContainer.classList.add('show-more-container');

  const showMoreButton = document.createElement('button');
  showMoreButton.textContent = 'Load More';
  showMoreButton.classList.add('show-more-button');
  showMoreContainer.append(showMoreButton);

  document.querySelector('.card-tile-wrapper').append(showMoreContainer);

  showMoreButton.addEventListener('click', () => {
    const showMoreURLData = document.body.getAttribute('data-vehicle-url');
    // eslint-disable-next-line no-use-before-define
    constructShowMoreUrl(
      showMoreURLData,
      pageOffset,
      pageLimit,
      currentPage,
      pageCount,
      getStockLocatorVehicles,
    );
  });
}

// eslint-disable-next-line max-len, no-shadow
function showResulsHandler(vehicleURL) {
  const showResultContainer = document.createElement('div');
  showResultContainer.classList.add('show-result-container');
  const showResultButton = document.createElement('button');
  showResultButton.textContent = 'Show results';
  showResultButton.classList.add('show-result');
  showResultContainer.appendChild(showResultButton);
  document.querySelector('.stock-locator-model-detail-definition-specification').appendChild(showResultContainer);
  showResultButton.addEventListener('click', async () => {
    // eslint-disable-next-line no-use-before-define
    closeModelPopup();
    const getStockLocatorSelectedFilter = await getStockLocatorFiltersData(vehicleURL);
    // eslint-disable-next-line no-use-before-define
    updateFilterDropDownValuePostSelection(getStockLocatorSelectedFilter?.data?.attributes);
    const getStockLocatorVehicles = await getStockLocatorVehiclesData(vehicleURL);
    cardTiles(getStockLocatorVehicles);
  });
}

const allFetchedVehicles = {
  data: [],
  meta: {},
};

async function constructShowMoreUrl(
  showMoreURLData,
  pageOffset,
  limit,
  currentPage,
  pageCount,
  getStockLocatorVehicles,
) {
  // Calculate the new offset based on current page and limit
  const offset = currentPage * limit;
  // Construct the URL with necessary parameters
  const urlParams = new URLSearchParams({
    limit,
    sortdirection: 'desc',
    offset,
    sortby: 'price',
  });

  const fullUrl = `${showMoreURLData}&${urlParams.toString()}`;
  document.querySelector('body').setAttribute('data-show-more-url', fullUrl);
  const showMoreCardRes = await getShowMoreCards(fullUrl);
  if (showMoreCardRes?.data) {
    allFetchedVehicles.data = Array.isArray(getStockLocatorVehicles.data)
      ? getStockLocatorVehicles.data : [];
    allFetchedVehicles.data = allFetchedVehicles.data.concat(showMoreCardRes.data);
    allFetchedVehicles.meta = showMoreCardRes.meta || {};
  }
  cardTiles(allFetchedVehicles);

  if (offset + limit >= pageCount) {
    const showMoreButton = document.querySelector('.show-more-button');
    showMoreButton.classList.add('hidden');
  }
}

function toggleButtonFunction() {
  const toggleButtons = document.querySelector('.accordion-toggle-icon');
  const toggleWindows = document.querySelector('.packages-accordion-content-wrapper');
  // const showMoreToggleButton = document.querySelector('.spec-details-showMore-button');
  // const specDetailsWindow = document.querySelector('spec-details-container-wrapper');

  toggleButtons.addEventListener('click', () => {
    if (toggleWindows.style.display === 'flex') {
      toggleWindows.style.display = 'none';
      toggleButtons.classList.add('down-arrow');
      toggleButtons.classList.remove('up-arrow');
    } else {
      toggleWindows.style.display = 'flex';
      toggleButtons.classList.add('up-arrow');
      toggleButtons.classList.remove('down-arrow');
    }
  });

  const showMoreToggleButton = document.querySelector('.spec-details-showMore-button');
  const specDetailsWindow = document.querySelector('.spec-details-container-wrapper');

  showMoreToggleButton.addEventListener('click', () => {
    if (specDetailsWindow.style.height === '600px' || specDetailsWindow.style.height === '') {
      specDetailsWindow.style.height = 'max-content';
      showMoreToggleButton.classList.add('up-arrow');
      showMoreToggleButton.classList.remove('down-arrow');
    } else {
      specDetailsWindow.style.height = '600px';
      showMoreToggleButton.classList.add('down-arrow');
      showMoreToggleButton.classList.remove('up-arrow');
    }
  });
}

function createPopover() {
  const infoButtons = document.querySelectorAll('.spec-details-Icon-Button');
  const popupTexts = document.querySelectorAll('.spec-popover-container');
  const closeButtons = document.querySelectorAll('.spec-popover-close-button');

  infoButtons.forEach((infoButton, index) => {
    const popupText = popupTexts[index];
    const closeButton = closeButtons[index];
    infoButton.addEventListener('click', () => {
      popupText.style.display = 'block';
    });

    closeButton.addEventListener('click', () => {
      popupText.style.display = 'none';
    });

    // Optional: Click outside to close the popup
    document.addEventListener('click', (event) => {
      if (!popupText.contains(event.target) && !infoButton.contains(event.target)) {
        popupText.style.display = 'none';
      }
    });
  });
}

function popupButton() {
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

/* on Page load call the Vehicle API */

async function vehicleFiltersAPI() {
  const getStockLocatorVehicles = await getStockLocatorVehiclesData();
  // sortVehiclesByPrice(getStockLocatorVehicles);
  cardTiles(getStockLocatorVehicles);
}

let debounceTimer;

async function handleCheckBoxSelection() {
  const filterLists = document.querySelectorAll('.filter-list');
  const selectedValues = {};
  filterLists.forEach((filterList) => {
    const filterLabelHeading = filterList.previousElementSibling;
    const checkboxes = filterList.querySelectorAll('.filter-checkbox');
    const headingText = filterLabelHeading.textContent;
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', async () => {
        if (checkbox.checked) {
          if (!filterLabelHeading.classList.contains('is-active')) {
            filterLabelHeading.classList.add('is-active');
          }
          if (!selectedValues[headingText]) {
            selectedValues[headingText] = [];
          }
          if (!selectedValues[headingText].includes(checkbox.id)) {
            selectedValues[headingText].push(checkbox.id);
          }
        } else {
          const index = selectedValues[headingText]?.indexOf(checkbox.id);
          if (index !== -1) {
            selectedValues[headingText]?.splice(index, 1);
          }
          // Remove is-active class if no checkbox is selected for this heading
          if (selectedValues[headingText]?.length === 0) {
            filterLabelHeading.classList.remove('is-active');
          }
        }

        // Debounce the API call
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
          // update the filter DOM value after selection
          // update the Vehicle DOM after selection
          // eslint-disable-next-line no-use-before-define
          updateSelectedValues(selectedValues);
          // eslint-disable-next-line no-use-before-define
          vehicleURL = constructVehicleUrl(selectedValues);
          const getStockLocatorSelectedFilter = await getStockLocatorFiltersData(vehicleURL);
          // eslint-disable-next-line no-use-before-define
          updateFilterDropDownValuePostSelection(getStockLocatorSelectedFilter?.data?.attributes);
          const getStockLocatorVehicles = await getStockLocatorVehiclesData(vehicleURL);
          cardTiles(getStockLocatorVehicles);
        }, 300); // 300ms delay
      });
    });
  });
}

async function updateSelectedValues(newValues) {
  const viewportwidth = window.innerWidth;
  const mergedValues = { ...newValues };
  const existingSelectedValues = JSON.parse(document.querySelector('body').getAttribute('data-selected-values')) || {};
  // Merge existing values with new values
  // eslint-disable-next-line no-restricted-syntax
  for (const [heading, valuesArray] of Object.entries(existingSelectedValues)) {
    if (valuesArray.length > 0) {
      if (!mergedValues[heading]) {
        mergedValues[heading] = [];
      }
      mergedValues[heading] = Array.from(new Set([...mergedValues[heading], ...valuesArray]));
    }
  }
  const selectedList = document.querySelector('.series-selected-list');

  if (viewportwidth > 1024) {
    selectedList.innerHTML = '';
  }
  let hasSelectedValues = false;

  // eslint-disable-next-line no-restricted-syntax, no-unused-vars
  for (const [heading, valuesArray] of Object.entries(mergedValues)) {
    if (valuesArray.length > 0) {
      hasSelectedValues = true;
      valuesArray.forEach((value) => {
        const valueElement = document.createElement('div');
        valueElement.classList.add('selected-filter-value');
        const eleSpan = document.createElement('span');
        eleSpan.textContent = value;
        const cancelElement = document.createElement('a');
        cancelElement.classList.add('cancel-filter');
        valueElement.append(eleSpan, cancelElement);
        selectedList.append(valueElement);
      });
    }
  }

  // Store the merged selected values back to data-attribute or other storage
  document.querySelector('body').setAttribute('data-selected-values', JSON.stringify(mergedValues));

  // Reset button management
  const existingResetButton = document.querySelector('.reset-filter-not-desktop');
  // eslint-disable-next-line no-shadow
  const viewport = window.innerWidth;
  if (viewport <= 768 && hasSelectedValues && !existingResetButton) {
    // eslint-disable-next-line no-use-before-define, no-undef
    // const resetFilterElement = createResetFilterButton(mergedValues);
  } else if (viewport > 768 && !document.querySelector('.reset-filter') && hasSelectedValues) {
    const resetFilterElement = document.createElement('div');
    resetFilterElement.classList.add('reset-filter');
    const resetSpan = document.createElement('span');
    resetSpan.textContent = 'Reset The filters';
    const resetAnchor = document.createElement('a');
    resetAnchor.classList.add('reset-filter-link');
    resetFilterElement.append(resetSpan, resetAnchor);

    selectedList.insertBefore(resetFilterElement, selectedList.firstChild);
    resetFilterElement.addEventListener('click', () => {
      // eslint-disable-next-line no-use-before-define
      resetAllFilters(mergedValues);
    });
  }
  handleCancelSelectedValue(mergedValues);
}

async function handleMobileSeriesFilter() {
  const dropdowns = document.querySelectorAll('.filter-list');
  const selectedValue = {};
  dropdowns.forEach((dropdown) => {
    const filterLabelHeading = dropdown.previousElementSibling;
    const headingText = filterLabelHeading.textContent;
    const filterItems = dropdown.querySelectorAll('.filter-item');

    filterItems.forEach((item) => {
      const checkbox = item.children[0];
      const label = item.querySelector('label');

      // Add event listener for the checkbox and label
      [item, label].forEach((element) => {
        element.addEventListener('click', (event) => {
          event.stopPropagation();
          if (event.target === label || event.target === checkbox) {
            checkbox.checked = !checkbox.checked;
          }
          item.classList.toggle('selected-filter', checkbox.checked);
          if (checkbox.checked) {
            if (!filterLabelHeading.classList.contains('is-active')) {
              filterLabelHeading.classList.add('is-active');
            }
            if (!selectedValue[headingText]) {
              selectedValue[headingText] = [];
            }
            if (!selectedValue[headingText].includes(checkbox.id)) {
              selectedValue[headingText].push(checkbox.id);
            }
          } else {
            const index = selectedValue[headingText]?.indexOf(checkbox.id);
            if (index !== -1) {
              selectedValue[headingText]?.splice(index, 1);
            }
            // Remove is-active class if no checkbox is selected for this heading
            if (selectedValue[headingText]?.length === 0) {
              filterLabelHeading.classList.remove('is-active');
            }
          }
          // Debounce the API call
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(async () => {
            // update the filter DOM value after selection
            // update the Vehicle DOM after selection
            // eslint-disable-next-line no-use-before-define
            updateSelectedValues(selectedValue);
            // eslint-disable-next-line no-use-before-define
            vehicleURL = constructVehicleUrl(selectedValue);
            const getStockLocatorSelectedFilter = await getStockLocatorFiltersData(vehicleURL);
            // eslint-disable-next-line no-use-before-define
            updateFilterDropDownValuePostSelection(getStockLocatorSelectedFilter?.data?.attributes);
            const getStockLocatorVehicles = await getStockLocatorVehiclesData(vehicleURL);
            cardTiles(getStockLocatorVehicles);
            showResulsHandler(vehicleURL);
          }, 300); // 300ms delay
        });
      });
    });
  });
}

function updateFilterDropDownValuePostSelection(newFilterData) {
  /* need to update the dropdown value on basis of new filteredData */
  // eslint-disable-next-line no-use-before-define
  newProcessFilterData(newFilterData?.series, 'series');
  // eslint-disable-next-line no-use-before-define
  newProcessFilterData(newFilterData?.fuel, 'fuel');
  // eslint-disable-next-line no-use-before-define
  newProcessFilterData(newFilterData?.driveType, 'driveType');
}

function constructVehicleUrl(selectedValues) {
  // Define a mapping for filter keys to their corresponding query parameter names
  const keyMapping = {
    Drivetrain: 'driveType',
    'Fuel Type': 'fuel',
    Series: 'series',
  };

  // Get the current URL
  const currentUrl = new URL(window.location.href);
  const searchParams = new URLSearchParams(currentUrl.search);
  const mergeValues = (key, newValues) => {
    if (newValues && newValues.length > 0) {
      const existingValues = searchParams.get(key) ? searchParams.get(key).split(',') : [];
      const mergedValues = Array.from(new Set([...existingValues, ...newValues]));
      const encodedValues = mergedValues.map((value) => encodeURIComponent(value));
      searchParams.set(key, encodedValues.join(','));
    } else {
      searchParams.delete(key);
    }
  };

  // Iterate over selectedValues and update searchParams for each key
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, values] of Object.entries(selectedValues)) {
    if (values && values.length > 0) {
      const queryKey = keyMapping[key] || key;
      mergeValues(queryKey, values);
    } else {
      const queryKey = keyMapping[key] || key;
      searchParams.delete(queryKey);
    }
  }

  const paramsString = Array.from(searchParams).map(([key, value]) => `${key}=${value}`).join('&');
  const newUrl = `${currentUrl.pathname}?${paramsString}`;
  // eslint-disable-next-line no-restricted-globals
  history.replaceState(null, '', newUrl);
  document.querySelector('body').setAttribute('data-vehicle-url', paramsString);
  return paramsString;
}

function resetAllFilters(values) {
  const checkboxes = document.querySelectorAll('.filter-checkbox');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
  const filterLabels = document.querySelectorAll('.filter-label-heading');
  filterLabels.forEach((label) => {
    label.classList.remove('is-active');
  });

  values.DriveTrain = '';
  values.FuelType = '';
  values.Series = '';
  values.Drivetrain = '';
  values['Fuel Type'] = '';

  document.querySelector('body').removeAttribute('data-selected-values');
  // eslint-disable-next-line no-use-before-define
  updateSelectedValues(values);
  removeFallbackBannerDOM();
  vehicleURL = constructVehicleUrl(values);
  // eslint-disable-next-line no-use-before-define
  createStockLocatorFilter(globalFilterData, dropDownContainer);
  vehicleFiltersAPI();
  handleCheckBoxSelection();
}

// function createResetFilterButton(values) {
//   const resetFilterElement = document.createElement('div');
//   resetFilterElement.classList.add('reset-filter-');

//   const resetAnchor = document.createElement('a');
//   resetAnchor.textContent = 'Reset The filters';
//   resetFilterElement.append(resetAnchor);
//   resetFilterElement.addEventListener('click', () => {
//     resetAllFilters(values); // Updated to not pass `values` directly
//   });
//   return resetFilterElement;
// }

function showFilterLabel(typeKey) {
  let filterLabel;
  const filterLabelHeading = typeKey.charAt(0).toUpperCase() + typeKey.slice(1);
  if (filterLabelHeading === 'DriveType') {
    filterLabel = 'Drivetrain';
  }
  if (filterLabelHeading === 'Fuel') {
    filterLabel = 'Fuel Type';
  }
  if (filterLabelHeading === 'Series') {
    filterLabel = 'Series';
  }
  return filterLabel;
}

function stockLocatorFilterDom(filterData, typeKey, dropDownContainer) {
  // Check if the filter list already exists
  let filterList = document.querySelector(`.${typeKey}-list`);
  let selectedFilterList = document.querySelector(`.${typeKey}-selected-list`);

  if (!filterList) {
    // Create DOM elements if they do not exist
    const boxContainer = document.createElement('div');
    boxContainer.classList.add('box-container', `${typeKey}-box`);

    const filterContainer = document.createElement('div');
    filterContainer.classList.add('stock-locator-container', `${typeKey}-container`);

    const filterWrapperContainer = document.createElement('div');
    filterWrapperContainer.classList.add('filter-wrapper', `${typeKey}-wrapper`);

    const mobilefilterWrapperLabel = document.createElement('span');
    mobilefilterWrapperLabel.classList.add('mobile-filter-wrapper', `${typeKey}-wrapper`);
    mobilefilterWrapperLabel.textContent = 'Filter By:';

    const filterHeading = document.createElement('span');
    filterHeading.classList.add('filter-label', `${typeKey}-label`);

    const filterLabelHeading = document.createElement('div');
    filterLabelHeading.classList.add('filter-label-heading', `${typeKey}-heading`);
    filterLabelHeading.textContent = showFilterLabel(typeKey);

    filterList = document.createElement('ul');
    filterList.classList.add('filter-list', 'dropdown-list-wrapper', `${typeKey}-list`);
    selectedFilterList = document.createElement('div');
    selectedFilterList.classList.add('selected-filter-list', `${typeKey}-selected-list`);

    // Add "All" option
    const allListItem = document.createElement('li');
    allListItem.classList.add('filter-item', `${typeKey}-item`, 'not-desktop', 'selected-filter');
    const allCheckbox = document.createElement('input');
    allCheckbox.classList.add(`${typeKey}-checkbox`, 'filter-checkbox');
    allCheckbox.type = 'checkbox';
    allCheckbox.id = 'All';
    allCheckbox.checked = true;
    const allLabel = document.createElement('label');
    allLabel.htmlFor = 'All';
    allLabel.textContent = 'All';
    const tickIcon = document.createElement('i');
    tickIcon.classList.add('icon-checkmark');
    allLabel.prepend(tickIcon);
    allListItem.appendChild(allCheckbox);
    allListItem.appendChild(allLabel);
    filterList.appendChild(allListItem);

    filterWrapperContainer.appendChild(mobilefilterWrapperLabel);
    filterContainer.appendChild(filterHeading);
    filterContainer.appendChild(filterWrapperContainer);
    filterWrapperContainer.appendChild(filterLabelHeading);
    filterWrapperContainer.appendChild(filterList);
    boxContainer.appendChild(filterWrapperContainer);
    filterContainer.appendChild(boxContainer);
    dropDownContainer.append(filterContainer, selectedFilterList);
    document.querySelector('.stock-locator-model-detail-definition-specification').append(dropDownContainer);
  } else {
    // Clear existing filter list items
    filterList.innerHTML = '';

    // Update "All" option
    const allListItem = document.createElement('li');
    allListItem.classList.add('filter-item', `${typeKey}-item`, 'not-desktop', 'selected-filter');
    const allCheckbox = document.createElement('input');
    allCheckbox.classList.add(`${typeKey}-checkbox`, 'filter-checkbox');
    allCheckbox.type = 'checkbox';
    allCheckbox.id = 'All';
    allCheckbox.checked = true;
    const allLabel = document.createElement('label');
    allLabel.htmlFor = 'All';
    allLabel.textContent = 'All';
    const tickIcon = document.createElement('i');
    tickIcon.classList.add('icon-checkmark');
    allLabel.prepend(tickIcon);
    allListItem.appendChild(allCheckbox);
    allListItem.appendChild(allLabel);
    filterList.appendChild(allListItem);
  }

  // Add filter data
  filterData.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.classList.add('filter-item', `${typeKey}-item`);
    const checkbox = document.createElement('input');
    checkbox.classList.add(`${typeKey}-checkbox`, 'filter-checkbox');
    checkbox.type = 'checkbox';
    checkbox.id = item.id;
    const label = document.createElement('label');
    label.htmlFor = item.id;
    label.textContent = `${item.label} (${item.count})`;
    const tickIcon = document.createElement('i');
    tickIcon.classList.add('icon-checkmark');
    label.prepend(tickIcon);
    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    filterList.appendChild(listItem);
  });

  return filterList;
}

function sortFilterResponse(data) {
  if (!data) return [];
  return data.sort((a, b) => {
    const idA = a.id.toUpperCase();
    const idB = b.id.toUpperCase();
    if (idA < idB) {
      return -1;
    }
    if (idA > idB) {
      return 1;
    }
    return 0;
  });
}

async function processFilterData(filterData, typeKey, dropDownContainer) {
  if (!filterData) return;
  const sortedFilterData = sortFilterResponse(filterData);
  const filterResponseData = [];

  sortedFilterData.forEach((data) => {
    const responseData = data || '';
    filterResponseData.push(responseData);
  });
  stockLocatorFilterDom(filterResponseData, typeKey, dropDownContainer);
}

function updateStockLocatorFilterDom(filterResponseData, typeKey) {
  const filterList = document.querySelector(`.${typeKey}-list`);
  if (!filterList) {
    // eslint-disable-next-line no-console
    console.error(`Filter list with typeKey ${typeKey} not found.`);
    return;
  }

  // Store previously selected checkbox ids
  const previouslySelected = new Set(
    Array.from(filterList.querySelectorAll('input[type="checkbox"]:checked')).map(
      (checkbox) => checkbox.id,
    ),
  );

  // Clear the existing list items
  filterList.innerHTML = '';
  // Add "All" option
  const allListItem = document.createElement('li');
  allListItem.classList.add('filter-item', `${typeKey}-item`, 'not-desktop', 'all-disabled');
  const allCheckbox = document.createElement('input');
  allCheckbox.classList.add(`${typeKey}-checkbox`, 'filter-checkbox');
  allCheckbox.type = 'checkbox';
  allCheckbox.id = 'All';
  allCheckbox.checked = true;
  const allLabel = document.createElement('label');
  allLabel.htmlFor = 'All';
  allLabel.textContent = 'All';
  allListItem.appendChild(allCheckbox);
  const tickIcon = document.createElement('i');
  tickIcon.classList.add('icon-checkmark');
  allLabel.prepend(tickIcon);
  allListItem.appendChild(allLabel);
  filterList.appendChild(allListItem);
  // Populate with new filterResponseData
  filterResponseData.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.classList.add('filter-item', `${typeKey}-item`);

    const checkbox = document.createElement('input');
    checkbox.classList.add(`${typeKey}-checkbox`, 'filter-checkbox');
    checkbox.type = 'checkbox';
    checkbox.id = item.id;
    checkbox.disabled = item.count === 0;
    // Restore the checked state if previously selected
    checkbox.checked = previouslySelected.has(item.id);
    if (previouslySelected.has(item.id)) {
      listItem.classList.add('selected-filter');
    }

    const label = document.createElement('label');
    label.htmlFor = item.id;
    label.textContent = `${item.label} (${item.count})`;
    label.prepend(tickIcon);
    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    filterList.appendChild(listItem);
  });

  // eslint-disable-next-line no-unused-expressions
  viewport >= 1024 ? handleCheckBoxSelection() : handleMobileSeriesFilter();
}

async function newProcessFilterData(filterData, typeKey) {
  if (!filterData) return;
  const sortedFilterData = sortFilterResponse(filterData);
  const filterResponseData = [];
  sortedFilterData.forEach((data) => {
    const responseData = data || '';
    filterResponseData.push(responseData);
  });
  updateStockLocatorFilterDom(filterResponseData, typeKey);
}

function createStockLocatorFilter(filterResponse, dropDownContainer) {
  processFilterData(filterResponse?.series, 'series', dropDownContainer);
  processFilterData(filterResponse?.fuel, 'fuel', dropDownContainer);
  processFilterData(filterResponse?.driveType, 'driveType', dropDownContainer);
}

// eslint-disable-next-line import/no-mutable-exports
export let sortBySelctionData;
// eslint-disable-next-line import/no-mutable-exports
export let vehicleNameSortBy;
// Function to handle single select for relevance dropdown

async function handleRelevanceSingleSelect() {
  const items = document.querySelectorAll('.filter-item-relevance');
  items.forEach((item) => {
    item.addEventListener('click', async () => {
      items.forEach((i) => i.classList.remove('selected'));
      item.classList.add('selected');
      sortBySelctionData = item.children[0].htmlFor || '';
      // eslint-disable-next-line no-use-before-define, max-len
      // vehicleNameSortBy = document.querySelector('.appear').getAttribute('data-vehicle-url') || '';
      item.parentElement.parentElement.querySelector('.filter-label-heading').textContent = item.textContent;
      const sortByresponse = await getStockLocatorVehiclesData();
      cardTiles(sortByresponse);
    });
  });
}

// Function to create the relevance dropdown
function createRelevanceDropdown(dropDownContainer) {
  const filterWrapperContent = document.createElement('div');
  filterWrapperContent.classList.add('stock-locator-container', 'relevance');
  const filterWrapper = document.createElement('div');
  filterWrapper.className = 'filter-wrapper';
  const filterLabelHeading = document.createElement('div');
  filterLabelHeading.className = 'filter-label';
  filterLabelHeading.textContent = 'Sort by:';
  filterWrapper.appendChild(filterLabelHeading);
  const filterList = document.createElement('ul');
  filterList.classList.add('filter-list', 'dropdown-list-wrapper');
  const filterLabelDefault = document.createElement('div');
  filterLabelDefault.className = 'filter-label-heading';
  filterLabelDefault.textContent = 'Descending price (default)';
  filterWrapper.appendChild(filterLabelDefault);
  filterWrapper.appendChild(filterList);
  const sortOptions = [
    { id: 'desc', text: 'Descending price' },
    { id: 'asc', text: 'Ascending price' },
  ];
  sortOptions.forEach((option) => {
    const listItem = document.createElement('li');
    listItem.className = 'filter-item-relevance';

    const label = document.createElement('label');
    label.setAttribute('for', option.id);
    label.textContent = option.text;

    listItem.appendChild(label);
    filterList.appendChild(listItem);
  });

  filterWrapperContent.append(filterWrapper);
  dropDownContainer.append(filterWrapperContent);

  document.querySelector('.stock-locator-model-detail-definition-specification').append(dropDownContainer);
  handleRelevanceSingleSelect();
}

//  added filterUi for Tablet
function closeModelPopup() {
  const parentWrapper = document.querySelector('.stock-locator-model-detail-definition-specification-wrapper');
  parentWrapper.classList.remove('filter-model-popup');
  const dropdown = document.querySelector('.dropdown-container');
  const resetFilterNotDesktop = document.querySelector('.reset-filter');
  const relevanceContent = document.querySelector('.relevance-container');
  const filterBtn = document.querySelector('.filter-container');
  dropdown.style.display = 'none';
  if (resetFilterNotDesktop) {
    resetFilterNotDesktop.style.display = 'none';
  }
  relevanceContent.style.display = 'flex';
  filterBtn.style.display = 'flex';
}

function setResetFilterBtn(hasSelectedValues) {
  const selectedList = document.querySelector('.series-selected-list');
  // Reset button management
  if ((!document.querySelector('.reset-filter') && hasSelectedValues) || (!document.querySelector('.reset-filter') && viewport <= 1024)) {
    const resetFilterElement = document.createElement('div');
    resetFilterElement.classList.add('reset-filter');
    const resetSpan = document.createElement('span');
    resetSpan.textContent = 'Reset The filters';
    const resetAnchor = document.createElement('a');
    resetAnchor.classList.add('reset-filter-link');
    resetFilterElement.append(resetSpan, resetAnchor);
    selectedList.insertBefore(resetFilterElement, selectedList.firstChild);
    resetFilterElement.addEventListener('click', () => {
      resetAllFilters({});
    });
  }
}

// open filter button for tablet -
function openFilterPopup() {
  const parentWrapper = document.querySelector('.stock-locator-model-detail-definition-specification-wrapper');
  parentWrapper.classList.add('filter-model-popup');
  const filterPopupContainer = document.createElement('div');
  filterPopupContainer.classList.add('filter-popup-container');
  const closeFilterPopupButton = document.createElement('a');
  closeFilterPopupButton.classList.add('close-filter-popup');
  const dropdown = document.querySelector('.dropdown-container');
  const relevanceContent = document.querySelector('.relevance-container');
  const filterBtn = document.querySelector('.filter-container');
  const resetFilterNotDesktop = document.querySelector('.reset-filter');
  parentWrapper.append(closeFilterPopupButton);
  dropdown.style.display = 'flex';
  if (resetFilterNotDesktop) {
    resetFilterNotDesktop.style.display = 'flex';
  }
  relevanceContent.style.display = 'none';
  filterBtn.style.display = 'none';
  closeFilterPopupButton.addEventListener('click', closeModelPopup);
  setResetFilterBtn();
}

function openFiltersBtn() {
  const sortAndFilterText = document.createElement('h2');
  sortAndFilterText.classList.add('sort-filter-text-mobile');
  // placeholder value needs to add here
  sortAndFilterText.textContent = 'Sort and filter';
  const relevanceContainer = document.createElement('div');
  relevanceContainer.classList.add('relevance-container');
  const filterContainer = document.createElement('div');
  filterContainer.classList.add('filter-container');
  const filterBtnOpen = document.createElement('a');
  filterBtnOpen.classList.add('filter-btn');
  const icon = document.createElement('i');
  icon.classList.add('icon-filter');
  const btnSpan = document.createElement('span');
  filterBtnOpen.append(icon, btnSpan);
  btnSpan.innerHTML = 'All Filters';
  filterContainer.append(filterBtnOpen);
  // const resetFilterElement = createResetFilterButton();
  document?.querySelector('.stock-locator-model-detail-definition-specification.block').append(sortAndFilterText, filterContainer);
  createRelevanceDropdown(relevanceContainer);
  filterBtnOpen.addEventListener('click', openFilterPopup);
}

let globalFilterData = {};
async function stockLocatorFiltersAPI(dropDownContainer) {
  const stockLocatorFilterResponse = await getStockLocatorFiltersData();
  const stockLocatorFilterData = stockLocatorFilterResponse.data.attributes;
  globalFilterData = stockLocatorFilterData;
  createStockLocatorFilter(stockLocatorFilterData, dropDownContainer);
}

async function getContentFragmentData(disclaimerCFPath, gqlOrigin) {
  const endpointUrl = gqlOrigin + disclaimerGQlEndpoint + disclaimerCFPath.innerText;
  const response = await fetch(endpointUrl);
  return response.json();
}

export function createLoadingIconDom() {
  const loadingIcon = document.createElement('div');
  const loadSpinnerContainer = document.createElement('img');
  loadSpinnerContainer.classList.add('loader-spinner');
  loadingIcon.classList.add('loading-icon');
  loadingIcon.appendChild(loadSpinnerContainer);
  document.querySelector('.stock-locator-model-overview-properties-container').append(loadingIcon);
}

export function hideLoadingIcon() {
  const loadSpinnerContainer = document.querySelector('.loading-icon');
  if (loadSpinnerContainer) {
    loadSpinnerContainer.classList.add('hidden');
  }
}

export function showLoadingIcon() {
  const loadSpinnerContainer = document.querySelector('.loading-icon');
  if (loadSpinnerContainer) {
    loadSpinnerContainer.classList.remove('hidden');
  }
}
const dropDownContainer = document.createElement('div');

/** **** details page function ***** */

function buildLabelDOM(labelResponse) {
  // console.log(labelResponse);
}

function buildExterioInteriosDOM(createOptionDOM, optionsData) {
  const exteriorValue = optionsData.data.attributes.exterior;
  const interiorValue = optionsData.data.attributes.interior;
  const intExtContainer = document.createElement('div');
  intExtContainer.classList.add('elements-design-container');

  // Function to create and return the section title
  function createSectionTitle(titleText) {
    const designElementsTitle = document.createElement('h2');
    designElementsTitle.classList.add('design-elements-title');
    designElementsTitle.textContent = titleText;
    return designElementsTitle;
  }

  // Create and append Exterior section if there is exterior data
  if (Object.keys(exteriorValue).length > 0) {
    const designEle = document.createElement('div');
    designEle.classList.add('design-elements');

    // Create the title and wrapper
    const designTitle = createSectionTitle('Exterior');
    const designWrapper = document.createElement('div');
    designWrapper.classList.add('elements-container');

    Object.entries(exteriorValue).forEach(([key, value]) => {
      const container = document.createElement('div');
      container.classList.add('elements-image-container');
      container.innerHTML = `
          <img class="elements-image" src="data:image/webp;base64,UklGRqwEAABXRUJQVlA4IKAEAACQKQCdASodAaEAPmkskEWloqGYv8QMWAaEtKX/vftxf1jj/wiTuf35nq/2lORu971n/jf67eo+kb7rHN/BN0/7/+j/Zpu2e8/8a4AtTIFsxjLGMsYyxjLGCfM7Pbv959OgpCvFj3KktG3AMlGWA2QP3sz7LvfGWgfAnpq15BEdQnm5X2HLe69e2Qml+O6I1QT7PMhNFlQJQ1Tqal+o9FSPXzZoKFObDvJB05e6GVRDER9J40+h/p8E2bp8pTVc1ZVle/dIsNbxfocRX5O7ZUP4WWlBTiRIctL4e5kRsd8O7SNiIUXnxvGjRI/N2BHdlllTOJYDIxHTJMvqahmkBcCDyeRlwMwkRNmvYylJcEqkToyg/9O581wW8sH2YQSjASjRsYKjZL5hBSXBKrOkUpLglVnP9jvNPDvJQ2HmlmEFJcEqs6hBSXBEl2MZYxljGWMZYxldgAD+9LP/gP48D/5eGLWicfxkNA448pA7M+LBt7WoDFG6pdSRb1scPgjoznJXSntZGKiGTgFxm0wewZUqo2U9qdb9uxaEVg60qnNH9GfBiUyWSwrb2fI/SEd5EVVeLOVljaJyuib1o6CkOSH1VgYqcKJD9xKNfIUOAiEkTUNPIzNTztwiwLqjstdfK1X7l/nLOnvuy7noU3VoDlDryI738WOby7nIaJgAhtGbBQvFhxuENCxhkDllaAduJba6e8mO77OJ/dRNEsCbLfUjNhqPRdpdhT8TXU2b1YXBeuOYIymLuk+gRVT5Ct4qlRLk+R6cuvyS/x6eKf86JwFpApqYqZejPKbiSNp3z19Z49d5f7Maz+hz4Q06qU94HaUwmups3qOsF96FKc7A87kIdE+VyDjQdkm5BMn0zSMRm2FIKDvIrTxSQ3gvPEetn00kzB1+yJ2LZW7wROfYWgd5z8wGJte184XPrAP4ic3SIPqHFdqVo3NNR1lJ8wIkl/vgXh+R48cAyQPDeCHuGc12ajMAZyTQRaNQz0IXw7Yk8veL+5ZBanrAuMdFqBUuw+SvB8XRCcDqyrj7e6IW7gA3HcatI7EWJJ2HSD3bUA0ELDfAF636akhBjHv7T3ukVU9nsx8URG8LxGUFZ/cKUzrtAQSRp/y3NcQzWomJ6kuc4hQobjQ3Z8tR1eU0MFtEasFJaETF1HA8dnvwbfXKmawNZxo+B2iuP92ebL8kgecSYqzUH0gfV8Cfrio7b/jS7jjSxnhEMxaFLZBmLwm+/77nDz6NFrZ7sEexhTIkLH909GY+pr9LtrXGi6+DtwDov4xvqd0s1GFKxUdGiHHKOJFIm9jnVNIzSzW1rWMwJI6Lo3fclLWpNSIA3qV15jxlzYzSQCAlYYcbCrmR1c4fi6KfNFanKWXJgJfrRG4S7mOgAq6E8Ee4dhq+WZX17Wd3bfeUlEbjEkHRLwRNuqaufndwsRebdzKGQYFIsXHF6D8UQ+ojHK6j+sK94IcH4us2lh3Q03UEXtKJuhIMoJQMWDC6WGRDK7x7DuAMIvCPT1YLNgAY/p9Qg8mJVohgBWkh0HOOy2dQKuO/JvuWVUAr7a6B1Q9w5k+23hf/EbAAAAAAAA==">
        <div class="elements-text-container">
          <span class="elements-text-title"> ${value.subCategory} </span>
          <h4 class="elements-text-dec">${value.shortText}</h4>        
      `;
      designWrapper.append(container);
    });

    // Append the title and wrapper inside the design-elements div
    designEle.append(designTitle);
    designEle.append(designWrapper);
    intExtContainer.append(designEle);
  }

  // Create and append Interior section if there is interior data
  if (Object.keys(interiorValue).length > 0) {
    const designEle = document.createElement('div');
    designEle.classList.add('design-elements');

    // Create the title and wrapper
    const designTitle = createSectionTitle('Interior');
    const designWrapper = document.createElement('div');
    designWrapper.classList.add('elements-container');

    Object.entries(interiorValue).forEach(([key, value]) => {
      const container = document.createElement('div');
      container.classList.add('elements-image-container');
      container.innerHTML = `
        <img class="elements-image" src="data:image/webp;base64,UklGRvYuAABXRUJQVlA4IOouAADQiwCdASodAaEAPm0skEWkIqGYCu5AQAbEs6I7kIet51Ab4Ooooxd6P7vjrQs+ljbd8+1pt/8U9QDz3fWm/7PSAf/vLReR2JH6X74G1Za3+L8A/7//S89n+X3o/s/iBYr/8rseOF/5XoHYQf6fmP/N+oB/hvPX/ueB9+F/53sBfor1ev9Lxufuv/L9hH+6/8r06////7vgx+8////+Hw1/u4FaQ987e0fLoEnvGse1IU40gPqXGhnjOMViaiR5C0wgrHMjertHib6YlKTX7qrKgw1dvObnKAtdX5sh9M5ZEmmjMAixyT+FCnDku8euBEEYFQGaGSl5T3jD9hpXJsBcGqCKQkC/hg50F1N0mR1x4z64qtTrdM4RDynxUbEcc5F9HaVR8BAyf25PkCOy7+opWYgbxwasL+EnEmIObkoLRakkkmSGPOgcSami7lm3FX7+DFbRR1Et5sVMw/gRLRPH7vIBH0PUL9sncBTqkwEpm8+GKpHumt4CdfxFZmbMwSX8nX3mV4WIQip/IypPEzOztj+thiSk/GGS7yCFrdohWXTDtOSkZds/VPQqYdzX7u93VNCoDbAbfPRCgQw8nWTvLpQO7HgPtDelxVj1WdLl+bWef7ofPWGeutdIGMwGqhoTPghTO0b0xEApps5aNlbWJi3C4xaSpASnh//7Tw7mpw5WOP7x77NjyRPObKZYBl/TkUqgL54w7kU0ixibokZB2BrhS9XhdPa5J8foFdZFb37aOXrWexR5tkLDLzucPRxU5lEmOt6m6vR0D14XWEeMMwOBZmdaVmQBc4+j+zlfdThboquJaPvN71NiEDQ/KAjB1kqC8cf7HGl5OqN346+Ip5fqPcziefSROmVyjO3ptHci+vZTXLMNFpao8c1ZMLJnx46ffnBLqv/7z3IPO0WZwWa0JPwbYxj++dHb/OQQJk3li3uf04+KK2sxz6VSHJw3HwuHMkzDty1jhR5/2+51XK5kNftffweDWzBh1k1iAHsBlb7qF3DZZzHzh7KOJRad3e8dOMmShaCgKY8UOWVugx6Xw1mpRnBgiTNQUoiqjDDNThheUq4tVj6Kqiecu43hB5zu+IYJde/T9610gLGPWc3DAQ7ovAJMsv/no3YuBoMCnN5rsjqKlBMDOYEnB1NOZmup7JXN+HD0itVeNxZwknerrRHmRZweSJdg74T8mRlKqtGTkmJtWrw58BEIBmrdU4rHzFEYEYMrbdR/mu0cNO0ShBmBXrRLB5Re1ytyufPzVN2Dm+zPPzGjBRWYsXdTlhS5SIzFM9eyrilqrNxkPcnJ4pR3BzabbHsLKiXCnUr+mlo0OsjVREKW3F2vBwGjqbmwnFMdWmCZqU3pcIVDR+7lpZPq+i5geP2vzf/We4u8iXH0UTGHNk6fETsRNeJZQH/fCzpvbPxipgXXp+UvaUfz7Z6rnjIKIOX+M1NNBfT/tN68eI/bRTF/EaqbwHPjXJizBQsgzqIGvqsoop9VlFFPqsojAAD+7MH/Pv9A9YP2yUdryKKGrTVgI2UPzNGVz+vcFVTB04Zz5DWYQJMwTi16PP36xUyEAfjiZDo4oP0XZp/IXD8vQbnDW66hv4CErj8K8k/7sXxl88Z3VisT7z6In/bbMH1ZI1E6lWSmHunmyR1nQ5xbPsQFoB3+eSL6kRYUQ8VAm7LSA890nR1n4M8jrhBn/EmcFNogS9g+0PVaWmmQ4uL6BzOJAeobdEl2PVWAuOwSDtBVDdX6mtCApgF8EPi2Onok2qqYdnF9VywEiS8ij/aeuMlGF914gJx8E70HhCfPWJd0B3AZ+l4NHBN95nFLhUfePxyO7r7rX/XkuAYJtul4TsrFCfCkDEXzqTEYec/k4xhLCHtsBwgI1mERVsw47yiDMKFmb/a6TXKxKJqkX/UaE2vtykNDAqLeWc8cjO7PdZVY3PQRFrlkKUz6DS42EB85iUgCW4KKVfzpscs407Oig2tMQv1R86b4RBXPLelWF85SQFqRGtvd+kDuiRkmb4kK6ANC/Jpr3co9hLuQ2uXj3lF5/Tr8BKaUTa3c1KmP1Jx45sU+VZAkxOX2V95SjzdCD9M0DIxe31o3cCxNP0hNXF0VFOpVDmCL1SWJdqjspkTJJYG+LSd7t8OAGws0hSk4CtlB6uu5eZ4VFIEaldZR9YiWIln3fJdQsF2rxmZfMoYPeBwzJnNfK9aO2GCf4xE0o/G6PwQkq8rlY0eh1HKYTJWbfT+7/glXkCejFE41kDjwcseaHehJYjREeXuuwc1idbAEUFM/gMVY1R4UA+xY5jZ41hDC2l4a2od0GP9eO03ku4RsURLP8kKchSIPFfOdulDiSmcX235A++tp4tTI5MHhfXXexWHUHJE+w7BHAUnGoK3x1/XuXHekYQfP7+DBqlLUzVKVyHYZXsVA99s0bscWl2NcJOPLpH96EqBTJNdQOZ08071Ls1cX31hsfGu6BxPWKqiTKSwr6OOyb3j5k20FHYRFRquN5hfyNGDR9Hxr/DFIIynWr6JrNXXvxcFq3/yT6vKjnDwX4Qxa6lAoYII16QbE4bS8kPPYBghlC70z0+h2pOujH2ffigONvgrSwdL6tpzI1kkXU3IcVCnshQ4+wkVY2xTTYvXQD6mNuiqLIB1+YncrH6HhYQSFx90mcCVfLdD+uHv/FXvyr2jyqNd673O1szHBciFD/7dbMJ4Dlqlczmd14QQNFO0pIRODfXm0dwNqHbOFECLNuwXrLPHoDXI+mG5LVgVTICBBqqbSToSmmtSGTufBtDTpfn2PPgLmjgpNFwNFeQ/1Bhvo8giKB0N9+UUqoEBMBnPNI6bi5XW11z+g1y5YvxIENPHdULxiYW8o/mcIUCL+JTkc2toHa1RaXKUd10TKaPUCnBsnlJdGIp3EENNTjL14UP6B78LjqNGkXv6bp+mmlkWnj3xYsU3nv0ifTji73NCCvdoRNP40kPHOHanj80guf58LV5MkntOmjaxz1Qh6eY1tWXVXeKUGtqlRTuP3Je1XNpQqNhK/1iuMx4C8MaZ+80XLmIRCKJFmsnot2IEMq5ATsVzMyhKepOYK5sEOdunBPi7PedrP+10uAmvSI0o+AyUYdcBZywOHq8MQmNIHS0roslpXUXBgWbI1eeykjERnxcmzIniD36OjUkNca/aKJaSRE5fN+gWG+QRY2VSFd+6/0pYFzSWa470Ra8W/exCB2NX/9cpRixr5ITjqZf5ILPccCriIvgOopKJHGq7fAxVAEakWImEFloHGmnDIWEMbwCUcq4Q1GcX7ODGPkSyXVwX2h3IgqztybJG2lY2UsZWbkgeAEgeO42xpnuaJZ3NsEUsjKFPi5ray/r8XckvBX6zOtj/8B4FLsViiCKPcc+pWuNT+DEi7TDub29BEVJIi/YGkvfkKsDn8LYsDMs+GoO/lUN9rNQxijyVPsUZxNyAMdloqTK/AwpWYekb7lun7inPW64pPpr/2wd1ayQsGHUw0JrCrfz6rMidXYGJgn/BgWt+wetzsA8hzIAcvZAP+bY9VcH4UL9kBZVRVyuBM6CDl0tHspcENgCpLCitmU+suaIUlrtsDYE1vCqEYUs03e8VrAmyRdA4vNKR7SuS9q5GMTp7OJx2mnrw2XW2TwIqgHL0bQweLjNXfLMbvU54ecnGDQAViZJUtcoCzWpU8lUivM17xOfnBkL41c69YSp1QOXHWRs80r4x1t9HiMQqguLgSrEj3bluxUCi6HcVr3Gi9UC+myF04Rk8LfnGG4qzXqcU+zJDf7xfOTrTP6tkTaMjvR0ybba2ZxU7GBIGlybOBBUJnM+8mQeD3AWsPmKskhM3pw7lUSheI+WrLjUrpbfwBda8QgbOjwYvuZyPRnUCvDJPfd2uiqM8DtL3w4h9gwQYpLOn7HDZJCdioxfrgVYJCnqF7mXQlhWFVjxI4g/XNxCT5gzFMmV2K6VqiMPh7gNPKLqz9TuQpefLFsw/MO7dooDQs7ZXAbM7YrJcn/DvCnnSBl1zIz3M2opLrRxdDKDnKUIY8Tw5RMvUQhVAZxpZ+ordz3zYFGq7rFCiDyqBDRL/38dFTBOpPXI2HaILJHA/RR4g5KHu3me0cuEpgFmFHbtX9lARzTsDOLdkIi+xqUAe20sekcRyTcDH1T76MO5AcapHSFXXMgA9rzOFCdhpoUIPP2I/PFdmJjkkBO54OIs0hGKFmo0hrGE2tVDvKdOQHFcVvEdBj3AKYEJweKK2cc08w83Wu4JeH8cjZZGoUNirIfM1YnLadscB2D924ccjb7RZ+Z9FCb9iR0I4Bhs3ZIkFxogv7WPfPrOdoOIf9X3e3oE9vpXiqIzpLrZcejH5FaDFSPuIbpW324lLR8WTHIokHvo7l+fL9F1QCTDxTHvrkGghSSAK/+H5TfAKcWYgQQRTKdnVYWlftBkDz3GvEcOTXUjg7pL6+o0cv8EmvVdD7arv311Ff7eKHCXbHCgESFMoLCTXNqdKITPCW4QxAI71csor/qehEUREl8/PYIcOnKlV2F00+u0M4sLxuS+C9EQ7/okGt2IynoCEh/v02m1eOPzLIs0QFVYNBzCIG3XOG+sw8v+MnP3/oLUroIDWtFKM1zRgr+c2A3pJlwVqTnPnHDSL61KapacSn+J8Smy3PszQREuZ8O15L64k6hmj6MORU1Yd03B9/0bZOiCxTxG0Bakk/q2sBkjeL3Am8sOx82u6qBalcsTQnkU7rU9y/WjVqExGqXJQwcg6LzlaF5R78yZqmE9QS9TdAV6XyOY5BcYO014c+BLxdU9GMNqrTy32VOBm0QhnartM4Njf42yxgvrl81lhDqmFXTin6d5fGC+pdy31ZfivXHCMsQitXciBr5dG+++MkFb4c67ILpKYo/AKSp0cpexkkvORVfK6DJ00uWBDrZyZ8p2iQDlxJuunHJAUbOVz+hyJgFKba1YhFY8TnXNSCb9R8I069QFP+TMcE3wBbAy2bbwG/SIA53+PG/8g8rO5AMsJ6PfaLAJepVIB/Msq8UA1EWztwb8beZpABk2BI1h1YgAAkYqd8jCmjsMMHr0cNxn3AirUvgnY43/1AIT8uEXBzpA5kVaeMTdatzZUGXSYSY4aLWFJPd7R4WqlrtI7iqAbb8CB6BCRqHAE3/VYMVyWWPfNvpumKsYSxJSYtIK4PYoypDDxcPkKytnU055thFpzSOC00w0W+r26dl6llx3H3xrWM42/Z1S2LAHIaiUzYZW6jGDtglpdGJNVJruqLCgD5+eB7hcdkptBrkB28lkWcUh3ickQqli3CX65xJ8OmGZ3HbAurdPXnn/2cFBdUA5hHuRAxAeLUYHm85KqQFU4w52LG7zESkkOCIzZLDhsm+ZUKMxHCRKXkymxAqx9Oj1OhYRswAhrR56D7204JT1IlJZcEsU12PaVapQ7jRiubpwJlG5mp4nvAGB8LPCKFlPUzENzD22cua5ugWqbelwXupHrpYkyLpYObrITPRr2HIJGufmnSEUdSLGnTAlr3Ua9lSqrfvizbxRw0FuNNkXJtJjoPnWUJX6Iw3z/uCVD+AcPOcmArSXi6MQCAfFcGS8PgI6SgS7qnxOTMHluqpX0Q5LxDFE3zj/X//uhJlGlkZvvbV/o3LK5uqAco5+0TpTfVYED9n/4/bXX+PeipTfATYR1gTObL4ZHyg7p3WJlXh5AcJcrAJaruRo4cB6IGZCjkORB+Hq/PPtavDs3QaNlQoATryE+lNEoP56l8iv6UKxGVa20+rwiREmfkbXsCwrqdOFk2AOZ8gjOPA7Lf6t7fx5XDrLnEzTHfQwwtQiPTTzJ/HgMSEUYAVEskppRa1Y/4Yxl9u09I1jC0oznIGzTmJPEfBJSqIajhlKSCWAQxuo3S8cwLwIcAGAC0CPEsTbXv5nXKp+1mr7KKb00iSDWJuzsJVZOMnyH4lqnKDTOrXxrXSxZCYwwAWdMhiMFEXLp8d1XQdwHKdGr/wW+FPwM6EsLHhTP0TmKj3RzbTY7o1iwk4JKAwJD0WnNSzi72uSH3S5he5YpLPCX/jg+WoCNpyXFv8QEQPQUIrte4e/fT90Vd9dyXA8NbjqKk3vkq0gteK89zoory2UC57UAFXB3IqRrrnF1jivDr+vC0N3WZkM7CdIJY7G81H2l4WK7h4kzsfg40iAwD9VW8Nas9jR4ttyBVKVGdreiWcU7rIKohwaNBnw1OoK7sF3+sxRxdboX++UsSKwYW/L+qtnDZ3+/9Lb/VPz8ibgiEUMcPEyypMotkMLtWWu13j/Abby6VsW32C5bpxqWXk+OQMl+mTEpPgAqevnMg6rdzQps8o2zD3bdIXFzDz2k3t5JkSenUKiePgXEA0EojzAlt6xiEDwrWL1SrDaIz7WZpZR6/DULVI94ox+asWOiI7IArJUqUQtOgMq5SgTUI3sMUVY0UoX6hIykot9BBxEll3AnKj56YkxN+ikZtABkPyJZVYQlMWbT70gpTBTtDep/zCoc91hY6d7ZipSxsy4yeuLWR9AihAB/ZiLPo9JIsSOEkr8Hwp1yEHW3GoBZ2NofaLC8E1vUd3Kw6V8gdXf7B2ZjT2cHeNnuYi/ETD41R6QAVmn+TLBTMp8mAQXwYGBTyhOzMZ0/AuU675eyOgXUo0yjcfLFQIoCFeC7avO5zAEm0F90S8kM2BefDe+awVB6lREOetiOtJXZUOv+oYza2wNeaYW7qpDJKm4SYJYWAvZVMMqNuBHTXfThDzV9uBbq7QwKvNTPS/G+aK9w60QIt2wvjiHNymTZl1FTbILmkCjTlVa7UIyvug1NHvmW9f0fPXm6NNF1b/C1KSCOG4eZYLAIjwQBhyTnX0TdbE37Sciib4Qld1aQ+LSB3Bw7NFB7oQU0AQOG+SN7YFBFvkVFQ/TyIXWxwnONWdhL91AQ3bCbzQDoVaOfU6iTKDIqQa4fCuprZrqzKl22V94M5YmU559fU73AY00qZ0shhji1KOnPNqgUqqFljSdkSmEHUpFi9U/4ygBb0rZrX8PURmxs4PBkbGng5W8L8XVsN+JZF6YxTb0czxiyoa3Vfz4qb1YVOYIDina9qMtrsSNwg6PzZyb0RJ9rah0LMSWbUf+jAZGaG09aI5mzZHfPfnp2oeFAprAN+UyfOgNjdaQk0u++cA2/Cx/v25RGgIc+PIW8TTtw28+JhPwVpziiCDzNXdwjrkcqG0JEtyid5GYewPPoTjdTA0xg+Plksxioxh4z1ihblLjVWo8NY5+k187zxzFgUYUuEhNFopE+80+LarqCz+iLTtS0pZ/zOWAD8S2zka4VPcq/eXWLJKz1fcS4CQxo+0115uZSBKBpSx+7w+Dlq3M4VeWekgtpcqzkB5+0zHLNF8ARXAcWGwULQmwG9Gdd5wcQcpOv9GwD4SghX5+e4BOjx1okkKTrZ7Cxreg7r6Ruje84reOv1GhEUH1rd1xLZHMTxcE4ej3EG4Yxs7H+usu6HUdK0XoMk65pvjXyIFL7yz5NXEGWIozQiMMkA/dUzhzHGSw5qBTDeYJ3FELR9DjwIz7+/OCBGMJ/NH0Byv0irSVvHJnPIA58LeXWFqKtiia+UrlOPfRgjVdRpYRavCmwBf7mpOpOvKquEZtnSBsJxWr2N/kS1rEkHs90tVChuT8eda8gYH+sIbomA9YhicsBrJHnIq+jQcvp9ZKCXI3/YgpCNzqDqJ8seTQhJzZaMbXwV5KYLLEKK88aXLhTXIr53LFhQOlvH8kHQBZJBW/fYX2Md490pgqCk/hgdsCAL/vKGST0S2JIMV+wyDsSeG6/61ZGFc6C/paWp4ujf8VhvqdJJhN3EzG5orYvOVKGWEEn9zGYPNnEZ4JjFfDVu+hzkloiOdgAtK7rOZ7M72jrTJnitr4A8sstNJ5ubpwgzck5+Esfk3yyHmjreDIEXEiazzy7e1MarL0LoA+c6En+GjZ9/iw/FM7780le0Sz66i2rN5TwMbeEBUdFS4KLTjV7yClh8HFjcZMIFJIuIx/kmKB1uxMhpoYlRY1KgtAYdHWMaWHgLznpvU3oyXNLxTN53IvIGSnJms7D8XhHAJGrytC6EonnpUFQAUe2u8NGzD8setM6R1HnBcEqmWn3L8eYOqGbZ5gLo1vU2rjVzwdnJHfXd1Bsf/jqc9bb+7+2fGzPKyas7IMRUxT34QzBbwZkkd5KNaWxjSD5RMHZZ0ng7Hb8uV2P02QHzLYQVY8BZefK22wI3ocB/ALSz4WpmUOPW+9w2ZcViCnYAluYwvdLWedUGhoqYDbLgXVjGoeDXiGZlM51og8hF80MTB1iPXbvNshbLmOzkXMerjpcU7YRj/y4z8JmQ6vvdohWne88WL6Mkz2Ibkr2pp98C9V9YP97YUGea8Tg9tq0t54yVkbQxAwGcE9bx9SiTqXwiuWN/RGJH+mcbhXCz5lwHn+K4Ow7iVs6nVvo51MLCiYM274+njDi7W1jfOMtxJXRUOyK7kXtiStghv5OgXHXfjhoJGu/MqKbSFvRloeLXcwnadGsI6jIKkNfJ2M8WKfH3iDm0somO6IYrxoFNVwAPlPsogNPJ7+60ivuOEmOUHswccYKJ8LzO/YV1gnNhNhf4jNm5l1cVQCD7/y19bxD7a9TuDX6/XocfzjIJqmtU8bMGOyHwe0h2C6LW6jE6sYpKnqKZXF6/C6kTcjC4uh2ttrTWjxE55uC2BBTIVG8j8z6h7MLd4Yz2m8xLkItsoGrjo8hNWgp4FUHrBHI4FVyhAABGnbckcmcRezUkQ8EGY0SIcU2x+LJVWq4ZHLXUp9Eg+A+NWK+r+bJctsiQNRS8boN6/o4o2dM5WK538bq/10r6zHRqhTboWdWbvHOSXH4cfXCPRoLOd86M+e21N3vyoKSdYRiBE42FjsKqfZsghkUgn6nwq0dnjrxV3UaQUPG+fwxRTfeCXM/7KFAqNcd4dXzPxGMR/2IWFPmSVLksqtP5rst8+S8FVvlOHr9wPOaDm5TRsWKinazxQe5awO0cNJKBY2vBtF4Vq2TGvQBmt1U0t1lYVL0hx1jGbJg8KEhKra90kqu1TdCyiD/YIZ9QxaJG0IrxbeyuNKZUL7wH+HkjLyRABI7HwSmGC4INFtmPQ40/rrYm0zU5OKRWV2I5ASZy9elUQ2GZRBCx9y9rzdx1jC2T0RAB8M/BbBMOYnL5zDM27II2a7nOk8fm25+3ophEYrH6vZdYPcy8pWOm4ZoaWwFo7GPIMY+DLyy723dGoAG5fNyOQv0t1/TiXLanQKbMLUR/PnCEDJi8vUcu+0OUCy6pjs0dtNAyQhjVNFxMvIAZU6/qlAzO/Deu5Sffg70+C6gWJjgpPKcUSHrol7E9z26CinEHURn1bqUOE3gI5Y2uv2PDxWN4A66PIt1oraVSGWS9xzel2dMCZtl1zdEwMW53HRjgUCDV9BzPx9R5y1Bli9m1gZOPGJ//iq4LqQRG/Zw91WkjqvpChENSDEG15ksJZLkINhaK+oN8VPIY442GDc7cj51It+K/UPwJTTr69zB+RN2ZvJagjFmE9gZbtNFK+HwG3ofbYuRR41PEuFuNlUH8tsr0hKgwmWvMOO0+lFcecZRhdp06TfhMo/Mi98TQe1fgHKKmBEW/rkcnT7UeC87X+AVKD2p0qRfJQ0RJynakylJipMRDwfkNkdw25m9yZkB12UWRFetoS8xXZGabzpVwThbwn34+wpTzet7lsqAEBrvDUlHABf0j1rpsKgCfQv+sODWvM69b8+Kw1PxrNzO4g2yA4S9tVtBQx6wZsqgjZjaVFuj4fB0KSxK05niWDQoWEEDhJHR+/I6itOVvaEU8xX/fAkM4zTtQW1FpLM7VWyC/IsKBCag2+LbOXji0ZEiOWXvCIUuv5K1Y4A5K/qXITJ8+/nstWAAgYQD+kr8nf5vv+J//b436kGqbnsGi7Pr9zmPR163GL0wOUVFEcJuDyGLseWtf/0oVQvd3qZPvQaxw5Qn4y615gooav+YwGYw4tU9/ELIF1gmWweinkGPuNU5zUR/SIacbLAv+dGWFX3o2kC+xC5QH/kt/l5b0JDWTBG0lFKutz1VA0BWP3dNb2ULJg9Ugd0I+pWNC6aAFQl0WP1HnJC11RbcW+/lafvdQLAk36bPJB0nCMdRE84XV5xF4w7/CZdgZyIfy2eI7u14RnPzdye0dnU3LCpkawuqQOl2EqWLnjk5CtdylaYOHKQz9/uhI18w3NDQDTH14X9hyknV5YiXYSZGp7LqMOiuqS93USa9uTVvUveS5+bt0XR3cG5DTRGlMxceaY4+UqrLDt2rXygPK2dA1nhGjcq2kkpPrwxysse7zEpR00ErZkhJeBZOsjwkaqSYZlsHZkU/nbZ0pygRgnNwWnkTnusepE7T55107KGcHRvd1ebR+DaIb1/vpUsRJtnxiiAxQg4X/0gSw5qgFXwynhLg8kukt6pFNjz0GklF3STkkew44Yqz4AV2y2dAeeHtANezjaDix/FrW+iddvpcQZNQt6ddGfOC0rF/z+EAaqF5xWpUnWzB8WDgLNbqgKI9q2PIug09ZBbURK4N7+O+U5y+n9asbUfX5GsruVkCyr4vcFzyZjWuHHxdxXw3WuqwxY8dVC40wEr0i+0ujbWGxVT4HtEMp913OYakeCQ9AO61bYysSMXh2F9944gHxUQjffCsVydFWxnLGXTuMHq5e/6LgNGSY4lKuEQxrfP+MFLtgofcuwks26g7SaSbGG7PvH/ukJ6Ka7yPzxJw8TfkuP3d1bHpb6+U34JGC6bq73RR7rIVM5d/gnMRZMLI+6MeoZdr609PP6smbkAOIaG6xRvuZ1AoxSNif1fxlU08433njsQ990xJyII3Pz1Nc/rGeE2besw8QNe4YCy2MlW+yNYzOozxr1YjvCt+WeGLQyybQ1Xhhy2qnrvAQlpwxD44e5fPRcsvnrjiDggxgpIUn++LD2MQa/J0b97IBjWJ339vgckreJveV0J6G+YWEn/YjGj8vdkhz9f3zxDdvRbXFgsT5oEE2tZ8ezP3eqlJIa2TahehQRRNdMLgCuQAxI8m2hOYJsHlfxQP/g9uIKTJRN3FvRrQ2T74gjlp3owJJj+Uug7nxiIgSryiihrUNr5Q60w29tHXBUKHhaLCH3VAmeYhw/s2TjPo3YkEOvsxDouszPnL4ow6wpdTWCsq8uGvyyWlj3qzUTvjfXWsoJqCixdhswW1hXWn7qGiVdZH/4HgTX9MmbhtZ16QretNcOIQxau7JtaraLAMnwMDSmrr0JWMxTN4+JfRXBv1QUuYx0Uq4KcLZtqzFkV0Yw+mGq54gqM+AAihGrQ+z23AQsEWy5GY3S5pp+XVugutHRU39kLQYxML8kob5T0w7cJc8DxPLjp+DKrzxEQsPurbk++8aTRpWcEIe35LP/DuSvyxsUfuQLWaIXsg7asJs8Kj7Uom3GKF8MX7GC/rRSPakTsZ21pzm6MEo5lqhfT9qg2Rtw8v6wEe5seyK9cL0OrMH2fbbXOgJTk1/T1bQzvrBiXcs+9bE7q9ppp6k30pAB/oXtHXPttligKPpxbtC8xGXoI+edIfVJHRenhLAw/d9YOFqzicZkj/vouhpMxc9fGuFQPACajsFxq71chDZeTQZ/k7AhmMiPEneScC9DH+E+dPIsbhjeEbGqBW56U76ApupLHjHcoeAXik6WFhKcep3PXVIpsTixc32VYqlNelVKzp07zml0TYbPCmmn1E+C+QpEoaqstjeJg2we2b3IAYmG3kCwVgCLBtaxzfMD8cVj0NdtEWwpIAyHuB73oe9/qv6o3N9gTZ4sfEyaMBjMXwO7W4guG/BdF3pH45Y92rXAaz3ji8YpMJg/29Qpw2orGw9JYLbLDT+LofP/6rNMbPZSBaEq4qnldYeWBEg+FVD8uzODwYNFtRFtNUcyJVI7lgs0ClM4/hKHQ/XyID/IB+wwCkl8y6/+CBW//8ROjvTWgdWwUAAhjE+YiGJKvthFTCAyMLWzWQps2wb+9PWskji3i265sC/GUEUX5Oo86abrIosfEWKYDiCpDCrTHflnAXs2wD49pnJEmPr57GeD9tKl3722+4Cfb3443pC8qHN4hKxn4uEpKSwglmjpArMtyBRGM+pqv/D3w3U4nn0YEh8kPgBtST7cvyBkbHAUIIES2SHD3xCZNbCMnkdoZ1f/e9amubyIaxHxXm05II2hO84hLlPWp4UUJQ8ON+oPtYrhOYmezY7gUFVAqHBt/EFp0XkotmtF1VY/LokRaDQ7ZghLuVxWbsNjajFEQxpN0H0kl+bw2eFwJatfQAZ667RWR7EbXLByEX5Ma4hFl+C7kBAO8TFUA9rL2xTxA9E7XMi9ugwYtX5JouNLf8zhVRZvVCgXvYeuvW2b2Aw3lbh5WmXZHeOEdNV/WOShV/g5DE47W1/EwHPLc+CDU+vgDsN7tfxG59zjJsmrVBwk3UEkWiNkNu+lbJQQFnevrigRbYky8f+dg92LUpuTOUPeRUYIoOuTerDC8BhXtMvew5H6FNPTEcRcuiXv7XMAlJRkDUFGBCaIjsXeFeQ4XyUiRRATRk/Nn6G2RpcGbtEHcx11VhA0gObKVXAQJINPFERdFozZpVQ17I0A/78ZYs2Rcx1fe9OKlj0qfTFfiDdDlAfhlG+yXVHWn2mZLziKcxoD/rhxIFrgnzgvaOU9qbPTqeB63Yw4c9MIraPI5f8mBSQmWbV1xGydxmdrtHug2uDRET2FfScf4TRs/l4RWymBUv7YuB/m7P98qGDFd4bKfiV34w9bfw1dQ1XChF7/9q3+c9kS5OL0GIPStVn7peDqfIIX2k2CyrPEjXo5P50h40ukcBFkq0dbFVgbkb2/X58B+2YI1ZsEc40MBP5qiMFFMD446C8qIgKx6DLFE1ZpZfdI42GlPK/b4jghOkZMMOj39wtw+gnqRp/I30gS8WXTi7IBa+shD6AxRFxjqF6p9ufjHqDoUBQFmKx0NcAFYr6nsUrtoVIp+7BJ2vhdgh9vKNtFhEKioF9MrBAmuEFGcwUQZ8u4CDu0bNZPfqw8g/4GK6afLj/TDscY/SD8OEGeCmtOBxDfTqh5jjw4YAYD10lSQHLW5PZMdqvkzhnMKXieiFtRimhT4AZyewMFANtyK2dVw1ahL98RO9t9lOLF5/f6JCaruAXnwe2Yz+0cQhldk67bq4POY8GWQOEpPH5hgrToswEpOXl3B2pW0rjOUgJR98McdY0x0sALsWukYy50ohMMesCv6JqxNDr1bZLyHHSi4M7g6ApEIgzQSmn0C1SBY69Le6Wsu9yqNKTyZhqssQLFTiTptG7+3jj9FS4azphhomSUMrgPaghYM6Vb+r29hSUvXJa2p7syk7NDqWFRHI0Eiv7BumjBEV0aM5Bq/Il8fDBoaYfFePOALS5h7A1hZ/UOM8U1eBqqyq4dFspi5aZ0YwC8Ynf2ImrU4H8qkltoxius+cJcxP2ei6V4ThcrxgFazPkYvCMV9JUkGOJ3DS589SGO3+myLJV21u2GW529KQfuMkFnXy47gEXSuGjoXqS7Dr81ApIq3TUQUsb59XrcdOazwnTUbwb9BsgfFVmsGNwzX+MD0p3Fn+a31DfcrRgLDNg6LCGMA9imptoKXVNgbVb9LeSwHE679GWLnyshVM4MlrHBLfPKsCiZdhffrHhteBIi0rrah4xqdTESQnx7Yt0ywEv0d/Ind9MCF8zl1fhFX9EfmLggtmNDIANvDw2TSmTk8GTplkOMqN0uHr0a32G7CCYPAk/gC1sAFjYPkCsag5/8t97UB9qC1aaUR1ZTUejnUf3cRQp+k92grD+cmLLJWMNDeWftkJHeBLIPkOmQskC7aJ7b3bsSUpWFMiCSd5/P5lURLozLj1kRYmpY1FGK6fTCtm4CVOEMWusVBaDcodKmSuNF2t+I4Gy6nYJ6HRoF4GBDQQzlOEStN3SxYTg1k+dYc4E/l8NDzdLKBOQ8jEXHO1XhAOpoa8DQHyyxrcJC1dZF/Gk57OiWoNBb1NVGMLbRwpzVdJOXyLhJJ26n+cZGniQhM8oT8oYx93Ytk5LcgBFMcI3UTNX+o7IeNjgPO0iwp5KmBfmrGPgW12ubTkVqJ/DYpTvczzc4w2PXDQMSSKgqoTt7izcTQa5YvONWcgv1HZZ9EmmWR4LulCkBiZvHy3vf28WfsmHsUWpz86H+jX5El0hTcohx4/7+gX9qGcQrPqukewZyHSt+3dm4TPYeOjYXrCGkHeQsL+uAsR0H7fKi4UqYNwAHRoD/k+VKiB0oDy4+sR82A3t6Wbl4Ksa90WcAt+PoFgZKiHXYgZqYDSOmu8Y17g2fY5k2V0Gz5SOIXHPRgGP56JHxv9L7BAipyKWlo/DWbzETnUjPk6ykB4V7qZuTJ8zPBUnzmj9DNHk8c0DZUcESnH0XX0CgKZxAwRlAUHFL93q/MDnHbS+bdBeZcNV1uKG3Xc+Q0oYYpCXIeJCyBKoNn+m92NJ0yncmbdprYhRO6jn7eoophRUKWj53vMuF7+vD96jL1ap0iu9xOWdFXLkHZGjQ61JknCTYbOLYuGWS6YIaZMA29j0b70rIZomQs8qxH+apdaZ8778+wzFY7t+BxY16kc7JXG/Kvdqd7NYSozqqHS86QbPXLCtxL9U5Evkm5WVcAZMAaJkVjF3pEWEsXO0Cx+R/8DwWaZc1PhZW6tginskpfIdh+j8H2oLOXGVDgeX8EW1b3+27vplyxlU40B4ZZNSBhT7IYsgqOvrbcu46qdRb7W7erQPQhXcqYGkIZBy2LIu7cWn4IJxT448WSI4Y+qnxxfJltMcoVXZGw91qQEmPFsBO4egnQkIpd0ddn9VrjnCTtBZQ96kQPUb3GVYzo3j0uwlsxV7fNjJDpb+ZX+IGQw/+PkGcUuUJj+TskGKbZAdUgBDU112YcJkX/v4v+Kq1BwNPlHv2xVu1kDNAfk960PfJyrscL0RU6EfVKoxfjsDr5r4Z8MatufqFyBjNMCd+6pblZndgoGsOpTwOaGTv0cBj6yWXE3SvJsbQoDjQS3H9qjvGDEyEJwr7tuC0qhUKCyrHYbXzJwi37Dqa+LJEsrtNByzSUgRTtuOK+07tsXUjqAX0KvZqQr42Bznh8fFn0mtY8rhRq0i5YXSW/PAhIdyA0DE0OOwnK7WUBp5bbelVRdDkdbF4Dgwh0auVf4VhZ3V8MUOi7obhibSKFqV8yBLV6kh7TIcC/CL4G5TLPpHqwwEqROKCoH7KC3qQ5oj/YoEAEcqM2HTa0Gbttn94Cen+v6aE3bsnFIRJG4j+zwZIE+C+DUQBanJvbjsOOcmbO6O+UhtwEO+0zVLaOvaXtKI7JDAYBlaqUSJG86vxQr5mSdTEWcXGNnbcrSu4mff1IgSBPakJjhbJVuvmnkPFeyD9LaQorJ+1gv6tSg0YhZgDPjDn0rtbASuMDUWOcLpgTKR4/YXUGdVlviFoo4/7QvkjreKUjOjQSnsrPyYLVLvs7Uv260iNhJLS2xBdC11FEx3AUAi+DpCpxEJu28CpfKNHtw3RlsvRjNSCsdePKFUes/LYXkhP72eM+f3dUTWeatXYwXA1DSxxtLVQfW7uFC6DgAkhAKrMTtXmSsJfNiQFp169ltR1rqwLunUH5rx/+TEAtGixDKWU+IE5qxxMx45oIf0ER9SptH4TeL3cxBmu5YDR5l1YOOOFfCoG8nzg8WNY4VOMlmaAF9OO8yzbdfRbgiDroL5g76HLm3POS8zhXAPFuzr2AVkz/lIwu6Ybtn6vfg7W5Dr1m0yNXeXXC4lyuApvemLsXLZN9RBiV3LHYwxAsS0aaQMTOe49Vo1knG48qw/41O0AjKQsdPDGeWenv5Clk2Fc2rL/mws7OyL+cFgov1vBCkn+FWAJiVOHxYrOOPLXutw800eOgDn5IclhF/P10xI51VMVj41M6LHsQAN1+0gVdv2KRzWVJHPsqtgeLNPLcWuUNUTmN332bu0WAyXmE61qUM4rMw5Vp1z4/Jv+E2gAAAAAAAA">
        <div class="elements-text-container">
        <span class="elements-text-title"> ${value.subCategory} </span>
        <h4 class="elements-text-dec">${value.shortText}</h4>        
      `;
      designWrapper.append(container);
    });

    // Append the title and wrapper inside the design-elements div
    designEle.append(designTitle);
    designEle.append(designWrapper);
    intExtContainer.append(designEle);
  }

  // Append the entire container to the DOM
  createOptionDOM.append(intExtContainer);
}

function buildOptionsDOM(optionsData) {
  const createOptionDOM = document.createElement('div');
  createOptionDOM.classList.add('car-spec-details-wrapper', 'border-class');
  const optionsValue = optionsData.data.attributes.options;
  buildExterioInteriosDOM(createOptionDOM, optionsData);
  const headingOptionLabelDom = document.createElement('h2');
  createOptionDOM.append(headingOptionLabelDom);
  headingOptionLabelDom.classList.add('car-spec-details-title');
  headingOptionLabelDom.innerText = 'Options';

  const specDetailsContainer = document.createElement('div');
  specDetailsContainer.classList.add('spec-details-container');

  Object.entries(optionsValue).forEach(([key, value], index) => {
    const container = document.createElement('div');
    container.classList.add('car-spec-details-container');
    if (index >= 8) {
      container.style.display = 'none'; // Hide extra items by default
    }
    container.innerHTML = `
        <img class="spec-img" src='https://picsum.photos/600/100' alt="${value.shortText}">
        <div class="spec-details-text-container">
            <div class="spec-details-Icon">
                <i class="spec-details-Icon-Button icon-info-i"></i>
            </div>
            <span class="spec-details-text">${value.shortText} (${key.toUpperCase()})</span>
        </div>
        <span class="spec-popover-wrapper">
          <div class="spec-popover-container" style="display: none;">
            <div class="spec-popover-title">
                ${value.shortText} (${key.toUpperCase()})</div>
            <img class="spec-popover-img" src='https://picsum.photos/900/100' alt="${value.longText}">
            <div class="spec-popover-dec">
              ${value.longText}</div>
            <div class="spec-popover-close-button"></div>
          </div>
        </span>
    `;
    specDetailsContainer.append(container);
  });

  createOptionDOM.append(specDetailsContainer);
  document.querySelector('.card-tile-wrapper')?.appendChild(createOptionDOM);
  if (Object.keys(optionsValue).length > 8) {
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    const toggleButton = document.createElement('button');
    toggleButton.innerText = 'Show More';
    toggleButton.classList.add('toggle-button');
    buttonContainer.append(toggleButton);
    createOptionDOM.append(buttonContainer);
    let isExpanded = false;
    toggleButton.addEventListener('click', () => {
      isExpanded = !isExpanded;
      toggleButton.innerText = isExpanded ? 'Show Less' : 'Show More';
      document.querySelectorAll('.car-spec-details-container').forEach((item, index) => {
        if (index >= 8) {
          item.style.display = isExpanded ? 'block' : 'none';
        }
      });
    });
  }

  // eslint-disable-next-line no-use-before-define
  createPopover();
}

function detailsPage() {
  const cardDetailsSelector = document.querySelectorAll('.stock-locator-details, .btn-stock-locator-details');
  cardDetailsSelector.forEach((value) => {
    value.addEventListener('click', async (e) => {
      e.stopPropagation();
      const referenceNumber = (e.target.parentElement.dataset.reference);
      const vehicleDetailsResponse = await getVehicleDetails(referenceNumber);
      const vehicleDetailsOptionsResponse = await getVehicleGroupReference(referenceNumber);
      buildLabelDOM(vehicleDetailsResponse);
      buildOptionsDOM(vehicleDetailsOptionsResponse);
    });
  });
}

export default async function decorate(block) {
  dropDownContainer.classList.add('dropdown-container');
  // Call stockLocatorFiltersAPI and wait for it to finish
  await stockLocatorFiltersAPI(dropDownContainer);

  // Proceed with the rest of the operations
  const props = [...block.children].map((row) => row.firstElementChild);
  const env = document.querySelector('meta[name="env"]').content;
  let publishDomain = '';
  const [disclaimerCF] = props;
  if (env === 'dev') {
    publishDomain = DEV.hostName;
  } else if (env === 'stage') {
    publishDomain = STAGE.hostName;
  } else {
    publishDomain = PROD.hostName;
  }
  block.textContent = '';
  window.gqlOrigin = window.location.hostname.match('^(.*.hlx\\.(page|live))|localhost$') ? publishDomain : '';
  getContentFragmentData(disclaimerCF, window.gqlOrigin).then((response) => {
    const cfData = response?.data;
    if (cfData) {
      const disclaimerHtml = cfData?.disclaimercfmodelByPath?.item?.disclaimer?.html;
      const disclaimerContent = document.createElement('div');
      disclaimerContent.className = 'disclaimer-content';
      disclaimerContent.innerHTML = disclaimerHtml;
      block.appendChild(disclaimerContent);
    }
  });

  // Clear block content and set up loading icon
  // block.textContent = '';
  createLoadingIconDom();
  openFiltersBtn();
  showResulsHandler();
  createRelevanceDropdown(dropDownContainer);
  await vehicleFiltersAPI();
  // Hide loading icon after all tasks are complete
  hideLoadingIcon();
  handleToggleFilterDropDown();
  handleMobileSeriesFilter();
  handleRelevanceSingleSelect();
  detailsPage();
  stockCar();
}
