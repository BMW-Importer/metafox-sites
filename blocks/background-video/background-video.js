import { loadVideoEmbed } from '../video/video.js';

/* this function also gets called by backgroud media */
export function generatebgVideoDom(block) {
  if (block?.querySelector('a')) {
    // video tab details
    const videoContentPtags = block.querySelectorAll('p');
    const vidTitle = videoContentPtags[0] || '';
    const vidDescp = videoContentPtags[1] || '';

    // video tab media
    const videoContentAtags = block.querySelectorAll('a');
    const DesktopVideoRef = videoContentAtags[0] || '';
    const mobileVideoRef = videoContentAtags[1] || '';

    const videoContentPictureTags = block.querySelectorAll('picture');
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
    const isLoopVideo = block.querySelector('h1')?.textContent.trim() === 'true';
    const isAutoPlayVideo = block.querySelector('h2')?.textContent.trim() === 'true';
    const enableHideControls = true;
    const isMuted = true;
    const onHoverPlay = false;
    // generating video
    // delete replace link with 'videoSlideDesktopVideoRef.textContent.trim()
    loadVideoEmbed([
      block,
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
    return block;
  }

  return '';
}

export default function decorate(block) {
  const dom = generatebgVideoDom(block);
  block.textContent = '';
  block.append(dom);
}
