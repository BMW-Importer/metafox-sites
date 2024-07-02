import {
  DEV,
  STAGE,
  PROD,
  disclaimerGQlEndpoint,
} from '../../scripts/common/constants.js';
import {
  fetchModelPlaceholderObject,
  fetchTechDataPlaceholderObject,
} from '../../scripts/common/wdh-placeholders.js';
import {
  buildContext,
  getCosyImage,
  getCosyImageUrl,
  replacePlaceholder,
  getResolutionKey,
  getFuelTypeImage,
  getFuelTypeLabelDesc,
} from '../../scripts/common/wdh-util.js';

const env = document.querySelector('meta[name="env"]').content;
const hostName = window?.location?.hostname;
const regExp = /^(.*\.hlx\.(page|live)|localhost)$/;
let galOrigin = '';
let publishDomain = '';

if (env === 'dev') {
  publishDomain = DEV.hostName;
} else if (env === 'stage') {
  publishDomain = STAGE.hostName;
} else {
  publishDomain = PROD.hostName;
}

async function getContentFragmentData(disclaimerCFPath, gqlOrigin) {
  const endpointUrl = gqlOrigin + disclaimerGQlEndpoint + disclaimerCFPath.innerText;
  const response = await fetch(endpointUrl);
  return response.json();
}

const modelRegex = /\{model(.*?)}/g;
const techRegex = /\{tech(.*?)}/g;
// when resize happens remove enablepopover class from left panel so that mobile dropdown
//  wont appear in desktop mode
export function drivetrainResize() {
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      const listOfDriveTrainBlocks = document.querySelectorAll('.drivetrain-switch-block');
      listOfDriveTrainBlocks.forEach((block) => {
        const leftPanel = block.querySelector('.dts-left-panel');
        leftPanel.classList.remove('enablepopover');
      });
    }
  });
}

function generateCloseIconClickEvent(closeIconLi) {
  closeIconLi.addEventListener('click', (e) => {
    const parentElem = e.target.closest('.dts-left-panel');
    const parentBlock = e.target.closest('.drivetrain-switch-block');
    const ddlBtn = parentBlock.querySelector('.dts-selected-model-mob');
    ddlBtn?.classList?.remove('active');
    parentElem.classList.remove('enablepopover');
  });
}

function enableClickEvent(selectedModelDdlMob) {
  selectedModelDdlMob.addEventListener('click', (e) => {
    e.target.classList.add('active');
    const nextElement = e.target.nextElementSibling;
    nextElement.classList.add('enablepopover');
  });
}

function generateTechnicalData1(technicalDetail1Cell, techTableData, wdhModelPlaceholder, wdhTechPlaceholder) {
  const tableRow1 = document.createElement('tr');
  let tableRow1Html = '';
  const dataFactLabel1 = technicalDetail1Cell?.querySelector('h2');
  if (dataFactLabel1?.outerHTML) {
    let modelTextContent = replacePlaceholder(dataFactLabel1.textContent, wdhModelPlaceholder, modelRegex);
    modelTextContent = replacePlaceholder(modelTextContent, wdhTechPlaceholder, techRegex);
    dataFactLabel1.textContent = modelTextContent;
    tableRow1Html = `<td class="" role="rowheader"><div>${dataFactLabel1.outerHTML}</div></td>`;
  }
  const dataFactVal1 = technicalDetail1Cell?.querySelector('h3');
  if (dataFactVal1?.outerHTML) {
    const modelTextContent = replacePlaceholder(dataFactVal1.textContent, wdhModelPlaceholder, modelRegex);
    const techTextContent = replacePlaceholder(dataFactVal1.textContent, wdhTechPlaceholder, techRegex);
    dataFactVal1.textContent = modelTextContent;

    tableRow1Html += `<td class="" role="cell"><div>${dataFactVal1.outerHTML}</div></td>`;
  }

  if (tableRow1Html) tableRow1.innerHTML = tableRow1Html;
  if (tableRow1.textContent) techTableData.append(tableRow1);

  const tableRow2 = document.createElement('tr');
  let tableRow2Html = '';

  const dataFactLabel2 = technicalDetail1Cell?.querySelector('h4');
  if (dataFactLabel2?.outerHTML) {
    const modelTextContent = replacePlaceholder(dataFactLabel2.textContent, wdhModelPlaceholder, modelRegex);
    const techTextContent = replacePlaceholder(dataFactLabel2.textContent, wdhTechPlaceholder, techRegex);
    dataFactLabel2.textContent = modelTextContent;
    tableRow2Html = `<td class="" role="rowheader"><div>${dataFactLabel2?.outerHTML}</div></td>`;
  }
  const dataFactVal2 = technicalDetail1Cell?.querySelector('h5');
  if (dataFactVal2?.outerHTML) {
    const modelTextContent = replacePlaceholder(dataFactVal2.textContent, wdhModelPlaceholder, modelRegex);
    const techTextContent = replacePlaceholder(dataFactVal2.textContent, wdhTechPlaceholder, techRegex);
    dataFactVal2.textContent = modelTextContent;
    tableRow2Html += `<td class="" role="cell"><div>${dataFactVal2?.outerHTML}</div></td>`;
  }

  if (tableRow2Html) tableRow2.innerHTML = tableRow2Html;
  if (tableRow2.textContent) techTableData.append(tableRow2);
}

function generateTechnicalData2(technicalDetail2Cell, techTableData, wdhModelPlaceholder, wdhTechPlaceholder) {
  const tableRow3 = document.createElement('tr');
  let tableRow3Html = '';

  const dataFactLabel3 = technicalDetail2Cell?.querySelector('h2');
  if (dataFactLabel3?.outerHTML) {
    const modelTextContent = replacePlaceholder(dataFactLabel3.textContent, wdhModelPlaceholder, modelRegex);
    const techTextContent = replacePlaceholder(dataFactLabel3.textContent, wdhTechPlaceholder, techRegex);
    dataFactLabel3.textContent = modelTextContent;
    tableRow3Html = `<td class="" role="rowheader"><div>${dataFactLabel3?.outerHTML}</div></td>`;
  }
  const dataFactVal3 = technicalDetail2Cell?.querySelector('h3');
  if (dataFactVal3?.outerHTML) {
    const modelTextContent = replacePlaceholder(dataFactVal3.textContent, wdhModelPlaceholder, modelRegex);
    const techTextContent = replacePlaceholder(dataFactVal3.textContent, wdhTechPlaceholder, techRegex);
    dataFactVal3.textContent = modelTextContent;
    tableRow3Html += `<td class="" role="cell"><div>${dataFactVal3?.outerHTML}</div></td>`;
  }
  if (tableRow3Html) tableRow3.innerHTML = tableRow3Html;
  if (tableRow3.textContent) techTableData.append(tableRow3);

  const tableRow4 = document.createElement('tr');
  let tableRow4Html = '';

  const dataFactLabel4 = technicalDetail2Cell?.querySelector('h4');
  if (dataFactLabel4?.outerHTML) {
    const modelTextContent = replacePlaceholder(dataFactLabel3.textContent, wdhModelPlaceholder, modelRegex);
    const techTextContent = replacePlaceholder(dataFactLabel3.textContent, wdhTechPlaceholder, techRegex);
    dataFactLabel3.textContent = modelTextContent;
    tableRow4Html = `<td class="" role="rowheader"><div>${dataFactLabel4?.outerHTML}</div></td>`;
  }
  const dataFactVal4 = technicalDetail2Cell?.querySelector('h5');
  if (dataFactVal4?.outerHTML) {
    const modelTextContent = replacePlaceholder(dataFactVal4.textContent, wdhModelPlaceholder, modelRegex);
    const techTextContent = replacePlaceholder(dataFactVal4.textContent, wdhTechPlaceholder, techRegex);
    dataFactVal4.textContent = modelTextContent;
    tableRow4Html += `<td class="" role="cell"><div>${dataFactVal4?.outerHTML}</div></td>`;
  }

  if (tableRow4Html) tableRow4.innerHTML = tableRow4Html;
  if (tableRow4.textContent) techTableData.append(tableRow4);
}

function generateLeftPanelModelList(modelGroup, element, selectedModelDdlMob, analytics, block, modelThumbnailElement) {
  const [modelCategory, modelLink, isSelected] = modelGroup.children;
  const [analyticsLabel, BtnType, btnSubType] = analytics.children;
  modelThumbnailElement.classList.add('dts-model-category-img');
  element.textContent = '';
  element.classList.add('dts-model-category-container');
  if (isSelected?.textContent === 'true') {
    element.classList.add('selected');
    element.append(
      document.createRange().createContextualFragment(`
                <span class='dts-model-category-title'>${modelCategory?.textContent}</span>                
                <div class='dts-category-box'>
                <span class='dts-fuel-image-type'></span>
                ${modelThumbnailElement.outerHTML}
                <span class='dts-model-category-descp'></span>
                <i class="dts-model-category-icon--selected" aria-hidden="true"></i></div>`),
    );
    selectedModelDdlMob.innerHTML = `<span class='dts-selected-model-title'>${modelCategory?.textContent}</span>
    <i class="dts-arrow-icon" data-icon="arrow_chevron_down" aria-hidden="true"></i>`;
  } else {
    element.append(
      document.createRange().createContextualFragment(`
                <span class='dts-model-category-title'>${modelCategory?.textContent}</span>            
                <div class='dts-category-box'>
                <span class='dts-fuel-image-type'></span>
                <a class='dts-model-category-link' href='${modelLink?.textContent}' data-analytics-label='${analyticsLabel?.textContent?.trim() || ''}'
                data-analytics-category='${BtnType?.textContent?.trim() || ''}'
                data-analytics-subCategory='${btnSubType?.textContent?.trim() || ''}'
                data-analytics-block-name='${block?.dataset?.blockName?.trim() || ''}'
                data-analytics-section-id='${block?.closest('.section')?.dataset?.analyticsLabel || ''}'
                data-analytics-custom-click='true'>
                ${modelThumbnailElement.outerHTML}
                <span class='dts-model-category-descp'></span>
                </a></div>`),
    );
  }
}

function bindAnalyticsValue(analytics, technicalLink, block) {
  if (analytics) {
    const [analyticsLabel, BtnType, btnSubType] = analytics.children;
    if (technicalLink) {
      technicalLink.dataset.analyticsLabel = analyticsLabel?.textContent?.trim() || '';
      technicalLink.dataset.analyticsCategory = BtnType?.textContent?.trim() || '';
      technicalLink.dataset.analyticsSubCategory = btnSubType?.textContent?.trim() || '';
      technicalLink.dataset.analyticsCustomClick = 'true';
      technicalLink.dataset.analyticsBlockName = block?.dataset?.blockName || '';
      technicalLink.dataset.analyticsSectionId = block?.closest('.section')?.dataset?.analyticsLabel || '';
    }
  }
}

export default async function decorate(block) {
  block.classList.add('drivetrain-switch-block');

  const leftPanel = document.createElement('div');
  leftPanel.classList.add('dts-left-panel');
  const rightPanel = document.createElement('div');
  rightPanel.classList.add('dts-right-panel');

  const selectedModelDdlMob = document.createElement('button');
  selectedModelDdlMob.classList.add('dts-selected-model-mob');

  const leftPanelModelGrouping = document.createElement('ul');
  leftPanelModelGrouping.classList.add('dts-model-grouping');

  const rightPanelTitleAndImg = document.createElement('div');
  rightPanelTitleAndImg.classList.add('dts-right-model-title-container');

  const rightPanelTechDetail = document.createElement('div');
  rightPanelTechDetail.classList.add('dts-right-tech-detail');

  const techTable = document.createElement('table');
  techTable.setAttribute('role', 'table');
  rightPanelTechDetail.append(techTable);
  const techTableData = document.createElement('tbody');
  techTableData.setAttribute('role', 'rowgroup');
  techTable.append(techTableData);

  const [
    fuelType,
    detailCell,
    disclaimerFragment,
    technicalDetail1Cell,
    technicalDetail2Cell,
    ...rows
  ] = [...block.children].map((row, index) => {
    if (index < 5) {
      return row;
    }
    return row;
  });

  // extracting detail cell
  const selectedFuelType = fuelType?.querySelector('h2');
  const selectedFuelTypeText = selectedFuelType?.textContent.trim();
  console.log(selectedFuelTypeText);
  block.removeChild(fuelType);

  const activeModelTitle = detailCell?.querySelector('h3');
  activeModelTitle.classList.add('dts-active-model-title');
  rightPanelTitleAndImg.append(activeModelTitle);
  rightPanel.append(rightPanelTitleAndImg);

  const modelDescp = detailCell?.querySelector('h4');
  modelDescp.classList.add('dts-active-model-descp');
  rightPanel.append(modelDescp);

  // appending table below the description
  rightPanel.append(rightPanelTechDetail);

  const technicalLink = detailCell?.querySelector('a');
  rightPanelTechDetail.append(technicalLink);

  const popover = detailCell?.querySelector('h6');
  if (popover.textContent === 'true') rightPanelTechDetail.classList.add('enable-popover');

  // removing detailcell so that it wont appear in content tree
  block.removeChild(detailCell);
  // disclaimer fragment
  const [disclaimerCF] = disclaimerFragment?.children || '';
  if (hostName) {
    const match = regExp.exec(hostName);
    if (match) {
      galOrigin = publishDomain;
    }
  }
  await getContentFragmentData(disclaimerCF, galOrigin).then((response) => {
    const cfData = response?.data;
    if (cfData) {
      const disclaimerHtml = cfData?.disclaimercfmodelByPath?.item?.disclaimer?.html;
      const disclaimerContent = document.createElement('div');
      disclaimerContent.className = 'disclaimer-content';
      disclaimerContent.innerHTML = disclaimerHtml;
      rightPanel.append(disclaimerContent);
      block.removeChild(disclaimerFragment);
    }
  });

  // looping through children model card blocks
  for (const element of rows) {
    const [modelGroup, context, analytics] = element?.children || '';
    bindAnalyticsValue(analytics, technicalLink, block);
    const [contextData] = context.children;
    const splitContextData = contextData?.textContent?.split(',');
    if (context) element.removeChild(context);
    const agCode = splitContextData[2]?.trim() || '7K11';
    let modelThumbnailElement;
    let fuelImageType;
    let fuelTypeDesc;
    await getCosyImage(agCode).then((responseJson) => {
      const screenWidth = window.innerWidth;
      const resolutionKey = getResolutionKey(screenWidth);
      const createPictureTag = (quality) => {
        const pictureTag = document.createElement('picture');
        const resolutions = [480, 1024, 1920];
        resolutions.forEach((resolution) => {
          const sourceTag = document.createElement('source');
          sourceTag.srcset = getCosyImageUrl(
            responseJson,
            getResolutionKey(resolution),
            quality,
          );
          sourceTag.media = `(min-width: ${resolution}px)`;
          pictureTag.appendChild(sourceTag);
        });

        // Fallback img tag
        const imgTag = document.createElement('img');
        imgTag.src = getCosyImageUrl(responseJson, resolutionKey, quality);
        imgTag.alt = 'Cosy Image';
        pictureTag.appendChild(imgTag);

        return pictureTag;
      };

      const createImgTag = (quality) => {
        const imgTag = document.createElement('img');
        imgTag.src = getCosyImageUrl(responseJson, resolutionKey, quality);
        imgTag.alt = 'Cosy Image';
        return imgTag;
      };

      // for condition based cosyImage if selected
      if (modelGroup.children[2].textContent === 'true') {
        let modelPictureElement;

        // Check if the device is an iPad or mobile view based on viewport width
        if (window.innerWidth <= 1024) {
            modelPictureElement = createPictureTag(10);
        } else {
            modelPictureElement = createPictureTag(40);
        }
        rightPanelTitleAndImg.append(modelPictureElement);
      }
      modelThumbnailElement = createImgTag(90);

      if (modelGroup.children) {
        generateLeftPanelModelList(modelGroup, element, selectedModelDdlMob, analytics, block, modelThumbnailElement);
        const modelListItem = document.createElement('li');
        modelListItem.append(element);
        analytics.classList.add(selectedFuelType?.textContent || '');
        leftPanelModelGrouping.append(modelListItem);
      }
    });

   
      buildContext([agCode]).then(() => {
        const wdhModelPlaceholder = fetchModelPlaceholderObject();
        // const wdhSetPlaceholder = fetchSetPlaceholderObject();
        const wdhTechPlaceholder = fetchTechDataPlaceholderObject();
        // buildContext 
        generateTechnicalData1(
        technicalDetail1Cell, techTableData, wdhModelPlaceholder, wdhTechPlaceholder);
        // removing techdetail1 so that it wont appear in content tree
        // block.removeChild(technicalDetail1Cell);

        generateTechnicalData2(
          technicalDetail2Cell, techTableData, wdhModelPlaceholder, wdhTechPlaceholder);
        // block.removeChild(technicalDetail2Cell);
        // getFuelTypeImage(wdhModelPlaceholder.fuel);
        // getFuelTypeLabelDesc(wdhModelPlaceholder.fuel);
        leftPanelModelGrouping.querySelector('.dts-fuel-image-type')?.classList.add(getFuelTypeImage('E')); //getFuelTypeImage(wdhModelPlacholder.fuelType)
        if (selectedFuelTypeText === 'fuel-type'){
          leftPanelModelGrouping.querySelector('.dts-model-category-descp').textContent = getFuelTypeLabelDesc('X');
        } else {
          // description should get updated
          leftPanelModelGrouping.querySelector('.dts-model-category-descp').textContent = wdhModelPlaceholder.description;
        }
        
      });
    
  }

  // clone selectedModel button and bind it inside left panel
  const modelListItem = document.createElement('li');
  modelListItem.classList.add('mob-visible');

  const closeIconLi = document.createElement('li');
  closeIconLi.classList.add('mob-visible', 'dts-close-btn-li');
  const closeIconBtn = document.createElement('button');
  closeIconBtn.classList.add('dts-close-btn');
  closeIconBtn.innerHTML = `<i data-icon="close" aria-hidden="true"></i>`;
  generateCloseIconClickEvent(closeIconBtn);
  closeIconLi.append(closeIconBtn);

  const cloneedSelectedModelDdlMob = selectedModelDdlMob.cloneNode(true);
  cloneedSelectedModelDdlMob.className = 'dts-selected-model-mob-popover';
  modelListItem.append(cloneedSelectedModelDdlMob);
  leftPanelModelGrouping.insertBefore(modelListItem, leftPanelModelGrouping.firstChild);
  leftPanelModelGrouping.insertBefore(closeIconLi, leftPanelModelGrouping.firstChild);

  // appending model group to UI
  leftPanel.append(leftPanelModelGrouping);

  block.textContent = '';
  block.append(selectedModelDdlMob);



  block.append(leftPanel);
  block.append(rightPanel);
  enableClickEvent(selectedModelDdlMob);
}
