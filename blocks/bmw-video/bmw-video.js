export function generateVideoScript() {
  // Build DOM
  const videoScriptDOM = document.createRange().createContextualFragment(`
  <div id="s7viewer" style="position:relative;width:640px;height:360px;"></div>
  <script type="text/javascript" src="http://bmw.scene7.com/s7viewers/html5/js/SmartCropVideoViewer.js"></script>
  <script type="text/javascript">
  console.log("Hello DM Video Player");
  var videoViewer = new s7viewers.SmartCropVideoViewer();
videoViewer.setContainerId("s7viewer");
videoViewer.setParam("serverurl", "http://bmw.scene7.com/is/image/");
videoViewer.setParam("videoserverurl", "http://bmw.scene7.com/is/content/");
videoViewer.setAsset("BMW/bmw-x-series-ix-onepager-gallery-charging-01-AVS");
videoViewer.setParam("autoplay", "1");
videoViewer.setParam("loop", "1");
videoViewer.setParam("transition", "none");
videoViewer.init();
   </script>
    `);
  return videoScriptDOM;
}
export default function decorate(block) {
  // get the first and only cell from each row
  // const props = [...block.children].map((row) => row.firstElementChild);
  const videoScriptDOM = generateVideoScript();
  block.textContent = '';
  block.append(videoScriptDOM);
}
