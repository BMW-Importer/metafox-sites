// eslint-disable-next-line import/no-cycle
import { getStockLocatorFiltersData, getStockLocatorVehiclesData } from '../../scripts/common/wdh-util.js';

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
  // eslint-disable-next-line no-use-before-define
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

function handleCancelSelectedValue() {
  const cancelSelctor = document.querySelectorAll('.cancel-filter');
  cancelSelctor?.forEach((item) => {
    cancelSelctor?.addEventListener('click', () => {
      console.log(item);
    });
  });
}

// eslint-disable-next-line import/no-mutable-exports
export let vehicleURL;

function handleCheckBoxSelectionForSeries() {
  const filterLists = document.querySelectorAll('.filter-list');
  const selectedValues = {};

  filterLists.forEach((filterList) => {
    const filterLabelHeading = filterList.previousElementSibling;
    const checkboxes = filterList.querySelectorAll('.filter-checkbox');
    const headingText = filterLabelHeading.textContent;

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
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
        // eslint-disable-next-line no-use-before-define
        updateSelectedValues(selectedValues);
        console.log(selectedValues);
        // eslint-disable-next-line no-use-before-define
        vehicleURL = constructVehicleUrl(selectedValues);
        getStockLocatorVehiclesData(vehicleURL);
      });
    });
  });
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
        cancelElement.textContent = '×';
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

function processFilterData(filterData, typeKey, dropDownContainer) {
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

async function stockLocatorFiltersAPI(dropDownContainer) {
  const stockLocatorFilterResponse = await getStockLocatorFiltersData();
  const stockLocatorFilterData = stockLocatorFilterResponse.data.attributes;
  createStockLocatorFilter(stockLocatorFilterData, dropDownContainer);
}

export default async function decorate(block) {
  const filterWrapperContent = document.createElement('div');
  filterWrapperContent.className = 'stock-locator-container';
  const filterWrapper = document.createElement('div');
  filterWrapper.className = 'filter-wrapper';

  const dropDownContainer = document.createElement('div');
  dropDownContainer.classList.add('dropdown-container');

  // Create the heading for the filter label
  const filterLabelHeading = document.createElement('div');
  filterLabelHeading.className = 'filter-label';
  filterLabelHeading.textContent = 'Sort by';
  filterWrapper.appendChild(filterLabelHeading);

  const filterList = document.createElement('ul');
  filterList.className = 'filter-list dropdown-list-wrapper';
  filterWrapper.appendChild(filterList);

  const filterLabelDefault = document.createElement('div');
  filterLabelDefault.className = 'filter-label-heading';
  filterLabelDefault.textContent = 'Relevence';
  filterWrapper.appendChild(filterLabelDefault);

  const sortOptions = [
    { id: 'a-z', text: 'A-z' },
    { id: 'z-a', text: 'Z-a' },
    { id: 'lowest', text: 'lowest' },
    { id: 'highest', text: 'highest' },
  ];

  sortOptions.forEach((option) => {
    const listItem = document.createElement('li');
    listItem.className = 'filter-item';

    const checkbox = document.createElement('input');
    checkbox.className = 'fuel-checkbox filter-checkbox';
    checkbox.type = 'checkbox';
    checkbox.id = option.id;

    const label = document.createElement('label');
    label.setAttribute('for', option.id);
    label.textContent = option.text;

    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    filterList.appendChild(listItem);
  });

  filterWrapperContent.append(filterWrapper);

  dropDownContainer.append(filterWrapperContent);

  const modelDetails = [...block.children];
  modelDetails.forEach((modelDetail) => {
    const [general] = modelDetail.children;
    console.log(general);
    // stock locator API called here
  });
  block.textContent = '';
  stockLocatorFiltersAPI(dropDownContainer);
}
