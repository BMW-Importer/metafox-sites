export default function decorate(block) {
  //console.log(block)
  const anchorEle = block.querySelector('a');
  if (anchorEle){
    anchorEle.target = '_blank';
    anchorEle.dataset.analyticsCustomClick = 'true';
    anchorEle.dataset.analyticsBlockName = anchorEle.closest('.block').dataset.blockName;
    anchorEle.dataset.analyticsSectionId = anchorEle.closest('.section').dataset.analyticsLabel;
  }
}