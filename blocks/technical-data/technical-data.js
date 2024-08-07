import {
  getApiResponse,
  getResolutionKey,
  getCosyImageUrl,
  getCosyImage,
  getTechnicalSpreadsheetData,
} from '../../scripts/common/wdh-util.js';
import { fetchPlaceholders } from '../../scripts/aem.js';
import { techDataMarkUp, techDataWdhResponsObject } from '../../scripts/common/technical-data-structure.js';
import {
  DEV, STAGE, PROD, disclaimerTechDataEndPoint,
} from '../../scripts/common/constants.js';
import { pushCustomLinkAnalyticData } from '../../scripts/analytics-util.js';

const env = document.querySelector('meta[name="env"]').content;
const savedListOfModels = [];
let savedSpreadSheetModels = [];
const lang = document.querySelector('meta[name="language"]').content;
const georegion = document.querySelector('meta[name="georegion"]').content;
const disclaimerToBeEncryptedValue = `/content/dam/metafox/${georegion?.toLowerCase() || ''}`;
let placeholders = await fetchPlaceholders(`/${lang}`);
let isBlockLoaded = false;

const placeholders2 = {
  techDataModelTitle: 'Izaberite model',
  techDataTransmissionTypeTitle: 'Izaberite menjač',
  techDataTechnicalDataFor: 'TECHNICAL DATA FOR ',
  techDataMmText: 'mm',
  techDataTotalPower: 'Total Power',
  techDataEngineType: 'Engine type',
  techDataPowerInKw: 'Power in kW (hp)',
  techDataTorqueInNm: 'Torque in Nm',
  techDataTransmission: 'Transmission',
  techDataGearBox: 'Gearbox',
  techDataDrive: 'Drive',
  techDataTwinPower: 'TwinPower Turbo internal combustion engine',
  techDataCylinders: 'Cylinders',
  techDataVolumneInCm: 'Volume in cm',
  techDataNominalPowerInKw: 'Nominal power in kW (HP)/1/min',
  techDataNominalSpeedInNm: 'Nominal speed in Nm/1/min',
  techDataElectricMotor: 'Electric motor',
  techDataNominalPowerElectricMotorKw: 'Nominal power of the electric motor in kW (HP)',
  techDataNominalTorqueInNm: '(Nominal) torque in Nm',
  techDataPerformance: 'Performance',
  techDataAccelerationZeroToHundread: 'Acceleration 0-100 km/h for s',
  techDataMaximumSpeedInKm: 'Maximum speed in km/h',
  techDataMaximumSpeedInKmElectricMotor: 'Maximum speed in km/h (electric motor)',
  techDataConsumptionEmission: 'Consumption/Emissions',
  techDataFuelConsumptionCombinedWltpUl: 'Fuel consumption, combined WLTP ul/100 km',
  techDataC02EmissionsCombinedWltpUgkm: 'C02 emissions, combined WLTP ug/km',
  techDataEnergyConsumptionCombinedWltpInKwh: 'Energy consumption, combined WLTP in kWh/100 km',
  techDataElectricRangeWltpInKm: 'Electric range, WLTP in km',
  techDataHighVoltageBatteryCharging: 'High voltage battery/48V, charging',
  techDataBatteryCapacityInKwh: 'Battery capacity in kWh',
  techDataAdditionalRangeAfterMinOfCharge: 'Additional range after 10 minutes of charging at a high-power station in km',
  techDataMaximumChargingPowerAcDcInKw: 'Maximum charging power AC/DC in kW',
  techDataChargingTimeAcHr: 'Charging time AC 0–100% hr',
  techDataChargingTimeDcInMin: 'Charging time DC 10–80% in min',
  techDataDimensionsWeights: 'Dimensions/weights',
  techDataLengthInMm: 'Length in mm',
  techDataWidthInMm: 'Width in mm',
  techDataHeightInMm: 'Height in mm',
  techDataWidthIncludingMirrorsInMm: 'Width including mirrors in mm',
  techDataWheelbaseInMm: 'Wheelbase in mm',
  techDataEmptyVehicleWeightInKg: 'Empty vehicle weight in kg',
  techDataMaximumAllowedWeightInKg: 'Maximum allowed weight in kg',
  techDataLoadCapacityInKg: 'Load capacity in kg',
  techDataOptionallySuppliedTowing: 'Optionally supplied towing hook for trailer mass, braked up to 12%/rigid connection in kg',
  techDataCapacityofTheLuggageSpaceUl: 'Capacity of the luggage space ul',
  techDataTheVolumeOfTheReservoirUl: 'The volume of the reservoir ul',
};

placeholders = { ...placeholders, ...placeholders2 };

function enableClickEventForClose(closeBtn) {
  closeBtn.addEventListener('click', (e) => {
    const parentElem = e.target.closest('.techdata-model-ddl-ul-container');
    const ddlBtnContainer = e.target.closest('.techdata-model-ddl-container');
    const ddlBtn = ddlBtnContainer.querySelector('.techdata-model-ddl-selected');
    if (parentElem) parentElem.classList.remove('active');
    if (ddlBtn) ddlBtn.classList.remove('clicked');
  });
}

function enableClickEventForDdl(ddl) {
  ddl.addEventListener('click', (e) => {
    const parentElem = e.target.closest('.techdata-model-ddl-container');
    const ddlBtn = parentElem.querySelector('.techdata-model-ddl-ul-container');
    e.target.classList.toggle('clicked');
    ddlBtn?.classList?.toggle('active');

    // Check if dropdown is open
    const isOpen = e.target.classList.contains('clicked') || ddlBtn?.classList?.contains('active');

    // Function to close dropdown
    /* eslint-disable func-names */
    const closeDropdown = function (event) {
      if (!parentElem.contains(event.target)) {
        // Click occurred outside the dropdown container, close it
        e.target.classList.remove('clicked');
        if (ddlBtn) ddlBtn.classList.remove('active');

        // Remove the event listener once the dropdown is closed
        document.removeEventListener('click', closeDropdown);
      }
    };

    // Add or remove event listener based on dropdown state
    if (isOpen) {
      // Add event listener to detect clicks anywhere on the document
      document.addEventListener('click', closeDropdown);
    } else {
      // Remove the event listener if dropdown is closed
      document.removeEventListener('click', closeDropdown);
    }
  });
}

// function to set max height so that when accordion button
// is clicked it shows animation effects
export function onLoadCalculateTechDataTableHeight() {
  const listOfTechDataTables = document.querySelectorAll('.techdata-tables-container .techdata-table tbody');
  const listOfTechDataTablesWithCarImg = document.querySelectorAll('.techdata-tables-container .techdata-table thead');

  // unset all max height style so that table ll take auto height
  listOfTechDataTables.forEach((tbody) => {
    tbody.style.maxHeight = 'unset';
  });

  listOfTechDataTablesWithCarImg.forEach((thead) => {
    thead.style.maxHeight = 'unset';
  });

  listOfTechDataTables.forEach((tbody) => {
    const height = tbody.offsetHeight;
    tbody.style.maxHeight = `${height}px`;
  });

  listOfTechDataTablesWithCarImg.forEach((thead) => {
    const height = thead.offsetHeight;
    thead.style.maxHeight = `${height}px`;
  });
}

export function technicalDataResize() {
  window.addEventListener('resize', () => {
    onLoadCalculateTechDataTableHeight();
  });
}

// attaching click event for accordion clicks
export function onLoadTechDataAttachAnchorClick() {
  const listOfTableContainer = document.querySelectorAll('.technical-data-block.techdata-enable-accordion .techdata-tables-container');
  listOfTableContainer.forEach((tableContainer) => {
    tableContainer.addEventListener('click', (event) => {
      if (event.target.tagName === 'CAPTION' || event.target.classList.contains('techdata-table-caption-btn')
        || event.target.classList.contains('techdata-caption-icon')) {
        const parentTable = event.target.closest('table');
        const tbody = parentTable?.querySelector('tbody');
        const thead = parentTable?.querySelector('thead');
        const arrowIcon = parentTable?.querySelector('.techdata-caption-icon');
        if (arrowIcon) arrowIcon.classList.toggle('clicked');
        if (tbody) tbody.classList.toggle('clicked');
        if (thead) thead.classList.toggle('clicked');
      }
    });
  });
}

function replacePlaceholders(template, data) {
  return template.replace(/{(\w+(\.\w+)*?)}/g, (match, path) => {
    const keys = path.split('.');
    const val = keys.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : match), data);
    return val;
  });
}

function replaceSpreadSheetPlaceholders(template, data) {
  return template.replace(/\{responseJson\.(\w+)\}/g, (match, key) => (data[key] !== undefined ? data[key] : ''));
}

function sortFootNotesArray(uniqueFootnotesArray) {
  return uniqueFootnotesArray?.sort((a, b) => {
    // Extract the numeric part of the strings
    const numA = parseInt(a.slice(1), 10); // Specifying radix 10
    const numB = parseInt(b.slice(1), 10); // Specifying radix 10

    // Compare the numeric parts
    return numA - numB;
  });
}

function generateSupElementForFootnotes(footNotesObj) {
  Object.keys(footNotesObj).forEach((className) => {
    const values = footNotesObj[className];
    const elements = document.querySelectorAll(`.${className}`);

    elements.forEach((element) => {
      values.forEach((value) => {
        const sup = document.createElement('sup');
        sup.setAttribute('id', `ref-${value}`);
        sup.classList.add('footnotes-reference-sup');

        const anchorElem = document.createElement('a');
        anchorElem.classList.add('footnotes-reference-a');
        anchorElem.setAttribute('href', `#disclaimer-${value}`);
        sup.appendChild(anchorElem);

        element.appendChild(sup);
      });
    });
  });
}

// Function to handle smooth scroll to a target element
function smoothScroll(target) {
  document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
}

async function generateDisclaimer(footNotesObj) {
  let publishDomain = '';
  if (env === 'dev') {
    publishDomain = DEV.hostName;
  } else if (env === 'stage') {
    publishDomain = STAGE.hostName;
  } else {
    publishDomain = PROD.hostName;
  }
  const regex = /^(.*\.hlx\.(page|live)|localhost)$/;
  const gqlOrigin = regex.exec(window.location.hostname) ? publishDomain : '';
  const footNotesArray = Object.values(footNotesObj).flat();
  const uniqueFootnotestArray = sortFootNotesArray([...new Set(footNotesArray)]);
  const listOfDisclaimer = [];

  // loop through footnotes and create sup element
  generateSupElementForFootnotes(footNotesObj);
  /* eslint-disable no-await-in-loop */
  /* eslint-disable no-console */
  /* eslint-disable no-restricted-syntax */
  for (const fValue of uniqueFootnotestArray) {
    const replacedValuesInUrl = disclaimerTechDataEndPoint.replace('{fvalue}', fValue).replace('{encryptedstring}', disclaimerToBeEncryptedValue);
    const response = await fetch(`${gqlOrigin}${replacedValuesInUrl}`);
    const responseJson = await response.json();
    responseJson?.data?.disclaimercfmodelList?.items?.forEach((item) => {
      listOfDisclaimer.push({
        key: fValue,
        value: item?.disclaimer?.html,
      });
    });
  }

  return listOfDisclaimer;
}

// function to delete empty tr and td in tables
function deleteEmptyTableValues(tableContainer) {
  const tables = tableContainer.querySelectorAll('div > table');

  tables.forEach((table) => {
    const tbodies = table.querySelectorAll('tbody');

    tbodies.forEach((tbody) => {
      const rows = tbody.querySelectorAll('tr');

      /* eslint-disable no-plusplus */
      for (let i = rows.length - 1; i >= 0; i--) {
        // Select the second td (value)
        const valueCell = rows[i].querySelector('td:nth-child(2)');

        // Check if the value td is empty
        if (valueCell.textContent.trim() === '' || valueCell.textContent.trim() === '-') {
          rows[i].remove();
        }
      }

      if (tbody.querySelectorAll('tr').length === 0) {
        tbody.remove();
      }
    });

    if (table.querySelectorAll('tbody').length === 0) {
      table.remove();
    }
  });
}

function bindClickEventForFootNotesLink(parentBlock) {
  // Add click event listeners to references
  parentBlock.querySelectorAll('.footnotes-reference-a').forEach((ref) => {
    ref.addEventListener('click', (event) => {
      event.preventDefault();
      smoothScroll(ref.getAttribute('href'));
    });
  });

  // Add click event listeners to disclaimers
  parentBlock.querySelectorAll('.techdata-table-disclaimer-a').forEach((disclaimer) => {
    disclaimer.addEventListener('click', (event) => {
      event.preventDefault();
      smoothScroll(disclaimer.getAttribute('href'));
    });
  });
}

/* eslint-disable no-console */
function triggerAnalytics(clickedElem) {
  try {
    if (clickedElem?.target) {
      const anchorTag = clickedElem.target;
      const analyticsLabel = anchorTag.getAttribute('data-analytics-label');
      const primaryCategory = anchorTag.getAttribute('data-analytics-link-type');
      const subCategory = anchorTag.getAttribute('data-analytics-subcategory-1');
      const subCategory2 = anchorTag.getAttribute('data-analytics-subcategory-2');
      const blockName = anchorTag.getAttribute('data-analytics-block-name');
      const sectionId = anchorTag.getAttribute('data-analytics-section-id');

      pushCustomLinkAnalyticData([
        analyticsLabel,
        primaryCategory,
        subCategory,
        blockName,
        sectionId,
        '',
        '',
        subCategory2,
      ]);
    }
  } catch (error) {
    console.error(error);
  }
}

async function generateTechUi(parentBlock) {
  const technicalDataTableContainer = parentBlock.querySelector('.techdata-tables-container');
  const selectedModel = parentBlock.querySelector('.models-type-ddl .techdata-model-ddl-model-item.active');
  const selectedTransmissionType = parentBlock.querySelector('.transmission-type-ddl .techdata-model-ddl-model-item.active');
  const agCode = selectedModel?.querySelector('.techdata-model-ddl-model-btn')?.getAttribute('data-agcode') || '';
  const transmissionType = selectedTransmissionType?.querySelector('.techdata-model-ddl-model-btn')?.getAttribute('data-transmission-code') || '';
  const selectedModelHeading = parentBlock.querySelector('.techdata-selected-model-title');
  selectedModelHeading.textContent = '';
  const agCodeArrayObj = agCode ? savedListOfModels.filter(
    (vehicle) => vehicle.agCode === agCode,
  ) : savedListOfModels;
  let technicalData;
  let footNotes;
  if (transmissionType) {
    const transCodeArray = agCodeArrayObj[0]?.json?.responseJson?.model?.vehicles?.filter(
      (transType) => transType?.transmissionCode === transmissionType,
    );
    technicalData = transCodeArray[0].technicalData;
    footNotes = transCodeArray[0].footnotes;
  } else {
    technicalData = agCodeArrayObj[0]?.json?.responseJson?.model?.vehicles[0]?.technicalData;
    footNotes = agCodeArrayObj[0]?.json?.responseJson?.model?.vehicles[0]?.footnotes;
  }

  if (technicalData) {
    technicalDataTableContainer.textContent = '';
    const description = agCodeArrayObj[0]?.json?.responseJson?.model?.description;
    // appending selected model detail in heading
    selectedModelHeading.textContent = `${placeholders?.techDataTechnicalDataFor} 
    ${description}`;

    const data = { placeholders, technicalData };
    const replacedHtml = replacePlaceholders(techDataMarkUp, data);
    technicalDataTableContainer.innerHTML = replacedHtml;

    // replace engine type with placeholder
    const fuelTypeElem = technicalDataTableContainer.querySelector('.value.powerTrain_fuelType');
    if (fuelTypeElem) {
      const fuelValue = fuelTypeElem.textContent.toLowerCase();
      fuelTypeElem.textContent = placeholders[fuelValue] || fuelTypeElem.textContent;
    }

    // generate disclaimer data
    const disclaimerData = await generateDisclaimer(footNotes);

    const disclaimerContainer = document.createElement('div');
    disclaimerContainer.classList.add('techdata-table-disclaimer-container');

    disclaimerData.forEach((disclaimerItem, index) => {
      const pTag = document.createElement('p');
      pTag.classList.add('techdata-table-disclaimer-p');

      const aTag = document.createElement('a');
      aTag.classList.add('techdata-table-disclaimer-a');
      aTag.textContent = index + 1;
      aTag.setAttribute('id', `disclaimer-${disclaimerItem.key}`);
      aTag.setAttribute('href', `#ref-${disclaimerItem.key}`);

      // fetching all footnotes and appending disclaimer index as sup value
      const listOfFootNotRef = parentBlock.querySelectorAll(`a[href='#disclaimer-${disclaimerItem.key}']`);
      listOfFootNotRef.forEach((refElem) => {
        refElem.textContent = `${index + 1}`;
      });

      const spanTag = document.createElement('span');
      spanTag.classList.add('techdata-table-disclaimer-span');
      spanTag.innerHTML = disclaimerItem.value;

      pTag.append(aTag);
      pTag.append(spanTag);
      disclaimerContainer.append(pTag);
    });

    if (disclaimerContainer.children.length > 0) {
      const container = parentBlock.querySelector('.techdata-disclaimer-container');
      container.textContent = '';
      container.append(disclaimerContainer);
    }

    // bind click event for disclaimer navigation
    bindClickEventForFootNotesLink(parentBlock);

    // making cozy call
    const imageSide = technicalDataTableContainer.querySelector('.techdata-table-img-side');
    const imageFront = technicalDataTableContainer.querySelector('.techdata-table-img-front');
    const imageBack = technicalDataTableContainer.querySelector('.techdata-table-img-back');

    let response;
    /* eslint-disable no-console */
    try {
      // delete
      response = await getCosyImage(agCode);
    } catch (error) {
      console.error(error);
    }

    const screenWidth = window.innerWidth;
    const resolutionKey = getResolutionKey(screenWidth);

    const createPictureTag = (quality) => {
      const pictureTag = document.createElement('picture');
      const resolutions = [1025, 768];
      resolutions.forEach((resolution) => {
        const sourceTag = document.createElement('source');
        sourceTag.srcset = getCosyImageUrl(
          response,
          getResolutionKey(resolution),
          quality,
        );
        sourceTag.media = `(min-width: ${resolution}px)`;
        pictureTag.appendChild(sourceTag);
      });

      // Fallback img tag
      const imgTag = document.createElement('img');
      imgTag.src = getCosyImageUrl(response, resolutionKey, quality);
      imgTag.alt = agCode;
      imgTag.classList.add('techdata-table-img');
      pictureTag.appendChild(imgTag);

      return pictureTag;
    };

    if (response) {
      imageSide.append(createPictureTag(90));
      imageFront.append(createPictureTag(0));
      imageBack.append(createPictureTag(180));
    }

    // delete table values if empty
    deleteEmptyTableValues(technicalDataTableContainer);

    // if block is loaded it mean calculate max height of tbody is already done so
    // u need to call calculate height method again when u r binding new table to Ui
    // after ddl selection
    if (isBlockLoaded) onLoadCalculateTechDataTableHeight();
  }
}

function generateTransTypeDdl(agCode, parentBlock) {
  const dropDownContainer = parentBlock.querySelector('.techdata-ddl-container');

  const transmissionTypeDdl = parentBlock.querySelector('.transmission-type-ddl');
  if (transmissionTypeDdl) transmissionTypeDdl.remove();

  const modelDdlContainer = document.createElement('div');
  modelDdlContainer.classList.add('techdata-model-ddl-container');
  modelDdlContainer.classList.add('transmission-type-ddl');

  const modelHeadingSpan = document.createElement('span');
  modelHeadingSpan.classList.add('techdata-model-ddl-title');
  modelHeadingSpan.textContent = placeholders.techDataTransmissionTypeTitle;
  modelDdlContainer.append(modelHeadingSpan);

  const selectedModelBtn = document.createElement('button');
  selectedModelBtn.classList.add('techdata-model-ddl-selected');
  selectedModelBtn.classList.add('transmission-ddl-selected');
  selectedModelBtn.append(document.createRange().createContextualFragment(`
    <span class="techdata-model-ddl-selected-text"></span>            
    <i class="techdata-model-ddl-icon" data-icon="arrow_chevron_down" aria-hidden="true"></i>
    `));
  modelDdlContainer.append(selectedModelBtn);

  const cloneedselectedModelBtnMob = selectedModelBtn.cloneNode(true);
  cloneedselectedModelBtnMob.className = 'techdata-model-ddl-selected-mob';

  enableClickEventForDdl(selectedModelBtn);

  const modelDdlList = document.createElement('ul');
  modelDdlList.classList.add('techdata-model-ddl-ul');
  modelDdlList.append(cloneedselectedModelBtnMob);

  const ulContainer = document.createElement('div');
  ulContainer.classList.add('techdata-model-ddl-ul-container');
  const closeBtn = document.createElement('button');
  closeBtn.classList.add('techdata-model-ddl-close-btn');
  enableClickEventForClose(closeBtn);

  closeBtn.append(document.createRange().createContextualFragment(`
  <i data-icon="close" aria-hidden="true"></i>
  `));
  ulContainer.append(closeBtn);
  ulContainer.append(modelDdlList);
  modelDdlContainer.append(ulContainer);

  const agCodeArrayObj = savedListOfModels.filter((vehicle) => vehicle.agCode === agCode);
  const listOfTranmissions = agCodeArrayObj.map(
    (vehicle) => vehicle?.json?.responseJson?.model?.vehicles,
  );
  const [analyticsLabel] = agCodeArrayObj[0]?.analytics?.children || [];

  // if list of tranmission type is 1 then hide ddl
  if (listOfTranmissions && listOfTranmissions.length > 0) {
    if (listOfTranmissions[0].length > 1) {
      modelDdlContainer.classList.remove('hidden');
    } else {
      modelDdlContainer.classList.add('hidden');
    }
  }

  /* eslint-disable no-restricted-syntax */
  for (const fuel of listOfTranmissions[0]) {
    const liItem = document.createElement('li');

    const modelsUnderTheFuelList = document.createElement('ul');
    modelsUnderTheFuelList.classList.add('techdata-model-ddl-model-container');

    const modelLi = document.createRange().createContextualFragment(`
            <li class="techdata-model-ddl-model-item"><button class="techdata-model-ddl-model-btn transmission-ddl" data-transmission-code="${fuel.transmissionCode}"
            data-analytics-label='${analyticsLabel?.textContent?.trim() || ''}'
            data-analytics-link-type='technicaldata.option'
            data-analytics-subcategory-1='${agCode || ''}'
            data-analytics-subcategory-2='${fuel?.transmissionCode || ''}'
            data-analytics-block-name='${parentBlock?.dataset?.blockName?.trim() || ''}'
            data-analytics-section-id='${parentBlock?.closest('.section')?.dataset?.analyticsLabel || ''}'
            >
            <span class="techdata-model-ddl-model-item-title">${fuel.transmissionCode || ''}</span>
            <i class="techdata-model-ddl-model-selected-icon" aria-hidden="true">
            </button></li>`);
    modelsUnderTheFuelList.append(modelLi);

    liItem.append(modelsUnderTheFuelList);
    modelDdlList.append(liItem);
  }
  dropDownContainer.append(modelDdlContainer);

  // bind click event for transmission type ddl
  const modelSelectionList = parentBlock.querySelectorAll('.techdata-model-ddl-model-btn.transmission-ddl');
  modelSelectionList.forEach((transmissionTypeBtn) => {
    transmissionTypeBtn.addEventListener('click', (e) => {
      const immediateParentUl = e.target.closest('.techdata-model-ddl-ul');
      const listOfModelBtns = immediateParentUl.querySelectorAll('.techdata-model-ddl-model-item');
      const currentSelectedLi = e.target.closest('.techdata-model-ddl-model-item');
      const parentBlockElem = e.target.closest('.technical-data-block');

      // loop through this list and remove active class
      listOfModelBtns.forEach((liElem) => {
        liElem.classList.remove('active');
      });

      // set current clicked item as active
      currentSelectedLi.classList.add('active');

      // update techData and generate
      const parentModelDdlContainer = parentBlockElem.querySelector('.transmission-type-ddl');
      const activeModelLi = parentModelDdlContainer.querySelector('.techdata-model-ddl-model-item.active');
      const activeModelLiBtn = activeModelLi.querySelector('.techdata-model-ddl-model-btn');
      const activeModelLiBtnText = activeModelLiBtn.querySelector('.techdata-model-ddl-model-item-title');
      const listOfSelectedText = parentModelDdlContainer.querySelectorAll('.techdata-model-ddl-selected-text');

      // updating selected model value
      listOfSelectedText.forEach((spanElem) => {
        spanElem.textContent = activeModelLiBtnText?.textContent;
      });

      // hidding drop down which are active i.e opened or visible
      const activeDdl = parentBlockElem.querySelectorAll('.techdata-model-ddl-ul-container.active');
      activeDdl.forEach((ddl) => {
        const parentContainer = ddl.closest('.techdata-model-ddl-container');
        const ddlTriggerBtn = parentContainer.querySelector('.techdata-model-ddl-selected');
        if (ddlTriggerBtn) ddlTriggerBtn.click();
      });

      // trigger analytics
      triggerAnalytics(e);

      // generate UI
      generateTechUi(parentBlockElem);
    });
  });

  // select first tranmission type if present
  const firstTranmissionType = parentBlock.querySelector('.techdata-model-ddl-model-btn.transmission-ddl');
  if (firstTranmissionType) firstTranmissionType.click();
}

function updateUiAfterDdlSelection(selectionType, block) {
  // hidding drop down which are active i.e opened or visible
  const activeDdl = block.querySelectorAll('.techdata-model-ddl-ul-container.active');
  activeDdl.forEach((ddl) => {
    const parentContainer = ddl.closest('.techdata-model-ddl-container');
    const ddlTriggerBtn = parentContainer.querySelector('.techdata-model-ddl-selected');
    if (ddlTriggerBtn) ddlTriggerBtn.click();
  });

  if (selectionType === 'model-selection') {
    const parentModelDdlContainer = block.querySelector('.models-type-ddl');
    const activeModelLi = parentModelDdlContainer.querySelector('.techdata-model-ddl-model-item.active');
    const activeModelLiBtn = activeModelLi.querySelector('.techdata-model-ddl-model-btn');
    const activeModelLiBtnText = activeModelLiBtn.querySelector('.techdata-model-ddl-model-item-title');
    const listOfSelectedText = parentModelDdlContainer.querySelectorAll('.techdata-model-ddl-selected-text');

    // updating selected model value
    listOfSelectedText.forEach((spanElem) => {
      spanElem.textContent = activeModelLiBtnText?.textContent;
    });

    // calling function to generate transmission type dropdown
    const agCode = activeModelLiBtn.getAttribute('data-agcode');
    generateTransTypeDdl(agCode, block);
  }
}

function enableClickEventForModelDdl(ddlContainer) {
  if (ddlContainer) {
    const modelSelectionList = ddlContainer.querySelectorAll('.techdata-model-ddl-model-btn.models-ddl');
    modelSelectionList.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const immediateParentUl = e.target.closest('.techdata-model-ddl-ul');
        const listOfModelBtns = immediateParentUl.querySelectorAll('.techdata-model-ddl-model-item');
        const currentSelectedLi = e.target.closest('.techdata-model-ddl-model-item');
        const parentBlockElem = e.target.closest('.technical-data-block');

        // loop through this list and remove active class
        listOfModelBtns.forEach((liElem) => {
          liElem.classList.remove('active');
        });

        // set current clicked item as active
        currentSelectedLi.classList.add('active');

        // function to update techData and generate
        updateUiAfterDdlSelection('model-selection', parentBlockElem);
      });
    });
  }
}

function generateModelsDdl(listOfModels, dropDownContainer) {
  const modelDdlContainer = document.createElement('div');
  modelDdlContainer.classList.add('techdata-model-ddl-container');
  modelDdlContainer.classList.add('models-type-ddl');

  const modelHeadingSpan = document.createElement('span');
  modelHeadingSpan.classList.add('techdata-model-ddl-title');
  modelHeadingSpan.textContent = placeholders.techDataModelTitle;
  modelDdlContainer.append(modelHeadingSpan);

  const selectedModelBtn = document.createElement('button');
  selectedModelBtn.classList.add('techdata-model-ddl-selected');
  selectedModelBtn.classList.add('model-ddl-selected');
  selectedModelBtn.append(document.createRange().createContextualFragment(`
    <span class="techdata-model-ddl-selected-text"></span>            
    <i class="techdata-model-ddl-icon" data-icon="arrow_chevron_down" aria-hidden="true"></i>
    `));
  modelDdlContainer.append(selectedModelBtn);

  const cloneedselectedModelBtnMob = selectedModelBtn.cloneNode(true);
  cloneedselectedModelBtnMob.className = 'techdata-model-ddl-selected-mob';

  enableClickEventForDdl(selectedModelBtn);

  const modelDdlList = document.createElement('ul');
  modelDdlList.classList.add('techdata-model-ddl-ul');
  modelDdlList.append(cloneedselectedModelBtnMob);

  const ulContainer = document.createElement('div');
  ulContainer.classList.add('techdata-model-ddl-ul-container');
  const closeBtn = document.createElement('button');
  closeBtn.classList.add('techdata-model-ddl-close-btn');
  enableClickEventForClose(closeBtn);

  closeBtn.append(document.createRange().createContextualFragment(`
  <i data-icon="close" aria-hidden="true"></i>
  `));
  ulContainer.append(closeBtn);
  ulContainer.append(modelDdlList);
  modelDdlContainer.append(ulContainer);

  /* eslint-disable no-restricted-syntax */
  for (const fuel in listOfModels) {
    if (Object.hasOwn(listOfModels, fuel)) {
      const liItem = document.createElement('li');

      const fuelHeadingSpan = document.createElement('span');
      fuelHeadingSpan.classList.add('techdata-model-ddl-fuel-title');
      fuelHeadingSpan.textContent = fuel;
      liItem.append(fuelHeadingSpan);

      const modelsUnderTheFuelList = document.createElement('ul');
      modelsUnderTheFuelList.classList.add('techdata-model-ddl-model-container');

      listOfModels[fuel].forEach((model) => {
        const [analyticsLabel] = model?.analytics?.children || [];
        let listOfAttributes = '';
        // fetchinf data attributes of authored model card
        /* eslint-disable no-plusplus */
        for (let i = 0; i < model?.modelParentDiv?.attributes.length; i++) {
          const attr = model?.modelParentDiv?.attributes[i];
          listOfAttributes += `${attr.name}="${attr.value}" `;
        }
        const modelLi = document.createRange().createContextualFragment(`
            <li class="techdata-model-ddl-model-item" ${listOfAttributes}><button class="techdata-model-ddl-model-btn models-ddl" data-agcode="${model?.agCode}"
            data-analytics-label='${analyticsLabel?.textContent?.trim() || ''}'>
            <span class="techdata-model-ddl-model-item-title">${model?.description || ''}</span>
            <i class="techdata-model-ddl-model-selected-icon" aria-hidden="true"></i>
            </button></li>`);
        modelsUnderTheFuelList.append(modelLi);
      });
      liItem.append(modelsUnderTheFuelList);
      modelDdlList.append(liItem);
    }
  }
  dropDownContainer.append(modelDdlContainer);
}

function generateAuthoredModels(
  modelDetailResponse,
  authoredAgCode,
  listOfModels,
  analyticsProp,
  modelData,
) {
  // check if u have already saved agCode details
  const isModelExists = savedListOfModels?.some((model) => model.agCode === authoredAgCode);
  const fuelTypeVal = modelDetailResponse?.responseJson?.model?.powerTrain?.fuelType?.toLowerCase();

  const fuelType = placeholders[fuelTypeVal];
  if (!listOfModels[fuelType]) {
    listOfModels[fuelType] = [];
  }
  listOfModels[fuelType].push({
    agCode: authoredAgCode,
    analytics: analyticsProp,
    fuelType,
    description: modelDetailResponse?.responseJson?.model?.description,
    modelParentDiv: modelData,
  });

  // saving model details in global variable
  if (!isModelExists) {
    savedListOfModels.push({
      agCode: authoredAgCode,
      analytics: analyticsProp,
      json: modelDetailResponse,
    });
  }
}

/* eslint-disable no-console */
function formateSpreadSheetResponse(authoredAgCode, listOfModels, analyticsProp, modelData) {
  try {
    let isAuthoredModelFound = false;
    savedSpreadSheetModels?.responseJson?.data?.forEach((modelObj, index) => {
      if (modelObj[index].ModelCode === authoredAgCode) {
        isAuthoredModelFound = true;
        const responseJson = modelObj[index];
        const newObj = replaceSpreadSheetPlaceholders(techDataWdhResponsObject, responseJson);
        const responseObj = {
          responseJson: JSON.parse(newObj),
        };
        generateAuthoredModels(responseObj, authoredAgCode, listOfModels, analyticsProp, modelData);
      }
    });

    if (!isAuthoredModelFound) {
      generateAuthoredModels({}, authoredAgCode, listOfModels, analyticsProp, modelData);
    }
  } catch (e) {
    console.log(e);
  }
}

// Function remove spaces in object keys
function removeSpacesInObjectKey(obj) {
  const replacedObj = {};
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      const newKey = key.replace(/ /g, '');
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        replacedObj[newKey] = removeSpacesInObjectKey(obj[key]);
      } else {
        replacedObj[newKey] = obj[key];
      }
    }
  }
  return replacedObj;
}

async function generateTechDataSpreadSheetObj(spreadSheetPath, spreadSheetFile) {
  try {
    const regex = /author-(.*?)\.adobeaemcloud\.com(.*?)/;
    const isMatch = regex.exec(window.location.host);
    const origin = isMatch ? `${spreadSheetPath}.json` : spreadSheetFile;
    const spreadSheetResponse = await getTechnicalSpreadsheetData(origin);
    if (spreadSheetResponse) {
      const convertedObj = removeSpacesInObjectKey(spreadSheetResponse);
      savedSpreadSheetModels = {
        responseJson: {
          data:
          Object.keys(
            convertedObj?.responseJson?.data,
          ).map((key) => ({ [key]: convertedObj?.responseJson?.data[key] })),
        },
      };
    }
  } catch (e) {
    console.error(e);
  }
}

async function loopModelsToFetchDetails(emptyModels, rows, enableAutoData, listOfModels) {
  /* eslint-disable no-await-in-loop */
  for (const modelData of rows) {
    const [modelProp, analyticsProp] = modelData?.children || [];
    modelData.textContent = '';

    modelProp.classList.add('techdata-model-ddl');

    const [modelPropData] = modelProp?.children || [];
    const splittedModelData = modelPropData?.textContent?.split(',');

    if (splittedModelData && splittedModelData?.length >= 3) {
      const authoredAgCode = splittedModelData[2]?.trim() || '';
      try {
        // wdh call or else spreadsheet call
        if (enableAutoData?.textContent === 'true') {
          const modelDetailResponse = await getApiResponse(authoredAgCode);
          generateAuthoredModels(
            modelDetailResponse,
            authoredAgCode,
            listOfModels,
            analyticsProp,
            modelData,
          );
        } else {
          formateSpreadSheetResponse(authoredAgCode, listOfModels, analyticsProp, modelData);
        }
      } catch (error) {
        console.error('fetch model detail failed');
      }
    } else {
      emptyModels.append(modelData);
    }
  }
}

/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
export default async function decorate(block) {
  block.classList.add('technical-data-block');
  const [
    techDataProp,
    headline1,
    headline2,
    ...rows
  ] = [...block.children].map((row, index) => {
    if (index < 3) {
      return row;
    }
    return row;
  });

  headline1.classList.add('techdata-rte-btn-container');
  headline2.classList.add('techdata-rte-btn-container');

  const heading = document.createElement('h2');
  heading.classList.add('techdata-selected-model-title');
  heading.textContent = placeholders.techDataTechnicalDataFor;

  const dropDownContainer = document.createElement('div');
  dropDownContainer.classList.add('techdata-ddl-container');

  const techDetailsTableContainer = document.createElement('div');
  techDetailsTableContainer.classList.add('techdata-tables-container');

  const rteContainer = document.createElement('div');
  rteContainer.classList.add('techdata-rte-container');
  rteContainer.append(headline1);
  rteContainer.append(headline2);

  const disclaimerContainer = document.createElement('div');
  disclaimerContainer.classList.add('techdata-disclaimer-container');

  const enableAutoData = techDataProp?.querySelector('h2');
  const enableAccordion = techDataProp?.querySelector('h3');
  if (enableAccordion?.textContent === 'true') {
    block.classList.add('techdata-enable-accordion');
  } else {
    block.classList.add('techdata-disable-accordion');
  }

  const spreadSheetPath = techDataProp?.querySelector('a')?.textContent;
  const spreadSheetFile = techDataProp?.querySelector('a')?.getAttribute('href');

  const listOfModels = [];

  if (enableAutoData?.textContent === 'false') {
    try {
      await generateTechDataSpreadSheetObj(spreadSheetPath, spreadSheetFile);
    } catch (e) {
      console.error(e);
    }
  }

  const emptyModels = document.createElement('div');

  await loopModelsToFetchDetails(emptyModels, rows, enableAutoData, listOfModels);

  generateModelsDdl(listOfModels, dropDownContainer);
  enableClickEventForModelDdl(dropDownContainer);

  block.textContent = '';
  block.append(heading);
  block.append(dropDownContainer);
  if (emptyModels.children.length > 0) block.append(emptyModels);
  block.append(techDetailsTableContainer);
  block.append(rteContainer);
  block.append(disclaimerContainer);

  // click first model to select it
  const firstModelDdlItem = block.querySelector('.techdata-model-ddl-model-btn.models-ddl');
  if (firstModelDdlItem) firstModelDdlItem.click();

  isBlockLoaded = true;
}
