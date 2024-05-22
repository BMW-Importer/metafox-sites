// eslint-disable-next-line import/no-unresolved
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  fs.mkdirSync(dirname);
  return true;
};

const writeToFile = async (modelName, data, apiFolder) => {
  try {
    const filePath = apiFolder + modelName;
    ensureDirectoryExistence(filePath);
    await fs.writeFileSync(filePath, data);
  } catch (error) {
    console.error(`Error writing to file ${modelName}:`, error);
  }
};

const callApi = async (url, options = {}) => {
  try {
    const response = await axios(url, options);
    return response.data;
  } catch (error) {
    await writeToFile(`error_${url}.txt`, 'API call failed');
    return null;
  }
};

module.exports = { callApi, writeToFile };
