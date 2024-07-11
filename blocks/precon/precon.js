/* eslint-disable no-await-in-loop */
/* eslint-disable max-len */
import {
  getPreConApiResponse, getPreConCosyImage, getResolutionKey, getCosyImageUrl,
} from '../../scripts/common/wdh-util.js';

export function getConfiguratorURL() {
  const url = document.querySelector('meta[name="configuratorurl"]')?.content;
  return url;
}

const configuratorURL = getConfiguratorURL();

function configureCTA(selectedModel, currentVechileData) {
  let selectedModelValue;
  if (selectedModel === 'modelRange') {
    selectedModelValue = `${configuratorURL}/${currentVechileData.modelRangeCode}`;
  }
  if (selectedModel === 'modelCode') {
    selectedModelValue = `${configuratorURL}/${currentVechileData.modelRangeCode}/${currentVechileData.modelCode}`;
  }
  if (selectedModel === 'allOptions') {
    selectedModelValue = `${configuratorURL}/${currentVechileData.modelRangeCode}/${currentVechileData.modelCode}/${currentVechileData.fabric}/${currentVechileData.paint}/${currentVechileData.options}`;
  }
  return selectedModelValue;
}

export default async function decorate(block) {
  let headLineDom;
  const precon = [...block.children];
  let preConImageDOM;
  // eslint-disable-next-line no-restricted-syntax
  for (const preconData of precon) {
    let preConModelResponse;
    let preConCosyImage;
    let preConHeadLine;
    let optionsValue;
    let configureLink;
    let configureCTADom;
    let modelName;

    const [wdhContext, linkTab] = preconData.children;
    const splitPreconData = wdhContext.querySelectorAll('p')[0]?.textContent.split(',') || '';
    const selctedModelData = wdhContext.querySelectorAll('p')[1]?.textContent || '';
    const selectedModelRange = splitPreconData[1]?.trim() || ''; // authored selected ModelRange G21
    const selectedPreConId = splitPreconData[2]?.trim() || ''; // authored selected PRECODN-ID
    preconData.removeChild(wdhContext);
    preconData.removeChild(linkTab);
    try {
      if (selectedModelRange) {
        preConModelResponse = await getPreConApiResponse(selectedModelRange); // calling PRECon API
        console.log('preConModel response', preConModelResponse);
      }
    } catch (error) {
      console.error(error);
    }
    if (preConModelResponse) {
      let preConModeCode;
      // eslint-disable-next-line no-restricted-syntax, guard-for-in, no-unreachable-loop
      for (const key in preConModelResponse.responseJson) {
        if (preConModelResponse.responseJson[key].id === selectedPreConId);
        preConModeCode = preConModelResponse.responseJson[key]?.modelCode; // MODEL-CODE
        preConHeadLine = preConModelResponse.responseJson[key]?.headline; // Show the headline below cosy Image
        optionsValue = preConModelResponse.responseJson[key]?.options; //
        modelName = preConModelResponse.responseJson[key]?.modelName;
        configureLink = configureCTA(selctedModelData, preConModelResponse.responseJson[key]);
        break;
      }
      const optionsCount = optionsValue.split(',').length;
      preConCosyImage = await getPreConCosyImage(preConModeCode); // Calling PRECON Cosy Image
      headLineDom = document.createElement('div');
      headLineDom.classList.add('headerline-wrapper');
      headLineDom.textContent = `HeadLine test: ${modelName} ${preConHeadLine}, ${optionsCount}`;
      configureCTADom = document.createElement('a');
      configureCTADom.classList.add('button');
      configureCTADom.href = configureLink;
      configureCTADom.textContent = 'CLICK ME';
      headLineDom.append(configureCTADom);
    }
    if (preConCosyImage) { // cosy image to show for Pre-Con
      const screenWidth = window.innerWidth;
      const resolutionKey = getResolutionKey(screenWidth);
      const createPictureTag = (quality) => {
        const pictureTag = document.createElement('picture');
        const resolutions = [1025, 768];
        resolutions.forEach((resolution) => {
          const sourceTag = document.createElement('source');
          sourceTag.srcset = getCosyImageUrl(
            preConCosyImage,
            getResolutionKey(resolution),
            resolution === 768 ? 30 : quality,
          );
          sourceTag.media = `(min-width: ${resolution}px)`;
          pictureTag.appendChild(sourceTag);
        });

        // Fallback img tag
        const imgTag = document.createElement('img');
        imgTag.src = getCosyImageUrl(preConCosyImage, resolutionKey, 40);
        imgTag.alt = 'pre con Cosy Image';
        pictureTag.appendChild(imgTag);
        return pictureTag;
      };
      preConImageDOM = createPictureTag(40);
      block.append(preConImageDOM);
      block.append(headLineDom);
    }
  }
}
