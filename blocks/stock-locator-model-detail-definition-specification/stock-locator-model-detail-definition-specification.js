// eslint-disable-next-line import/no-cycle
import { getStockLocatorFiltersData, getStockLocatorVehiclesData } from '../../scripts/common/wdh-util.js';
import {
  DEV, STAGE, PROD, disclaimerGQlEndpoint,
} from '../../scripts/common/constants.js';

let currentlyOpenDropdown = null;
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
  handleCheckBoxSelectionForSeries();
}

function handleMobileSeriesFilter() {
  const filterItems = document.querySelectorAll('.filter-list.dropdown-list-wrapper .filter-item');
  filterItems.forEach((item) => {
    item.addEventListener('click', () => {
      item.classList.toggle('selected-filter');
    });
  });
}

function handleCancelSelectedValue(values) {
  const cancelSelectors = document.querySelectorAll('.cancel-filter');
  cancelSelectors.forEach((item) => {
    item.addEventListener('click', () => {
      const valueElement = item.parentElement;
      valueElement.remove();
      removeLastSelectedValue(values);
    });
  });
}

function removeLastSelectedValue(values) {
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
  updateSelectedValues(values);
  // eslint-disable-next-line no-use-before-define
  vehicleURL = constructVehicleUrl(values);
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
    currentlyOpenDropdown.style.display = 'none';
    currentlyOpenDropdown.previousElementSibling.classList.remove('show-dropdown');
  }
}

// function handleCheckBoxSelectionForSeries() {
//   const filterLists = document.querySelectorAll('.filter-list');
//   filterLists.forEach((filterList) => {
//     const filterLabelHeading = filterList.previousElementSibling;
//     const checkboxes = filterList.querySelectorAll('.filter-checkbox');
//     const selectedValues = [];
//     const selectedCheckBoxType = [];

//     checkboxes.forEach((checkbox) => {
//       checkbox.addEventListener('change', () => {
//         if (checkbox.checked) {
//           if (!filterLabelHeading.classList.contains('is-active')) {
//             filterLabelHeading.classList.add('is-active');
//           }
//           selectedValues.push(checkbox.id);
//           selectedCheckBoxType.push(filterLabelHeading.textContent);
//         } else {
//           const index = selectedValues.indexOf(checkbox.id);
//           if (index !== -1) {
//             selectedValues.splice(index, 1);
//           }
//           // Remove is-active class if no checkbox is selected
//           if (selectedValues.length === 0) {
//             filterLabelHeading.classList.remove('is-active');
//           }
//         }
//         // Update the displayed selected values
//         // eslint-disable-next-line no-use-before-define
//         updateSelectedValues(selectedValues, filterList);
//         console.log(selectedValues);
//         console.log(selectedCheckBoxType);
//       });
//     });
//   });
// }

// eslint-disable-next-line import/no-mutable-exports
export let vehicleURL;

function cardTiles(filterVehicle) {
  const cardWrapper = document.createElement('div');
  cardWrapper.classList.add('card-tile-wrapper');
  // eslint-disable-next-line array-callback-return
  filterVehicle.data.map((vehicle) => {
    const {
      // eslint-disable-next-line max-len
      model, powerKw, powerPs, priceInformation: { baseCurrencyCodeA, finalPriceWithTax }, groupReference,
    } = vehicle.attributes;

    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-tile-container');

    const cardList = document.createElement('ul');
    cardList.classList.add('card-tile-list');

    const cardListElement = document.createElement('li');
    cardListElement.classList.add('card-tile-list-ele');

    const modelCard = document.createElement('div');
    modelCard.classList.add('model-card');

    const cardImgContainer = document.createElement('div');
    cardImgContainer.classList.add('image-container');

    const pictureTag = document.createElement('picture');

    const imgElem = document.createElement('img');
    imgElem.src = 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fbmw&psig=AOvVaw2VIQ2prCpWALFDmQR11JMk&ust=1721922019328000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCNiUv8WBwIcDFQAAAAAdAAAAABAE';
    imgElem.alt = 'img';

    const detailContent = document.createElement('div');
    detailContent.classList.add('detail-content');

    const modelName = document.createElement('h4');
    modelName.classList.add('model-name');
    modelName.textContent = model;

    const cardLayerInfoContainer = document.createElement('div');
    cardLayerInfoContainer.classList.add('card-layer-info-container');
    const cardLayerInfoItem = document.createElement('div');
    cardLayerInfoItem.classList.add('card-layer-info-item');
    const infoSpan = document.createElement('span');
    infoSpan.textContent = `${powerKw} kW (${powerPs} KS)`;

    const priceContainer = document.createElement('div');
    priceContainer.classList.add('price-container');

    const price = document.createElement('span');
    price.classList.add('car-price');
    price.textContent = `${finalPriceWithTax.min} ${baseCurrencyCodeA}`;

    priceContainer.append(price);
    cardLayerInfoItem.append(infoSpan);
    cardLayerInfoContainer.append(cardLayerInfoItem);
    detailContent.append(modelName);
    pictureTag.append(imgElem);
    cardImgContainer.append(pictureTag);
    cardListElement.append(cardImgContainer, detailContent, cardLayerInfoContainer, priceContainer);
    cardList.append(cardListElement);
    cardContainer.append(cardList);
    cardWrapper.append(cardContainer);
  });
  document.querySelector('.stock-locator-model-detail-definition-specification.block').append(cardWrapper);
}

async function vehicleFiltersAPI() {
  const getStockLocatorVehicles = await getStockLocatorVehiclesData();
  cardTiles(getStockLocatorVehicles);
}
let selectedbolean = false;

async function handleCheckBoxSelectionForSeries() {
  const filterLists = document.querySelectorAll('.filter-list');
  const selectedValues = {};
  filterLists.forEach((filterList) => {
    const filterLabelHeading = filterList.previousElementSibling;
    const checkboxes = filterList.querySelectorAll('.filter-checkbox');
    const headingText = filterLabelHeading.textContent;

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', async () => {
        selectedbolean = true;
        console.log(checkbox.checked);
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
        // Update the displayed selected values
        updateSelectedValues(selectedValues);
        vehicleURL = constructVehicleUrl(selectedValues);
        const data = await getStockLocatorVehiclesData(vehicleURL);
        cardTiles(data);
      });
    });
  });
  console.log(selectedbolean);
}

function constructVehicleUrl(selectedValues) {
  const urlParams = [];
  if (selectedValues.Series && selectedValues.Series.length > 0) {
    urlParams.push(`series=${selectedValues.Series.join(',')}`);
  }
  if (selectedValues.Fuel && selectedValues.Fuel.length > 0) {
    urlParams.push(`fuel=${selectedValues.Fuel.join(',')}`);
  }
  if (selectedValues.DriveType && selectedValues.DriveType.length > 0) {
    urlParams.push(`drive=${selectedValues.DriveType.join(',')}`);
  }

  const fullUrl = `${urlParams.join('&')}`;
  document.querySelector('body').setAttribute('data-vehicle-url', fullUrl);
  return fullUrl;
}

function updateSelectedValues(values) {
  const selectedList = document.querySelector('.series-selected-list');
  selectedList.innerHTML = '';

  let hasSelectedValues = false;

  // eslint-disable-next-line no-restricted-syntax, no-unused-vars
  for (const [heading, valuesArray] of Object.entries(values)) {
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

  if (!document.querySelector('.reset-filter') && hasSelectedValues) {
    const resetFilterElement = document.createElement('div');
    resetFilterElement.classList.add('reset-filter');
    const resetSpan = document.createElement('span');
    resetSpan.textContent = 'Reset The filters';
    const resetAnchor = document.createElement('a');
    resetAnchor.classList.add('reset-filter-link');
    resetFilterElement.append(resetSpan, resetAnchor);

    selectedList.insertBefore(resetFilterElement, selectedList.firstChild);
    resetFilterElement.addEventListener('click', () => {
      resetAllFilters(values);
    });
  }
  handleCancelSelectedValue(values);
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

  values.DriveType = '';
  values.Fuel = '';
  values.Series = '';

  updateSelectedValues(values);

  currentlyOpenDropdown.style.display = 'none';
  currentlyOpenDropdown.previousElementSibling.classList.remove('show-dropdown');
  vehicleURL = constructVehicleUrl(values);
  getStockLocatorVehiclesData(vehicleURL);
}

function stockLocatorFilterDom(filterData, typeKey, dropDownContainer) {
  const boxContainer = document.createElement('div');
  boxContainer.classList.add('box-container', `${typeKey}-box`);

  const filterContainer = document.createElement('div');
  filterContainer.classList.add('stock-locator-container', `${typeKey}-container`);

  const filterWrapperContainer = document.createElement('div');
  filterWrapperContainer.classList.add('filter-wrapper', `${typeKey}-wrapper`);

  const mobilefilterWrapperLabel = document.createElement('span');
  mobilefilterWrapperLabel.classList.add('mobile-filter-wrapper');
  mobilefilterWrapperLabel.textContent = 'Filter By:';

  const filterHeading = document.createElement('span');
  filterHeading.classList.add('filter-label', `${typeKey}-label`);
  filterHeading.textContent = typeKey.charAt(0).toUpperCase() + typeKey.slice(1);

  const filterLabelHeading = document.createElement('div');
  filterLabelHeading.classList.add('filter-label-heading', `${typeKey}-heading`);
  filterLabelHeading.textContent = typeKey.charAt(0).toUpperCase() + typeKey.slice(1);

  const filterList = document.createElement('ul');
  filterList.classList.add('filter-list', 'dropdown-list-wrapper', `${typeKey}-list`);

  const selectedFilterList = document.createElement('div');
  selectedFilterList.classList.add('selected-filter-list', `${typeKey}-selected-list`);

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
  filterContainer.appendChild(filterHeading);
  filterWrapperContainer.appendChild(mobilefilterWrapperLabel);
  filterContainer.appendChild(filterWrapperContainer);
  filterWrapperContainer.appendChild(filterLabelHeading);
  filterWrapperContainer.appendChild(filterList);
  boxContainer.appendChild(filterWrapperContainer);
  filterContainer.appendChild(boxContainer);
  dropDownContainer.append(filterContainer, selectedFilterList);
  document.querySelector('.stock-locator-model-detail-definition-specification').append(dropDownContainer);

  handleMobileSeriesFilter();
  return filterContainer;
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

function createStockLocatorFilter(filterResponse, dropDownContainer) {
  processFilterData(filterResponse?.series, 'series', dropDownContainer);
  processFilterData(filterResponse?.driveType, 'driveType', dropDownContainer);
  processFilterData(filterResponse?.fuel, 'fuel', dropDownContainer);
  handleToggleFilterDropDown();
}

document.addEventListener('DOMContentLoaded', () => {
  const infoButton = document.querySelector('.description-popup-button');
  const popupText = document.querySelector('.description-popup-container');
  const closeButton = document.querySelector('.description-popup-close-button');
  const toggleButton = document.querySelector('.popup-toggle-button');
  const descriptionPopupDisclaimer = document.querySelector('.description-popup-disclaimer');

  infoButton.addEventListener('click', () => {
    popupText.style.display = 'block';
  });

  closeButton.addEventListener('click', () => {
    popupText.style.display = 'none';
  });

  toggleButton.addEventListener('click', () => {
    if (popupText.classList.contains('expanded')) {
      popupText.classList.remove('expanded');
      descriptionPopupDisclaimer.style.height = '200px';
      toggleButton.textContent = '▼';
    } else {
      popupText.classList.add('expanded');
      toggleButton.textContent = '▲';

      descriptionPopupDisclaimer.style.height = 'max-content';
    }
  });

  // Optional: Click outside to close the popup
  document.addEventListener('click', (event) => {
    if (!popupText.contains(event.target) && !infoButton.contains(event.target)) {
      popupText.style.display = 'none';
    }
  });
});

async function stockLocatorFiltersAPI(dropDownContainer) {
  const stockLocatorFilterResponse = await getStockLocatorFiltersData();

  const stockLocatorFilterData = stockLocatorFilterResponse.data.attributes;

  createStockLocatorFilter(stockLocatorFilterData, dropDownContainer);
}

// Function to handle single select for relevance dropdown
function handleRelevanceSingleSelect() {
  const relevanceDropdown = document.querySelector('.stock-locator-container.relevance .filter-list');
  const items = relevanceDropdown.querySelectorAll('.filter-item-relevance');

  items.forEach((item) => {
    item.addEventListener('click', () => {
      items.forEach((i) => i.classList.remove('selected')); // Deselect all items
      item.classList.add('selected'); // Select the clicked item
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
  filterLabelHeading.textContent = 'Sort by';
  filterWrapper.appendChild(filterLabelHeading);

  const filterList = document.createElement('div');
  filterList.classList.add('filter-list', 'dropdown-list-wrapper');

  const filterLabelDefault = document.createElement('div');
  filterLabelDefault.className = 'filter-label-heading';
  filterLabelDefault.textContent = 'Relevance';
  filterWrapper.appendChild(filterLabelDefault);
  filterWrapper.appendChild(filterList);

  const sortOptions = [
    { id: 'a-z', text: 'A-Z' },
    { id: 'z-a', text: 'Z-A' },
  ];

  sortOptions.forEach((option) => {
    const listItem = document.createElement('div');
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

async function getContentFragmentData(disclaimerCFPath, gqlOrigin) {
  const endpointUrl = gqlOrigin + disclaimerGQlEndpoint + disclaimerCFPath.innerText;
  const response = await fetch(endpointUrl);
  return response.json();
}

export default async function decorate(block) {
  const dropDownContainer = document.createElement('div');
  dropDownContainer.classList.add('dropdown-container');

  // const modelDetails = [...block.children];

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
    console.log(cfData);
    if (cfData) {
      const disclaimerHtml = cfData?.disclaimercfmodelByPath?.item?.disclaimer?.html;
      const disclaimerContent = document.createElement('div');
      disclaimerContent.className = 'disclaimer-content';
      disclaimerContent.innerHTML = disclaimerHtml;
      block.appendChild(disclaimerContent);
    }
  });

  block.textContent = '';
  vehicleFiltersAPI();
  createRelevanceDropdown(dropDownContainer);
  stockLocatorFiltersAPI(dropDownContainer);
}
