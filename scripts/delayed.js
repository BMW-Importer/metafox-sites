// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './aem.js';
// Core Web Vitals RUM collection
sampleRUM('cwv');
const page_tracking = {"page": {
        "pageInfo": {
            "pageID": "/content/bmw/marketB4R1/bmw_rs/sr_RS/index",
            "version": "acdl: 2024-03-27t12: 24: 35.759+01: 00",
            "siteSection": "cars",
            "breadCrumbs": [
                "home",
                "cars",
                "models",
                "modelX"
            ],
            "sysEnv": "desktop",
            "destinationURL": "https://www.bmw.rs/sr/index.html",
            "referringURL": "",
            "variant": "real page",
            "geoRegion": "RS",
            "language": "sr",
            "websiteEnv": "prod",
            "pageTitle": "BMW Srbija",
            "pageName": "web:home",
            "windowInfo": {
                "screenWidth": 3840,
                "screenHeight": 2160,
                "screenOrientation": "landscape",
                "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
                "server": "www.bmw.rs",
                "url": "https://www.bmw.rs/sr/index.html",
                "previousDomain": "",
                "campaign": "",
                "internalCampaign": "",
                "urlClean": "https://www.bmw.rs/sr/index.html",
                "queryParam": ""
            },
            "timeInfo": {
                "localTime": "20:43:11",
                "utcTime": "18:43:11"
            }
        },
        "category": {
            "primaryCategory": "central car stock locator",
            "subCategory1": "",
            "subCategory2": "",
            "subCategory3": "",
            "pageType": "search"
        },
        "campaign": {
            "trackingCode": "utm_source=soc&utm_medium=twit&utm_campaign=MU_BMW_Brand_SOCIAL_AWNS&utm_id=HSZ2Q1BH7M9T&utm_term=brnd&utm_content=miy",
            "campaignSource": "soc",
            "campaignMedium": "twit",
            "campaignName": "MU_BMW_Brand_SOCIAL_AWNS",
            "campaignID": "HSZ2Q1BH7M9T",
            "campaignTerm": "pro",
            "campaignContent": "miy"
        },
        "attributes": {
            "parentDomain": ".bmw.rs",
            "brand": "bmw",
            "outletID": "1234_1",
            "outletName": "Nelson's Autohaus (Thailand) Co., L",
            "dealerID": "1234",
            "dealerName": "Nelson's Autohaus (Thailand) Co., L"
        }
    },
    "eventInfo": {
        "id": "2121221",
        "eventName": "pageview",
        "timeStamp": 1712774591731
    },
    "event": "pageview",
    "user": {
        "loginStatus": "logged_out",
        "consent": {
            "analytics": true,
            "marketing": true,
            "personalization": false
        }
    }}

// add more delayed functionality here
function analyticsTracking() {
    opt_in_info();
    set_page_tracking();
    set_ecid();
}
function opt_in_info(){
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
          time: '2024-04-30T07:00:05-7:00'
        }
      }
    }]
  });
}
function set_page_tracking(){
  // adding page tracking properties
    page_tracking.page.pageInfo.windowInfo.screenWidth = window.screen.width;
    page_tracking.page.pageInfo.windowInfo.screenHeight = window.screen.height;
    page_tracking.page.pageInfo.windowInfo.screenOrientation = window.screen.orientation.type;
    page_tracking.page.pageInfo.windowInfo.userAgent = navigator.userAgent;
    page_tracking.page.pageInfo.windowInfo.url = window.location.href;


    window.adobeDataLayer.push(page_tracking);
}
function set_ecid(){
  const iframeBlock = document.getElementById('bmwIframe');
  const anchor = iframeBlock.src || '';
  if(anchor){
    alloy('appendIdentityToUrl', { url: anchor }).then(result => {iframeBlock.src = result.url;});
  }
}
analyticsTracking();
