export const techDataMarkUp = `
<table class='techdata-table total-power'>
<caption>
<button class='techdata-table-caption-btn powerTrain'>{placeholders.techDataTotalPower}</button>
<i class="techdata-caption-icon" data-icon="arrow_chevron_up" aria-hidden="true"></i>
</caption>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label powerTrain_fuelType">{placeholders.techDataEngineType}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value powerTrain_fuelType">{technicalData.powerTrain.fuelType}</p>
    </td>
</tr>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label powerTrain_systemPower">{placeholders.techDataPowerInKw}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value powerTrain_systemPower">{technicalData.powerTrain.systemPower}</p>
    </td>
</tr>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label powerTrain_systemMaxTorque">{placeholders.techDataTorqueInNm}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value powerTrain_systemMaxTorque">{technicalData.powerTrain.systemMaxTorque}</p>
    </td>
</tr>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label powerTrain_gearBox">{placeholders.techDataTransmission}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value powerTrain_gearBox">{technicalData.powerTrain.gearBox}</p>
    </td>
 </tr>
 <tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label powerTrain_driveType">{placeholders.techDataDrive}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value powerTrain_driveType">{technicalData.powerTrain.driveType}</p>
    </td>
</tr>
</table>

<table class='techdata-table twin-power'>
<caption>
<button class='techdata-table-caption-btn engine'>{placeholders.techDataTwinPower}</button>
<i class="techdata-caption-icon" data-icon="arrow_chevron_up" aria-hidden="true"></i>
</caption>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label engine_cylinders_label">{placeholders.techDataCylinders}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value engine_cylinders_value">{technicalData.engine.cylinders}</p>
    </td>
</tr>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label engine_technicalCapacity_label">{placeholders.techDataVolumneInCm}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value engine_technicalCapacity_value">{technicalData.engine.technicalCapacity}</p>
    </td>
</tr>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label engine_nominalPower_label">{placeholders.techDataNominalPowerInKw}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value engine_nominalPower_value">{technicalData.engine.nominalPower}</p>
    </td>
</tr>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label engine_nominalTorque_label">{placeholders.techDataNominalSpeedInNm}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value engine_nominalTorque_value">{technicalData.engine.nominalTorque}</p>
    </td>
 </tr>
</table>

<table class='techdata-table electric-motor'>
<caption>
<button class='techdata-table-caption-btn electric'>{placeholders.techDataElectricMotor}</button>
<i class="techdata-caption-icon" data-icon="arrow_chevron_up" aria-hidden="true"></i>
</caption>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label electric_systemPower_label">{placeholders.techDataNominalPowerElectricMotorKw}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value electric_systemPower_value">{technicalData.electric.systemPower}</p>
    </td>
</tr>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label electric_systemMaxTorque_label">{placeholders.techDataNominalTorqueInNm}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value electric_systemMaxTorque_value">{technicalData.electric.systemMaxTorque}</p>
    </td>
</tr>
</table>

<table class='techdata-table performance'>
<caption>
<button class='techdata-table-caption-btn performance'>{placeholders.techDataPerformance}</button>
<i class="techdata-caption-icon" data-icon="arrow_chevron_up" aria-hidden="true"></i>
</caption>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label performance_acceleration_label">{placeholders.techDataAccelerationZeroToHundread}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value performance_acceleration_value">{technicalData.performance.acceleration}</p>
    </td>
</tr>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label performance_topSpeed_label">{placeholders.techDataMaximumSpeedInKm}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value performance_topSpeed_value">{technicalData.performance.topSpeed}</p>
    </td>
</tr>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label performance_electricTopSpeed_label">{placeholders.techDataMaximumSpeedInKmElectricMotor}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value performance_electricTopSpeed_value">{technicalData.performance.electricTopSpeed}</p>
    </td>
</tr>
</table>

<table class='techdata-table Consumption-Emissions'>
<caption>
<button class='techdata-table-caption-btn emissionsConsumptionWltp'>{placeholders.techDataConsumptionEmission}</button>
<i class="techdata-caption-icon" data-icon="arrow_chevron_up" aria-hidden="true"></i>
</caption>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label emissionsConsumptionWltp_consumptionWltpCombined_label">{placeholders.techDataFuelConsumptionCombinedWltpUl}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value emissionsConsumptionWltp_consumptionWltpCombined_value">{technicalData.emissionsConsumptionWltp.consumptionWltpCombined}</p>
    </td>
</tr>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label emissionsConsumptionWltp_emissionsWltpCombined_label">{placeholders.techDataC02EmissionsCombinedWltpUgkm}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value emissionsConsumptionWltp_emissionsWltpCombined_value">{technicalData.emissionsConsumptionWltp.emissionsWltpCombined}</p>
    </td>
</tr>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label emissionsConsumptionWltp_consumptionWltpCombinedChargeSustaining_label">{placeholders.techDataEnergyConsumptionCombinedWltpInKwh}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value emissionsConsumptionWltp_consumptionWltpCombinedChargeSustaining_value">{technicalData.emissionsConsumptionWltp.consumptionWltpCombinedChargeSustaining}</p>
    </td>
</tr>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label emissionsConsumptionWltp_emissionsWltpCombined_label">{placeholders.techDataElectricRangeWltpInKm}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value emissionsConsumptionWltp_emissionsWltpCombined_value">{technicalData.emissionsConsumptionWltp.emissionsWltpCombined}</p>
    </td>
</tr>
</table>

<table class='techdata-table high-voltage-battery'>
<caption>
<button class='techdata-table-caption-btn charging'>{placeholders.techDataHighVoltageBatteryCharging}</button>
<i class="techdata-caption-icon" data-icon="arrow_chevron_up" aria-hidden="true"></i>
</caption>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label charging_batteryCapacity_label">{placeholders.techDataBatteryCapacityInKwh}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value charging_batteryCapacity_value">{technicalData.charging.batteryCapacity}</p>
    </td>
</tr>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label charging_additionalRangeDC_label">{placeholders.techDataAdditionalRangeAfterMinOfCharge}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value charging_additionalRangeDC_value">{technicalData.charging.additionalRangeDC}</p>
    </td>
</tr>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label charging_chargeACDC_label">{placeholders.techDataMaximumChargingPowerAcDcInKw}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value charging_chargeACDC_value">{technicalData.charging.chargeACDC}</p>
    </td>
</tr>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label charging_charge_AC_0_100_label">{placeholders.techDataChargingTimeAcHr}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value charging_charge_AC_0_100_value">{technicalData.charging.charge_AC_0_100}</p>
    </td>
</tr>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label charging_charge_DC_10_80_label">{placeholders.techDataChargingTimeDcInMin}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value charging_charge_DC_10_80_value">{technicalData.charging.charge_DC_10_80}</p>
    </td>
</tr>
</table>


<table class='techdata-table dimenssion-weights'>
<caption>
<button class='techdata-table-caption-btn weightMeasurements'>{placeholders.techDataDimensionsWeights}</button>
<i class="techdata-caption-icon" data-icon="arrow_chevron_up" aria-hidden="true"></i>
</caption>
<thead class="techdata-table-head">
    <tr class="techdata-table-head-tr">
        <td class="techdata-table-head-td">
        <div class="techdata-table-img-side"></div>
        <div class="techdata-table-img-measurements">
        <p class="techdata-table-img-side-text">{technicalData.weightMeasurements.length}&nbsp{placeholders.techDataMmText}</p>
        </div>
        </td>
    </tr>
    <tr class="techdata-table-head-tr">
        <td class="techdata-table-head-td">
        <div class="techdata-table-img-front"></div>
        <div class="techdata-table-img-measurements">
        <p class="techdata-table-img-front-text">{technicalData.weightMeasurements.width}&nbsp{placeholders.techDataMmText}</p>
        </div>
        </td>
    </tr>
    <tr class="techdata-table-head-tr">
        <td class="techdata-table-head-td">
        <div class="techdata-table-img-back"></div>
        <div class="techdata-table-img-measurements">
        <p class="techdata-table-img-back-text">{technicalData.weightMeasurements.height}&nbsp{placeholders.techDataMmText}</p>
        </div>
        </td>
    </tr>
</thead>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label weightMeasurements_length_label">{placeholders.techDataLengthInMm}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value weightMeasurements_length_value">{technicalData.weightMeasurements.length}</p>
    </td>
</tr>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label weightMeasurements_width_label">{placeholders.techDataWidthInMm}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value weightMeasurements_width_value">{technicalData.weightMeasurements.width}</p>
    </td>
</tr>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label weightMeasurements_height_label">{placeholders.techDataHeightInMm}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value weightMeasurements_height_value">{technicalData.weightMeasurements.height}</p>
    </td>
</tr>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label weightMeasurements_widthMirrors_label">{placeholders.techDataWidthIncludingMirrorsInMm}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value weightMeasurements_widthMirrors_value">{technicalData.weightMeasurements.widthMirrors}</p>
    </td>
</tr>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label weightMeasurements_wheelTurn_label">{placeholders.techDataWheelbaseInMm}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value weightMeasurements_wheelTurn_value">{technicalData.weightMeasurements.wheelTurn}</p>
    </td>
</tr>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label weightMeasurements_weightNotLoaded_label">{placeholders.techDataEmptyVehicleWeightInKg}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value weightMeasurements_weightNotLoaded_value">{technicalData.weightMeasurements.weightNotLoaded}</p>
    </td>
</tr>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label weightMeasurements_weightMax_label">{placeholders.techDataMaximumAllowedWeightInKg}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value weightMeasurements_weightMax_value">{technicalData.weightMeasurements.weightMax}</p>
    </td>
</tr>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label weightMeasurements_permittedLoad_label">{placeholders.techDataLoadCapacityInKg}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value weightMeasurements_permittedLoad_value">{technicalData.weightMeasurements.permittedLoad}</p>
    </td>
</tr>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label weightMeasurements_trailerLoad_label">{placeholders.techDataOptionallySuppliedTowing}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value weightMeasurements_trailerLoad_value">{technicalData.weightMeasurements.trailerLoad}</p>
    </td>
</tr>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label weightMeasurements_trunkCapacity_label">{placeholders.techDataCapacityofTheLuggageSpaceUl}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value weightMeasurements_trunkCapacity_value">{technicalData.weightMeasurements.trunkCapacity}</p>
    </td>
</tr>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label">{placeholders.techDataTheVolumeOfTheReservoirUl}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value">{technicalData.}</p>
    </td>
</tr>
<tr class="techdata-table-tr" role="row">
    <td class="techdata-table-td label" role="rowheader">
    <p class="techdata-table-td-text label">{placeholders.techDataBmwWheelsAndTires}</p>
    </td>
    <td class="techdata-table-td value" role="rowheader">
    <p class="techdata-table-td-text value">{technicalData.}</p>
    </td>
</tr>
</table>
`;

export const techDataWdhResponsObject = `
{
    "model": {
        "modelCode": "{responseJson.ModelCode}",
        "brand": "",
        "description": "",
        "shortName": "",
        "shortRangeName": "",
        "modelRangeCode": "",
        "modelRanges": [
            ""
        ],
        "seriesCode": "",
        "series": [
            ""
        ],
        "seriesDescription": "",
        "seriesDescriptions": [
            ""
        ],
        "hybridCode": "",
        "fromPrice": 0,
        "acceleration": "",
        "trunkCapacity": 0,
        "seats": 0,
        "horsePower": 0,
        "topSpeed": "",
        "bodyTypeCode": "",
        "marketingBodyTypeCode": "",
        "posiSpec": {
            "cosyBrand": "",
            "agCode": "",
            "paint": "",
            "fabric": "",
            "options": ""
        },
        "powerTrain": {
            "fuelType": "",
            "systemPower": "",
            "systemMaxTorque": "",
            "gearBox": "",
            "driveType": ""
        },
        "effectDate": "",
        "vehicles": [
            {
                "transmissionCode": "{responseJson.TransmissionType}",
                "hybridCode": "",
                "iD_LEIST_KONST": "",
                "volt48": true,
                "technicalData": {
                    "powerTrain": {
                        "fuelType": "{responseJson.EngineType}",
                        "systemPower": "{responseJson.PowerkW}",
                        "systemMaxTorque": "{responseJson.TorqueNm}",
                        "gearBox": "{responseJson.Gearbox}",
                        "driveType": "{responseJson.Drive}"
                    },
                    "engine": {
                        "cylinders": "{responseJson.Cylinders}",
                        "technicalCapacity": "",
                        "nominalPower": "{responseJson.NominalPowerkW}",
                        "nominalTorque": "{responseJson.NominalTorqueNm}"
                    },
                    "electric": {
                        "systemPower": "{responseJson.ElectricNominalPowerkW}"
                    },
                    "performance": {
                        "acceleration": "{responseJson.Acceleration}",
                        "topSpeed": "{responseJson.MaximumSpeed}",
                        "electricTopSpeed": "{responseJson.ElectricMaximumSpeed}"
                    },
                    "emissionsConsumptionWltp": {
                        "consumptionWltpCombined": "{responseJson.EnergyConsumptionWLTP}",
                        "consumptionWltpCombinedChargeSustaining": "",
                        "emissionsWltpCombined": "{responseJson.CO2Emissions}",
                        "electricConsumption": "",
                        "electricRangeWltpCombined": "{responseJson.ElectricRange}",
                        "efficiencyCategoryMinChargeSustaining": "",
                        "efficiencyCategoryMaxChargeSustaining": "",
                        "noiseDriving": "{responseJson.PassageNoiseLevel}",
                        "noiseStationary": "{responseJson.NoiseLevelStanding}"
                    },
                    "charging": {
                        "batteryCapacity": "{responseJson.BatteryCapacity}",
                        "additionalRangeDC": "",
                        "chargeACDC": "{responseJson.MaximumChargingPower}",
                        "chargeAC": "{responseJson.ChargeAC}",
                        "charge_AC_0_100": "{responseJson.ChargeACDC}",
                        "chargeDC": "{responseJson.ChargeDC}",
                        "charge_DC_10_80": ""
                    },
                    "weightMeasurements": {
                        "length": "{responseJson.Length}",
                        "width": "{responseJson.Width}",
                        "height": "{responseJson.Height}",
                        "widthMirrors": "{responseJson.WidthIncMirrors}",
                        "wheelTurn": "{responseJson.Wheelbase}",
                        "weightNotLoaded": "{responseJson.EmptyWeight}",
                        "weightMax": "{responseJson.MaximumWeight}",
                        "permittedLoad": "",
                        "trailerLoad": "{responseJson.TowingHook}",
                        "trunkCapacity": "{responseJson.LuggageSpaceCapacity}",
                        "tankCapacity": "{responseJson.TankVolume}"
                    }
                },
                "footnotes": {},
                "footnotesData": {
                    "overboostMax": "",
                    "overboostKW": ""
                }
            }
        ]
    }
}`;
