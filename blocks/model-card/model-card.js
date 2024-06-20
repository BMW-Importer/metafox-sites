import { fetchSetPlaceholderObject, fetchModelPlaceholderObject } from '../../scripts/common/wdh-placeholders.js';
import {
  buildContext, getCosyImage, getCosyImageUrl, replacePlaceholder,
} from '../../scripts/common/wdh-util.js';

export default function decorate(block) {
  const props = [...block.children].map((row) => row.firstElementChild);
  const [, placeholder] = props;
  const modelCodeArray = ['7K11', '61CM', '7K11'];
  block.textContent = '';
  buildContext(modelCodeArray).then(() => {
    // console.log(wdhSetPlaceholder);
    const wdhModelPlaceholder = fetchModelPlaceholderObject();
    const wdhSetPlaceholder = fetchSetPlaceholderObject();
    const modelRegex = /\${model(.*?)}/g;
    const textContent = placeholder.innerText;
    let updatedPlaceholder = replacePlaceholder(textContent, wdhModelPlaceholder, modelRegex);
    const setRegex = /\${set(.*?)}/g;
    updatedPlaceholder = replacePlaceholder(updatedPlaceholder, wdhSetPlaceholder, setRegex);
    console.log(wdhSetPlaceholder);
    block.append(updatedPlaceholder);
  });
  modelCodeArray.forEach((agCode) => {
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
  const a = fetchSetPlaceholderObject();
  console.log(a);
}
