export function generateImgSlidePicture(props) {
  const [imgDOMContainer, imageSlideImgRef] = props;
  const propImgElem = imageSlideImgRef.querySelector('img');
  const imageSlideAltText = propImgElem.getAttribute('alt');

  const pictureElement = document.createElement('picture');
  const imgElem = document.createElement('img');
  imgElem.src = propImgElem.src;
  imgElem.setAttribute('alt', imageSlideAltText);

  pictureElement.append(imgElem);
  imgDOMContainer.append(pictureElement);
}

export function generateImgSlideDetailMarkUp(props) {
  const [imageSlideHeadline, imageSlideCopyText,
    button, index, showless, block, edsGeneratedImgElem] = props;

  const videoImgDetailDOMContainer = document.createElement('div');

  // appending imge elemnt here so that it appears in content tree under image slide block
  videoImgDetailDOMContainer.append(edsGeneratedImgElem);

  // fetch all attribute of block and append to 'vid-img-slide' div
  Array.from(block.attributes).forEach((attr) => {
    videoImgDetailDOMContainer.setAttribute(attr.name, attr.value);
  });

  videoImgDetailDOMContainer.classList.add('vid-img-slide');
  videoImgDetailDOMContainer.classList.add(`vid-img-slide-${index}`);

  if (index === 0) {
    videoImgDetailDOMContainer.classList.add('visible');
  }
  videoImgDetailDOMContainer.classList.add('detail');

  // desktop view collapsed state detail cover
  const vidImgDetailCover = document.createElement('button');
  vidImgDetailCover.classList.add('vid-img-slide-cover');
  // if headline is authored
  if (imageSlideHeadline) {
    const headlineElem = document.createElement('h4');
    headlineElem.classList.add('vid-img-slide-cover-title');
    headlineElem.textContent = imageSlideHeadline?.textContent || '';
    vidImgDetailCover.append(headlineElem);
  }

  // desktop, tab and mobile open state detail cover
  const vidImgDetailExpandedCover = document.createElement('div');
  vidImgDetailExpandedCover.classList.add('vid-img-slide-expand-cover');

  const vidImgDetailExpandTitle = imageSlideHeadline;
  vidImgDetailExpandTitle?.classList?.add('vid-img-slide-expand-title');

  const vidImgDetailExpandDesp = imageSlideCopyText;
  vidImgDetailExpandDesp?.classList?.add('vid-img-slide-expand-descp');

  const vidImgDetailLinkBtn = button;
  vidImgDetailLinkBtn?.classList?.add('vid-img-slide-link-btn');
  const vidImgDetailAnchorElm = vidImgDetailLinkBtn?.querySelector('a');

  if (vidImgDetailAnchorElm) {
    if (vidImgDetailLinkBtn.querySelector('strong')) {
      vidImgDetailLinkBtn.querySelector('strong').textContent = '';
      vidImgDetailLinkBtn.querySelector('strong').append(vidImgDetailAnchorElm);
    } else if (vidImgDetailLinkBtn.querySelector('em')) {
      vidImgDetailLinkBtn.querySelector('em').textContent = '';
      vidImgDetailLinkBtn.querySelector('em').append(vidImgDetailAnchorElm);
    }
  }
  const showMoreShowLessBtnContainer = document.createElement('div');
  showMoreShowLessBtnContainer.classList.add('vid-img-slide-showmore-btn', 'hidden');
  const showMoreShowLessBtn = document.createElement('button');
  showMoreShowLessBtn.textContent = showless;
  showMoreShowLessBtn.classList.add('vid-img-slide-showmore-btn-link');
  showMoreShowLessBtnContainer.append(showMoreShowLessBtn);

  vidImgDetailExpandedCover.append(vidImgDetailExpandTitle);
  vidImgDetailExpandedCover.append(vidImgDetailExpandDesp);
  vidImgDetailExpandedCover.append(vidImgDetailLinkBtn);
  vidImgDetailExpandedCover.append(showMoreShowLessBtnContainer);
  videoImgDetailDOMContainer.append(vidImgDetailCover);
  videoImgDetailDOMContainer.append(vidImgDetailExpandedCover);
  return videoImgDetailDOMContainer;
}
