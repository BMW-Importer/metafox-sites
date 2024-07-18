// import { getApiResponse } from '../../scripts/common/wdh-util.js';

// export default async function decorate(block) {
//     block.classList.add('technical-data-block');
//     const [
//         techDataProp,
//         ...rows
//     ] = [...block.children].map((row, index) => {
//         if (index < 1) {
//             return row;
//         }
//         return row;
//     });

//     const heading = document.createElement('h2');
//     heading.classList.add('techdata-selected-model-title');
//     block.append(heading);

//     const dropDownContainer = document.createElement('div');
//     dropDownContainer.classList.add('techdata-ddl-container');
//     block.append(dropDownContainer);

//     const enableAutoData = techDataProp?.querySelector('h2');
//     const enableAccordion = techDataProp?.querySelector('h3');
//     if (enableAccordion) block.classList.append('techdata-enable-accordion');

//     const spreadSheetLink = techDataProp?.querySelector('a');

//     const listOfModels = [];

//     rows.forEach(async (modelData) => {
//         const [modelProp, analyticsProp] = modelData?.children || [];

//         modelProp.classList.append('techdata-model-ddl');

//         const [modelPropData] = modelProp?.children || [];
//         const splittedModelData = modelPropData?.textContent?.split(',');

//         if (splittedModelData && splittedModelData?.length >= 3) {
//             const agCode = splittedModelData[2]?.trim() || '';
//             try {
//                 // wdh call or else spreadsheet call
//                 if (enableAutoData) {
//                     const modelDetailResponse = await getApiResponse(agCode);
//                     listOfModels.push({
//                         agCode: agCode,
//                         analytics: analyticsProp,
//                         json: modelDetailResponse,
//                     });
//                 }
//             } catch (error) {
//                 console.error('fetch model detail failed');
//             }
//         }

//     });

//     if (listOfModels.length > 1) {
//         generateModelsDdl(listOfModels);
//     } else {
//         generateTechDataUI(listOfModels[0]);
//     }
// }
