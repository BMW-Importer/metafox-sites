const modelPlaceholderObject = {
  alt: '',
  enginePower: '',
  description: '',
  seriesDescription: '',
  acceleration: '',
  bodyTypeCode: '',
  shortRangeName: '',
  modelRangeCode: '',
  marketingBodyTypeCode: '',
  seriesCode: '',
  agCode: '',
  bodyTypeDescription: '',
  brand: '',
  cosyFallbackAlt: '',
  cosyBrand: '',
  driveType: '',
  electricRange: '',
  fabric: '',
  fuelType: '',
  gearBox: '',
  horsePower: '',
  hybridCode: '',
  modelCode: '',
  name: '',
  options: '',
  power: '',
  price: '',
  paint: '',
  series: '',
  seats: '',
  systemMaxTorque: '',
  systemPower: '',
  trunkCapacity: '',
};

const setPlaceholderObject = {
  accelerationFrom: '',
  accelerationTo: '',
  electricRangeFrom: '',
  electricRangeTo: '',
  horsePowerFrom: '',
  horsePowerTo: '',
  powerFrom: '',
  powerTo: '',
  systemMaxTorqueFrom: '',
  systemMaxTorqueTo: '',
  topSpeedFrom: '',
  topSpeedTo: '',
  trunkCapacityFrom: '',
  trunkCapacityTo: '',
};

export function buildModelPlaceholder(responseJson) {
  modelPlaceholderObject.description = responseJson.model.description;
  modelPlaceholderObject.bodyTypeCode = responseJson.model.bodyTypeCode;
  modelPlaceholderObject.hybridCode = responseJson.model.hybridCode;
  modelPlaceholderObject.seriesCode = responseJson.model.seriesCode;
  modelPlaceholderObject.acceleration = responseJson.model.acceleration;
}

export function buildSetPlaceholder(responseJsonArray) {
  const accelerationArray = responseJsonArray.map((obj) => parseFloat(obj.model.acceleration))
    .filter((value) => !Number.isNaN(value));
  setPlaceholderObject.accelerationFrom = Math.min(...accelerationArray);
  setPlaceholderObject.accelerationTo = Math.max(...accelerationArray);
  const horsePowerArray = responseJsonArray.map((obj) => parseFloat(obj.model.horsePower))
    .filter((value) => !Number.isNaN(value));
  setPlaceholderObject.horsePowerFrom = Math.min(...horsePowerArray);
  setPlaceholderObject.horsePowerTo = Math.max(...horsePowerArray);
  const systemMaxTorqueArray = responseJsonArray
    .map((obj) => parseFloat(obj.model.powerTrain.systemMaxTorque))
    .filter((value) => !Number.isNaN(value));
  setPlaceholderObject.systemMaxTorqueFrom = Math.min(...systemMaxTorqueArray);
  setPlaceholderObject.systemMaxTorqueTo = Math.max(...systemMaxTorqueArray);
  const topSpeedArray = responseJsonArray.map((obj) => parseFloat(obj.model.topSpeed))
    .filter((value) => !Number.isNaN(value));
  setPlaceholderObject.topSpeedFrom = Math.min(...topSpeedArray);
  setPlaceholderObject.topSpeedTo = Math.max(...topSpeedArray);
  const trunkCapacityArray = responseJsonArray.map((obj) => parseFloat(obj.model.trunkCapacity))
    .filter((value) => !Number.isNaN(value));
  setPlaceholderObject.trunkCapacityFrom = Math.min(...trunkCapacityArray);
  setPlaceholderObject.trunkCapacityTo = Math.max(...trunkCapacityArray);
}

export function fetchModelPlaceholderObject() {
  return modelPlaceholderObject;
}

export function fetchSetPlaceholderObject() {
  return setPlaceholderObject;
}
