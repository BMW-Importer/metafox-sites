import { loadVideoEmbed } from '../video/video.js';

let iconClicked = false;

function updateCarousel(content, currentIndex, gap) {
  const itemWidth = (content.children[currentIndex].offsetWidth);
  const offset = -(currentIndex * (itemWidth + gap));
  content.style.transform = `translate3d(${offset}px, 0px, 0px)`;
  content.style.transitionDuration = '50ms';
  content.style.transitionDelay = '0ms';
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
  const offsetPercentage = 0.2; // 20%
  const currentOffset = -(currentIndex * (itemWidth + gap));
  const offset = direction === 'right' ? -((offsetPercentage * itemWidth) + gap) : ((offsetPercentage * itemWidth) + gap);
  content.style.transform = `translate3d(${offset + currentOffset}px, 0px, 0px)`;
  content.style.transitionDuration = '500ms';
  content.style.transitionDelay = '100ms';
}

function onHoverCarouselLeave(content, currentIndex, gap) {
  content.style.transform = 'translate3d(0px, 0px, 0px)';
  content.style.transitionDuration = '500ms';
  content.style.transitionDelay = '100ms';
  if (iconClicked) {
    updateCarousel(content, currentIndex, gap);
  }
}

function updateButtonVisibility(prevButton, nextButton, currentIndex, totalItems, itemsToShow) {
  if (currentIndex === 0) {
    prevButton.classList.add('hide-icon'); // Add 'hidden' class to hide
    prevButton.parentElement.classList.add('hide-icon');
  } else {
    prevButton.classList.remove('hide-icon'); // Remove 'hide-icon' class to show
    prevButton.parentElement.classList.remove('hide-icon');
  }

  if (currentIndex >= totalItems - itemsToShow) {
    nextButton.classList.add('hide-icon'); // Add 'hide-icon' class to hide
    nextButton.parentElement.classList.add('hide-icon');
  } else {
    nextButton.classList.remove('hide-icon'); // Remove 'hide-icon' class to show
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

function addDotsNavigation(block, content, totalItems, itemsToShow, gap, totalDots) {
  let dotsWrapper = block.querySelector('.dots-navigation');
  if (dotsWrapper) {
    dotsWrapper.remove();
  }
  dotsWrapper = document.createElement('div');
  dotsWrapper.classList.add('dots-navigation');
  const preButton = block.querySelector('.carousel-btn-prev');
  const nexButton = block.querySelector('.carousel-btn-next');

  let currentIndex = 0;
  function updateDotCarousel() {
    updateCarousel(content, currentIndex, gap);
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

  nextButton.addEventListener('mouseover', () => {
    onHoverCarousel(content, currentIndex, 'right', gap);
  });
  nextButton.addEventListener('mouseleave', () => {
    onHoverCarouselLeave(content, currentIndex, gap);
  });

  prevButton.addEventListener('mouseover', () => {
    onHoverCarousel(content, currentIndex, 'left', gap);
  });
  prevButton.addEventListener('mouseleave', () => {
    onHoverCarouselLeave(content, currentIndex, gap);
  });

  prevButton.addEventListener('click', () => {
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
  nextButton.addEventListener('click', () => {
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

function updateItemsToShow(carouselContent) {
  const viewport = window.innerWidth;
  const totalItems = carouselContent.childElementCount;
  const computedStyle = getComputedStyle(carouselContent);
  const paddingLeft = parseFloat(computedStyle.paddingLeft);
  const paddingRight = parseFloat(computedStyle.paddingRight);
  const desktopScreenWidth = viewport - (paddingLeft + paddingRight);

  // padding only for more than 1280 viewport
  const desktopContentPadding = document.querySelector('.section.media-carousel-container');
  const computedStyleDesktop = getComputedStyle(desktopContentPadding);
  const paddingLeftDesktop = parseFloat(computedStyleDesktop.paddingLeft);
  const paddingRightDesktop = parseFloat(computedStyleDesktop.paddingRight);
  const ultraScreenWidth = viewport - (paddingLeftDesktop + paddingRightDesktop);
  const availableWidth = viewport >= 1920 ? ultraScreenWidth : desktopScreenWidth;
  let cardsToShow;
  if (viewport >= 1280) {
    cardsToShow = Math.min(totalItems, 4);
  } else if (viewport >= 1024) {
    cardsToShow = Math.min(totalItems, 3);
  } else if (viewport >= 768) {
    cardsToShow = Math.min(totalItems, 2);
  } else {
    cardsToShow = 1;
  }
  return { cardsToShow, availableWidth, totalItems };
}

function resizeBlock() {
  const viewport = window.innerWidth;
  const carousels = document.querySelectorAll('.video-image-carousel-content');

  carousels.forEach((carouselContent) => {
    const block = carouselContent.closest('.media-carousel.block');
    const cards = carouselContent.querySelectorAll('.video-img-carousel-card');
    const carouselLeftWrapper = block.querySelector('.carousel-wrapper-lft-area');
    const carouselRightWrapper = block.querySelector('.carousel-wrapper-rth-area');
    const gap = viewport >= 768 ? 24 : 16;
    const { cardsToShow, availableWidth, totalItems } = updateItemsToShow(carouselContent);
    const cardWidth = ((availableWidth - ((cardsToShow - 1) * gap)) / cardsToShow);
    let scrollbarWidth = 0;
    if (viewport < 1024) {
      scrollbarWidth = `${viewport - document.body.clientWidth}`;
    }
    cards.forEach((card) => {
      card.style.width = `${cardWidth - scrollbarWidth}px`;
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
    if (viewport >= 1280 && totalItems > 4) {
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

    let totalDots;
    if (viewport >= 1280) {
      const visibleCards = 4;
      totalDots = totalItems > visibleCards ? totalItems - 3 : 0;
    } else if (viewport >= 1024) {
      const visibleCards = 3;
      totalDots = totalItems > visibleCards ? totalItems - 2 : 0;
    } else if (viewport >= 768) {
      const visibleCards = 2;
      totalDots = totalItems > visibleCards ? totalItems - 1 : 0;
    } else {
      totalDots = totalItems;
    }
    addDotsNavigation(block, carouselContent, totalItems, cardsToShow, gap, totalDots);
    updateCarousel(carouselContent, 0, gap);
  });
}

export function mediaCarouselResizer() {
  resizeBlock();

  // windo resize event
  window.addEventListener('resize', () => {
    resizeBlock();
  });
}

export default function decorate(block) {
  const panels = [...block.children];

  const videoImageCarouselContent = document.createElement('div');
  videoImageCarouselContent.classList.add('video-image-carousel-content');

  const carouselLeftWrapper = document.createElement('div');
  carouselLeftWrapper.classList.add('carousel-wrapper-lft-area');

  const carouselRightWrapper = document.createElement('div');
  carouselRightWrapper.classList.add('carousel-wrapper-rth-area');

  if (block.children.length > 0) {
    [...panels].forEach((panel, index) => {
      const videoCarouselCard = document.createElement('div');
      videoCarouselCard.classList.add('video-img-carousel-card');

      const [content, media, cta] = panel.children;
      console.log(media?.children?.length);
      if (media?.children?.length > 1) {
        console.log(media?.children?.length);
        const vidImgTitleWrapper = document.createElement('div');
        vidImgTitleWrapper.classList.add('video-img-title');
        const vidImgCtaWrap = document.createElement('div');
        vidImgCtaWrap.classList.add('video-img-cta');
        const vidImgDesWrapper = document.createElement('div');
        vidImgDesWrapper.classList.add('video-img-description');

        // headline and copy text under general tab
        const contentElem = content?.children;
        const videoCarouselHeadline = content?.querySelector('h2') || '';
        const videoCarouselCopyText = contentElem[1] || '';
        let vidImgAnchorElm = cta.querySelector('a');
        vidImgAnchorElm = (vidImgAnchorElm && vidImgAnchorElm.href) ? vidImgAnchorElm : '';
        vidImgCtaWrap.append(vidImgAnchorElm);
        vidImgTitleWrapper.append(videoCarouselHeadline);
        vidImgDesWrapper.append(videoCarouselCopyText);

        // video tab details
        const videoCarouselContentPtags = media?.querySelectorAll('p');
        const videoCarouselTitle = videoCarouselContentPtags[0] || '';
        const videoCarouselDescription = videoCarouselContentPtags[1] || '';

        // video tab media
        const videoCarouselContentAtags = media?.querySelectorAll('a');
        const videoCarouselDesktopVideoRef = videoCarouselContentAtags[0] || '';
        const videoCarouselMobVideoRef = videoCarouselContentAtags[1] || '';

        const videoContentPictureTags = media?.querySelectorAll('picture');
        const videoCarouselDesktopPosterImgRef = videoContentPictureTags[0]?.querySelector('img')?.getAttribute('src');
        const videoCarouselMobPosterImgRef = videoContentPictureTags[1]?.querySelector('img')?.getAttribute('src');

        const videoDOMContainer = document.createElement('div');

        if (index === 0) {
          videoDOMContainer.classList.add('visible');
        }

        // extracting video link
        const videoLinkObj = {};
        const posterObj = {};

        if (videoCarouselDesktopVideoRef) videoLinkObj.desktop = videoCarouselDesktopVideoRef.href;
        if (videoCarouselMobVideoRef) videoLinkObj.mobile = videoCarouselMobVideoRef.href;

        if (videoCarouselDesktopPosterImgRef) posterObj.desktop = videoCarouselDesktopPosterImgRef;
        if (videoCarouselMobPosterImgRef) posterObj.mobile = videoCarouselMobPosterImgRef;

        // converting string to boolen
        const isLoopVideo = media.querySelector('h3')?.textContent.trim() === 'true';
        const onHoverPlay = media.querySelector('h4')?.textContent.trim() === 'true';
        const enableHideControls = media.querySelector('h5')?.textContent.trim() === 'true';
        const isMuted = media.querySelector('h6')?.textContent.trim() === 'true';
        const isAutoPlayVideo = false;

        loadVideoEmbed(
          [videoDOMContainer,
            videoCarouselTitle?.textContent,
            videoCarouselDescription?.textContent,
            videoLinkObj,
            isAutoPlayVideo,
            isLoopVideo,
            enableHideControls,
            isMuted,
            posterObj,
            onHoverPlay],
        );
        // Append elements to the video card
        videoCarouselCard.append(
          videoDOMContainer,
          vidImgTitleWrapper,
          vidImgDesWrapper,
          vidImgCtaWrap,
        );
        videoImageCarouselContent.append(videoCarouselCard);
      } else {
      // image
        const imgTitleWrapper = document.createElement('div');
        imgTitleWrapper.classList.add('video-img-title');
        const imgDesWrapper = document.createElement('div');
        imgDesWrapper.classList.add('video-img-description');
        const vidImgCtaWrap = document.createElement('div');
        vidImgCtaWrap.classList.add('video-img-cta');

        const imgDOMContainer = document.createElement('div');
        if (index === 0) {
          imgDOMContainer.classList.add('visible');
        }

        let vidImgAnchorElm = cta?.querySelector('a');
        vidImgAnchorElm = (vidImgAnchorElm && vidImgAnchorElm.href) ? vidImgAnchorElm : '';
        vidImgCtaWrap.append(vidImgAnchorElm);
        // headline and copy text under general tab
        const contentElem = content?.children;
        const imgCarouselHeadline = content?.querySelector('h2') || '';
        const imgCarouselCopyText = contentElem[1] || '';
        imgTitleWrapper.append(imgCarouselHeadline);
        imgDesWrapper.append(imgCarouselCopyText);

        const imageCarouselCard = document.createElement('div');
        imageCarouselCard.classList.add('video-img-carousel-card');

        const imageCarouselImgRef = media?.querySelector('picture');

        if (index === 0) {
          imgDOMContainer.classList.add('visible');
        }
        const propImgElem = imageCarouselImgRef?.querySelector('img');
        const imageCarouselAltText = propImgElem?.getAttribute('alt');

        const pictureElement = document.createElement('picture');
        const imgElem = document.createElement('img');
        imgElem.src = propImgElem?.src;
        imgElem.setAttribute('alt', imageCarouselAltText);

        pictureElement.append(imgElem);
        imgDOMContainer.append(pictureElement);
        imageCarouselImgRef?.classList.add('hidden');
        imageCarouselCard.append(imgDOMContainer, imgTitleWrapper, imgDesWrapper, vidImgCtaWrap);
        videoImageCarouselContent.append(imageCarouselCard);
      }
    });
    block.textContent = '';
    block.append(carouselLeftWrapper, carouselRightWrapper);
    block.append(videoImageCarouselContent);
    resizeBlock();
  }
}
