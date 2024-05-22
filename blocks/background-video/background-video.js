import { loadVideoEmbed } from '../video/video.js';

/* this function also gets called by backgroud media */
export function generatebgVideoDom(block) {
  // eslint-disable-next-line max-len
  const [vidTitle, vidDescp, desktopVid, mobVid, desktopPosterImg, mobPosterImg, loopVid, autoPlay] = block.children;
  if (desktopVid) {
    // video tab media
    const DesktopVideoRef = desktopVid?.querySelector('a');
    const mobileVideoRef = mobVid?.querySelector('a');

    // extracting img src
    const videoSlideDesktopPosterImgRef = desktopPosterImg?.querySelector('img')?.getAttribute('src');
    const videoSlideMobPosterImgRef = mobPosterImg?.querySelector('img')?.getAttribute('src');

    // extracting video link
    const videoLinkObj = {};
    const posterObj = {};

    if (DesktopVideoRef) videoLinkObj.desktop = DesktopVideoRef.href;
    if (mobileVideoRef) videoLinkObj.mobile = mobileVideoRef.href;

    if (videoSlideDesktopPosterImgRef) posterObj.desktop = videoSlideDesktopPosterImgRef;
    if (videoSlideMobPosterImgRef) posterObj.mobile = videoSlideMobPosterImgRef;

    // converting string to boolen
    const isLoopVideo = loopVid?.textContent.trim() === 'true';
    const isAutoPlayVideo = autoPlay?.textContent.trim() === 'true';
    const enableHideControls = true;
    const isMuted = true;
    const onHoverPlay = false;
    // generating video
    // delete replace link with 'videoSlideDesktopVideoRef.textContent.trim()
    loadVideoEmbed(
      block,
      vidTitle.textContent,
      vidDescp.textContent,
      videoLinkObj,
      isAutoPlayVideo,
      isLoopVideo,
      enableHideControls,
      isMuted,
      posterObj,
      onHoverPlay,
    );
    return block;
  }

  return '';
}

export default function decorate(block) {
  const dom = generatebgVideoDom(block);
  block.textContent = '';
  block.append(dom);
}
