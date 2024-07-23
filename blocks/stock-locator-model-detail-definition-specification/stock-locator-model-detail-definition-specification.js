import { getStockLocatorFiltersData } from '../../scripts/common/wdh-util.js';

function handleToggleFilterDropDown() {
  let currentlyOpenDropdown = null;

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

// function handleCancelSelectedValue() {
//   const cancelSelctor = document.querySelectorAll('.cancel-filter');
//   cancelSelctor?.forEach((item) => {
//     cancelSelctor?.addEventListener('click', () => {
//       console.log(item);
//     });
//   });
// }

// function updateSelectedValues(selectedValues) {
//   const selectedValuesContainer = document.querySelector('.selected-filter-list');
//   selectedValuesContainer.textContent = '';
//   selectedValues.forEach((value) => {
//     const valueElement = document.createElement('div');
//     valueElement.classList.add('selected-filter-value');
//     valueElement.textContent = value;
//     const cancelElement = document.createElement('div');
//     cancelElement.classList.add('cancel-filter');
//     selectedValuesContainer.appendChild(valueElement);
//     valueElement.appendChild(cancelElement);
//   });
//   // Append the new container below the filter list
//   const existingContainer = document.getElementById('selected-values-container');
//   if (existingContainer) {
//     existingContainer.remove();
//   }
//   handleCancelSelectedValue();
// }

function handleCheckBoxSelectionForSeries() {
  const filterLists = document.querySelectorAll('.filter-list');
  filterLists.forEach((filterList) => {
    const filterLabelHeading = filterList.previousElementSibling;
    const checkboxes = filterList.querySelectorAll('.filter-checkbox');
    const selectedValues = [];

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          if (!filterLabelHeading.classList.contains('is-active')) {
            filterLabelHeading.classList.add('is-active');
          }
          selectedValues.push(checkbox.id);
        } else {
          const index = selectedValues.indexOf(checkbox.id);
          if (index !== -1) {
            selectedValues.splice(index, 1);
          }
          // Remove is-active class if no checkbox is selected
          if (selectedValues.length === 0) {
            filterLabelHeading.classList.remove('is-active');
          }
        }
        // Update the displayed selected values
        // eslint-disable-next-line no-use-before-define
        updateSelectedValues(selectedValues, filterList);
      });
    });
  });
}

function updateSelectedValues(selectedValues, filterList) {
  const selectedList = filterList.nextElementSibling;
  selectedList.innerHTML = '';
  selectedValues.forEach((value) => {
    const valueElement = document.createElement('div');
    valueElement.classList.add('selected-filter-value');
    valueElement.textContent = value;
    selectedList.appendChild(valueElement);
  });
}

function stockLocatorFilterDom(filterData, typeKey) {
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
  filterWrapperContainer.appendChild(selectedFilterList);
  document.querySelector('.stock-locator-model-detail-definition-specification-wrapper').appendChild(filterContainer);
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

function processFilterData(filterData, typeKey) {
  if (!filterData) return;
  const sortedFilterData = sortFilterResponse(filterData);
  const filterResponseData = [];

  sortedFilterData.forEach((data) => {
    const responseData = data || '';
    filterResponseData.push(responseData);
  });

  stockLocatorFilterDom(filterResponseData, typeKey);
}

function createStockLocatorFilter(filterResponse) {
  processFilterData(filterResponse?.series, 'series');
  processFilterData(filterResponse?.driveType, 'driveType');
  processFilterData(filterResponse?.fuel, 'fuel');
  handleToggleFilterDropDown();
}

async function stockLocatorAPiCalled() {
  const stockFilterResponse = await getStockLocatorFiltersData();
  const stockFilterData = stockFilterResponse.data.attributes;
  createStockLocatorFilter(stockFilterData);
}

export default async function decorate(block) {
  const modelDetails = [...block.children];
  modelDetails.forEach((modelDetail) => {
    const [general] = modelDetail.children;
    console.log(general);
    // stock locator API called here
  });
  stockLocatorAPiCalled();
}
