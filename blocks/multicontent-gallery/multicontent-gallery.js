import { loadVideoEmbed } from '../video/video.js';
import generateVideoDetailMarkUp from '../video-slide/video-slide.js';
import { generateImgSlidePicture, generateImgSlideDetailMarkUp } from '../image-slide/image-slide.js';
import { fetchPlaceholders } from '../../scripts/aem.js';

let startTouchX = 0;
let endTouchX = 0;
const lang = document.querySelector('meta[name="language"]').content;
const placeholders = await fetchPlaceholders(`/${lang}`);
const { showmore, showless } = placeholders;

function enableShowMoreButton() {
  const detailContainer = document.querySelectorAll('.vid-img-slide-expand-cover');
  detailContainer.forEach((item) => {
    const showMoreBtn = item.querySelector('.vid-img-slide-showmore-btn');

    if (showMoreBtn) {
      // if showmore button is already clicked then click showless before enabling it
      if (showMoreBtn.classList.contains('showless')) {
        const showMoreBtnElm = showMoreBtn.querySelector('button');
        showMoreBtnElm.click();
      }

      // enable showmore button based on overflowing content
      if (item.scrollHeight > item.clientHeight) {
        showMoreBtn.classList.remove('hidden');
      } else {
        showMoreBtn.classList.add('hidden');
      }
    }
  });
}

// this function will run when resolution is for desktop, it loops through all
// multicontent gallery blocks and opens first card and hides rest other ccards
function generateViewForDesktop() {
  const multiMediaBlocks = document.querySelectorAll('.multicontent-gallery.block');

  multiMediaBlocks.forEach((item) => {
    // scroll to startshowMoreTextg of detail childs
    const detailContainer = item.querySelector('.video-image-detail-container');

    if (detailContainer) {
      detailContainer.scrollTo({
        left: 0,
        behavior: 'smooth',
      });
    }

    if (item.querySelector('.video-image-slide-conatiner')) {
      const mediaContainer = item.querySelector('.video-image-slide-conatiner').querySelectorAll('.video-image-slide.media');
      mediaContainer.forEach((media) => {
        media.classList.remove('visible');
      });
    }

    // make first detail as open state
    // call click event for first click
    const firstDetailHeadingElem = item.querySelector('.vid-img-slide-cover');
    if (firstDetailHeadingElem) {
      firstDetailHeadingElem.click();
    }
  });
}

function triggerAfterResize() {
  let heightCalValue = 88;
  // if screen widht is greater than 1280 then enable first element as opened card
  if (window.screen.width >= 1920) {
    heightCalValue = 88;
    generateViewForDesktop();
    enableShowMoreButton();
  } else if (window.screen.width >= 1280 && window.screen.width <= 1919) {
    heightCalValue = 118;
    generateViewForDesktop();
    enableShowMoreButton();
  } else if (window.screen.width >= 768) {
    heightCalValue = 40;
  }

  // set height of multicontent gallery block based on video and detail height
  const multiContentGalleryBlock = document.querySelectorAll('.multicontent-gallery.block');

  multiContentGalleryBlock.forEach((mcgBlock) => {
    const videoImgContainer = mcgBlock.querySelector('.video-image-slide-conatiner');
    const videoImgDetailContainer = mcgBlock.querySelector('.vid-img-slide.detail');
    const desktopVidDetailHeadings = mcgBlock.querySelectorAll('.vid-img-slide-cover');
    if (videoImgContainer && videoImgDetailContainer) {
      const videoImgContainerHeight = videoImgContainer.offsetHeight;
      const videoImgDetailContainerHeight = videoImgDetailContainer.offsetHeight;
      const detailheight = videoImgDetailContainerHeight - heightCalValue;
      const mcgBlockHeight = videoImgContainerHeight + detailheight;

      // setting min height of mcgBlock
      mcgBlock.style.minHeight = `${mcgBlockHeight}px`;

      // if height is greater than zero then remove no-visiblity class
      if (mcgBlockHeight > 0) {
        mcgBlock.classList.remove('no-visiblity');
      }

      const desktopVidDetailHeadingHeight = mcgBlock.offsetHeight - videoImgContainer.offsetHeight;

      // setting height of video detail heading which is only visible in desktop
      desktopVidDetailHeadings.forEach((vidDetailHeading) => {
        vidDetailHeading.style.minHeight = `${desktopVidDetailHeadingHeight}px`;
      });
    }
  });
}

function setTimeOutForSlideIn(childElem) {
  setTimeout(() => {
    childElem.classList.remove('slide-in');
    childElem.classList.add('slide-out');
    childElem.nextElementSibling.classList.remove('slide-out');
    childElem.nextElementSibling.classList.add('slide-in');
    enableShowMoreButton();
  }, 100);
}

function setTimeOutForSlideOut(childElem) {
  setTimeout(() => childElem.classList.remove('slide-out'), 100);
}

function addVisibleClass(listOfElem, indexOfElem) {
  if (listOfElem) {
    listOfElem.forEach((detailCardDiv, index) => {
      if (index === indexOfElem) {
        detailCardDiv.classList.add('visible');
      } else {
        detailCardDiv.classList.remove('visible');
      }
    });
  }
}

function attachDetailHeadingClickEvent(block) {
  const desktopDetailHeadingElem = block.querySelectorAll('.vid-img-slide-cover');
  desktopDetailHeadingElem.forEach((elem) => {
    elem.addEventListener('click', (e) => {
      const listOfDetailHeading = e.target.closest('.video-image-detail-container').querySelectorAll('.vid-img-slide-cover');
      const listOfDetailText = e.target.closest('.video-image-detail-container').querySelectorAll('.vid-img-slide.detail');
      listOfDetailHeading.forEach((childElem, index) => {
        const parentBlock = childElem.closest('.multicontent-gallery.block');
        let mediaElement;
        let mediaContainer;
        if (parentBlock) {
          mediaElement = parentBlock.querySelectorAll('.video-image-slide-conatiner .video-image-slide.media');
          mediaContainer = parentBlock.querySelector('.video-image-slide-conatiner');
          // adding class to display overlay effect and removing it after 0.25s
          if (mediaContainer) mediaContainer.classList.add('overlay-effect');
        }
        if (elem === childElem) {
          // adding class to show slide in effects
          childElem.classList.add('clicked');
          childElem.nextElementSibling.classList.add('slide-out');
          childElem.classList.add('slide-in');
          setTimeOutForSlideIn(childElem);

          if (mediaElement) {
            // delaying to show video so that overlay effect can be visible
            setTimeout(() => mediaElement[index].classList.add('visible'), 200);
          }

          // adding visible class to detail text div so that overlay
          // effects wont appear on this div
          if (listOfDetailText) {
            addVisibleClass(listOfDetailText, index);
          }
        } else {
          childElem.classList.remove('clicked');
          mediaElement[index].classList.remove('visible');
          setTimeOutForSlideOut(childElem);
        }

        // removing class to remove overlay effects on media change
        setTimeout(() => {
          if (mediaContainer) mediaContainer.classList.remove('overlay-effect');
        }, 200);
      });
    });
  });
}

function attachShowMoreEvents(block) {
  const showMoreBtn = block.querySelectorAll('.vid-img-slide-showmore-btn-link');
  const boxPaddingBottom = 14;
  const detailBoxColumnGaps = 12;
  showMoreBtn.forEach((btnElem) => {
    btnElem.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const parentDiv = e.target.closest('.vid-img-slide-expand-cover');
      if (e.target.closest('.vid-img-slide-showmore-btn').classList.contains('showless')) {
        e.target.closest('.vid-img-slide-showmore-btn').classList.remove('showless');
        e.target.textContent = showless;
        e.target.closest('.vid-img-slide-expand-cover').style.cssText = 'unset';
      } else {
        e.target.closest('.vid-img-slide-showmore-btn').classList.add('showless');
        e.target.textContent = showmore;
        const showMoreBtnElm = parentDiv.querySelector('.vid-img-slide-showmore-btn');
        let showMoreBtnHeight = 0;

        if (showMoreBtnElm) {
          showMoreBtnHeight = (showMoreBtnElm.clientHeight / 2) + detailBoxColumnGaps;
        }

        const parentDivScrollHeight = (parentDiv.scrollHeight + (showMoreBtnHeight))
         - boxPaddingBottom;
        e.target.closest('.vid-img-slide-expand-cover').style.height = `${parentDivScrollHeight}px`;
      }
    });
  });
}

function handleSwipe(galleryContainer) {
  const swipeDistance = startTouchX - endTouchX;
  if (swipeDistance === 0) {
    return;
  }

  const children = galleryContainer.querySelectorAll('.vid-img-slide.detail');
  const cardWidth = galleryContainer.querySelector('.vid-img-slide.detail').offsetWidth;
  const containerSwipedDistance = galleryContainer.scrollLeft;
  let indexToSwipe;
  if (swipeDistance > 0) {
    indexToSwipe = Math.ceil(containerSwipedDistance / cardWidth);
  } else {
    indexToSwipe = Math.floor(containerSwipedDistance / cardWidth);
  }

  // if show more is enabled then click it again to reduce show more details
  children.forEach((detailElem) => {
    const detailCard = detailElem.querySelector('.vid-img-slide-showmore-btn');
    if (detailCard?.classList.contains('showless')) {
      const showMoreBtn = detailCard.querySelector('button');
      if (showMoreBtn) showMoreBtn.click();
    }
  });

  if (indexToSwipe === 0) {
    galleryContainer.scrollTo({
      left: 0,
      behavior: 'smooth',
    });
  } else {
    galleryContainer.scrollTo({
      left: children[indexToSwipe].offsetLeft,
      behavior: 'smooth',
    });
  }

  // setting class so that overlay effects on cards go off when visible
  addVisibleClass(children, indexToSwipe);

  const videoImgGalleryElems = galleryContainer.parentElement.querySelector('.video-image-slide-conatiner').querySelectorAll('.video-image-slide.media');
  videoImgGalleryElems.forEach((item, index) => {
    if (index === indexToSwipe) {
      item.classList.add('visible');
    } else {
      item.classList.remove('visible');
    }
  });
}

function attachSlideEvents(galleryContainer) {
  let isDesktopDragging = false;
  let isMobileSwipe = false;
  let desktopScrollLeft = 0;

  // below events for swipe left and right of mob, tab and desktop
  galleryContainer.addEventListener('touchstart', (e) => {
    if (e.target.classList.contains('vid-img-slide-showmore-btn-link')
    || e.target.classList.contains('vid-img-slide-cover')
    || e.target.classList.contains('vid-img-slide-cover-title')) {
      return;
    }
    isMobileSwipe = true;
    startTouchX = e.touches[0].clientX;
    const vidImgContainer = galleryContainer.previousElementSibling;
    vidImgContainer.classList.add('overlay-effect');
  });

  galleryContainer.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('vid-img-slide-showmore-btn-link') || e.target.classList.contains('vid-img-slide-cover')
    || e.target.classList.contains('vid-img-slide-cover-title')) {
      return;
    }
    isDesktopDragging = true;
    startTouchX = e.clientX;
    desktopScrollLeft = galleryContainer.scrollLeft;
    const vidImgContainer = galleryContainer.previousElementSibling;
    vidImgContainer.classList.add('overlay-effect');
  });

  galleryContainer.addEventListener('mousemove', (e) => {
    if (!isDesktopDragging) return;
    const deltX = e.clientX - startTouchX;
    galleryContainer.scrollLeft = desktopScrollLeft - deltX;
  });

  galleryContainer.addEventListener('touchend', (e) => {
    if (!isMobileSwipe) return;
    endTouchX = e.changedTouches[0].clientX;
    handleSwipe(galleryContainer);
    isMobileSwipe = false;
    const vidImgContainer = galleryContainer.previousElementSibling;
    vidImgContainer.classList.remove('overlay-effect');
  });

  galleryContainer.addEventListener('mouseup', (e) => {
    if (!isDesktopDragging) return;
    isDesktopDragging = false;
    endTouchX = e.clientX;
    handleSwipe(galleryContainer);
    const vidImgContainer = galleryContainer.previousElementSibling;
    vidImgContainer.classList.remove('overlay-effect');
  });
}

export function multiContentGalFunAfterPageLoad() {
  enableShowMoreButton();
  triggerAfterResize();

  // windo resize event
  window.addEventListener('resize', () => {
    enableShowMoreButton();
    triggerAfterResize();
  });
}

// keyboard focus events
function initMGalleryFocusEvent(btn) {
  btn.addEventListener('focus', (e) => {
    const parentElem = e.target.closest('.vid-img-slide-expand-cover');
    const buttonParentElm = parentElem.querySelector('.vid-img-slide-showmore-btn');

    if (buttonParentElm && !buttonParentElm.classList.contains('showless')) {
      const showMoreBtn = buttonParentElm.querySelector('.vid-img-slide-showmore-btn-link');
      showMoreBtn.click();
    }
  });
}

export default function decorate(block) {
  const videoImageContainer = document.createElement('div');
  videoImageContainer.classList.add('video-image-slide-conatiner');

  const videoImageDetailsContainer = document.createElement('div');
  videoImageDetailsContainer.classList.add('video-image-detail-container');
  attachSlideEvents(videoImageDetailsContainer);

  // get all children elements
  const panels = [...block.children];

  // loop through all children blocks
  [...panels].forEach((panel, index) => {
    const [content, vidOrImg, button] = panel.children;

    // get anchor element of button to add focus event fot it
    const anchorElem = button.querySelector('a');
    if (anchorElem) {
      initMGalleryFocusEvent(anchorElem);
    }

    // checking which is current block children
    if (vidOrImg.children.length > 1) {
      // headline and copy text under general tab
      const contentElem = content.children;
      const videoSlideHeadline = content.querySelector('h4');
      const videoSlideCopyText = contentElem[1] || '';

      // video tab details
      const videoContentPtags = vidOrImg.querySelectorAll('p');
      const videoSlideTitle = videoContentPtags[0] || '';
      const videoSlideDescription = videoContentPtags[1] || '';

      // video tab media
      const videoContentAtags = vidOrImg.querySelectorAll('a');
      const videoSlideDesktopVideoRef = videoContentAtags[0] || '';
      const videoSlideMobVideoRef = videoContentAtags[1] || '';

      const videoContentPictureTags = vidOrImg.querySelectorAll('picture');
      const videoSlideDesktopPosterImgRef = videoContentPictureTags[0]?.querySelector('img')?.getAttribute('src');
      const videoSlideMobPosterImgRef = videoContentPictureTags[1]?.querySelector('img')?.getAttribute('src');

      const videoDOMContainer = document.createElement('div');
      videoDOMContainer.classList.add('video-image-slide', 'media');
      videoDOMContainer.classList.add(`video-image-slide-${index}`);
      if (index === 0) {
        videoDOMContainer.classList.add('visible');
      }

      // extracting video link
      const videoLinkObj = {};
      const posterObj = {};

      if (videoSlideDesktopVideoRef) videoLinkObj.desktop = videoSlideDesktopVideoRef.href;
      if (videoSlideMobVideoRef) videoLinkObj.mobile = videoSlideMobVideoRef.href;

      if (videoSlideDesktopPosterImgRef) posterObj.desktop = videoSlideDesktopPosterImgRef;
      if (videoSlideMobPosterImgRef) posterObj.mobile = videoSlideMobPosterImgRef;

      // converting string to boolen
      const isLoopVideo = vidOrImg?.querySelector('h2')?.textContent === 'true';
      const isAutoPlayVideo = vidOrImg?.querySelector('h3')?.textContent === 'true';
      const enableVideoControls = false;
      const isMuted = true;
      const onHoverPlay = false;

      // generating video
      // delete replace link with 'videoSlideDesktopVideoRef.textContent.trim()
      loadVideoEmbed([videoDOMContainer,
        videoSlideTitle.textContent,
        videoSlideDescription.textContent,
        videoLinkObj,
        isAutoPlayVideo,
        isLoopVideo,
        enableVideoControls,
        isMuted,
        posterObj,
        onHoverPlay,
      ]);

      // call function for generating video slide UI
      videoImageContainer.append(videoDOMContainer);

      // call function to generate video detail div
      videoImageDetailsContainer.append(generateVideoDetailMarkUp([
        videoSlideHeadline, videoSlideCopyText,
        button, index, showless, panel]));
    } else {
      // content details
      const contentElem = content.children;
      const imageSlideHeadline = content.querySelector('h4');
      const imageSlideCopyText = contentElem[1];

      // image
      const imageSlideImgRef = vidOrImg.querySelector('picture');

      const imgDOMContainer = document.createElement('div');
      imgDOMContainer.classList.add('video-image-slide', 'media', 'image-slide');
      imgDOMContainer.classList.add(`video-image-slide-${index}`);

      if (index === 0) {
        imgDOMContainer.classList.add('visible');
      }
      // append picture to imgDomContainer div
      generateImgSlidePicture([imgDOMContainer, imageSlideImgRef]);

      // call function for generating image slide UI
      videoImageContainer.append(imgDOMContainer);

      // appending EDS generated picture inside detail container
      // so that it appears in content tree under image-slide
      imageSlideImgRef.classList.add('hidden');

      // call function for generating image slide details
      videoImageDetailsContainer.append(generateImgSlideDetailMarkUp([
        imageSlideHeadline, imageSlideCopyText,
        button, index, showless, panel, imageSlideImgRef]));
    }
  });
  block.textContent = '';
  block.append(videoImageContainer);
  block.append(videoImageDetailsContainer);
  block.classList.add('no-visiblity');

  // attache events for details div
  attachShowMoreEvents(block);
  // attach click event for desktop heading click
  attachDetailHeadingClickEvent(block);
  triggerAfterResize();
}
