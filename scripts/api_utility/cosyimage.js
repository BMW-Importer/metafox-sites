const { callApi, writeFileAsync } = require('./api_handler.js');
const config = require('./config.js');

function getApiUrl(modelJson) {
  const { posiSpec } = modelJson.model;
  const cosyApiUrl = config.cosyApiBaseUrl;
  const cosyHub = config.cosyApiHub;
  const { options } = posiSpec;
  let sortedOptions;
  if (posiSpec.options) {
    sortedOptions = options.split(',').sort();
  }
  const apiUrl = `${cosyApiUrl}${posiSpec.agCode}?hub=${cosyHub}&imagetype=webp&background=transparent&lightson=true&options=${posiSpec.fabric},${posiSpec.paint},${sortedOptions}`;
  return apiUrl;
}

async function getCosyUrl(modelJson) {
  const apiUrl = getApiUrl(modelJson);
  const xApiKey = process.env.COSY_API_TOKEN;
  const modelName = modelJson.model.modelCode;
  const COSY_IMAGE_FOLDER = 'WDH_API/Models/CosyImages/';
  const apiHeaders = {
    headers: {
      'x-api-key': `${xApiKey}`,
    },
  };
  const data = await callApi(apiUrl, apiHeaders);
  const modelFileName = `${modelName}-cosy.json`;
  if (data) {
    await writeFileAsync(`${COSY_IMAGE_FOLDER}${modelFileName}`, JSON.stringify(data, null, 2));
  }
  return modelName;
}

module.exports = getCosyUrl;
