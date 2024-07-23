const alignClassList = { center: 'alignment-center', right: 'alignment-right', left: 'alignment-left' };

function getAlignmentStyle(element, selector) {
  let alignClass = '';
  element.querySelectorAll(selector).forEach((childElemet) => {
    childElemet.classList.forEach((className) => {
      if (className.includes('alignment-')) {
        alignClass = className;
      }
    });
  });
  return alignClass;
}

function setAlignmentStyle(style, element) {
  if (alignClassList.left === style) {
    element.classList.add('button-align-left');
  } else if (alignClassList.right === style) {
    element.classList.add('button-align-right');
  } else {
    element.classList.add('button-align-center');
  }
}

export function addIcon(element, iconType, className = '') {
  if (iconType === 'arrow_chevron_right') {
    const iconSpan = document.createElement('span');
    iconSpan.innerHTML = '<i class="icon-gt" aria-hidden="true" data-icon="arrow_chevron_right"></i>';
    iconSpan.classList = className;
    element.append(iconSpan);
  }
}

export function decorateBMWButtons(element) {
  element.querySelectorAll('a').forEach((a) => {
    a.title = a.title || a.textContent;
    if (a.href !== a.textContent) {
      const up = a.parentElement;
      const twoup = a.parentElement.parentElement;
      if (!a.querySelector('img')) {
        if (
          up.childNodes.length === 1 && (up.tagName === 'P' || up.tagName === 'DIV')
        ) {
          // default
          up.ariaLabel = up.textContent;
          a.className = '';
          const alignment = getAlignmentStyle(element, 'div.section');
          setAlignmentStyle(alignment, up);
        }
        if (
          up.childNodes.length === 1 && up.tagName === 'STRONG' && twoup.childNodes.length === 1 && (twoup.tagName === 'P' || twoup.tagName === 'DIV')
        ) {
          a.className = 'button ghost-dark button-fixed-width';
          up.ariaLabel = up.textContent;
          twoup.classList.add('button-container');
          const alignment = getAlignmentStyle(element, 'div.section');
          setAlignmentStyle(alignment, twoup);
        }
        if (
          up.childNodes.length === 1 && up.tagName === 'EM' && twoup.childNodes.length === 1 && (twoup.tagName === 'P' || twoup.tagName === 'DIV')
        ) {
          a.className = 'button hyperlink';
          twoup.ariaLabel = up.textContent;
          twoup.classList.add('button-container');
          up.classList.add('align-icon');
          const alignment = getAlignmentStyle(element, 'div.section');
          setAlignmentStyle(alignment, twoup);
          addIcon(up, 'arrow_chevron_right', 'align-center');
        }
      }
    }
  });
}

export function timeStamp() {
  const dateTime = new Date();

  // Format the date components
  const year = dateTime.getFullYear();
  const month = (dateTime.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const day = dateTime.getDate().toString().padStart(2, '0');
  const hours = dateTime.getHours().toString().padStart(2, '0');
  const minutes = dateTime.getMinutes().toString().padStart(2, '0');
  const seconds = dateTime.getSeconds().toString().padStart(2, '0');
  const milliseconds = dateTime.getMilliseconds().toString().padStart(3, '0');
  const timezoneOffset = -dateTime.getTimezoneOffset();
  const timezoneOffsetHours = Math.floor(Math.abs(timezoneOffset) / 60).toString().padStart(2, '0');
  const timezoneOffsetMinutes = (Math.abs(timezoneOffset) % 60).toString().padStart(2, '0');
  const timezoneSign = timezoneOffset >= 0 ? '+' : '-';

  // Construct the timestamp string
  const timestamp = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezoneSign}${timezoneOffsetHours}:${timezoneOffsetMinutes}`;
  return timestamp;
}

/** *** cookie code start */
// Function to get a cookie by name
function getCookie(name) {
  const cookieArr = document.cookie.split(';');

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < cookieArr.length; i++) {
    const cookiePair = cookieArr[i].split('=');

    // Removing whitespace at the beginning of the cookie name and compare it with the given string
    if (name === cookiePair[0].trim()) {
      // Decode the cookie value and return
      return decodeURIComponent(cookiePair[1]);
    }
  }
  // Return null if not found
  return null;
}

export function getConsentValue() {
// Get the 'cc_consentCookie' cookie
  // eslint-disable-next-line camelcase
  const cc_consentCookie = getCookie('cc_consentCookie');
  let advertisingValue;
  // eslint-disable-next-line camelcase
  if (cc_consentCookie) {
  // Parse the JSON string to an object
    const cookieObject = JSON.parse(cc_consentCookie);

    // Access the advertising value
    advertisingValue = cookieObject.bmw_rs.cmm.advertising;
  } else {
    console.log('Cookie not found');
  }
  /* cookie code end ** */

  let userConsentValue = 'n';

  if (advertisingValue === 1) {
    userConsentValue = 'y';
  }

  return userConsentValue;
}

export function marketingValue() {
  // Get the 'cc_consentCookie' cookie
  // eslint-disable-next-line camelcase
  const cc_consentCookie = getCookie('cc_consentCookie');
  let advertisingValue;
  // eslint-disable-next-line camelcase
  if (cc_consentCookie) {
    // Parse the JSON string to an object
    const cookieObject = JSON.parse(cc_consentCookie);

    // Access the advertising value
    advertisingValue = cookieObject.bmw_rs.cmm.advertising;
  } else {
    console.log('Cookie not found');
  }
  /* cookie code end ** */

  let userConsentValue = false;

  if (advertisingValue === 1) {
    userConsentValue = true;
  }

  return userConsentValue;
}

export default decorateBMWButtons;
