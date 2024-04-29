export function generateVideoScript(videoControls) {
  // Build DOM
  let videoViewer = `
  <div id="s7viewer" style="position:relative;width:640px;height:360px;"></div>
  <script type="text/javascript" defer>
  console.log("Hello DM Video Player");
  var videoViewer = new s7viewers.SmartCropVideoViewer();
videoViewer.setContainerId("s7viewer");
videoViewer.setParam("serverurl", "http://bmw.scene7.com/is/image/");
videoViewer.setParam("videoserverurl", "http://bmw.scene7.com/is/content/");
videoViewer.setAsset("BMW/bmw-x-series-ix-onepager-gallery-charging-01-AVS");`;
  const videoControlProperties = videoControls.innerText.split(',');
  const enableAutoplay = !!videoControlProperties.includes('autoplay');
  const loop = !!videoControlProperties.includes('loop');
  const enableControls = !!videoControlProperties.includes('enableVideoControls');
  const muted = !!videoControlProperties.includes('muted');
  if (enableAutoplay) {
    videoViewer += 'videoViewer.setParam("autoplay", "1");';
  }
  if (loop) {
    videoViewer += 'videoViewer.setParam("loop", "1");';
  }
  console.log('Enable Video Controls', enableControls);
  console.log('Video muted on load', muted);
  videoViewer += 'videoViewer.init();</script>';
  const videoScriptDOM = document.createRange().createContextualFragment(videoViewer);
  return videoScriptDOM;
}
export default function decorate(block) {
  // get the first and only cell from each row
  const props = [...block.children].map((row) => row.firstElementChild);
  const [, , videoControls] = props;
  const s7ViewerScriptTag = document.createElement('script');
  s7ViewerScriptTag.src = 'http://bmw.scene7.com/s7viewers/html5/js/SmartCropVideoViewer.js';
  s7ViewerScriptTag.type = 'text/javascript';
  s7ViewerScriptTag.setAttribute('defer', 'defer');
  block.append(s7ViewerScriptTag);
  const videoScriptDOM = generateVideoScript(videoControls);
  block.textContent = '';
  block.append(videoScriptDOM);
}
