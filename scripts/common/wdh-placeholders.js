const modelPlaceholderObject = {
  enginePower: '',
  description: '',
  seriesDescription: '',
  acceleration: '',
  bodyTypeCode: '',
  shortRangeName: '',
  modelRangeCode: '',
  marketingBodyTypeCode: '',
  seriesCode: '',
};

const modelRangePlaceholderObject = {
  setAccelerationFrom: '',
  setAccelerationTo: '',
  enginePower: '',
  description: '',
};

export function buildGetPlaceholder(responseJson) {
  modelPlaceholderObject.description = responseJson.model.description;
  modelPlaceholderObject.bodyTypeCode = responseJson.model.bodyTypeCode;
  modelPlaceholderObject.hybridCode = responseJson.model.hybridCode;
  modelPlaceholderObject.seriesCode = responseJson.model.seriesCode;
  modelPlaceholderObject.acceleration = responseJson.model.acceleration;
}

export function getModelPlaceholderObject() {
  return modelPlaceholderObject;
}

export function getModelRangePlaceholderObject() {
  return modelRangePlaceholderObject;
}
