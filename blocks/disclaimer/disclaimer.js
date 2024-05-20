import {
  DEV, STAGE, PROD, disclaimerGQlEndpoint,
} from '../../scripts/common/constants.js';

async function getContentFragmentData(disclaimerCFPath, gqlOrigin) {
  const endpointUrl = gqlOrigin + disclaimerGQlEndpoint + disclaimerCFPath.innerText;
  const response = await fetch(endpointUrl);
  return response.json();
}

export default function decorate(block) {
  const props = [...block.children].map((row) => row.firstElementChild);
  const env = document.querySelector('meta[name="env"]').content;
  let publishDomain = '';
  const [disclaimerCF] = props;
  if (env === 'dev') {
    publishDomain = DEV.hostName;
  } else if (env === 'stage') {
    publishDomain = STAGE.hostName;
  } else {
    publishDomain = PROD.hostName;
  }
  block.textContent = '';
  window.gqlOrigin = window.location.hostname.match('^(.*.hlx\\.(page|live))|localhost$') ? publishDomain : '';
  getContentFragmentData(disclaimerCF, window.gqlOrigin).then((response) => {
    const cfData = response?.data;
    if (cfData) {
      const disclaimerHtml = cfData?.disclaimercfmodelByPath?.item?.disclaimer?.html;
      const disclaimerContent = document.createElement('div');
      disclaimerContent.className = 'disclaimer-content';
      disclaimerContent.innerHTML = disclaimerHtml;
      block.appendChild(disclaimerContent);
    }
  });
}
