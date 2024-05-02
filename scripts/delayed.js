// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './aem.js';
// Core Web Vitals RUM collection
sampleRUM('cwv');
const page_tracking = {"page": {
        "pageInfo": {
            "pageID": "/content/bmw/marketB4R1/bmw_rs/sr_RS/index",
            "version": "acdl: 2024-03-27t12: 24: 35.759+01: 00",
            "sysEnv": "desktop",
            "destinationURL": "https://www.bmw.rs/sr/index.html",
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
                "internalCampaign": "",
                "urlClean": "https://www.bmw.rs/sr/index.html",
            },
            "timeInfo": {
                "localTime": "20:43:11",
                "utcTime": "18:43:11"
            }
        },
        "attributes": {
            "parentDomain": ".bmw.rs",
            "brand": "bmw",
        }
    },
    "eventInfo": {
        "id": "2121221",
        "eventName": "pageview",
        "timeStamp": 1712774591731
    },
    "event": "pageview",
    "user": {
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
    window.setTimeout(() => { set_ecid() }, 1000)
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

const dateTime = new Date();
function set_page_tracking(){
  // adding page tracking properties
  if(document.referrer !== ''){
    page_tracking.page.pageInfo.windowInfo.previousDomain = document.referrer;
    page_tracking.page.pageInfo.referringURL = document.referrer;
  }
    page_tracking.page.pageInfo.windowInfo.screenWidth = window.screen.width;
    page_tracking.page.pageInfo.windowInfo.screenHeight = window.screen.height;
    page_tracking.page.pageInfo.windowInfo.screenOrientation = window.screen.orientation.type.split('-')[0];
    page_tracking.page.pageInfo.windowInfo.userAgent = navigator.userAgent;
    page_tracking.page.pageInfo.windowInfo.server = window.location.hostname;
    page_tracking.page.pageInfo.windowInfo.url = window.location.href;
    page_tracking.page.pageInfo.windowInfo.urlClean = window.location.href.split('?')[0]
    // timeinfo
    page_tracking.page.pageInfo.timeInfo.localTime = dateTime.toLocaleTimeString([], {hour12: false});
    page_tracking.page.pageInfo.timeInfo.utcTime = dateTime.toUTCString().match(/(\d{2}:\d{2}:\d{2})/)[0];
    page_tracking.page.pageInfo.pageID = window.location.pathname;
    page_tracking.page.pageInfo.language = navigator.languages[1];
    page_tracking.page.pageInfo.pageTitle = document.title;
    // eventinfo
    const randomNum = 1000000000 + Math.random() * 9000000000;
    page_tracking.eventInfo.id = Math.floor(randomNum).toString();
    page_tracking.eventInfo.timeStamp = Date.now();
    // setting attributes
    page_tracking.page.attributes.parentDomain = window.location.hostname.replace('www','');
    // camapaign attributes
    if(window.location.search !== ''){
      var queryParam = new URLSearchParams(window.location.search);
      page_tracking.page['campaign'] = {};
      page_tracking.page.pageInfo.windowInfo.campaign = window.location.search.slice(1);
      page_tracking.page.pageInfo.windowInfo.queryParam = window.location.search;
      page_tracking.page.pageInfo.windowInfo.internalCampaign = queryParam.get('intCampID');
      page_tracking.page.campaign.trackingCode = window.location.search.slice(1);
      page_tracking.page.campaign.campaignSource = queryParam.get('utm_source');
      page_tracking.page.campaign.campaignMedium = queryParam.get('utm_medium');
      page_tracking.page.campaign.campaignName = queryParam.get('utm_campaign');
      page_tracking.page.campaign.campaignID = queryParam.get('utm_id');
      page_tracking.page.campaign.campaignTerm = queryParam.get('utm_term');
      page_tracking.page.campaign.campaignContent = queryParam.get('utm_content');

    }



    window.adobeDataLayer.push(page_tracking);
}

function set_ecid(){
  const iframeBlock = document.getElementById('bmwIframe');
  if(iframeBlock){
    const anchor = iframeBlock.src;
    alloy('appendIdentityToUrl', { url: anchor }).then(result => {
        iframeBlock.src = result.url;});
  }
}


analyticsTracking();
