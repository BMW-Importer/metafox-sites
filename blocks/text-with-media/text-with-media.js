import { loadVideoEmbed } from '../video/video.js';

function generateMediaDom(mediaType, media) {
  const containerDiv = document.createElement('div');
  media.classList.add('media-container');
  if (mediaType === 'image') {
    media.classList.add('image');
    const [pictureElement] = media.children;
    media.textContent = '';
    if (pictureElement) {
      const generatedPictureElem = pictureElement.querySelector('picture');

      if (generatedPictureElem) {
        const generatedImgElem = generatedPictureElem?.querySelector('img');
        generatedPictureElem.textContent = '';

        const imageTag = document.createElement('img');
        imageTag.src = generatedImgElem?.src;
        imageTag.alt = generatedImgElem?.alt;
        imageTag.loading = generatedImgElem?.loading;

        generatedPictureElem?.classList?.add('media-image');
        generatedPictureElem.append(imageTag);

        containerDiv.append(generatedPictureElem);

        // binding back to container
        media.append(containerDiv);
      }
    }
  } else if (media?.querySelector('a')) {
    // video details
    const videoContentPtags = media.querySelectorAll('p');
    const vidTitle = videoContentPtags[0] || '';
    const vidDescp = videoContentPtags[1] || '';

    // video tab media
    const videoContentAtags = media.querySelectorAll('a');
    const DesktopVideoRef = videoContentAtags[0] || '';
    const mobileVideoRef = videoContentAtags[1] || '';

    const videoContentPictureTags = media.querySelectorAll('picture');
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
    const isLoopVideo = media.querySelector('h2')?.textContent.trim() === 'true';
    const isAutoPlayVideo = media.querySelector('h3')?.textContent.trim() === 'true';
    const enableHideControls = media.querySelector('h4')?.textContent.trim() === 'true';
    const isMuted = media.querySelector('h5')?.textContent.trim() === 'true';
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

    media.textContent = '';
    // binding back to container
    media.append(containerDiv);
  }
}

export default function decorate(block) {
  const textWithMediaChildrens = [...block.children];
  textWithMediaChildrens.forEach((childrenBlockProps) => {
    childrenBlockProps.classList.add('text-with-media-item');
    const [classes, content, media, cta] = childrenBlockProps.children;

    // removing classes div
    childrenBlockProps.removeChild(classes);

    const imageAlignment = classes?.textContent?.split(',')?.[1] || 'left';
    childrenBlockProps.classList.add(imageAlignment?.trim());

    let mediaType;
    if (classes.textContent.includes('text-with-video')) {
      mediaType = 'video';

      // adding class to child block
      childrenBlockProps.classList.add('text-with-video-block');
    } else {
      mediaType = 'image';

      // adding class to child block
      childrenBlockProps.classList.add('text-with-image-block');
    }

    // generate media
    generateMediaDom(mediaType, media);

    // add class to content div
    content.classList.add('media-detail-container');

    // extract button
    const ctaElem = cta.querySelector('a');

    //  and bind it inside content
    if (ctaElem) {
      ctaElem?.classList?.add('text-with-media-cta');
      content.append(ctaElem);
    }

    // delete cta div
    childrenBlockProps.removeChild(cta);
  });
}
