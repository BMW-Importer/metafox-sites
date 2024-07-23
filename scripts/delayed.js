// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './aem.js';
import { multiContentGalFunAfterPageLoad } from '../blocks/multicontent-gallery/multicontent-gallery.js';
import { changeAllVidSrcOnResize, enableObserverForVideos } from '../blocks/video/video.js';
import { mediaCarouselResizer } from '../blocks/media-carousel/media-carousel.js';
import { pushCustomLinkAnalyticData } from './analytics-util.js';
import { videoGalleryResizer } from '../blocks/video-gallery/video-gallery.js';
import { drivetrainResize } from '../blocks/drivetrain-switch/drivetrain-switch.js';
import { timeStamp, marketingValue } from './bmw-util.js';
import { onLoadCalculateTechDataTableHeight, technicalDataResize, onLoadTechDataAttachAnchorClick } from '../blocks/technical-data/technical-data.js';
import { preconResizer } from '../blocks/precon/precon.js';


// Core Web Vitals RUM collection
sampleRUM('cwv');
multiContentGalFunAfterPageLoad();
changeAllVidSrcOnResize();
addAnalyticsCustomClickEvent();
enableObserverForVideos();
mediaCarouselResizer();
videoGalleryResizer();
drivetrainResize();
onLoadCalculateTechDataTableHeight();
technicalDataResize();
onLoadTechDataAttachAnchorClick();
preconResizer();

const page_tracking = {"page": {
  "pageInfo": {
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
  }},
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
        "personalization": true
    }
}}

// add more delayed functionality here
function analyticsTracking() {
    set_page_tracking();
}

function getFileType(url) {
  const lastDotPosition = url.lastIndexOf('.');
  if (lastDotPosition === -1) {
    return '';
  }
  return url.substring(lastDotPosition + 1);
}
function getFileName(url) {
  const lastSlashPosition = url.lastIndexOf('/');
  return url.substring(lastSlashPosition + 1);
}

function addAnalyticsCustomClickEvent() {
  const listOfCustomClickBtns = document.querySelectorAll('a[data-analytics-custom-click=true]');
  listOfCustomClickBtns.forEach((btn)=> {
    btn.addEventListener('click', function(e) {
      //e.preventDefault();
      let anchorTag = e.target;
      if (e.target.tagName.toLowerCase() !== 'a') {
        anchorTag = e.target.closest('a[data-analytics-custom-click="true"]');
      } 
      const analyticsLabel = anchorTag.getAttribute('data-analytics-label');
      const primaryCategory = anchorTag.getAttribute('data-analytics-link-type');
      const linkURL = anchorTag.getAttribute('href');
      let subCategory;
      let linkName;
      let subCategory2;
      
      if (primaryCategory.toLowerCase() === "other") {
        subCategory = "CTA";
        linkName = anchorTag.getAttribute('data-analytics-link-other-type');
      }
      if (primaryCategory.toLowerCase() === "exit") {
        let linkParsedUrl = "";
        let linkDomainName = '';
        try {
          linkParsedUrl = new URL(linkURL);
        } catch (e) {
        }
        if(linkParsedUrl) {
          linkDomainName = linkParsedUrl.hostname.toLowerCase();
        }
        if (linkDomainName && !linkDomainName.includes("bmw")) {
          subCategory = "External page";
          linkName = linkURL;
        } else {
          subCategory = "Social";
          linkName = anchorTag?.textContent?.trim() || '';
        }
      }
      
      if (primaryCategory.toLowerCase() === "download") {
        subCategory = getFileType(linkURL);
        linkName = getFileName(linkURL);
      }

      // technical data related analytics
      if (primaryCategory.toLowerCase() === "technicaldata.option") {
        subCategory = anchorTag.getAttribute('data-analytics-subcategory-1');
        subCategory2 = anchorTag.getAttribute('data-analytics-subcategory-2');
      }
      
      const blockName = anchorTag.getAttribute('data-analytics-block-name');
      const sectionId = anchorTag.getAttribute('data-analytics-section-id');
      
      pushCustomLinkAnalyticData([
        analyticsLabel,
        primaryCategory,
        subCategory,
        blockName,
        sectionId,
        linkURL,
        linkName,
        subCategory2
      ]);      
    });
  });
}

function set_page_tracking(){
  // adding page tracking properties
  const dateTime = new Date();
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
    page_tracking.page.pageInfo.version = 'acdl: ' +timeStamp();
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

    if (window.matchMedia("(min-width: 1280px)").matches) {
        page_tracking.page.pageInfo.sysEnv = "desktop";
    } else if (window.matchMedia("(min-width: 768px) and (max-width: 1279px)").matches) {
        page_tracking.page.pageInfo.sysEnv = "responsive";
    } else {
        page_tracking.page.pageInfo.sysEnv = "mobile";
    }

    const path = window.location.pathname;
    const pathParts = path.split('/').filter(part => part !== ''); // Filter out empty parts
    const formattedPath = pathParts.map(part => part.replace(/[^\w\s]/g, '')).join(':'); // Remove special characters

    if(document.title ==='Page not found' && document.body.innerHTML.includes('404') && document.body.innerHTML.includes('Page Not Found'))
    {     
      page_tracking.page.pageInfo.pageName = "web:errorpage";
      page_tracking.page.pageInfo.pageID = "errorpage";
    } else {
      page_tracking.page.pageInfo.pageID = window.location.pathname;
      if (formattedPath !== '') {
        page_tracking.page.pageInfo.pageName = "web:home:" + formattedPath;
      } else {
          page_tracking.page.pageInfo.pageName = "web:home";
      }
    }

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

    page_tracking.user.consent.marketing =  marketingValue();
    page_tracking.user.consent.analytics =  marketingValue();
    page_tracking.user.consent.personalization =  marketingValue();
    
    window.adobeDataLayer.push(page_tracking);

}

analyticsTracking();
