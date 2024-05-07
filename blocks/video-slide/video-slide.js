export default function generateVideoDetailMarkUp(props) {
  const [videoSlideHeadline, videoSlideCopyText,
    button, index] = props;

  const videoImgDetailDOMContainer = document.createElement('div');
  videoImgDetailDOMContainer.classList.add('vid-img-slide');
  videoImgDetailDOMContainer.classList.add(`vid-img-slide-${index}`);
  if (index === 0) {
    videoImgDetailDOMContainer.classList.add('visible');
  }
  videoImgDetailDOMContainer.classList.add('detail');

  // desktop view collapsed state detail cover
  const vidImgDetailCover = document.createElement('div');
  vidImgDetailCover.classList.add('vid-img-slide-cover');
  const vidImgDetailCoverTitle = document.createElement('h4');
  vidImgDetailCoverTitle.classList.add('vid-img-slide-cover-title');
  vidImgDetailCoverTitle.textContent = videoSlideHeadline;
  vidImgDetailCover.append(vidImgDetailCoverTitle);

  // desktop, tab and mobile open state detail cover
  const vidImgDetailExpandedCover = document.createElement('div');
  vidImgDetailExpandedCover.classList.add('vid-img-slide-expand-cover');

  const vidImgDetailExpandTitle = document.createElement('h4');
  vidImgDetailExpandTitle.classList.add('vid-img-slide-expand-title');
  vidImgDetailExpandTitle.textContent = videoSlideHeadline;

  const vidImgDetailExpandDesp = document.createElement('p');
  vidImgDetailExpandDesp.classList.add('vid-img-slide-expand-descp');
  vidImgDetailExpandDesp.innerHTML = videoSlideCopyText.outerHTML;

  const vidImgDetailLinkBtn = button;
  vidImgDetailLinkBtn.classList.add('vid-img-slide-link-btn');
  const vidImgDetailAnchorElm = vidImgDetailLinkBtn.querySelector('a');

  const anchorElem = document.createElement('a');
  anchorElem.href = vidImgDetailAnchorElm.href;
  anchorElem.classList = vidImgDetailAnchorElm.classList;
  anchorElem.textContent = vidImgDetailAnchorElm.textContent;

  if (vidImgDetailLinkBtn.querySelector('strong')) {
    vidImgDetailLinkBtn.querySelector('strong').textContent = '';
    vidImgDetailLinkBtn.querySelector('strong').append(anchorElem);
  } else if (vidImgDetailLinkBtn.querySelector('em')) {
    vidImgDetailLinkBtn.querySelector('em').textContent = '';
    vidImgDetailLinkBtn.querySelector('em').append(anchorElem);
  }

  const showMoreShowLessBtnContainer = document.createElement('div');
  showMoreShowLessBtnContainer.classList.add('vid-img-slide-showmore-btn', 'hidden');

  const showMoreShowLessBtn = document.createElement('button');
  showMoreShowLessBtn.textContent = 'Prikaži manje';
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