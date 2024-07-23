/* global videojs */
const videoJsStyle = 'https://vjs.zencdn.net/8.10.0/video-js.css';
const videoJsLibrary = 'https://vjs.zencdn.net/8.10.0/video.min.js';
let isScriptAdded = false;
let isObserverAndVidJsInitialized;
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

function playOrPauseVideo(props) {
  const [video, isIntersecting, autoplay] = props;

  if (isIntersecting) {
    video.dataset.isVideoInViewPort = 'true';
    if (video.paused && autoplay === 'true') {
      video.play().catch();
    }
  } else if (!video.paused) {
    video.dataset.isVideoInViewPort = 'false';
    video.pause();
  } else {
    video.dataset.isVideoInViewPort = 'false';
  }
}

function initializePlayerRead(player, video, isIntersecting, autoplay) {
  player.ready(() => {
    playOrPauseVideo([video, isIntersecting, autoplay]);
  });
}

// function to loop through all videos and initiate videjs and also add observer
function initObserverAndVidJs() {
  const listOfVideos = document.querySelectorAll('video');
  listOfVideos.forEach((video) => {
    // initialiting player
    videojsFunction(video);

    // enabling observer for each video
    if (window.IntersectionObserver) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const autoplay = video?.dataset?.autoplay;
          if (video?.parentElement?.classList?.contains('video-js')) {
            playOrPauseVideo([video, entry.isIntersecting, autoplay]);
          } else {
            const player = videojsFunction(video);
            initializePlayerRead(player, video, entry.isIntersecting, autoplay);
          }
        });
      }, { threshold: 0.5 });
      observer.observe(video);
    } else document.querySelector('#warning').style.display = 'block';
  });
}

function triggerLoadingVideoJsLib() {
  loadScript(videoJsLibrary, () => {
    // once after videojs library is loaded then save videojs funtion in a variable so that
    // it can be called wen resize screen hapepns to load video again after changing src
    if (typeof videojs === 'function') {
      videojsFunction = videojs;

      // if observer is not initialised then do it
      if (isObserverAndVidJsInitialized === false) initObserverAndVidJs();
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
  const [video, enableVideoControls, enableLoop, muted, onHoverPlay] = props;

  if (enableVideoControls) {
    video.setAttribute('controls', '');
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

  video.setAttribute('width', '641');
  video.setAttribute('height', '264');

  if (window.innerWidth < 768) {
    video.setAttribute('data-isDesktop', false);
  } else {
    video.setAttribute('data-isDesktop', true);
  }
}

function removeEmptyObjectKeys(obj) {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      removeEmptyObjectKeys(obj[key]);
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key];
      }
    } else if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
      delete obj[key];
    }
  });
}

const isValidUrl = (url) => {
  try {
    return !!(new URL(url));
  } catch (e) {
    return false;
  }
};

function triggerMediaPlayAnalytics(video) {
  window.adobeDataLayer = window.adobeDataLayer || [];
  const { blockName } = video.closest('.block').dataset;
  const { analyticsLabel: sectionId } = video.closest('.section').dataset;
  const { blockDetails } = video.closest('div').dataset;
  const mediaUrl = video.querySelector('source').getAttribute('src');
  const mediaHostname = isValidUrl(mediaUrl) ? new URL(mediaUrl).hostname : window.location.host;
  if (blockName) {
    video.dataset.analyticsBlockName = blockName || '';
  }
  if (sectionId) {
    video.dataset.analyticsSectionId = sectionId || '';
  }
  if (mediaUrl) {
    video.dataset.analyticsMediaUrl = mediaUrl || '';
  }
  if (blockDetails) {
    video.dataset.analyticsBlockDetails = blockDetails || '';
  }
  if (mediaHostname) {
    video.dataset.analyticsMediaHosting = mediaHostname || '';
  }

  const mediaPlayObject = {
    event: 'media.play',
    eventInfo: {
      id: '',
      attributes: {
        mediaInfo: {
          mediaName: '',
          mediaHosting: '',
          mediaType: 'video',
        },
      },
      section: {
        sectionInfo: {
          sectionName: '',
          sectionID: '',
        },
      },
      block: {
        blockInfo: {
          blockName: '',
          blockDetails: '',
        },
      },
    },
  };

  const randomNum = 100000 + Math.random() * 900000;
  mediaPlayObject.eventInfo.id = Math.floor(randomNum).toString();
  if (mediaUrl) {
    mediaPlayObject.eventInfo.attributes.mediaInfo.mediaName = mediaUrl || '';
  }
  if (mediaHostname) {
    mediaPlayObject.eventInfo.attributes.mediaInfo.mediaHosting = mediaHostname || '';
  }
  if (blockName) {
    mediaPlayObject.eventInfo.block.blockInfo.blockName = blockName || '';
  }
  if (sectionId) {
    mediaPlayObject.eventInfo.section.sectionInfo.sectionID = sectionId || '';
  }
  if (blockDetails) {
    mediaPlayObject.eventInfo.block.blockInfo.blockDetails = blockDetails || '';
  }
  if (mediaUrl) {
    removeEmptyObjectKeys(mediaPlayObject);
    window.adobeDataLayer.push(mediaPlayObject);
  }
}

function triggerMediaCompleteAnalytics(video) {
  const { blockName } = video.closest('.block').dataset;
  const { analyticsLabel: sectionId } = video.closest('.section').dataset;
  const { blockDetails } = video.closest('div').dataset;
  const mediaUrl = video.querySelector('source').getAttribute('src');
  const mediaHostname = isValidUrl(mediaUrl) ? new URL(mediaUrl).hostname : window.location.host;
  // Only assign non-blank values to data attributes
  if (blockName) {
    video.dataset.analyticsBlockName = blockName;
  }
  if (sectionId) {
    video.dataset.analyticsSectionId = sectionId;
  }
  if (mediaUrl) {
    video.dataset.analyticsMediaUrl = mediaUrl;
  }
  if (blockDetails) {
    video.dataset.analyticsBlockDetails = blockDetails;
  }
  if (mediaHostname) {
    video.dataset.analyticsMediaHosting = mediaHostname;
  }

  const mediaCompleteObject = {
    event: 'media.complete',
    eventInfo: {
      id: '',
      attributes: {
        mediaInfo: {
          mediaName: '',
          mediaHosting: '',
          mediaType: 'video',
        },
      },
      section: {
        sectionInfo: {
          sectionName: '',
          sectionID: '',
        },
      },
      block: {
        blockInfo: {
          blockName: '',
          blockDetails: '',
        },
      },
    },
  };

  // Generate a random ID
  const randomNum = 100000 + Math.random() * 900000;
  mediaCompleteObject.eventInfo.id = Math.floor(randomNum).toString();

  // Only assign non-blank values to the mediaCompleteObject
  if (mediaUrl) {
    mediaCompleteObject.eventInfo.attributes.mediaInfo.mediaName = mediaUrl;
  }
  if (blockName) {
    mediaCompleteObject.eventInfo.attributes.mediaInfo.mediaHosting = mediaHostname || '';
    mediaCompleteObject.eventInfo.block.blockInfo.blockName = blockName;
  }
  if (sectionId) {
    mediaCompleteObject.eventInfo.section.sectionInfo.sectionID = sectionId;
  }
  if (mediaHostname) {
    mediaCompleteObject.eventInfo.attributes.mediaInfo.mediaHosting = mediaHostname;
  }

  // Push to data layer only if mediaUrl is not blank (as an example of required field)
  if (mediaUrl) {
    mediaCompleteObject.eventInfo.block.blockInfo.blockDetails = blockDetails || '';
    removeEmptyObjectKeys(mediaCompleteObject);
    window.adobeDataLayer.push(mediaCompleteObject);
  }
}

export function getVideoElement(props) {
  const [videoTitle, videoDescp, source, videoFormat, autoplay,
    enableLoop, enableVideoControls, muted, posters, onHoverPlay, analyticsLabel] = props;

  const video = document.createElement('video');
  video.dataset.loading = 'true';
  if (analyticsLabel) {
    video.dataset.blockDetails = analyticsLabel;
  }
  video.addEventListener('loadedmetadata', () => delete video.dataset.loading);

  // generate video controls
  enableVideoFeature([video, enableVideoControls, enableLoop, muted, onHoverPlay]);

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
    const flyoutElem = document.querySelectorAll('.menu-flyout-wrapper.showfly');
    if (flyoutElem.length === 0) {
      event.stopImmediatePropagation();
      if (video.paused) {
        video.play().catch();
      } else {
        video.pause();
      }
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
      video.play().catch();
    } else {
      video.pause();
    }
  }, { passive: false });

  video.dataset.autoplay = autoplay ? 'true' : 'false';

  video.oncanplay = () => {
    if (autoplay && video.dataset.isVideoInViewPort === 'true') {
      video.muted = !userUnmuted;
      video.play().catch();
    } else {
      video.play().catch();
      video.pause();
    }
  };

  let checkVideoEnd = '';
  let isVideoPlayed = false;
  let isVideoStarted = false;

  video.addEventListener('play', () => {
    if (!isVideoStarted) {
      isVideoStarted = true;
      triggerMediaPlayAnalytics(video);
    }
    if (!isVideoPlayed) {
      checkVideoEnd = setInterval(() => {
        if (Math.ceil(video.currentTime) === Math.floor(video.duration)) {
          triggerMediaCompleteAnalytics(video);
          clearInterval(checkVideoEnd);
          isVideoPlayed = true;
        }
      }, 1000);
    }
  });

  video.addEventListener('pause', () => {
    clearInterval(checkVideoEnd);
  });

  return video;
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
    loop, enableVideoControls, muted, posters, onHoverPlay = false] = props;
  block.setAttribute('data-video-title', videoTitle);
  block.setAttribute('data-video-desp', videoDescp);
  block.setAttribute('data-video-desktop', linkObject?.desktop || '');
  block.setAttribute('data-video-mobile', linkObject?.mobile || '');
  block.setAttribute('data-video-autoplay', autoplay);
  block.setAttribute('data-video-loop', loop);
  block.setAttribute('data-video-controls', enableVideoControls);
  block.setAttribute('data-video-muted', muted);
  block.setAttribute('data-poster-desktop', posters?.desktop || '');
  block.setAttribute('data-poster-mobile', posters?.mobile || '');
  block.setAttribute('data-video-hover', onHoverPlay);
}

export function loadVideoEmbed(props) {
  const [block, videoTitle, videoDescp, linkObject,
    autoplay, loop, enableVideoControls, muted, posters, onHoverPlay = false,
    analyticsLabel] = props;

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
    block.append(getVideoElement([videoTitle, videoDescp, linkObject, '.mp4', autoplay, loop, enableVideoControls, muted, posters, onHoverPlay, analyticsLabel]));
  } else if (isM3U8) {
    if (!isScriptAdded) triggerLoadingVideoJsLib();
    isScriptAdded = true;
    block.append(getVideoElement([videoTitle, videoDescp, linkObject, '.m3u8', autoplay, loop, enableVideoControls, muted, posters, onHoverPlay, analyticsLabel]));
  }

  block.dataset.embedIsLoaded = true;
}

export function enableObserverForVideos() {
  if (typeof videojsFunction === 'function') {
    isObserverAndVidJsInitialized = true;
    initObserverAndVidJs();
  } else {
    isObserverAndVidJsInitialized = false;
  }
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
      const enableVideoControls = parentElementBlock.getAttribute('data-video-controls');
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
          enableVideoControls,
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
    videoControls,
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
  const enableVideoControls = videoControls?.textContent.trim() === 'true';
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
      enableVideoControls,
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
          enableVideoControls,
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
