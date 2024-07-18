import {
  buildModelPlaceholder, buildSetPlaceholder, buildTechDataPlaceholder,
  fetchSetPlaceholderObject, fetchModelPlaceholderObject, fetchTechDataPlaceholderObject,
} from './wdh-placeholders.js';

export async function getApiResponse(modelCode) {
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
  const [modelCode, selectedTCode] = modelCodesArray;
  try {
    await fetchAllModels([modelCode]).then((response) => {
      buildSetPlaceholder(response);
      buildModelPlaceholder(response[0]);
      response[0].model.vehicles.forEach((vehicleData) => {
        if (vehicleData.transmissionCode === selectedTCode) {
          const vehicleDataResponse = vehicleData;
          buildTechDataPlaceholder(vehicleDataResponse);
        }
      });
      const modelPlaceholder = fetchModelPlaceholderObject();
      const setPlaceholder = fetchSetPlaceholderObject();
      const techPlaceholder = fetchTechDataPlaceholderObject();
      return { modelPlaceholder, setPlaceholder, techPlaceholder };
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

// export function getCosyImageUrl(response, resolution, angle) {
//   const imagesObject = response.walkaround[resolution].images;
//   const imgUrl = imagesObject.find((img) => img.angle === angle && img.viewImage !== undefined);
//   return imgUrl.viewImage;
// }

const mockResponses = {
  imageResponse1: 'https://prod.cosy.bmw.cloud/bmwweb/cosySec?COSY-EU-100-7331rjFhnOqIbq1KL4L3h8H7EpCxEarjlfuzHVPRdgSht9QEq2YIqlbgulamzL15UxOl4ExoubWTkFKqvLB9vCmK5GaUtcDqgXA2dba10t83D%25NxyKGwgSMA84DB1Q53XWIQ7ayVzbYCj7F3dzmvh8RwzP2LOM0PuzHMxBzcsMWB1XYvQiG%25XRaYWH%25qQ5nmPX59agOybfgKnvIT9jgCO2B3iDvMIjedwq2bBDMztrO6eqhk7NggMLoAC0KThJHFlMJQou%25KXgvxHSfWQo4E%25V1Pa8TffNEbn%25jV10s9OfDFE4riI1RoscZwBL75rxRteapxZ857Mn6lRUgChOrW5GvloImmgp2XH2GWv6jQ%25gLv2YDafuJOjmqn1SFbDyLOEVxKqTJIsN8OL3uBr05YJdSeZ4KmuzVMRcXySkNh56x4VA0ogYZWNF4HvmJx0Kc%252yVn4WxfjpIBcP81D8WbxbUEqcuX89GsLxkRUiprJ8vBGw6ZuU5eptYRSGQz67m5VK%25kYCygNW2HmlTv0YCCyX324mbyTQdjcSUk3azDxTKAdnkq83mCzOALUdWckIVrgyfYgMkBlbcPrTST5lkEKM4bfz8snGyulITUrR5E47Zvz56swTRBYhdrxlS%25NrnF94fX51',
  imageResponse2: 'https://prod.cosy.bmw.cloud/bmwweb/cosySec?COSY-EU-100-7331rjFhnOqIbqcuu7L3h8H7EpCxEarjlfuzHVPRdgSht9QEq2YIqlbgulamzL15UxOl4ExoubWTkFKqvLB9vCmK5GaUtcDqgXA2dba10t83D%25NxyKGwgSMA84DB1Q53XWIQ7ayVzbYCj7F3dzmvh8RwzP2LOM0PuzHMxBzcsMWB1XYvQiG%25XRaYWFR1Q5nmPKJNagOybWBKnvIT9PeTO2B3iEoMIjedwsrNBDMztIa0eqhk7BnDMLoACeLJhJHFlM2oou%25KXh5IHSfWQopq%25V1PaHSGfNEbn%25VV10s9OfDFE4riI1qEscZwBE5HrxRteaxNZ857MnDxRUgChO%2525GvloImVgp2XHBy0v6jQ%25e5H2YDafu3Rjmqn1Sd9DyLOEVzwqTJIsN76L3uBr0NMJdSeZ4btuzVMRcp0SkNh5bxTVA0og0jqNF4Hv4aB0Kc%252cD74WxfjxqMcP81D8WOxbUEqUlk89RIhNQSht8iAm2YI0Z0MA8nptvmQxDOPLNrA90qIeMnvzBoxMuO30ein8IIjAZX5IPGyvQFMa',
  imageResponse3: 'https://prod.cosy.bmw.cloud/bmwweb/cosySec?COSY-EU-100-7331rjFhnOqIbqcgLeL3h8H7EpCxEarjlfuzHVPRdgSht9QEq2YIqlbgulamzL15UxOl4ExoubWTkFKqvLB9vCmK5GaUtcDqgXA2dba10t83D%25NxyKGwgSMA84DB1Q53XWIQ7ayVzbYCj7F3dzmvh8RwzP2LOM0PuzHMxBzcsMWB1XYvQiG%25XRaYWFR1Q5nmPKJNagOybWBKnvIT9PeTO2B3iEoMIjedwsbLBDMztraoeqhk7ZqzMLoACR5qhJHFlMI2ou%25KXhB8HSfWQoeu%25V1PaHV5fNEbn%25Bp10s9OfexE4riI1usscZwBEpjrxRtesQzZ857Mr2IRUgChZjR5GvloRUdgp2XH5GGv6jQ%25g0y2YDafv47jmqn12cjDyLOEju5qTJIsH0yL3uBr%255VJdSeZfFduzVMR1K6SkNh5EJQVA0og8Q3NF4HvUbJ0Kc%252G9a4WxfjpiOcP81D6BAxbUEqY6r89GsLmQIUiprJykaGw6ZuTArptYRSa3b67m5VnJbYCygNO99mlTv0IfyyX324BNETQdjcdUp3azDxzs5dnkq8kGHzOALUApvkIFJGFOZABKupKfXFeWS6hB3KMPVYoe9WhcgDzr3D%25WontGwgk4kjnWR9%25UtrK65emz0nhkYg2jRUQvqKjT5lk2o3GRgpn4sxgeb7UrOjZ',
};

/* dummy URL called */
export function getCosyImageUrl() {
  const imagesObject = mockResponses.imageResponse1;
  // const imgUrl = imagesObject.find((img) => img.angle === angle && img.viewImage !== undefined);
  return imagesObject;
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

/* To call api for getting spreadsheet data */

export async function getTechnicalSpreadsheetData() {
  try {
    const endpointUrl = '/en/technical-data.json';
    const origin = window.location.host.match('author-(.*?).adobeaemcloud.com(.*?)') ? `${window.hlx.codeBasePath}` : '';
    const response = await fetch(`${origin}${endpointUrl}`);
    const responseJson = await response.json();
    return { responseJson };
  } catch (error) {
    console.log('Error fetching data from spreadsheet', error);
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
    E: 'fuel-type-bev',
    X: 'fuel-type-phev',
  };
  return fuelTypeMap[powerTrain] || 'no_image_type';
}

export function getFuelTypeLabelDesc(powerTrain) {
  const fuelTypeDesc = {
    E: 'Vollelektrisch',
    X: 'Plug-in-Hybrid',
    O: 'Dizel',
  };
  return fuelTypeDesc[powerTrain] || ' ';
}

export async function getPreConApiResponse(modelRange) { // modelRange = 'F40'
  try {
    const endpointUrl = `/WDH_API/Models/precon-details/${modelRange}.json`;
    const origin = window.location.host.match('author-(.*?).adobeaemcloud.com(.*?)') ? `${window.hlx.codeBasePath}` : '';
    const response = await fetch(`${origin}${endpointUrl}`);
    const responseJson = await response.json();
    return { modelRange, responseJson };
  } catch (error) {
    console.log('Error fetching data for building get placeholder', error);
    throw error;
  }
}

export async function getPreConCosyImage(modelCode) {
  try {
    const endpointUrl = `/WDH_API/Models/precon-cosy/${modelCode}.json`;
    const origin = window.location.host.match('author-(.*?).adobeaemcloud.com(.*?)') ? `${window.hlx.codeBasePath}` : '';
    const response = await fetch(`${origin}${endpointUrl}`);
    const preConCosyResJSON = await response.json();
    return preConCosyResJSON;
  } catch (error) {
    console.log('Error fetching data for building get placeholder', error);
    throw error;
  }
}
