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

function generateTechnicalData1(technicalDetail1Cell, techTableData) {
  // extracting technical data
  const tableRow1 = document.createElement('tr');
  let tableRow1Html = '';

  const dataFactLabel1 = technicalDetail1Cell?.querySelector('h2');
  if (dataFactLabel1?.outerHTML) {
    tableRow1Html = `<td class="" role="rowheader"><div>${dataFactLabel1.outerHTML}</div></td>`;
  }
  const dataFactVal1 = technicalDetail1Cell?.querySelector('h3');
  if (dataFactVal1?.outerHTML) {
    tableRow1Html += `<td class="" role="cell"><div>${dataFactVal1.outerHTML}</div></td>`;
  }

  if (tableRow1Html) tableRow1.innerHTML = tableRow1Html;
  if (tableRow1.textContent) techTableData.append(tableRow1);

  const tableRow2 = document.createElement('tr');
  let tableRow2Html = '';

  const dataFactLabel2 = technicalDetail1Cell?.querySelector('h4');
  if (dataFactLabel2?.outerHTML) {
    tableRow2Html = `<td class="" role="rowheader"><div>${dataFactLabel2?.outerHTML}</div></td>`;
  }
  const dataFactVal2 = technicalDetail1Cell?.querySelector('h5');
  if (dataFactVal2?.outerHTML) {
    tableRow2Html += `<td class="" role="cell"><div>${dataFactVal2?.outerHTML}</div></td>`;
  }

  if (tableRow2Html) tableRow2.innerHTML = tableRow2Html;
  if (tableRow2.textContent) techTableData.append(tableRow2);
}

function generateTechnicalData2(technicalDetail2Cell, techTableData) {
  const tableRow3 = document.createElement('tr');
  let tableRow3Html = '';

  const dataFactLabel3 = technicalDetail2Cell?.querySelector('h2');
  if (dataFactLabel3?.outerHTML) {
    tableRow3Html = `<td class="" role="rowheader"><div>${dataFactLabel3?.outerHTML}</div></td>`;
  }
  const dataFactVal3 = technicalDetail2Cell?.querySelector('h3');
  if (dataFactVal3?.outerHTML) {
    tableRow3Html += `<td class="" role="cell"><div>${dataFactVal3?.outerHTML}</div></td>`;
  }
  if (tableRow3Html) tableRow3.innerHTML = tableRow3Html;
  if (tableRow3.textContent) techTableData.append(tableRow3);

  const tableRow4 = document.createElement('tr');
  let tableRow4Html = '';

  const dataFactLabel4 = technicalDetail2Cell?.querySelector('h4');
  if (dataFactLabel4?.outerHTML) {
    tableRow4Html = `<td class="" role="rowheader"><div>${dataFactLabel4?.outerHTML}</div></td>`;
  }
  const dataFactVal4 = technicalDetail2Cell?.querySelector('h5');
  if (dataFactVal4?.outerHTML) {
    tableRow4Html += `<td class="" role="cell"><div>${dataFactVal4?.outerHTML}</div></td>`;
  }

  if (tableRow4Html) tableRow4.innerHTML = tableRow4Html;
  if (tableRow4.textContent) techTableData.append(tableRow4);
}

function generateLeftPanelModelList(
  modelGroup,
  element,
  selectedModelDdlMob,
  analytics,
  block,
) {
  const [modelCategory, modelLink, isSelected] = modelGroup.children;
  const [analyticsLabel, BtnType, btnSubType] = analytics.children;
  element.textContent = '';
  if (isSelected?.textContent === 'true') {
    element.append(document.createRange().createContextualFragment(`<span>${modelCategory?.textContent}</span><span></span>`));
    selectedModelDdlMob.textContent = modelCategory?.textContent;
  } else {
    element.append(document.createRange().createContextualFragment(`<span>${modelCategory?.textContent}</span>
        <a href='${modelLink?.textContent}' data-analytics-label='${analyticsLabel?.textContent?.trim() || ''}'
        data-analytics-category='${BtnType?.textContent?.trim() || ''}'
        data-analytics-subCategory='${btnSubType?.textContent?.trim() || ''}'
        data-analytics-block-name='${block?.dataset?.blockName?.trim() || ''}'
        data-analytics-section-id= "${block?.closest('.section')?.dataset?.analyticsLabel || ''}"
        data-analytics-custom-click='true'></a>`));
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
  rightPanelTitleAndImg.classList.add('dts-right-model-title');
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
  block.removeChild(fuelType);

  const activeModelTitle = detailCell?.querySelector('h3');
  rightPanelTitleAndImg.append(activeModelTitle);
  rightPanel.append(rightPanelTitleAndImg);

  const modelDescp = detailCell?.querySelector('h4');
  rightPanel.append(modelDescp);

  // appending table below the description
  rightPanel.append(rightPanelTechDetail);

  const technicalLink = detailCell?.querySelector('a');
  rightPanelTechDetail.append(technicalLink);

  const popover = detailCell?.querySelector('h6');
  if (popover.textContent === 'true') {
    rightPanelTechDetail.classList.add('enable-popover');
  }
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
      rightPanelTechDetail.append(disclaimerContent);
      block.removeChild(disclaimerFragment);
    }
  });

  generateTechnicalData1(technicalDetail1Cell, techTableData);

  // removing techdetail1 so that it wont appear in content tree
  block.removeChild(technicalDetail1Cell);

  generateTechnicalData2(technicalDetail2Cell, techTableData);

  // removing techdetail1 so that it wont appear in content tree
  block.removeChild(technicalDetail2Cell);

  // looping through children model card blocks
  rows.forEach((element) => {
    const [modelGroup, context, analytics] = element?.children || '';
    // API call for getCosyImage and calling buildContext
    // const modelDetail = ['4, 445, 7k19, true, transmissionType'];
    const modelCodeArray = ['7K11'];
    block.textContent = '';
    modelCodeArray.forEach((agCode) => {
      getCosyImage(agCode).then((responseJson) => {
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
          const modelPictureElement = createPictureTag(40);
          rightPanelTitleAndImg.append(modelPictureElement);
        }
        const modelThumbnailElement = createImgTag(90); // for left Nav

        if (context) element.removeChild(context);

        // if (context) {
        //   const [seriesRangeCode, enableTechData, transmissionType] = context.children;
        // }

        bindAnalyticsValue(analytics, technicalLink, block);

        if (modelGroup.children) {
          generateLeftPanelModelList(
            modelGroup,
            element,
            selectedModelDdlMob,
            analytics,
            block,
          );
          const modelListItem = document.createElement('li');
          modelListItem.append(element);
          analytics.classList.add(selectedFuelType?.textContent || '');
          leftPanelModelGrouping.append(modelListItem);
        }

        leftPanelModelGrouping.append(modelThumbnailElement);
      });
    });

    buildContext(modelCodeArray).then(() => {
      const wdhModelPlaceholder = fetchModelPlaceholderObject();
      // const wdhSetPlaceholder = fetchSetPlaceholderObject();
      const wdhTechPlaceholder = fetchTechDataPlaceholderObject();
      const modelRegex = /\{model(.*?)}/g;
      let textContent; // const textContent = placeholder.innerText
      let updatedPlaceholder = replacePlaceholder(textContent, wdhModelPlaceholder, modelRegex);
      // const setRegex = /\{set(.*?)}/g;
      // updatedPlaceholder = replacePlaceholder(updatedPlaceholder, wdhSetPlaceholder, setRegex);
      // technicalData
      const techRegex = /\{tech(.*?)}/g;
      updatedPlaceholder = replacePlaceholder(updatedPlaceholder, wdhTechPlaceholder, techRegex);
      console.log(wdhTechPlaceholder);
      block.append(updatedPlaceholder);
    });
  });

  // appending model group to UI
  leftPanel.append(leftPanelModelGrouping);

  block.textContent = '';
  block.append(leftPanel);
  block.append(rightPanel);
}
