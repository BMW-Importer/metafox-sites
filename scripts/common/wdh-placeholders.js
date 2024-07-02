import { fetchPlaceholders } from '../aem.js';

const placeholders = await fetchPlaceholders();

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

/*  need to write the logic for vechile Array */

const techPlaceholderObject = {
  brand: '',
  transmissionCode: '',
  transmissionId: '',
  volt48: '',
  id_leist_konst: '',

  systemPower: '',
  systemMaxTorque: '',
  gearBox: '',
  driveType: '',

  cylinders: '',
  technicalCapacity: '',
  nominalPower: '',
  nominalTorque: '',

  electricSystemPower: '',
  electricSystemMaxTorque: '',

  acceleration: '',
  topSpeed: '',
  electricTopSpeed: '',

  consumptionWltpCombined: '',
  consumptionWltpCombinedBest: '',
  emissionsWltpCombined: '',
  emissionsWltpCombinedBest: '',
  electricConsumption: '',
  electricConsumptionBest: '',
  electricRangeWltpCombined: '',
  electricRangeWltpCombinedBest: '',
  efficiencyCategoryMin: '',
  efficiencyCategoryMax: '',
  co2EquivalentOverallBest: '',
  co2EquivalentOverall: '',
  petrolEquivalentOverallBest: '',
  petrolEquivalentOverall: '',
  primaryEnergyPetrolEquivalentBest: '',
  primaryEnergyPetrolEquivalent: '',
  electricRangeWltpCity: '',
  noiseDriving: '',
  noiseStationary: '',

  batteryCapacity: '',
  chargeACDC: '',
  charge_DC_10_80: '',
  chargeDC: '',
  additionalRangeDC: '',
  chargeAC: '',
  chargeAC_11: '',
  chargeAC_22: '',
  charge_AC_0_100: '',
  charge_AC_0_100_11: '',
  charge_AC_0_100_22: '',
  chargingMaxAC: '',

  lengthWidthHeight: '',
  length: '',
  width: '',
  height: '',
  widthMirrors: '',
  wheelTurn: '',
  weightNotLoaded: '',
  weightMax: '',
  permittedLoad: '',
  permittedAxleLoad: '',
  trunkCapacity: '',
  tankCapacity: '',

  fuelType: '',
  hybridCode: '',

  overboostMax: '',
  overboostKW: '',
};

function processGearBoxValue(responseGearBoxValue) {
  const separatedValues = responseGearBoxValue.split(' - ');
  const numberOfGears = separatedValues[0].trim();
  const transmissionType = separatedValues[1].trim();
  const matchingEntry = Object.entries(placeholders)
    .find(([key]) => key === transmissionType);
  if (matchingEntry) {
    const [, value] = matchingEntry;
    return `${numberOfGears} - ${value}`;
  }
  return responseGearBoxValue;
}

export function buildModelPlaceholder(responseJson) {
  modelPlaceholderObject.alt = responseJson.model.alt;
  modelPlaceholderObject.enginePower = responseJson.model.enginePower;
  modelPlaceholderObject.description = responseJson.model.description;
  modelPlaceholderObject.seriesDescription = responseJson.model.seriesDescription;
  modelPlaceholderObject.acceleration = responseJson.model.acceleration;
  modelPlaceholderObject.bodyTypeCode = responseJson.model.bodyTypeCode;
  modelPlaceholderObject.shortRangeName = responseJson.model.shortRangeName;
  modelPlaceholderObject.modelRangeCode = responseJson.model.modelRangeCode;
  modelPlaceholderObject.marketingBodyTypeCode = responseJson.model.marketingBodyTypeCode;
  modelPlaceholderObject.seriesCode = responseJson.model.seriesCode;
  modelPlaceholderObject.agCode = responseJson.model.agCode;
  modelPlaceholderObject.bodyTypeDescription = responseJson.model.bodyTypeDescription;
  modelPlaceholderObject.brand = responseJson.model.brand;
  modelPlaceholderObject.cosyFallbackAlt = responseJson.model.cosyFallbackAlt;
  modelPlaceholderObject.cosyBrand = responseJson.model.cosyBrand;
  modelPlaceholderObject.driveType = responseJson.model.driveType;
  modelPlaceholderObject.electricRange = responseJson.model.electricRange;
  modelPlaceholderObject.fabric = responseJson.model.fabric;
  modelPlaceholderObject.fuelType = responseJson.model.powerTrain.fuelType;
  modelPlaceholderObject.gearBox = processGearBoxValue(responseJson.model.powerTrain.gearBox);
  modelPlaceholderObject.horsePower = responseJson.model.horsePower;
  modelPlaceholderObject.hybridCode = responseJson.model.hybridCode;
  modelPlaceholderObject.modelCode = responseJson.model.modelCode;
  modelPlaceholderObject.name = responseJson.model.name;
  modelPlaceholderObject.options = responseJson.model.options;
  modelPlaceholderObject.power = responseJson.model.power;
  modelPlaceholderObject.price = responseJson.model.price;
  modelPlaceholderObject.paint = responseJson.model.paint;
  modelPlaceholderObject.series = responseJson.model.series;
  modelPlaceholderObject.seats = responseJson.model.seats;
  modelPlaceholderObject.systemMaxTorque = responseJson.model.systemMaxTorque;
  modelPlaceholderObject.systemPower = responseJson.model.systemPower;
  modelPlaceholderObject.trunkCapacity = responseJson.model.trunkCapacity;
}

export function buildTechDataPlaceholder(vehicleJSON, transmissionCode) {
  techPlaceholderObject.fuelType = vehicleJSON.technicalData.powerTrain.fuelType;
  techPlaceholderObject.brand = vehicleJSON.technicalData.powerTrain.transmissionCode;
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

export function fetchTechDataPlaceholderObject() {
  return techPlaceholderObject;
}
