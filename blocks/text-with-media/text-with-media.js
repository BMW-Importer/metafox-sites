/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import { addIcon } from '../../scripts/bmw-util.js';
import { getVideoElement } from '../video/video.js';

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
    const videoElement = getVideoElement(videoTitle, videoDescp, linkObject, '.mp4', autoplay, loop, enableControls, muted, posters, false);
    videoElement.classList.add('text-with-video');
    block.append(videoElement);
  } else if (isM3U8) {
    block.textContent = '';

    if (!isScriptAdded) headElement.append(videoScriptDOM);
    isScriptAdded = true;
    const videoElement = getVideoElement(videoTitle, videoDescp, linkObject, '.mp4', autoplay, loop, enableControls, muted, posters, false);
    videoElement.classList.add('text-with-video');
    block.append(videoElement);
  }
  block.classList.add('video-block');
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
  block.appendChild(div);
  block.classList.add(alignment?.trim());
}

function generateTextWithImageDOM(
  block,
  imageLink,
) {
  block.textContent = '';
  const picture = imageLink.querySelector('picture');
  const image = picture.querySelector('img');
  image.setAttribute('fetchpriority', 'high');
  const imageContainer = document.createElement('div');
  imageContainer.classList.add('image');
  block.classList.add('image-block');
  if (picture) {
    imageContainer.append(picture);
  }
  block.append(imageContainer);
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
      video,
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
      video,
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
      image,
      imageLink,
    );
    generateTextDOM(
      image,
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
