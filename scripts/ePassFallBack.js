const iframeElement = document.querySelector('#bmwIframe');

const iframeUrl = iframeElement.getAttribute('src');
const iframeWrapper = iframeElement.parentElement;

// first hide the iframe
iframeElement.style.display = 'none';

// create a callback function that is called if the user rejects the cookies
// at a later point when the content is already displayed.
// the callback is unloading the iframe and hiding it,
// and calling the fallback page handling again.

// create the options object - for simplicity we use an almost empty object -
// fields accepted are explained in the documentation
// we only add the optional consentRejectedCallback field,
// for demonstration purposes. It can be omitted, if there is no need for it.

export function handleFallbackPage() {
  // We create a container for the fallback page, in case it needs to be displayed.
  // The container usually should take the same size as the iframe,
  // so that there won't be any jumping of the page when
  // the container is hidden and the actual iframe is displayed.
  const fallbackPageContainer = document.createElement('div');
  iframeWrapper.appendChild(fallbackPageContainer);
  // set some size for the ePaaS FallbackPage container.
  // The ePaaS FallbackPage will take up all the size of its container.

  fallbackPageContainer.setAttribute('style', `height: 
        ${iframeElement.style.height}; width: ${iframeElement.style.width}`);

  epaas.api.fallbackpage.then((bundle) => bundle.handleFallbackPage(fallbackPageContainer, iframeUrl, fallbackPageOptions))
    .then(() => {
      // the fallback was resolved, this means we can show the iframe.
      iframeElement.style.display = 'block';
      // remove the fallback page component, as it's no longer needed.
      iframeWrapper.removeChild(fallbackPageContainer);
      // load the iframe
      iframeElement.setAttribute('src', iframeUrl);
    })
    .catch((error) => {
      // here we should do some error handling in case
      console.error('Fallback page promise rejected for url:', iframeUrl, error.message);
    });
}

function consentRejectedCallback() {
  iframeElement.setAttribute('src', undefined);
  iframeElement.style.display = 'none';
  console.log('consentRejectedCallback called');

  handleFallbackPage();
}

export const fallbackPageOptions = {
  consentRejectedCallback,
};

// show the fallback page
handleFallbackPage();
