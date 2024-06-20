import {
  buildModelPlaceholder, buildSetPlaceholder,
  fetchSetPlaceholderObject, fetchModelPlaceholderObject,
} from './wdh-placeholders.js';

async function getApiResponse(modelCode) {
  try {
    const endpointUrl = `/WDH_API/Models/ModelDetails/${modelCode}.json`;
    const origin = window.location.host.match('author-(.*?).adobeaemcloud.com(.*?)') ? `${window.hlx.codeBasePath}` : '';
    const response = await fetch(`${origin}${endpointUrl}`);
    const responseJson = await response.json();
    if (responseJson) {
      window.modelDataMap.set(modelCode, responseJson);
    }
    return { modelCode, responseJson };
  } catch (error) {
    console.log('Error fetching data for building get placeholder', error);
    throw error;
  }
}

async function fetchAllModels(modelCodes) {
  const modelCodesArray = modelCodes.filter((modelCode) => !window.modelDataMap.has(modelCode));
  const promises = modelCodesArray.map(getApiResponse);
  const results = await Promise.allSettled(promises);
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      window.modelDataMap.set(result.value.modelCode, result.value.responseJson);
    } else {
      console.error('API call failed while fetching WDH data');
    }
  });
  const response = modelCodes.map((modelCode) => {
    if (window.modelDataMap.has(modelCode)) {
      return window.modelDataMap.get(modelCode);
    }
    return { modelCode, error: 'Model Code data not found' };
  });
  return response;
}

export async function buildContext(modelCodesArray) {
  try {
    await fetchAllModels(modelCodesArray).then((response) => {
      buildSetPlaceholder(response);
      buildModelPlaceholder(response[0]);
      const modelPlaceholder = fetchModelPlaceholderObject();
      const setPlaceholder = fetchSetPlaceholderObject();
      return { modelPlaceholder, setPlaceholder };
    });
  } catch (error) {
    console.log('Error fetching data for building get placeholder', error);
    throw error;
  }
  // return fetchModelPlaceholderObject();
}

export function replacePlaceholder(string, data, regex) {
  return string.replace(regex, (match, expression) => {
    const key = expression.split('.');
    let value = data;
    if (key[1] in value) {
      value = value[key[1]];
    } else {
      return match;
    }
    return value;
  });
}

export function getCosyImageUrl(response, resolution, angle) {
  const imagesObject = response.walkaround[resolution].images;
  const imgUrl = imagesObject.find((img) => img.angle === angle && img.viewImage !== undefined);
  return imgUrl.viewImage;
}

export async function getCosyImage(modelCode) {
  try {
    const endpointUrl = `/WDH_API/Models/CosyImages/${modelCode}-cosy.json`;
    const origin = window.location.host.match('author-(.*?).adobeaemcloud.com(.*?)') ? `${window.hlx.codeBasePath}` : '';
    const response = await fetch(`${origin}${endpointUrl}`);
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.log('Error fetching data for building get placeholder', error);
    throw error;
  }
}
