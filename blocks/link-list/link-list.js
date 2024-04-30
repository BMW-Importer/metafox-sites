function toggleLinkListDetail(e) {
  const { target } = e;
  if (window.innerWidth < 768) {
    if (target.classList.contains('expand')) {
      target.nextSibling.style.maxHeight = null;
      target.classList.remove('expand');
    } else {
      let listOfTitle;
      const parentElem = e.target.closest('.section.link-list-container');
      if (parentElem) {
        listOfTitle = parentElem.querySelectorAll('.link-list-wrapper.vertical .link-list-title.expand');
        // let expand = document.querySelectorAll('.link-list-title.expand');
        for (let j = 0; j < listOfTitle.length; j += 1) {
          listOfTitle[j].classList.remove('expand');
          listOfTitle[j].nextElementSibling.style.maxHeight = null;
        }
        target.nextSibling.style.maxHeight = `${target.nextSibling.scrollHeight}px`;
        target.classList.add('expand');
      }
    }
  }
}
export function generateLinkListDom(block) {
  const props = [...block.children].map((row) => row.firstElementChild);
  const [linkListOrientation, linkListTitle, linkListDetail] = props;
  const orientationClassName = linkListOrientation.textContent || 'vertical';
  block.parentElement.classList.add(orientationClassName);

  const linkListTitleElem = document.createElement('h3');
  linkListTitleElem.classList.add('link-list-title');
  linkListTitleElem.textContent = linkListTitle.textContent;
  linkListTitleElem.addEventListener('click', toggleLinkListDetail);

  const linkListRTEElem = document.createElement('div');
  linkListRTEElem.classList.add('link-list-detail');
  linkListRTEElem.innerHTML = linkListDetail.innerHTML;

  return [linkListTitleElem, linkListRTEElem];
}

export function generateHeaderLinkList(props) {
  const [, b, ulList] = props;
  const menuteaserDOM = document.createRange().createContextualFragment(`
      <div class="flyout-link-list">     
        <div class ="link-list-wrapper vertical">
          <div class="link-list block" data-block-name="link-list" data-block-status="loaded">
            <h3 class="link-list-title">${b.textContent}</h3>
              <div class="link-list-detail">
               ${ulList.innerHTML}
              </div>
        </div>
      </div>
    `);
  return menuteaserDOM;
}

export default function decorate(block) {
  const [linkListTitleElem, linkListRTEElem] = generateLinkListDom(block);
  block.textContent = '';
  block.append(linkListTitleElem);
  block.append(linkListRTEElem);
}
