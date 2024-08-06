// eslint-disable-next-line import/no-cycle
import { getStockLocatorFiltersData, getStockLocatorVehiclesData, getShowMoreCards } from '../../scripts/common/wdh-util.js';
import {
  DEV, STAGE, PROD, disclaimerGQlEndpoint,
} from '../../scripts/common/constants.js';

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
    anchorWrapper.href = `#details/${groupReference}`;
    anchorWrapper.setAttribute('data-reference', groupReference);

    const imgElem = document.createElement('img');
    imgElem.classList.add('stocklocator-card-img');
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
    stockLocatorHideButtonLink.classList.add('stock-locator-btn-details');
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
          const index = selectedValues[headingText].indexOf(checkbox.id);
          if (index !== -1) {
            selectedValues[headingText].splice(index, 1);
          }
          // Remove is-active class if no checkbox is selected for this heading
          if (selectedValues[headingText].length === 0) {
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
  selectedList.innerHTML = '';
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
    const resetFilterElement = createResetFilterButton(mergedValues);
    document.querySelector('.stock-locator-model-detail-definition-specification.block').append(resetFilterElement);
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
    const allItem = Array.from(filterItems).find((item) => item.children[0].id === 'all');

    filterItems.forEach((item) => {
      const checkbox = item.children[0];
      // Initialize 'All' option
      if (checkbox.id === 'all') {
        checkbox.checked = true;
        item.classList.add('selected-filter');
      }

      item.addEventListener('click', (event) => {
        if (event.target.tagName.toLowerCase() === 'input') {
          return;
        }
        // Toggle checkbox state and selected class
        checkbox.checked = !checkbox.checked;
        item.classList.toggle('selected-filter');

        if (checkbox.checked) {
          if (!selectedValue[headingText]) {
            selectedValue[headingText] = [];
          }
          if (!selectedValue[headingText].includes(checkbox.id)) {
            selectedValue[headingText].push(checkbox.id);
          }
        } else {
          const index = selectedValue[headingText].indexOf(checkbox.id);
          if (index !== -1) {
            selectedValue[headingText].splice(index, 1);
          }
        }
        // Handle 'All' option logic
        if (item === allItem) {
          filterItems.forEach((otherItem) => {
            if (otherItem !== allItem) {
              otherItem.classList.remove('selected-filter');
              otherItem.children[0].checked = false;
            }
          });
          selectedValue[headingText] = ['All'];
        } else {
          if (selectedValue[headingText].includes('All')) {
            const index = selectedValue[headingText].indexOf('All');
            selectedValue[headingText].splice(index, 1);
          }
          allItem.classList.remove('selected-filter');
          allItem.children[0].checked = false;
        }

        // eslint-disable-next-line max-len, no-shadow
        const anyChecked = Array.from(filterItems).some((item) => item !== allItem && item.children[0].checked);
        if (anyChecked) {
          allItem.classList.add('all-disabled');
        } else {
          allItem.classList.remove('all-disabled');
        }
        updateSelectedValues(selectedValue);
        // eslint-disable-next-line no-use-before-define
        vehicleURL = constructVehicleUrl(selectedValue);
        showResulsHandler(vehicleURL);
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
    allListItem.classList.add('filter-item', `${typeKey}-item`, 'not-desktop');
    const allCheckbox = document.createElement('input');
    allCheckbox.classList.add(`${typeKey}-checkbox`, 'filter-checkbox');
    allCheckbox.type = 'checkbox';
    allCheckbox.id = 'All';
    allCheckbox.checked = true;
    const allLabel = document.createElement('label');
    allLabel.htmlFor = 'All';
    allLabel.textContent = 'All';
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
    allListItem.classList.add('filter-item', `${typeKey}-item`, 'not-desktop');
    const allCheckbox = document.createElement('input');
    allCheckbox.classList.add(`${typeKey}-checkbox`, 'filter-checkbox');
    allCheckbox.type = 'checkbox';
    allCheckbox.id = 'All';
    allCheckbox.checked = true;
    const allLabel = document.createElement('label');
    allLabel.htmlFor = 'All';
    allLabel.textContent = 'All';
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
  allListItem.classList.add('filter-item', `${typeKey}-item`, 'not-desktop');
  const allCheckbox = document.createElement('input');
  allCheckbox.classList.add(`${typeKey}-checkbox`, 'filter-checkbox');
  allCheckbox.type = 'checkbox';
  allCheckbox.id = 'all';
  allCheckbox.checked = true;
  const allLabel = document.createElement('label');
  allLabel.htmlFor = 'All';
  allLabel.textContent = 'All';
  allListItem.appendChild(allCheckbox);
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

    const label = document.createElement('label');
    label.htmlFor = item.id;
    label.textContent = `${item.label} (${item.count})`;
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
}
