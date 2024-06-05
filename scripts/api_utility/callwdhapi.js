const getData = require('./all_models.js');
const getModelsData = require('./model-details.js');

function getModelDetailsByModelCode(modelsArray) {
  modelsArray.forEach((modelObject) => {
    const modelName = modelObject.modelCode;
    if (modelName) {
      try {
        getModelsData(modelName);
      } catch (error) {
        console.log(error);
      }
    }
  });
}

async function callWdhApi() {
  try {
    const allModelsData = await getData();
    if (allModelsData) {
      const allModelsJson = JSON.parse(allModelsData);
      const modelsArray = allModelsJson.models;
      getModelDetailsByModelCode(modelsArray);
    }
  } catch (error) {
    console.error(error);
  }
}

callWdhApi();

module.exports = callWdhApi;
