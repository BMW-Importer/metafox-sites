let isScriptAdded = false;

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

function getVideoElement(
  videoTitle,
  videoDescp,
  source,
  videoFormat,
  autoplay,
  enableLoop,
  enableHideControls,
  muted,
  posters,
  onHoverPlay,
) {
  const video = document.createElement('video');
  video.dataset.loading = 'true';
  video.addEventListener('loadedmetadata', () => delete video.dataset.loading);

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
  video.setAttribute('title', videoTitle?.textContent ?? '');
  video.setAttribute('data-description', videoDescp?.textContent ?? '');

  const sourceEl = document.createElement('source');
  const mobileWidth = window.innerWidth < 768;
  if (source.desktop && !mobileWidth) {
    sourceEl.setAttribute('src', source?.desktop);
    video.setAttribute('poster', posters?.desktop);
  } else if (source.mobile) {
    sourceEl.setAttribute('src', source?.mobile);
    video.setAttribute('poster', posters?.mobile || '');
  } else {
    sourceEl.setAttribute('src', source?.desktop);
    video.setAttribute('poster', posters?.desktop);
  }

  video.setAttribute('data-desktop-poster', posters?.desktop);
  video.setAttribute('data-mobile-poster', posters?.mobile || '');

  sourceEl.setAttribute('data-desktop-vid', source?.desktop);
  sourceEl.setAttribute('data-mobile-vid', source?.mobile);

  if (source.desktop && !mobileWidth) {
    if (videoFormat === '.mp4') {
      sourceEl.setAttribute('type', `video/${source.desktop.split('.').pop()}`);
    } else if (videoFormat === '.m3u8') {
      sourceEl.setAttribute('type', 'application/x-mpegURL');
    }
    video.append(sourceEl);
  } else {
    if (videoFormat === '.mp4') {
      sourceEl.setAttribute('type', `video/${source.mobile.split('.').pop()}`);
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

  let userUnmuted = false;

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
        video.play().then(() => {}).catch(() => {});
      }
    });

    video.addEventListener('mouseleave', () => {
      if (!video.paused) {
        if (posters.desktop && !mobileWidth) {
          video.setAttribute('poster', posters.desktop);
        } else {
          video.setAttribute('poster', posters.mobile);
        }
        video.pause();
      }
    });
  } else {
    video.removeEventListener('mouseenter', () => {});
    video.removeEventListener('mouseleave', () => {});
  }

  video.addEventListener('touchstart', () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }, { passive: false });

  document.body.addEventListener('touchmove', (event) => {
    event.preventDefault();
  }, { passive: false });

  video.dataset.autoplay = autoplay ? 'true' : 'false';
  if (window.IntersectionObserver) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (video) {
          if (entry.isIntersecting) {
            if (video.paused) {
              video.play().catch();
            }
          } else if (!video.paused) {
            video.pause();
          }
        }
      });
    }, { threshold: 0.5 });
    observer.observe(video);
    video.oncanplay = () => {
      if (autoplay) {
        video.muted = true;
        video.play();
      }
      if (userUnmuted) {
        video.muted = false;
        video.play();
      }
    };
  } else document.querySelector('#warning').style.display = 'block';
  return video;
}

// function to check given url is absolute or relative
function isAbsoluteUrl(url) {
  return /^(https?:)?\/\//i.test(url);
}

export function loadVideoEmbed(
  block,
  videoTitle,
  videoDescp,
  linkObject,
  autoplay,
  loop,
  enableHideControls,
  muted,
  posters,
  onHoverPlay = false,
) {
  if (block.dataset.embedIsLoaded) {
    return;
  }

  const baseUrl = window.location.origin;
  let desktopUrl;
  let mobileUrl;
  if (isAbsoluteUrl(linkObject.desktop)) {
    desktopUrl = new URL(linkObject.desktop);
  } else {
    desktopUrl = new URL(linkObject.desktop, baseUrl);
  }
  if (isAbsoluteUrl(linkObject.mobile)) {
    mobileUrl = new URL(linkObject.mobile);
  } else {
    mobileUrl = new URL(linkObject.mobile, baseUrl);
  }

  const isYoutube = linkObject.desktop ? linkObject.desktop.includes('youtube') || linkObject.desktop.includes('youtu.be')
    : linkObject.mobile.includes('youtube') || linkObject.mobile.includes('youtu.be');
  const isVimeo = linkObject.desktop ? linkObject.desktop.includes('vimeo')
    : linkObject.mobile.includes('vimeo');
  const isMp4 = linkObject.desktop ? linkObject.desktop.includes('.mp4')
    : linkObject.mobile.includes('.mp4');
  const isM3U8 = linkObject.desktop ? linkObject.desktop.includes('.m3u8')
    : linkObject.mobile.includes('.m3u8');

  const isMobile = window.innerWidth < 768;

  const videoScriptDOM = document.createRange().createContextualFragment('<link href="https://vjs.zencdn.net/8.10.0/video-js.css" rel="stylesheet" /><script src="https://vjs.zencdn.net/8.10.0/video.min.js"></script>');
  const headElement = document.querySelector('head');

  if (isYoutube) {
    const desktopEmbed = embedYoutube(desktopUrl, autoplay);
    const mobileEmbed = embedYoutube(mobileUrl, autoplay);
    block.innerHTML = isMobile ? mobileEmbed : desktopEmbed;
  } else if (isVimeo) {
    const desktopEmbed = embedVimeo(desktopUrl, autoplay);
    const mobileEmbed = embedVimeo(mobileUrl, autoplay);
    block.innerHTML = isMobile ? mobileEmbed : desktopEmbed;
  } else if (isMp4) {
    block.textContent = '';

    if (!isScriptAdded) headElement.append(videoScriptDOM);
    isScriptAdded = true;
    block.append(getVideoElement(videoTitle, videoDescp, linkObject, '.mp4', autoplay, loop, enableHideControls, muted, posters, onHoverPlay));
  } else if (isM3U8) {
    block.textContent = '';

    if (!isScriptAdded) headElement.append(videoScriptDOM);
    isScriptAdded = true;

    block.append(getVideoElement(videoTitle, videoDescp, linkObject, '.m3u8', autoplay, loop, enableHideControls, muted, posters, onHoverPlay));
  }

  block.dataset.embedIsLoaded = true;
}

export function changeAllVidSrcOnResize() {
  window.addEventListener('resize', () => {
    const listOfVideos = document.querySelectorAll('video');
    listOfVideos.forEach((video) => {
      const sourceEl = video.querySelector('source');
      const desktopVidPath = sourceEl.getAttribute('data-desktop-vid');
      const mobileVidPath = sourceEl.getAttribute('data-mobile-vid');
      const desktopPosterPath = video.getAttribute('data-desktop-poster');
      const mobilePosterPath = video.getAttribute('data-mobile-poster');
      const linkObject = {
        desktop: desktopVidPath,
        mobile: mobileVidPath,
      };
      const posters = {
        desktop: desktopPosterPath,
        mobile: mobilePosterPath,
      };
      const parentBlock = video?.parentNode?.parentNode;
      const videoTitle = parentBlock.getAttribute('title');
      const videoDescp = parentBlock.getAttribute('data-description');
      const autoplay = parentBlock.hasAttribute('autoplay') || false;
      const loop = parentBlock.hasAttribute('loop') || false;
      const enableHideControls = false;
      const muted = parentBlock.hasAttribute('muted') || false;
      const onHoverPlay = false;
      let { src } = video;
      if (src.startsWith('blob:')) {
        src = src.replace(/^blob:/, '');
      }
      if (window.innerWidth > 768) {
        if (src.length > 0 && src !== desktopVidPath) {
          // parentBlock.dataset.embedIsLoaded = '';
          delete parentBlock.dataset.embedIsLoaded;
          loadVideoEmbed(
            parentBlock,
            videoTitle,
            videoDescp,
            linkObject,
            autoplay,
            loop,
            enableHideControls,
            muted,
            posters,
            onHoverPlay,
          );
        }
      } else if (mobileVidPath) {
        if (src.length > 0 && src !== mobileVidPath) {
          // parentBlock.dataset.embedIsLoaded = '';
          delete parentBlock.dataset.embedIsLoaded;
          loadVideoEmbed(
            parentBlock,
            videoTitle,
            videoDescp,
            linkObject,
            autoplay,
            loop,
            enableHideControls,
            muted,
            posters,
            onHoverPlay,
          );
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
    loadVideoEmbed(
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
    );
  } else {
    block.classList.add('lazy-loading');
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        loadVideoEmbed(
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
        );
        block.classList.remove('lazy-loading');
      }
    });
    observer.observe(block);
  }
}
