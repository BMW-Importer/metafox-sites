import { loadVideoEmbed } from '../video/video.js';

let iconClicked = false;

function updateCarousel(content, currentIndex, gap) {
  const itemWidth = (content.children[currentIndex].offsetWidth);
  const offset = -(currentIndex * (itemWidth + gap));
  content.style.transform = `translate3d(${offset}px, 0px, 0px)`;
  content.style.transitionDuration = '750ms';
  content.style.transitionDelay = '100ms';
}

function updateDots(dotsWrapper, currentIndex) {
  const dots = dotsWrapper.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    if (index === currentIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}
function onHoverCarousel(content, currentIndex, direction, gap) {
  const itemWidth = (content.children[currentIndex].offsetWidth);
  const offsetPercentage = 0.07;
  const currentOffset = -(currentIndex * (itemWidth + gap));
  const offset = direction === 'right' ? -((offsetPercentage * itemWidth) + gap) : ((offsetPercentage * itemWidth) + gap);
  content.style.transform = `translate3d(${offset + currentOffset}px, 0px, 0px)`;
  content.style.transitionDuration = '750ms';
  content.style.transitionDelay = '100ms';
}

function onHoverCarouselLeave(content, currentIndex, gap) {
  content.style.transform = 'translate3d(0px, 0px, 0px)';
  content.style.transitionDuration = '750ms';
  content.style.transitionDelay = '100ms';
  if (iconClicked) {
    updateCarousel(content, currentIndex, gap);
  }
}

function updateButtonVisibility(prevButton, nextButton, currentIndex, totalItems, itemsToShow) {
  if (currentIndex === 0) {
    prevButton.classList.add('hide-icon');
    prevButton.parentElement.classList.add('hide-icon');
  } else {
    prevButton.classList.remove('hide-icon');
    prevButton.parentElement.classList.remove('hide-icon');
  }

  if (currentIndex >= totalItems - itemsToShow) {
    nextButton.classList.add('hide-icon');
    nextButton.parentElement.classList.add('hide-icon');
  } else {
    nextButton.classList.remove('hide-icon');
    nextButton.parentElement.classList.remove('hide-icon');
  }
}

function addTouchSlideFunctionality(block, content, totalItems, itemsToShow, currentIndex, gap) {
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  let startTime = 0;
  let index = currentIndex;

  let endTime = 0;
  let moved = false;
  const maxClickDuration = 200;
  const minSlideDistance = 100;

  content.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX;
    startTime = new Date().getTime();
    isDragging = true;
    moved = false;
  });
  content.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].pageX;
    const dx = currentX - startX;
    if (Math.abs(dx) >= minSlideDistance) {
      moved = true;
      const itemWidth = content.children[index].offsetWidth;
      const offset = -(index * (itemWidth + gap)) + dx;
      content.style.transform = `translate3d(${offset}px, 0px, 0px)`;
    }
  });

  content.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    endTime = new Date().getTime();
    const dx = currentX - startX;
    const duration = endTime - startTime;
    if (!moved || (Math.abs(dx) < minSlideDistance && duration < maxClickDuration)) {
      return; // avoide small movements and quick touches (clicks)
    }
    const itemWidth = content.children[index].offsetWidth;
    const threshold = itemWidth * 0.6; // threshold to move to next/previous item

    if (Math.abs(dx) > threshold) {
      if (dx > 0 && index > 0) {
        index -= 1;
      } else if (dx < 0 && index < totalItems - itemsToShow) {
        index += 1;
      }
    }
    content.style.transitionDuration = '300ms';
    updateCarousel(content, index, gap);
    updateDots(block.querySelector('.dots-navigation'), index);
  });
}

function addDotsNavigation(block, content, totalItems, itemsToShow, gap) {
  let dotsWrapper = block.querySelector('.dots-navigation');
  if (dotsWrapper) {
    dotsWrapper.remove();
  }
  dotsWrapper = document.createElement('div');
  dotsWrapper.classList.add('dots-navigation');
  const preButton = block && block.querySelector('.carousel-btn-prev');
  const nexButton = block.querySelector('.carousel-btn-next');
  let currentIndex = 0;
  function updateDotCarousel() {
    updateCarousel(content, currentIndex, gap);
  }
  let totalDots;
  if (totalItems > 1) {
    totalDots = totalItems;
  } else {
    totalDots = 0;
  }
  function createClickHandler(index) {
    return function handleClick() {
      currentIndex = index;
      updateDotCarousel();
      updateDots(dotsWrapper, currentIndex);
      updateButtonVisibility(
        preButton,
        nexButton,
        currentIndex,
        totalItems,
        itemsToShow,
      );
      addTouchSlideFunctionality(block, content, totalItems, itemsToShow, currentIndex, gap);
    };
  }

  for (let i = 0; i < totalDots; i += 1) {
    const dotButton = document.createElement('button');
    dotButton.classList.add('dot');
    if (i === 0) dotButton.classList.add('active');
    dotButton.addEventListener('click', (createClickHandler(i)));
    dotsWrapper.append(dotButton);
  }

  block.append(dotsWrapper);
  block.dataset.dotsAdded = 'true';
}

function addIconCarouselControls(
  block,
  content,
  totalItems,
  itemsToShow,
  carouselLeftWrapper,
  carouselRightWrapper,
  gap,
) {
  let prevButton = block.querySelector('.carousel-btn-prev');
  let nextButton = block.querySelector('.carousel-btn-next');

  if (prevButton) {
    prevButton.remove();
  }

  if (nextButton) {
    nextButton.remove();
  }
  prevButton = document.createElement('button');
  prevButton.classList.add('carousel-btn-prev');

  nextButton = document.createElement('button');
  nextButton.classList.add('carousel-btn-next');
  carouselLeftWrapper.append(prevButton);
  carouselRightWrapper.append(nextButton);
  let currentIndex = 0;
  function updateIconCarousel() {
    updateCarousel(content, currentIndex, gap);
  }

  carouselRightWrapper.addEventListener('mouseover', () => {
    onHoverCarousel(content, currentIndex, 'right', gap);
  });
  carouselRightWrapper.addEventListener('mouseleave', () => {
    onHoverCarouselLeave(content, currentIndex, gap);
  });

  carouselLeftWrapper.addEventListener('mouseover', () => {
    onHoverCarousel(content, currentIndex, 'left', gap);
  });
  carouselLeftWrapper.addEventListener('mouseleave', () => {
    onHoverCarouselLeave(content, currentIndex, gap);
  });

  carouselLeftWrapper.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      iconClicked = true;
      updateDots(block.querySelector('.dots-navigation'), currentIndex);
      updateIconCarousel();
      updateButtonVisibility(
        prevButton,
        nextButton,
        currentIndex,
        totalItems,
        itemsToShow,
      );
    }
  });
  carouselRightWrapper.addEventListener('click', () => {
    if (currentIndex < totalItems - itemsToShow) {
      currentIndex += 1;
      iconClicked = true;
      updateDots(block.querySelector('.dots-navigation'), currentIndex);
      updateIconCarousel();
      updateButtonVisibility(
        prevButton,
        nextButton,
        currentIndex,
        totalItems,
        itemsToShow,
      );
    }
  });
  updateButtonVisibility(
    prevButton,
    nextButton,
    currentIndex,
    totalItems,
    itemsToShow,
  );
}

function updateItemsToShow(videoGalleryContent) {
  const viewport = document.documentElement.clientWidth;

  const totalItems = videoGalleryContent.childElementCount;
  videoGalleryContent.style.maxHeight = '100%';
  videoGalleryContent.style.height = '100%';
  const computedStyle = getComputedStyle(videoGalleryContent);
  const paddingLeft = parseFloat(computedStyle.paddingLeft);
  const paddingRight = parseFloat(computedStyle.paddingRight);
  const desktopScreenWidth = viewport - (paddingLeft + paddingRight);

  // padding only for more than 1280 viewport
  const desktopContentPadding = document.querySelector('.section.video-gallery-container');
  const computedStyleDesktop = getComputedStyle(desktopContentPadding);
  const paddingLeftDesktop = parseFloat(computedStyleDesktop.paddingLeft);
  const paddingRightDesktop = parseFloat(computedStyleDesktop.paddingRight);
  const ultraScreenWidth = viewport - (paddingLeftDesktop + paddingRightDesktop);
  const availableWidth = viewport >= 1920 ? ultraScreenWidth : desktopScreenWidth;
  const cardsToShow = 1;
  return { cardsToShow, availableWidth, totalItems };
}

export function resizeVideoBlock() {
  const viewport = document.documentElement.clientWidth;
  const carousels = document.querySelectorAll('.video-gallery-content');
  carousels.forEach((carouselContent) => {
    const block = carouselContent.closest('.video-gallery.block');
    const cards = carouselContent.querySelectorAll('.video-gallery-card');
    const carouselLeftWrapper = block.querySelector('.slide-wrapper-lft-area');
    const carouselRightWrapper = block.querySelector('.slide-wrapper-rth-area');
    const gap = viewport >= 768 ? 24 : 16;
    const { cardsToShow, availableWidth, totalItems } = updateItemsToShow(carouselContent);
    let scrollbarWidth;
    if (viewport < 1024) {
      scrollbarWidth = `${viewport - document.body.clientWidth}px`;
    }
    const cardWidth = ((availableWidth - ((cardsToShow - 1) * gap)) / cardsToShow) - scrollbarWidth;
    cards.forEach((card) => {
      card.style.width = `${cardWidth}px`;
      card.style.marginRight = `${gap}px`;
    });

    addTouchSlideFunctionality(
      block,
      carouselContent,
      totalItems,
      cardsToShow,
      0,
      gap,
    );
    if (viewport >= 1024 && totalItems > 1) {
      addIconCarouselControls(
        block,
        carouselContent,
        totalItems,
        cardsToShow,
        carouselLeftWrapper,
        carouselRightWrapper,
        gap,
      );
    }
    addDotsNavigation(block, carouselContent, totalItems, cardsToShow, gap);
    updateCarousel(carouselContent, 0, gap);
  });
}

function generateMediaGallery(videoGallery, block, callback) {
  const containerDiv = document.createElement('div');

  const videocontainer = document.createElement('div');
  videocontainer.classList.add('video-content');

  // video details
  const videoSlideTextDiv = document.createElement('div');
  if (videoGallery?.querySelector('a')) {
    videoSlideTextDiv.classList.add('video-gallery-title');
    let videoSlideText = videoGallery.querySelectorAll('h3, h4');
    videoSlideText = videoSlideText.length > 0 ? videoSlideText[0].textContent : '';
    videoSlideTextDiv.append(videoSlideText);
    const videoContentPtags = videoGallery.querySelectorAll('p');
    const vidTitle = videoContentPtags[0] || '';
    const vidDescp = videoContentPtags[1] || '';

    // video tab videoGallery
    const videoContentAtags = videoGallery.querySelectorAll('a');
    const DesktopVideoRef = videoContentAtags[0] || '';
    const mobileVideoRef = videoContentAtags[1] || '';

    const videoContentPictureTags = videoGallery.querySelectorAll('picture');
    const videoSlideDesktopPosterImgRef = videoContentPictureTags[0]?.querySelector('img')?.getAttribute('src');
    const videoSlideMobPosterImgRef = videoContentPictureTags[1]?.querySelector('img')?.getAttribute('src');

    // extracting video link
    const videoLinkObj = {};
    const posterObj = {};

    if (DesktopVideoRef) videoLinkObj.desktop = DesktopVideoRef.href;
    if (mobileVideoRef) videoLinkObj.mobile = mobileVideoRef.href;

    if (videoSlideDesktopPosterImgRef) posterObj.desktop = videoSlideDesktopPosterImgRef;
    if (videoSlideMobPosterImgRef) posterObj.mobile = videoSlideMobPosterImgRef;

    // converting string to boolen
    const isLoopVideo = videoGallery.querySelector('h1')?.textContent.trim() === 'true';
    const isAutoPlayVideo = videoGallery.querySelector('h2')?.textContent.trim() === 'true';
    const enableHideControls = videoGallery.querySelector('h5')?.textContent.trim() === 'true';
    const isMuted = videoGallery.querySelector('h6')?.textContent.trim() === 'true';
    const onHoverPlay = false;

    loadVideoEmbed([
      containerDiv,
      vidTitle?.textContent,
      vidDescp?.textContent,
      videoLinkObj,
      isAutoPlayVideo,
      isLoopVideo,
      enableHideControls,
      isMuted,
      posterObj,
      onHoverPlay,
    ]);

    videoGallery.textContent = '';

    videocontainer.append(containerDiv);
    videoGallery.append(
      videocontainer,
      videoSlideTextDiv,
    );
    if (typeof callback === 'function') {
      callback(videoGallery);
    }
    resizeVideoBlock();
  }
}

export function videoGalleryResizer() {
  resizeVideoBlock();

  // windo resize event
  window.addEventListener('resize', () => {
    resizeVideoBlock();
  });
}

export default function decorate(block) {
  const mediaGalleryProps = [...block.children];

  const parentContainerDiv = document.createElement('div');
  parentContainerDiv.classList.add('video-gallery-content');

  const videoSlideLeftWrapper = document.createElement('div');
  videoSlideLeftWrapper.classList.add('slide-wrapper-lft-area');

  const videoSlideRightWrapper = document.createElement('div');
  videoSlideRightWrapper.classList.add('slide-wrapper-rth-area');

  let completedGalleries = 0;
  const totalGalleries = mediaGalleryProps.length;

  mediaGalleryProps.forEach((childrenBlockProps) => {
    const [videoGallery] = childrenBlockProps.children;
    generateMediaGallery(videoGallery, block, (generatedDOM) => {
      parentContainerDiv.append(generatedDOM);
      completedGalleries += 1;
      if (completedGalleries === totalGalleries) {
        block.append(videoSlideLeftWrapper, videoSlideRightWrapper);
        block.append(parentContainerDiv);
        const parentElements = document.querySelectorAll('.video-gallery-content');
        parentElements.forEach((parentElement) => {
          Array.from(parentElement.children).forEach((child) => {
            child.classList.add('video-gallery-card');
          });
        });
        resizeVideoBlock();
      }
    });
  });
}
