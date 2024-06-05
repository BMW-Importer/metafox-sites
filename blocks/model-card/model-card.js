import { buildGetPlaceholder, getModelPlaceholderObject } from '../../scripts/common/wdh-placeholders.js';

async function modelPlaceholder(modelCode) {
  try {
    const endpointUrl = `/WDH_API/Models/ModelDetails/${modelCode[0]}.json`;
    const origin = window.location.host.match('author-(.*?).adobeaemcloud.com(.*?)') ? `${window.hlx.codeBasePath}` : '';
    const response = await fetch(`${origin}${endpointUrl}`);
    const responseJson = await response.json();
    buildGetPlaceholder(responseJson);
    return getModelPlaceholderObject();
  } catch (error) {
    console.log('Error fetching data for building get placeholder', error);
    throw error;
  }
}

function replacePlaceholder(string, data) {
  return string.replace(/\${model(.*?)}/g, (match, expression) => {
    const key = expression.split('.');
    let value = data;
    if (key[1] in value) {
      value = value[key[1]];
    } else {
      return match;
    }
    return value;
  });
}

function getCosyImageUrl(response, resolution, angle) {
  const imagesObject = response.walkaround[resolution].images;
  const imgUrl = imagesObject.find((img) => img.angle === angle && img.viewImage !== undefined);
  return imgUrl.viewImage;
}

async function getCosyImage(modelCode) {
  try {
    const endpointUrl = `/WDH_API/Models/CosyImages/${modelCode}-cosy.json`;
    const origin = window.location.host.match('author-(.*?).adobeaemcloud.com(.*?)') ? `${window.hlx.codeBasePath}` : '';
    const response = await fetch(`${origin}${endpointUrl}`);
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.log('Error fetching data for building get placeholder', error);
    throw error;
  }
}

export default function decorate(block) {
  const props = [...block.children].map((row) => row.firstElementChild);
  const [, placeholder] = props;
  const modelCode = ['7K11', '61CM'];
  block.textContent = '';
  modelPlaceholder(modelCode).then((wdhPlaceholderObject) => {
    const updatedPlaceholder = replacePlaceholder(placeholder.innerText, wdhPlaceholderObject);
    block.append(updatedPlaceholder);
  });
  modelCode.forEach((agCode) => {
    getCosyImage(agCode).then((responseJson) => {
      const cosyImageUrl = getCosyImageUrl(responseJson, 'res_1280x720', 20);
      const imgTag = document.createElement('img');
      imgTag.src = cosyImageUrl;
      block.append(imgTag);
    });
    getCosyImage(agCode).then((responseJson) => {
      const cosyImageUrlNew = getCosyImageUrl(responseJson, 'res_640x360', 90);
      const imgTag = document.createElement('img');
      imgTag.src = cosyImageUrlNew;
      block.append(imgTag);
    });
  });
}
