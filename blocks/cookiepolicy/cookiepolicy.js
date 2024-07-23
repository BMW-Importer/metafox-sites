export function generateCookiePolicyDOM() {
  const CookiePolicyDOM = document.createRange().createContextualFragment(`
     <div class="epaas-policy-page-container"></div>
    `);
  return CookiePolicyDOM;
}

function genCookiePolicyPage() {
  const containerElement = document.querySelector('.cookiepolicy.block');
  // eslint-disable-next-line max-len, no-undef
  epaas.api.policypage.then((policypageBundle) => policypageBundle.showPolicyPage(containerElement));
}

export default function decorate(block) {
  const props = [...block.children].map((row) => row.firstElementChild);
  const CookiePolicyDOM = generateCookiePolicyDOM(props);
  block.textContent = '';
  block.append(CookiePolicyDOM);
  ((window.epaas && window.epaas.api) || window).addEventListener('consentcontroller.api.initialized', genCookiePolicyPage);
}
