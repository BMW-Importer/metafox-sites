const { callApi } = require('./api_handler.js');
const config = require('./config.js');

async function getModelsTechnicalData(modelName) {
  // const API_FOLDER = 'WDH_API/Models/ModelsTechnicalData/';
  const API_PATH = config.wdhModelTechnicalDataApiUrl;
  const apiUrl = API_PATH + modelName;
  const apiHeaders = {
    'x-api-key': `${process.env.API_TOKEN}`,
  };
  const data = await callApi(apiUrl, apiHeaders);
  // const modelFileName = `${modelName}.json`;
  if (data) {
    // await writeToFile(modelFileName, JSON.stringify(data, null, 2), API_FOLDER);
  }
  return data;
}

// getModelsData();

module.exports = getModelsTechnicalData;
