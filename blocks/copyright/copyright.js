export function generateCopyRightTextDOM(props) {
  // Extract properties, always same order as in model, empty string if not set
  const [textarea] = props;
  const copyRightyear = new Date();
  // Build DOM
  const copyRightTextDOM = document.createRange().createContextualFragment(`
    <div class="copy-right-content"><div>${textarea.textContent} <span class="copy-right-year">${copyRightyear.getFullYear()}</span></div></div>
  `);

  // add final teaser DOM and classes if used as child component
  return copyRightTextDOM;
}

export default function decorate(block) {
  // get the first and only cell from each row
  const props = [...block.children].map((row) => row.firstElementChild);
  const copyRightTextDOM = generateCopyRightTextDOM(props);
  block.textContent = '';
  block.append(copyRightTextDOM);
}
