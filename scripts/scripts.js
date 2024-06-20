import {
  sampleRUM,
  loadHeader,
  loadFooter,
  decorateIcons,
  decorateBlocks,
  decorateSections,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
  buildBlock,
  readBlockConfig,
} from './aem.js';

import { decorateBMWButtons } from './bmw-util.js';

if (!window.modelDataMap) {
  window.modelDataMap = new Map();
}

const LCP_BLOCKS = []; // add your LCP blocks to the list

/**
 * Moves all the attributes from a given elmenet to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveAttributes(from, to, attributes) {
  if (!attributes) {
    // eslint-disable-next-line no-param-reassign
    attributes = [...from.attributes].map(({ nodeName }) => nodeName);
  }
  attributes.forEach((attr) => {
    const value = from.getAttribute(attr);
    if (value) {
      to.setAttribute(attr, value);
      from.removeAttribute(attr);
    }
  });
}

/**
 * Move instrumentation attributes from a given element to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveInstrumentation(from, to) {
  moveAttributes(
    from,
    to,
    [...from.attributes]
      .map(({ nodeName }) => nodeName)
      .filter((attr) => attr.startsWith('data-aue-') || attr.startsWith('data-richtext-')),
  );
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

function buildTabs(main) {
  const tabs = [...main.querySelectorAll(':scope > div')]
    .map((section) => {
      const sectionMeta = section.querySelector('div.section-metadata');
      if (sectionMeta) {
        const meta = readBlockConfig(sectionMeta);
        return [section, meta['tab-label']];
      }
      return null;
    })
    .filter((el) => !!el && el[1]);

  if (tabs.length) {
    const section = document.createElement('div');
    section.className = 'section';
    const ul = document.createElement('ul');
    ul.append(...tabs
      .map(([, tab]) => {
        if (tab) {
          const li = document.createElement('li');
          li.innerText = tab;
          return li;
        }
        return null;
      })
      .filter((li) => li !== null));

    const tabsBlock = buildBlock('tabs', [[ul]]);
    section.append(tabsBlock);
    tabs[0][0].insertAdjacentElement('beforebegin', section);
  }
}


/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildTabs(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}


/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateBMWButtons(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}
function launchVariables() {
  const headElement = document.querySelector('head');
  const scriptElement = document.createElement('script');
  scriptElement.setAttribute('src', 'https://assets.adobedtm.com/413a8cbe910e/2a9212d4511b/launch-6ca074b36c7e-development.min.js');
  headElement.appendChild(scriptElement);
}


function opt_in_info() {
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
  console.log("Time of optin : " + timestamp);
  const adobeDtm = window.adobeDataLayer;
  console.log(adobeDtm.version);
  const d = new Date();
  alloy('setConsent', {
    consent: [{
      standard: 'Adobe',
      version: '2.0',
      value: {
        collect: {
          val: 'y'
        },
        metadata: {
          time: timestamp
        }
      }
    }]
  });
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  // load anything that can be postponed to the latest here
  import('./delayed.js');
}
async function loadPage() {
  launchVariables();
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
  opt_in_info();
}

loadPage();

document.fonts.addEventListener('loading', ({ target }) => {
  [...target].filter(ff => ff.family === 'bmw_next_icons')
    .forEach((ff) => {
      ff.loaded.then(() => {
        document.body.classList.add(`iconfont${ff.weight}-loaded`);
        console.log(`Icon font ${ff.weight} loaded`);
      });
    });
});
