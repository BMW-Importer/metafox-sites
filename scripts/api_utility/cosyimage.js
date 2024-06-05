const { callApi, writeToFile } = require('./api_handler.js');
const config = require('./config.js');

function getApiUrl(modelJson) {
  const { posiSpec } = modelJson.model;
  const cosyApiUrl = config.cosyApiBaseUrl;
  const cosyHub = config.cosyApiHub;
  const apiUrl = `${cosyApiUrl}${posiSpec.agCode}?hub=${cosyHub}&imagetype=webp&options=${posiSpec.options}`;
  return apiUrl;
}

async function getCosyUrl(modelJson) {
  const apiUrl = getApiUrl(modelJson);
  const xApiKey = process.env.COSY_API_TOKEN;
  const modelName = modelJson.model.modelCode;
  const apiHeaders = {
    headers: {
      'x-api-key': `${xApiKey}`,
    },
  };
  const data = await callApi(apiUrl, apiHeaders);
  const modelFileName = `${modelName}-cosy.json`;
  if (data) {
    await writeToFile(modelFileName, JSON.stringify(data, null, 2), 'WDH_API/Models/CosyImages/');
  }
  return modelName;
}

module.exports = getCosyUrl;
