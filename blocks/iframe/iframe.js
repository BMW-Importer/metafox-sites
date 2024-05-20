function loadScript(url, callback) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  script.async = true;
  document.head.append(script);
  // Call the callback function once the script is loaded
  script.onload = () => {
    callback();
  };
}
// Load the iFrameResize library dynamically
loadScript('https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.2/iframeResizer.min.js', () => {
  // Initialize the iFrameResize function once the library is loaded
  if (typeof iFrameResize === 'function') {
    // eslint-disable-next-line no-undef
    iFrameResize({ log: true }, '#bmwIframe');
  }
});
export function generateIFrameDOM(props) {
  // Extract properties, always same order as in model, empty string if not set
  const [iFrameUrl] = props;

  // Build DOM
  const iFrameDOM = document.createRange().createContextualFragment(`
      <div class="iframe-container">
      <iframe src="${iFrameUrl.textContent}" id="bmwIframe" style="border: 0; width: 100%; height: 100%; min-height: 900px;">
      </iframe>
      <div class="loader"></div>
       </div>
    `);
  return iFrameDOM;
}
function iframeLoader() {
  const iframeCont = document.getElementById('bmwIframe');
  const loading = document.querySelector('.loader');
  iframeCont.addEventListener('load', () => {
    loading.style.display = 'none';
    iframeCont.style.opacity = 1;
  });
}
export default function decorate(block) {
  // get the first and only cell from each row
  const props = [...block.children].map((row) => row.firstElementChild);
  const iFrameDOM = generateIFrameDOM(props);
  block.textContent = '';
  block.append(iFrameDOM);
  iframeLoader();
}
