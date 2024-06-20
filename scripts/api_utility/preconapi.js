const config = require('./config.js');
const { callApi, writeToFile } = require('./api_handler.js');

async function fetchModelRange(seriesCode, apiEndpoint, apiHeaders) {
  try {
    const modelRangeApiEndpoint = `${apiEndpoint}/ranges/${config.marketTenant}/${seriesCode}`;
    const modelRangeResponse = await callApi(modelRangeApiEndpoint, apiHeaders);
    return modelRangeResponse;
  } catch (error) {
    console.error(`Error fetching model range for ${seriesCode}:`, error);
    throw error;
  }
}

async function fetchPreConId(modelRange, apiEndpoint, apiHeaders) {
  try {
    const preConApiEndpoint = `${apiEndpoint}/vehicles/${config.marketTenant}/${modelRange}`;
    const preConIdResponse = await callApi(preConApiEndpoint, apiHeaders);
    return preConIdResponse;
  } catch (error) {
    console.error(`Error fetching pre con id for ${modelRange}:`, error);
    throw error;
  }
}

async function fetchPreConDetails(preConId, apiEndpoint, apiHeaders) {
  try {
    const preConIdDetailsEndpoint = `${apiEndpoint}/vehicle/${config.marketTenant}/${preConId}`;
    const preConIdDetailsResponse = await callApi(preConIdDetailsEndpoint, apiHeaders);
    return preConIdDetailsResponse;
  } catch (error) {
    console.error(`Error fetching pre con id details for ${preConId}:`, error);
    throw error;
  }
}

function groupByModelRangeCode(preConResults) {
  return preConResults.reduce((acc, preConResult) => {
    const { modelRangeCode, id } = preConResult;
    if (!acc[modelRangeCode]) {
      acc[modelRangeCode] = {};
    }
    acc[modelRangeCode][id] = preConResult;
    return acc;
  }, {});
}

async function fetchCosyImage(preConId, COSY_API, cosyApiHeaders) {
  // const brand = preConId.cosyBrand;
  const cosyOptions = preConId.options;
  const paintCode = preConId.paint;
  const cosyFabric = preConId.fabric;
  const quality = '82';
  const agModelCode = preConId.modelCode;
  const prodDate = (preConId.productionDate !== '') ? preConId.productionDate.replace(/-/g, '') : preConId.effectDate.replace(/-/g, '');
  const cosyHub = config.cosyApiHub;

  const apiUrl = `${COSY_API}${agModelCode}?hub=${cosyHub}&imagetype=webp&effectdate=${prodDate}&background=transparent&lightson=true&options=${cosyFabric},${paintCode},${cosyOptions}&quality=${quality}`;
  const response = await callApi(apiUrl, cosyApiHeaders);
  return { agModelCode, data: response };
}

async function getPreconData() {
  const PRECON_API = config.preConDataApi;
  const COSY_API = config.cosyApiBaseUrl;
  const preconSeriesApiEndpoint = `${PRECON_API}/series/${config.marketTenant}`;
  const apiHeaders = {
    headers: {
      'x-api-key': `${process.env.API_TOKEN}`,
    },
  };
  const cosyApiHeaders = {
    headers: {
      'x-api-key': `${process.env.COSY_API_TOKEN}`,
    },
  };
  const preConSeriesData = await callApi(preconSeriesApiEndpoint, apiHeaders);
  const seriesCodeList = Object.values(preConSeriesData).map((item) => item.seriesCode);
  const modelRangePromises = seriesCodeList
    .map((seriesCode) => fetchModelRange(seriesCode, PRECON_API, apiHeaders));
  const results = await Promise.allSettled(modelRangePromises);

  const successfulResults = results
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value);

  const modelRangeCodes = [];
  successfulResults.forEach((modelRanges) => {
    Object.values(modelRanges).forEach((modelRange) => {
      modelRangeCodes.push(modelRange.modelRangeCode);
    });
  });

  const preConIdPromises = modelRangeCodes
    .map((modelRange) => fetchPreConId(modelRange, PRECON_API, apiHeaders));
  const preConIdPromiseResults = await Promise.allSettled(preConIdPromises);

  const preConIdSuccessResults = preConIdPromiseResults
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value);

  const preConIdList = [];
  preConIdSuccessResults.forEach((preConIdPromise) => {
    Object.values(preConIdPromise).forEach((preConId) => {
      preConIdList.push(preConId.id);
    });
  });

  const preConIdDetailsPromises = preConIdList
    .map((preConId) => fetchPreConDetails(preConId, PRECON_API, apiHeaders));
  const preConIdDetailsPromiseResults = await Promise.allSettled(preConIdDetailsPromises);

  const preConIdDetailsResults = preConIdDetailsPromiseResults.filter((result) => result.status === 'fulfilled')
    .map((result) => result.value);

  const preConGroupedData = groupByModelRangeCode(preConIdDetailsResults);

  const API_FOLDER = 'WDH_API/Models/precon-details/';
  const PRE_CON_COSY_API = 'WDH_API/Models/precon-cosy/';
  const writePromise = Object.keys(preConGroupedData).map(async (modelRangeCode) => {
    const jsonData = JSON.stringify(preConGroupedData[modelRangeCode], null, 2);
    const modelRangeCodeFileName = `${modelRangeCode}.json`;
    await writeToFile(modelRangeCodeFileName, jsonData, API_FOLDER);
  });

  await Promise.all(writePromise);

  const preConCosyPromise = preConIdDetailsResults
    .map((preConId) => fetchCosyImage(preConId, COSY_API, cosyApiHeaders));
  const preConCosyPromiseResults = await Promise.allSettled(preConCosyPromise);
  preConCosyPromiseResults.forEach(async (result) => {
    if (result.status === 'fulfilled') {
      const { agModelCode, data } = result.value;
      const preConIdName = `${agModelCode}.json`;
      await writeToFile(preConIdName, JSON.stringify(data, null, 2), PRE_CON_COSY_API);
    } else {
      console.error('Error while fetching cosy images', result.reason.error);
    }
  });
}

module.exports = getPreconData;
