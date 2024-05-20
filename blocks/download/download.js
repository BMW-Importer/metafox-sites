export default function decorate(block) {
  const anchorEle = block.querySelector('a');
  if (anchorEle) anchorEle.target = '_blank';
}
