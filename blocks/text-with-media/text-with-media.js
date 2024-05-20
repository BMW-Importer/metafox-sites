/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import { addIcon } from '../../scripts/bmw-util.js';

let isScriptAdded = false;
const videoComponentwrapper = 'video';
const imageComponentWrapper = 'image';
const blankElementsIndex = [0, 6, 8];

export function changeAllVidSrcOnResize() {
  window.addEventListener('resize', () => {
    const listOfVideos = document.querySelectorAll('video');
    listOfVideos.forEach((video) => {
      const sourceEl = video.querySelector('source');
      const posterDiv = video.parentElement.querySelector('.vjs-poster picture img');

      const desktopVidPath = sourceEl.getAttribute('data-desktop-vid');
      const mobileVidPath = sourceEl.getAttribute('data-mobile-vid');

      const desktopPosterPath = video.getAttribute('data-desktop-poster');
      const mobilePosterPath = video.getAttribute('data-mobile-poster');

      if (window.innerWidth > 768) {
        if (video.src !== desktopVidPath) {
          video.src = desktopVidPath;
          sourceEl.src = desktopVidPath;
          video.poster = desktopPosterPath;
          posterDiv.src = desktopPosterPath;
        }
      } else if (mobileVidPath) {
        if (video.src !== mobileVidPath) {
          video.src = mobileVidPath;
          sourceEl.src = mobileVidPath;
          video.poster = mobilePosterPath;
          posterDiv.src = mobilePosterPath;
        }
      }
    });
  });
}

function getVideoElement(
  videoTitle,
  videoDescp,
  source,
  videoFormat,
  autoplay,
  enableLoop,
  enableControls,
  muted,
  posters,
) {
  const video = document.createElement('video');
  video.dataset.loading = 'true';
  video.addEventListener('loadedmetadata', () => delete video.dataset.loading);
  if (enableControls) {
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

  video.setAttribute('preload', 'auto');
  video.setAttribute('class', 'video-js');

  video.setAttribute('data-setup', '{}');
  video.setAttribute('width', '600');
  video.setAttribute('height', '400');
  video.setAttribute('title', videoTitle?.textContent);
  video.setAttribute('data-description', videoDescp?.textContent);
  video.classList.add('text-with-video');
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

  video.addEventListener('touchstart', (event) => {
    event.preventDefault();
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });

  video.dataset.autoplay = autoplay ? 'true' : 'false';
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (video) {
        if (entry.isIntersecting) {
          if (video.paused) {
            video.play();
          }
        } else if (!video.paused) {
          video.pause();
        }
      }
    });
  }, { threshold: 0.1 });

  observer.observe(video);
  return video;
}

function addWrapperDiv(block, element, componentWrapper, alignment = 'left') {
  if (block.getElementsByClassName(`${componentWrapper}-wrapper-div`)?.length) {
    const wrapperDiv = block.getElementsByClassName(`${componentWrapper}-wrapper-div`);
    wrapperDiv[0].appendChild(element);
  } else {
    const div = document.createElement('div');
    div.classList.add(`${componentWrapper}-wrapper-div`);
    div.classList.add(alignment);
    div.append(element);
    block.append(div);
  }
}

export function loadVideo(
  block,
  videoTitle,
  videoDescp,
  linkObject,
  autoplay,
  loop,
  enableControls,
  muted,
  posters,
) {
  if (block.dataset.embedIsLoaded) {
    return;
  }

  const isMp4 = linkObject?.desktop ? linkObject?.desktop?.includes('.mp4')
    : linkObject?.mobile?.includes('.mp4');
  const isM3U8 = linkObject?.desktop ? linkObject?.desktop?.includes('.m3u8')
    : linkObject?.mobile?.includes('.m3u8');

  const videoScriptDOM = document.createRange().createContextualFragment('<link href="https://vjs.zencdn.net/8.10.0/video-js.css" rel="stylesheet" /><script src="https://vjs.zencdn.net/8.10.0/video.min.js"></script>');
  const headElement = document.querySelector('head');

  if (isMp4) {
    block.textContent = '';

    if (!isScriptAdded) headElement.append(videoScriptDOM);
    isScriptAdded = true;
    addWrapperDiv(block, getVideoElement(videoTitle, videoDescp, linkObject, '.mp4', autoplay, loop, enableControls, muted, posters), videoComponentwrapper);
  } else if (isM3U8) {
    block.textContent = '';

    if (!isScriptAdded) headElement.append(videoScriptDOM);
    isScriptAdded = true;

    addWrapperDiv(block, getVideoElement(videoTitle, videoDescp, linkObject, '.m3u8', autoplay, loop, enableControls, muted, posters), videoComponentwrapper);
  }

  block.dataset.embedIsLoaded = true;
}

export function generateTextDOM(
  block,
  eyebrowStyle,
  eyebrow,
  headlineElement,
  description,
  buttonElement,
  componentNameAndAlignment,
  componentWrapper,
) {
  const div = document.createElement('div');
  const headline = document.createElement('h2');
  const [componentName, alignment] = componentNameAndAlignment.textContent.split(',');
  div.classList.add('text-alignment');
  if (eyebrow) eyebrow.classList.add(`${componentName}-eyebrow`);
  if (headline) headline.classList.add(`${componentName}-headline`);
  if (description) description.classList.add(`${componentName}-description`);
  if (eyebrowStyle === 'eyebrowbold1' && eyebrow) {
    eyebrow.classList.add(eyebrowStyle.textContent);
  } else if (eyebrowStyle === 'eyebrowbold2' && eyebrow) {
    eyebrow.classList.add(eyebrowStyle.textContent);
  } else if (eyebrowStyle === 'iconization' && eyebrow) {
    eyebrow.classList.add(eyebrowStyle.textContent);
  }
  headline.innerHTML = headlineElement?.innerHTML;
  if (buttonElement?.textContent) {
    buttonElement.classList.add(`${componentName}-button`);
    addIcon(buttonElement, 'arrow_chevron_right');
  }
  div.append(eyebrow, headline, description, buttonElement);
  addWrapperDiv(block, div, componentWrapper, alignment?.trim());
}

function generateTextWithImageDOM(
  block,
  imageLink,
  imageComponentName,
) {
  const alignment = imageComponentName.textContent.split(',')[1];
  const picture = imageLink.querySelector('picture');
  const image = picture.querySelector('img');
  image.setAttribute('fetchpriority', 'high');
  const imageContainer = document.createElement('div');
  imageContainer.classList.add('image');
  imageContainer.style.float = alignment?.trim()?.toLowerCase();
  if (picture) {
    imageContainer.append(picture);
  }
  addWrapperDiv(block, imageContainer, imageComponentWrapper);
}

export default function decorate(block) {
  let video;
  let image;
  [...block.children].forEach((row) => {
    if (row.textContent.includes('text-with-video')) {
      video = row;
    } else {
      image = row;
    }
  });
  const [
    componentNameV,
    videoEyebrow,
    eyebrowStyleV,
    headline,
    description,
    videoPropsGrp,
    videoButtonName,
    videoButtonElement,
  ] = video
    ? [...video.children || []].filter((row, idx) => {
      if (!blankElementsIndex.includes(idx)) {
        return row;
      }
    }) : [];
  const pictures = videoPropsGrp?.querySelectorAll('picture') || [];
  const videos = videoPropsGrp?.getElementsByClassName('button-container') || [];
  const [desktopVidPath, mobileVidPath] = videos;
  const [desktopPosterPath, mobilePosterPath] = pictures;
  const [
    videoTitle,
    videoDescp,
    videoLoop,
    videoAutoPlay,
    videoControl,
    videoMute,
  ] = [...videoPropsGrp?.children || []].filter((element) => {
    if (!element.classList.length
      && ![...element.children].includes((item) => item.tagName === 'PICTURE')) {
      return element;
    }
  });

  const posters = {
    desktop: desktopPosterPath?.querySelector('img')?.getAttribute('src'),
    mobile: mobilePosterPath?.querySelector('img')?.getAttribute('src'),
  };

  const videoLinkObject = {
    desktop: desktopVidPath?.textContent,
    mobile: mobileVidPath?.textContent,
  };
  block.textContent = '';
  const enablecontrols = videoControl?.textContent.trim() === 'true';
  const loop = videoLoop?.textContent.trim() === 'true';
  const autoplay = videoAutoPlay?.textContent.trim() === 'true';
  const mute = videoMute?.textContent.trim() === 'true';
  if (videoButtonElement?.textContent) videoButtonElement.ariaLabel = videoButtonName?.textContent;
  const videoButtonAnchor = videoButtonElement?.querySelector('a');
  if (videoButtonAnchor) {
    videoButtonAnchor.textContent = videoButtonName?.textContent;
    videoButtonAnchor.title = videoButtonName?.textContent;
  }
  if (video) {
    loadVideo(
      block,
      videoTitle,
      videoDescp,
      videoLinkObject,
      autoplay,
      loop,
      enablecontrols,
      mute,
      posters,
    );
    generateTextDOM(
      block,
      eyebrowStyleV,
      videoEyebrow,
      headline,
      description,
      videoButtonElement,
      componentNameV,
      videoComponentwrapper,
    );
  }

  const [
    componentNameI,
    imageEyebrow,
    imageEyebrowStyle,
    imageHeadline,
    imageDescp,
    imageLink,
    imageButtonName,
    imageButtonElement,
  ] = image
    ? [...image.children || []].filter((row, idx) => {
      if (!blankElementsIndex.includes(idx)) {
        return row;
      }
    }) : [];

  if (imageButtonElement) imageButtonElement.ariaLabel = imageButtonName?.textContent;
  const imageButtonAnchor = imageButtonElement?.querySelector('a');
  if (imageButtonAnchor) {
    imageButtonAnchor.textContent = imageButtonName?.textContent;
    imageButtonAnchor.title = imageButtonName?.textContent;
  }
  if (image) {
    generateTextWithImageDOM(
      block,
      imageLink,
      componentNameI,
    );
    generateTextDOM(
      block,
      imageEyebrowStyle,
      imageEyebrow,
      imageHeadline,
      imageDescp,
      imageButtonElement,
      componentNameI,
      imageComponentWrapper,
    );
  }
}
