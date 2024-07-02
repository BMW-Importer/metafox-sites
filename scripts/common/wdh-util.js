import {
  buildModelPlaceholder, buildSetPlaceholder, buildTechDataPlaceholder,
  fetchSetPlaceholderObject, fetchModelPlaceholderObject, fetchTechDataPlaceholderObject
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
      const techDataPlaceholder = fetchTechDataPlaceholderObject();
      // response[0].model.vehicles.forEach(function (data) {
      //   buildTechDataPlaceholder(data, data.transmissionCode);
      // })
      return { modelPlaceholder, setPlaceholder, techDataPlaceholder };
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

/* getting cosy images as per resoultion */

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

export function getResolutionKey(screenWidth) {
  // Define breakpoints for different screen sizes using min-width
  const breakpoints = [
    { key: 'res_2560x1440', minWidth: 1921 }, // Large Desktop
    { key: 'res_1280x720', minWidth: 1025 }, // Medium Desktop
    { key: 'res_1280x720', minWidth: 768 }, // Tablet
    { key: 'res_640x360', minWidth: 0 }, // Mobile
  ];
  // Determine the appropriate resolution based on screen width
  const matchingBreakpoint = breakpoints.find((breakpoint) => screenWidth >= breakpoint.minWidth);
  return matchingBreakpoint ? matchingBreakpoint.key : 'res_1280x720'; // Default to medium desktop if no match for fallback case
}

export function getFuelTypeImage(powerTrain) {
  const fuelTypeMap = {
      'E': 'fuel_type_bev',
      'X': 'fuel_type_phev'
  };
  return fuelTypeMap[powerTrain] || 'no_image_type';
}

export function getFuelTypeLabelDesc(powerTrain) {
  const fuelTypeDesc = {
      'E': 'Vollelektrisch',
      'X': 'Plug-in-Hybrid'
  };
  return fuelTypeDesc[powerTrain] || ' ';
}