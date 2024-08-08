const fs = require('fs');
const { promisify } = require('util');
const axios = require('axios');

const writeFileAsync = promisify(fs.writeFile);
const appendFileAsync = promisify(fs.appendFile);

const ERROR_LOG_FILE = 'WDH_API/wdh_error.txt';

const logError = async (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  await appendFileAsync(ERROR_LOG_FILE, logMessage);
};

const callApi = async (url, options = {}) => {
  try {
    const response = await axios(url, options);
    return response.data;
  } catch (error) {
    const errorMessage = error.response
      ? `Error: ${error.response.status} ${error.response.statusText}`
      : `Error: ${error.message}`;
    const logMessage = `URL: ${url}, Message: ${errorMessage}`;
    await logError(logMessage);
    return null;
  }
};

module.exports = {
  callApi,
  writeFileAsync,
  logError,
};
