/* global videojs */
const videoJsStyle = 'https://vjs.zencdn.net/8.10.0/video-js.css';
const videoJsLibrary = 'https://vjs.zencdn.net/8.10.0/video.min.js';
let isScriptAdded = false;
let videojsFunction;

function loadScript(url, callback) {
  const styleSheet = document.createElement('link');
  styleSheet.rel = 'stylesheet';
  styleSheet.href = videoJsStyle;
  document.head.append(styleSheet);

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

function triggerLoadingVideoJsLib() {
  loadScript(videoJsLibrary, () => {
    // once after videojs library is loaded then save videojs funtion in a variable so that
    // it can be called wen resize screen hapepns to load video again after changing src
    if (typeof videojs === 'function') {
      videojsFunction = videojs;
    }
  });
}

function embedYoutube(url, autoplay) {
  const usp = new URLSearchParams(url.search);
  const suffix = autoplay ? '&muted=1&autoplay=1' : '';
  let vid = usp.get('v') ? encodeURIComponent(usp.get('v')) : '';
  const embed = url.pathname;
  if (url.origin.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  }
  return `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://www.youtube.com${vid ? `/embed/${vid}?rel=0&v=${vid}${suffix}` : embed}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Youtube" loading="lazy"></iframe>
    </div>`;
}

function embedVimeo(url, autoplay) {
  const [, video] = url.pathname.split('/');
  const suffix = autoplay ? '?muted=1&autoplay=1' : '';
  return `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://player.vimeo.com/video/${video}${suffix}"
      style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
      frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen  
      title="Content from Vimeo" loading="lazy"></iframe>
    </div>`;
}

function enableVideoFeature(props) {
  const [video, enableHideControls, autoplay, enableLoop, muted, onHoverPlay] = props;
  if (!enableHideControls) {
    video.setAttribute('controls', '');
  }
  if (autoplay) {
    video.setAttribute('autoplay', '');
  }

  if (enableLoop) {
    video.setAttribute('loop', '');
  }
  if (muted) {
    video.setAttribute('muted', '');
  }
  if (onHoverPlay) {
    video.setAttribute('playOnHover', '');
  }
  video.setAttribute('preload', 'auto');
  video.setAttribute('class', 'video-js');

  video.setAttribute('data-setup', '{}');
  video.setAttribute('width', '641');
  video.setAttribute('height', '264');

  if (window.innerWidth < 768) {
    video.setAttribute('data-isDesktop', false);
  } else {
    video.setAttribute('data-isDesktop', true);
  }
}

export function getVideoElement(props) {
  const [videoTitle, videoDescp, source, videoFormat, autoplay,
    enableLoop, enableHideControls, muted, posters, onHoverPlay] = props;

  const video = document.createElement('video');
  video.dataset.loading = 'true';
  video.addEventListener('loadedmetadata', () => delete video.dataset.loading);

  // generate video controls
  enableVideoFeature([video, enableHideControls, autoplay, enableLoop, muted, onHoverPlay]);

  video.setAttribute('title', videoTitle ?? '');
  video.setAttribute('data-description', videoDescp ?? '');

  const sourceEl = document.createElement('source');

  if (window.innerWidth < 768 && source?.mobile) {
    sourceEl.setAttribute('src', source?.mobile);
    video.setAttribute('poster', posters?.mobile || posters?.desktop);

    if (videoFormat === '.mp4') {
      sourceEl.setAttribute('type', `video/${source.mobile.split('.').pop()}`);
    } else if (videoFormat === '.m3u8') {
      sourceEl.setAttribute('type', 'application/x-mpegURL');
    }
    video.append(sourceEl);
  } else {
    sourceEl.setAttribute('src', source?.desktop);
    video.setAttribute('poster', posters?.desktop);

    if (videoFormat === '.mp4') {
      sourceEl.setAttribute('type', `video/${source.desktop.split('.').pop()}`);
    } else if (videoFormat === '.m3u8') {
      sourceEl.setAttribute('type', 'application/x-mpegURL');
    }
    video.append(sourceEl);
  }

  video.addEventListener('click', (event) => {
    event.stopImmediatePropagation();
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });

  let userUnmuted = !muted;

  video.addEventListener('volumechange', () => {
    if (!video.muted && video.volume > 0 && !userUnmuted) {
      userUnmuted = true;
    }
  });

  if (onHoverPlay) {
    video.addEventListener('mouseenter', () => {
      if (video.paused) {
        video.setAttribute('poster', '');
        if (!userUnmuted) {
          video.muted = true;
        }
        video.play().then(() => { }).catch(() => { });
      }
    });

    video.addEventListener('mouseleave', () => {
      if (!video.paused) {
        if (posters.desktop && window.innerWidth > 768) {
          video.setAttribute('poster', posters.desktop);
        } else {
          video.setAttribute('poster', posters.mobile);
        }
        video.pause();
      }
    });
  } else {
    video.removeEventListener('mouseenter', () => { });
    video.removeEventListener('mouseleave', () => { });
  }

  video.addEventListener('touchstart', () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }, { passive: false });

  video.dataset.autoplay = autoplay ? 'true' : 'false';

  video.oncanplay = () => {
    if (autoplay) {
      video.muted = !userUnmuted;
      video.play();
    }
  };

  
  let checkVideoEnd = "";
  video.addEventListener('play', () => {
    triggerMediaPlayAnalytics(video);
   checkVideoEnd = setInterval(function() {
    console.log(video.title + 'video  title')
    console.log(Math.ceil(video.currentTime),Math.ceil(video.duration))
    if (Math.ceil(video.currentTime) === Math.ceil(video.duration)) {
      console.log('Video ended');
      triggerMediaCompleteAnalytics(video)
      //clearInterval(checkVideoEnd); 
    }
    }, 1000);
  });

  video.addEventListener('pause', () => {
    console.log('video paused')
    clearInterval(checkVideoEnd); 
  }, 1000); 
  return video;
}

function triggerMediaPlayAnalytics(video) {
  const blockName  = video.closest('.block').dataset.blockName;
  const sectionName  = video.closest('.section').dataset.sectionName;
  const mediaUrl = video.getAttribute('src');
  video.dataset.analyticsBlockName = blockName ? blockName : ''; 
  video.dataset.analyticsSectionName = sectionName ? sectionName : '';
  video.dataset.analyticsMediaUrl = mediaUrl ? mediaUrl : '';
  const mediaPlayObject = {
    "event": "media.play",
    "eventInfo": {
        "id": "2121221",
        "attributes": {
            "mediaInfo": {
                "mediaName": "https://renderings.evecp.bmw.cloud/trunks/9a8e9c541f03c53a00f195fe0a6502adb6a8ace0050e98f456332257/g82_de_villa_day_int.mp4",
                "mediaHosting": "renderings.evecp.bmw.cloud",
                "mediaType": "video"
        }
      },
      "section": {
        "sectionInfo": {
            "sectionName" : "Section",
            "sectionID" : "bmw/RS_sr/home/header"
        }
      },

      "block": {
        "blockInfo": {
            "blockName" : "Video Slide",
            "blockDetails" : "Video Slide 2",
        }
    }
  }
  }
  mediaPlayObject.eventInfo.attributes.mediaInfo.mediaName = mediaUrl ? mediaUrl : '';
  mediaPlayObject.eventInfo.block.blockInfo.blockName = blockName ? blockName : '';
  mediaPlayObject.eventInfo.section.sectionInfo.sectionName = sectionName ? sectionName : '';
  window.adobeDataLayer.push(mediaPlayObject);
}

function triggerMediaCompleteAnalytics(video) {
  const blockName  = video.closest('.block').dataset.blockName;
  const sectionName  = video.closest('.section').dataset.sectionName;
  const mediaUrl = video.getAttribute('src');
  video.dataset.analyticsBlockName = blockName ? blockName : ''; 
  video.dataset.analyticsSectionName = sectionName ? sectionName : '';
  video.dataset.analyticsMediaUrl = mediaUrl ? mediaUrl : '';
  const mediaCompleteObject = {
    "event": "video.complete",
    "eventInfo": {
        "id": "2121221",
        "attributes": {
            "mediaInfo": {
                "mediaName": "https://renderings.evecp.bmw.cloud/trunks/9a8e9c541f03c53a00f195fe0a6502adb6a8ace0050e98f456332257/g82_de_villa_day_int.mp4",
                "mediaHosting": "renderings.evecp.bmw.cloud",
                "mediaType": "video"
            }
        },
        "section": {
            "sectionInfo": {
                "sectionName" : "Section",
                "sectionID" : "bmw/RS_sr/home/header"
            }
        },
        
        "block": {
              "blockInfo": {
                  "blockName" : "Video Slide",
                  "blockDetails" : "Video Slide 2",
              }
        }
      }
    }
  mediaCompleteObject.eventInfo.attributes.mediaInfo.mediaName = mediaUrl ? mediaUrl : '';
  mediaCompleteObject.eventInfo.block.blockInfo.blockName = blockName ? blockName : '';
  mediaCompleteObject.eventInfo.section.sectionInfo.sectionName = sectionName ? sectionName : '';
  window.adobeDataLayer.push(mediaCompleteObject);
}

// function to check given url is absolute or relative
function isAbsoluteUrl(url) {
  return /^(https?:)?\/\//i.test(url);
}

// below function generates url
function generateUrlObject(linkObject) {
  const videoUrl = window.innerWidth > 768 ? linkObject.desktop
    : (linkObject.mobile || linkObject.desktop);
  let videoObject;
  if (!isAbsoluteUrl(videoUrl)) {
    videoObject = new URL(videoUrl, window.location.origin);
  } else {
    videoObject = new URL(videoUrl);
  }
  return videoObject;
}

// this function sets input properties values as data attr to parents block element
function setDataAttributeToBlock(props) {
  const [block, videoTitle, videoDescp, linkObject, autoplay,
    loop, enableHideControls, muted, posters, onHoverPlay = false] = props;
  block.setAttribute('data-video-title', videoTitle);
  block.setAttribute('data-video-desp', videoDescp);
  block.setAttribute('data-video-desktop', linkObject?.desktop || '');
  block.setAttribute('data-video-mobile', linkObject?.mobile || '');
  block.setAttribute('data-video-autoplay', autoplay);
  block.setAttribute('data-video-loop', loop);
  block.setAttribute('data-video-controls', enableHideControls);
  block.setAttribute('data-video-muted', muted);
  block.setAttribute('data-poster-desktop', posters?.desktop || '');
  block.setAttribute('data-poster-mobile', posters?.mobile || '');
  block.setAttribute('data-video-hover', onHoverPlay);
}

export function loadVideoEmbed(props) {
  const [block, videoTitle, videoDescp, linkObject,
    autoplay, loop, enableHideControls, muted, posters, onHoverPlay = false] = props;

  if (block?.dataset?.embedIsLoaded === true) return;

  setDataAttributeToBlock(props);

  const videoUrl = generateUrlObject(linkObject);

  const isYoutube = videoUrl?.href?.includes('youtube') || videoUrl?.href?.includes('youtu.be');
  const isVimeo = videoUrl?.href?.includes('vimeo');
  const isMp4 = videoUrl?.href?.includes('.mp4');
  const isM3U8 = videoUrl?.href?.includes('.m3u8');

  block.classList.add('video-parent-block');
  block.textContent = '';

  if (isYoutube) {
    block.innerHTML = embedYoutube(videoUrl, autoplay);
  } else if (isVimeo) {
    block.innerHTML = embedVimeo(videoUrl, autoplay);
  } else if (isMp4) {
    if (!isScriptAdded) triggerLoadingVideoJsLib();
    isScriptAdded = true;
    block.append(getVideoElement([videoTitle, videoDescp, linkObject, '.mp4', autoplay, loop, enableHideControls, muted, posters, onHoverPlay]));
  } else if (isM3U8) {
    if (!isScriptAdded) triggerLoadingVideoJsLib();
    isScriptAdded = true;
    block.append(getVideoElement([videoTitle, videoDescp, linkObject, '.m3u8', autoplay, loop, enableHideControls, muted, posters, onHoverPlay]));
  }

  block.dataset.embedIsLoaded = true;
  
}

export function enableObserverForVideos() {
  const listOfVideos = document.querySelectorAll('video');
  listOfVideos.forEach((video) => {
    if (window.IntersectionObserver) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const autoplay = video?.dataset?.autoplay;
          if (video?.parentElement?.classList?.contains('video-js')) {
            if (entry.isIntersecting) {
              if (video.paused && autoplay === 'true') {
                video.play().catch();
              } else {
                video.pause();
              }
            } else if (!video.paused) {
              video.pause();
            }
          } else {
            const player = videojsFunction(video);
            player.ready(() => {
              if (entry.isIntersecting) {
                if (video.paused && autoplay === 'true') {
                  video.play().catch();
                } else {
                  video.pause();
                }
              } else if (!video.paused) {
                video.pause();
              }
            });
          }
        });
      }, { threshold: 0.5 });
      observer.observe(video);
    } else document.querySelector('#warning').style.display = 'block';
  });
}

export function changeAllVidSrcOnResize() {
  window.addEventListener('resize', () => {
    const listOfVideos = document.querySelectorAll('video');
    listOfVideos.forEach((video) => {
      const isDesktopVideo = video.getAttribute('data-isDesktop');
      const parentElementBlock = video.closest('.video-parent-block');
      const videoTitle = parentElementBlock.getAttribute('data-video-title');
      const videoDescp = parentElementBlock.getAttribute('data-video-desp');
      const desktopPath = parentElementBlock.getAttribute('data-video-desktop') || '';
      const mobPath = parentElementBlock.getAttribute('data-video-mobile') || '';
      const autoplay = parentElementBlock.getAttribute('data-video-autoplay');
      const loop = parentElementBlock.getAttribute('data-video-loop');
      const enableHideControls = parentElementBlock.getAttribute('data-video-controls');
      const muted = parentElementBlock.getAttribute('data-video-muted');
      const desktopPoster = parentElementBlock.getAttribute('data-poster-desktop') || '';
      const mobilePoster = parentElementBlock.getAttribute('data-poster-mobile') || '';
      const onHoverPlay = parentElementBlock.getAttribute('data-video-hover');
      const linkObject = { desktop: desktopPath, mobile: mobPath };
      const posterImgObj = { desktop: desktopPoster, mobile: mobilePoster || '' };

      // if its tab and desktop resokution and attr s false it means
      // we need to change vudei source to desktop vid
      if ((window.innerWidth > 768 && isDesktopVideo === 'false') || (window.innerWidth <= 768 && isDesktopVideo === 'true')) {
        parentElementBlock.dataset.embedIsLoaded = false;
        loadVideoEmbed([
          parentElementBlock,
          videoTitle,
          videoDescp,
          linkObject,
          autoplay,
          loop,
          enableHideControls,
          muted,
          posterImgObj,
          onHoverPlay,
        ]);
        const newlyGeneratedVideo = parentElementBlock.querySelector('video');

        if (typeof videojsFunction === 'function') {
          videojsFunction(newlyGeneratedVideo);
        }
      }
    });
  });
}

export default async function decorate(block) {
  const props = [...block.children].map((row) => row.firstElementChild);
  const [
    videoTitle,
    videoDescp,
    videoDesktopPath,
    videoMobPath,
    videoDesktopPoster,
    videoMobPoster,
    videoLoop,
    videoAutoPlay,
    videoHideControls,
    videoMute] = props;

  const placeholder = block.querySelector('picture');
  const desktopVideolink = videoDesktopPath?.textContent;
  const mobileVideolink = videoMobPath?.textContent;
  const linkObject = {
    desktop: desktopVideolink,
    mobile: mobileVideolink,
  };

  const posters = {
    desktop: videoDesktopPoster?.querySelector('img')?.getAttribute('src'),
    mobile: videoMobPoster?.querySelector('img')?.getAttribute('src'),
  };

  block.textContent = '';
  const autoplay = videoAutoPlay?.textContent.trim() === 'true';
  const loop = videoLoop?.textContent.trim() === 'true';
  const enableHideControls = videoHideControls?.textContent.trim() === 'true';
  const muted = videoMute?.textContent.trim() === 'true';
  const onHoverPlay = false;

  if (placeholder) {
    loadVideoEmbed([
      block,
      videoTitle.textContent,
      videoDescp.textContent,
      linkObject,
      autoplay,
      loop,
      enableHideControls,
      muted,
      posters,
      onHoverPlay,
    ]);
  } else {
    block.classList.add('lazy-loading');
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        loadVideoEmbed([
          block,
          videoTitle,
          videoDescp,
          linkObject,
          autoplay,
          loop,
          enableHideControls,
          muted,
          posters,
          onHoverPlay,
        ]);
        block.classList.remove('lazy-loading');
      }
    });
    observer.observe(block);
  }
}
