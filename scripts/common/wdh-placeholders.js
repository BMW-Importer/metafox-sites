/* eslint-disable max-len */
import { fetchPlaceholders } from '../aem.js';

const lang = document.querySelector('meta[name="language"]').content;
const placeholders = await fetchPlaceholders(`/${lang}`);

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
  const transmissionType = separatedValues[1]?.trim();
  const matchingEntry = Object.entries(placeholders)
    .find(([key]) => key === transmissionType);
  if (matchingEntry) {
    const [, value] = matchingEntry;
    return `${numberOfGears} - ${value}`;
  }
  return responseGearBoxValue;
}

export function buildModelPlaceholder(responseJson) {
  modelPlaceholderObject.alt = responseJson.model.alt || '';
  modelPlaceholderObject.enginePower = responseJson.model.enginePower || '';
  modelPlaceholderObject.acceleration = responseJson.model.acceleration || '';
  modelPlaceholderObject.agCode = responseJson.model.posiSpec.agCode || '';
  modelPlaceholderObject.bodyTypeCode = responseJson.model.bodyTypeCode || '';
  modelPlaceholderObject.bodyTypeDescription = responseJson.model.bodyTypeDescription || '';
  modelPlaceholderObject.brand = responseJson.model.brand || '';
  modelPlaceholderObject.cosyBrand = responseJson.model.posiSpec.cosyBrand || '';
  modelPlaceholderObject.cosyFallbackAlt = responseJson.model.cosyFallbackAlt || '';
  modelPlaceholderObject.description = responseJson.model.description || '';
  modelPlaceholderObject.driveType = responseJson.model.powerTrain.driveType || '';
  modelPlaceholderObject.electricRange = responseJson.model.pureElectricRange || '';
  modelPlaceholderObject.fabric = responseJson.model.posiSpec.fabric || '';
  modelPlaceholderObject.fuelType = responseJson.model.powerTrain.fuelType || '';
  modelPlaceholderObject.gearBox = processGearBoxValue(responseJson.model.powerTrain.gearBox) || '';
  modelPlaceholderObject.horsePower = responseJson.model.horsePower || '';
  modelPlaceholderObject.hybridCode = responseJson.model.hybridCode || '';
  modelPlaceholderObject.marketingBodyTypeCode = responseJson.model.marketingBodyTypeCode || '';
  modelPlaceholderObject.modelCode = responseJson.model.modelCode || '';
  modelPlaceholderObject.modelRangeCode = responseJson.model.modelRangeCode || '';
  modelPlaceholderObject.name = responseJson.model.name || '';
  modelPlaceholderObject.options = responseJson.model.posiSpec.options || '';
  modelPlaceholderObject.paint = responseJson.model.posiSpec.paint || '';
  modelPlaceholderObject.power = responseJson.model.power || '';
  modelPlaceholderObject.price = responseJson.model.price || '';
  modelPlaceholderObject.seats = responseJson.model.seats || '';
  modelPlaceholderObject.series = responseJson.model.series || '';
  modelPlaceholderObject.seriesCode = responseJson.model.seriesCode || '';
  modelPlaceholderObject.seriesDescription = responseJson.model.seriesDescription || '';
  modelPlaceholderObject.shortRangeName = responseJson.model.shortRangeName || '';
  modelPlaceholderObject.systemMaxTorque = responseJson.model.powerTrain.systemMaxTorque || '';
  modelPlaceholderObject.systemPower = responseJson.model.powerTrain.systemPower || '';
  modelPlaceholderObject.trunkCapacity = responseJson.model.trunkCapacity || '';
  modelPlaceholderObject.topSpeed = responseJson.model.topSpeed || '';
}

export function buildTechDataPlaceholder(techJson) {
  techPlaceholderObject.brand = ''; // key not found
  techPlaceholderObject.transmissionCode = techJson?.transmissionCode || '';
  techPlaceholderObject.transmissionId = ''; // key not found
  techPlaceholderObject.volt48 = techJson?.volt48 || '';
  techPlaceholderObject.id_leist_konst = techJson?.iD_LEIST_KONST || '';
  techPlaceholderObject.systemPower = techJson?.technicalData?.powerTrain?.systemPower || '';
  techPlaceholderObject.systemMaxTorque = techJson?.technicalData?.powerTrain?.systemMaxTorque || '';
  techPlaceholderObject.gearBox = processGearBoxValue(techJson?.technicalData?.powerTrain?.gearBox || '');
  techPlaceholderObject.driveType = techJson?.technicalData?.powerTrain?.driveType || '';
  techPlaceholderObject.cylinders = techJson?.technicalData?.engine?.cylinders || '';
  techPlaceholderObject.technicalCapacity = techJson?.technicalData?.engine?.technicalCapacity || '';
  techPlaceholderObject.nominalPower = techJson?.technicalData?.engine?.nominalPower || '';
  techPlaceholderObject.nominalTorque = techJson?.technicalData?.engine?.nominalTorque || '';
  techPlaceholderObject.electricSystemPower = techJson?.technicalData?.electric?.electricSystemPower || '';
  techPlaceholderObject.electricSystemMaxTorque = techJson?.technicalData?.electric?.electricSystemMaxTorque || '';
  techPlaceholderObject.acceleration = techJson?.technicalData?.performance?.acceleration || '';
  techPlaceholderObject.topSpeed = techJson?.technicalData?.performance?.topSpeed || '';
  techPlaceholderObject.electricTopSpeed = techJson?.technicalData?.performance?.electricTopSpeed || '';
  techPlaceholderObject.consumptionWltpCombined = techJson?.technicalData?.emissionsConsumptionWltp?.consumptionWltpCombined || '';
  techPlaceholderObject.consumptionWltpCombinedBest = techJson?.technicalData?.emissionsConsumptionWltp?.consumptionWltpCombinedBest || '';
  techPlaceholderObject.emissionsWltpCombined = techJson?.technicalData?.emissionsConsumptionWltp?.emissionsWltpCombined || '';
  techPlaceholderObject.emissionsWltpCombinedBest = techJson?.technicalData?.emissionsConsumptionWltp?.emissionsWltpCombinedBest || '';
  techPlaceholderObject.electricConsumption = techJson?.technicalData?.emissionsConsumptionWltp?.electricConsumption || '';
  techPlaceholderObject.electricConsumptionBest = techJson?.technicalData?.emissionsConsumptionWltp?.electricConsumptionBest || '';
  techPlaceholderObject.electricRangeWltpCombined = techJson?.technicalData?.emissionsConsumptionWltp?.electricRangeWltpCombined || '';
  techPlaceholderObject.electricRangeWltpCombinedBest = techJson?.technicalData?.emissionsConsumptionWltp?.electricRangeWltpCombinedBest || '';
  techPlaceholderObject.efficiencyCategoryMin = techJson?.technicalData?.emissionsConsumptionWltp?.efficiencyCategoryMin || '';
  techPlaceholderObject.efficiencyCategoryMax = techJson?.technicalData?.emissionsConsumptionWltp?.efficiencyCategoryMaxChargeSustaining || '';
  techPlaceholderObject.co2EquivalentOverallBest = techJson?.technicalData?.emissionsConsumptionWltp?.co2EquivalentOverallBest || '';
  techPlaceholderObject.co2EquivalentOverall = techJson?.technicalData?.emissionsConsumptionWltp?.co2EquivalentOverall || '';
  techPlaceholderObject.petrolEquivalentOverallBest = techJson?.technicalData?.emissionsConsumptionWltp?.petrolEquivalentOverallBest || '';
  techPlaceholderObject.petrolEquivalentOverall = techJson?.technicalData?.emissionsConsumptionWltp?.petrolEquivalentOverall || '';
  techPlaceholderObject.primaryEnergyPetrolEquivalentBest = techJson?.technicalData?.emissionsConsumptionWltp?.primaryEnergyPetrolEquivalentBest || '';
  techPlaceholderObject.primaryEnergyPetrolEquivalent = techJson?.technicalData?.emissionsConsumptionWltp?.primaryEnergyPetrolEquivalent || '';
  techPlaceholderObject.electricRangeWltpCity = techJson?.technicalData?.emissionsConsumptionWltp?.electricRangeWltpCity || '';
  techPlaceholderObject.noiseDriving = techJson?.technicalData?.emissionsConsumptionWltp?.noiseDriving || '';
  techPlaceholderObject.noiseStationary = techJson?.technicalData?.emissionsConsumptionWltp?.noiseStationary || '';
  techPlaceholderObject.batteryCapacity = techJson?.technicalData?.charging?.batteryCapacity || '';
  techPlaceholderObject.chargeACDC = techJson?.technicalData?.charging?.chargeACDC || '';
  techPlaceholderObject.charge_DC_10_80 = techJson?.technicalData?.charging?.charge_DC_10_80 || '';
  techPlaceholderObject.chargeDC = techJson?.technicalData?.charging?.chargeDC || '';
  techPlaceholderObject.additionalRangeDC = techJson?.technicalData?.charging?.additionalRangeDC || '';
  techPlaceholderObject.chargeAC = techJson?.technicalData?.charging?.chargeAC || '';
  techPlaceholderObject.charge_AC_0_100 = techJson?.technicalData?.charging?.charge_AC_0_100 || '';
  techPlaceholderObject.chargeAC_11 = techJson?.technicalData?.charging?.chargeAC_11 || ''; // key not found;
  techPlaceholderObject.chargeAC_22 = techJson?.technicalData?.charging?.chargeAC_22 || ''; // key not found;
  techPlaceholderObject.charge_AC_0_100_11 = techJson?.technicalData?.charging?.charge_AC_0_100_11 || ''; // key not found
  techPlaceholderObject.charge_AC_0_100_22 = techJson?.technicalData?.charging?.charge_AC_0_100_22 || ''; // key not found;
  techPlaceholderObject.chargingMaxAC = techJson?.technicalData?.charging?.chargingMaxAC || ''; // key not found
  techPlaceholderObject.lengthWidthHeight = techJson?.technicalData?.weightMeasurements?.lengthWidthHeight || ''; // key not found;
  techPlaceholderObject.length = techJson?.technicalData?.weightMeasurements?.length || '';
  techPlaceholderObject.width = techJson?.technicalData?.weightMeasurements?.width || '';
  techPlaceholderObject.height = techJson?.technicalData?.weightMeasurements?.height || '';
  techPlaceholderObject.widthMirrors = techJson?.technicalData?.weightMeasurements?.widthMirrors || '';
  techPlaceholderObject.wheelTurn = techJson?.technicalData?.weightMeasurements?.wheelTurn || '';
  techPlaceholderObject.weightNotLoaded = techJson?.technicalData?.weightMeasurements?.weightNotLoaded || '';
  techPlaceholderObject.weightMax = techJson?.technicalData?.weightMeasurements?.weightMax || '';
  techPlaceholderObject.permittedLoad = techJson?.technicalData?.weightMeasurements?.permittedLoad || '';
  techPlaceholderObject.permittedAxleLoad = techJson?.technicalData?.weightMeasurements?.permittedAxleLoad || '';
  techPlaceholderObject.trunkCapacity = techJson?.technicalData?.weightMeasurements?.trunkCapacity || '';
  techPlaceholderObject.tankCapacity = techJson?.technicalData?.weightMeasurements?.tankCapacity || '';
  techPlaceholderObject.fuelType = techJson?.technicalData?.powerTrain?.fuelType || '';
  techPlaceholderObject.hybridCode = techJson?.hybridCode || '';
  techPlaceholderObject.overboostMax = techJson?.footnotesData?.overboostMax || '';
  techPlaceholderObject.overboostKW = techJson?.footnotesData?.overboostKW || '';
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
