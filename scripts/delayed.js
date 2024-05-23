// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './aem.js';
import { multiContentGalFunAfterPageLoad } from '../blocks/multicontent-gallery/multicontent-gallery.js';
import { changeAllVidSrcOnResize } from '../blocks/video/video.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');
multiContentGalFunAfterPageLoad();
changeAllVidSrcOnResize();

const page_tracking = {"page": {
        "pageInfo": {
            "pageID": "/content/bmw/marketB4R1/bmw_rs/sr_RS/index",
            "version": "acdl: 2024-03-27t12: 24: 35.759+01: 00",
            "destinationURL": "https://www.bmw.rs/sr/index.html",
            "variant": "real page",
            "pageTitle": "BMW Srbija",
            "windowInfo": {
                "screenWidth": 3840,
                "screenHeight": 2160,
                "screenOrientation": "landscape",
                "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
                "server": "www.bmw.rs",
                "url": "https://www.bmw.rs/sr/index.html",
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
var dateTime = new Date();

// Format the date components
var year = dateTime.getFullYear();
var month = (dateTime.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
var day = dateTime.getDate().toString().padStart(2, '0');
var hours = dateTime.getHours().toString().padStart(2, '0');
var minutes = dateTime.getMinutes().toString().padStart(2, '0');
var seconds = dateTime.getSeconds().toString().padStart(2, '0');
var milliseconds = dateTime.getMilliseconds().toString().padStart(3, '0');
var timezoneOffset = -dateTime.getTimezoneOffset();
var timezoneOffsetHours = Math.floor(Math.abs(timezoneOffset) / 60).toString().padStart(2, '0');
var timezoneOffsetMinutes = (Math.abs(timezoneOffset) % 60).toString().padStart(2, '0');
var timezoneSign = timezoneOffset >= 0 ? '+' : '-';

// Construct the timestamp string
var timestamp = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezoneSign}${timezoneOffsetHours}:${timezoneOffsetMinutes}`;
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
    var lang = document.querySelector('meta[name="language"]');
    var geoReg = document.querySelector('meta[name="georegion"]');
    page_tracking.page.pageInfo.timeInfo.localTime = dateTime.toLocaleTimeString([], {hour12: false});
    page_tracking.page.pageInfo.timeInfo.utcTime = dateTime.toUTCString().match(/(\d{2}:\d{2}:\d{2})/)[0];
    page_tracking.page.pageInfo.pageID = window.location.pathname;
    page_tracking.page.pageInfo.version = 'acdl: ' +timestamp;
    page_tracking.page.pageInfo.destinationURL = window.location.href;
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
      const utmParameters = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_id', 'utm_term', 'utm_content'];
      const hasUtmParams = utmParameters.some(param => queryParam.has(param));

      if(queryParam.has('intCampID')){
        page_tracking.page.pageInfo.windowInfo.internalCampaign = 'intCampID='+queryParam.get('intCampID');
      }
      if (hasUtmParams) {
        page_tracking.page['campaign'] = {};
        page_tracking.page.pageInfo.windowInfo.queryParam = window.location.search.slice(1);
        page_tracking.page.campaign.campaignSource = queryParam.get('utm_source');
        page_tracking.page.campaign.campaignMedium = queryParam.get('utm_medium');
        page_tracking.page.campaign.campaignName = queryParam.get('utm_campaign');
        page_tracking.page.campaign.campaignID = queryParam.get('utm_id');
        page_tracking.page.campaign.campaignTerm = queryParam.get('utm_term');
        page_tracking.page.campaign.campaignContent = queryParam.get('utm_content');
        page_tracking.page.pageInfo.windowInfo.campaign = window.location.search.slice(1);
        page_tracking.page.campaign.trackingCode = window.location.search.slice(1);
      }
    }

    if (window.matchMedia("(min-width: 1024px)").matches) {
        page_tracking.page.pageInfo.sysEnv = "desktop";
    } else {
        page_tracking.page.pageInfo.sysEnv = "mobile";
    }

    
    const path = window.location.pathname;
    const pathParts = path.split('/').filter(part => part !== ''); // Filter out empty parts
    const formattedPath = pathParts.map(part => part.replace(/[^\w\s]/g, '')).join(':'); // Remove special characters

    fetch(window.location.href)
    .then(response => {
      if (!response.ok) {
        page_tracking.page.pageInfo.pageName = "web:errorpage";
      } else {
        if (formattedPath !== '') {
          page_tracking.page.pageInfo.pageName = "web:home:" + formattedPath;
        } else {
            page_tracking.page.pageInfo.pageName = "web:home";
        }
      }
    })

    const metaTag = document.querySelector('meta[name="env"]');
    if (metaTag && metaTag.content) {
      page_tracking.page.pageInfo.websiteEnv = metaTag.content;
    }
    if (lang && lang.content) {
      page_tracking.page.pageInfo.language = lang.content;
    }
    if (geoReg && geoReg.content) {
      page_tracking.page.pageInfo.geoRegion = geoReg.content;
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
