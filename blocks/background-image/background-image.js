/* this function also gets called by backgroud media */
export function generatebgImgDom(block) {
  const [image] = block.children;
  let pictureElem = '';
  if (image) {
    pictureElem = image.querySelector('picture');
  }
  block.textContent = '';
  return pictureElem;
}

export default function decorate(block) {
  const dom = generatebgImgDom(block);
  block.textContent = '';
  block.append(dom);
}
