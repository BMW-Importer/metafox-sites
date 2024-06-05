const { callApi, writeToFile } = require('./api_handler.js');
const getCosyUrl = require('./cosyimage.js');
const getModelsTechnicalData = require('./modeltechnicaldata.js');
const config = require('./config.js');

function getModelsDataJson(data, modelTechnicalData) {
  if ('effectDate' in modelTechnicalData) {
    data.model.effectDate = modelTechnicalData.effectDate;
  }
  if ('vehicles' in modelTechnicalData) {
    data.model.vehicles = modelTechnicalData.vehicles;
  }
  return data;
}

async function getModelsData(modelName) {
  const API_FOLDER = 'WDH_API/Models/ModelDetails/';
  const API_PATH = config.wdhModelDetailsApiUrl;
  const apiUrl = API_PATH + modelName;
  const apiHeaders = {
    'x-api-key': `${process.env.API_TOKEN}`,
  };
  let data = await callApi(apiUrl, apiHeaders);
  const modelFileName = `${modelName}.json`;
  if (data) {
    const modelTechnicalData = await getModelsTechnicalData(modelName);
    if (modelTechnicalData) {
      data = getModelsDataJson(data, modelTechnicalData);
    }
    await writeToFile(modelFileName, JSON.stringify(data, null, 2), API_FOLDER);
    await getCosyUrl(data);
  }

  return JSON.stringify(data);
}

getModelsData(process.env.MODEL_NAME);

module.exports = getModelsData;
