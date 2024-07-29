const createMetadata = (main, document) => {
	
  createColumns(main, document);
  createBackgroundMedia(main, document);
  createAccordion(main, document);
  createTextWithMediaLeft(main, document);
  createTextWithMediaRight(main, document);
  createVideo(main, document);
  createCarousel(main, document);
  createMultiContentGallery(main, document);
  createDefaultContent(main, document);
  createflexibleWidthSection(main, document);
  createSection(main, document);

  const meta = {};
  const title = document.querySelector('title');
  if (title) {
    meta.Title = title.innerHTML.replace(/[\n\t]/gm, '');
  }
  const desc = document.querySelector('meta[name="description"]');
  if (desc) {
    meta.Description = desc.content;
  }
  const img = document.querySelector('meta[name="image"]');
  if (img) {
    const el = document.createElement('img');
    el.src = img.content;
    meta.Image = el;
  }
  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(block);
};

export default {


  transformDOM: ({
    // eslint-disable-next-line no-unused-vars
    document,
    url,
  }) => {
    const main = document.body;

    // you can implement your usual DOM transformation rules here
    createMetadata(main, document);
    WebImporter.DOMUtils.remove(main, [
      'header',
      '.header',
      'nav',
      '.nav',
      'footer',
      '.footer',
      'iframe',
      'noscript',
      '.cmp-page__skiptomaincontent',
      '.cmp-epaasnotavailablebanner',
      '.cmp-backtotop',
      '.speeddial',
      '.drivetrainswitch',
      '.visualizer',
      '.preCon',
	  '.modelnavigation',
	  '.cmp-modelhubcard',
	  '.technicaldata',
	  '.modelcard',
	  '.tabs',
	  '.style-text--disclaimer-1',
	  '[data-tracking-regionid*="drivetrain switch"]',
	  '[data-tracking-regionid*="standalone-disclaimer"]',
      /* '.accordion',
       '.container',
       '.backgroundmedia',
       '.carousel'*/
    ]);
   // console.log(main)
    return main;
  },
};

const createBackgroundMedia = (main, document) => {

  const listOfBackgroundMedia = document.querySelectorAll('.backgroundmedia');
  listOfBackgroundMedia.forEach(bgmedia => {
    const backgroundMediaBlock = [];
    const name = ['Background Media'];
    backgroundMediaBlock.push(name);
    const backgroundMediaBlockData = [];
    const backgroundMediaBlockData1 = [];
    const backgroundMediaImageBlockData = [];
	let copyText;
	let subBrandIconType;
	    const mediaImageCmp = bgmedia.querySelector('.cmp-image .cmp-image__image');

    const titles = bgmedia.querySelectorAll('.title');
	if(!mediaImageCmp){
    titles.forEach((title, i) => {
      if (i == 0) {
        const eyeBrow = title.querySelector('.cmp-title__text')?.textContent;
        let eyeBrowType = '';
        if (title.classList.contains('style-title__text--eyebrow2-bold')) {
          eyeBrowType = "Eyebrow Bold 2 (h5)";
          const h5 = document.createElement('h5');
          h5.textContent = eyeBrow;
          backgroundMediaBlockData1.push(h5);
        } else if (title.classList.contains('style-title__text--eyebrow1-bold')) {
          eyeBrowType = "Eyebrow Bold 1 (h4)";
          const h4 = document.createElement('h4');
          h4.textContent = eyeBrow;
          backgroundMediaBlockData1.push(h4);
        } else {
          eyeBrowType = 'Iconization (h6)';
          const h6 = document.createElement('h6');
          h6.textContent = eyeBrow;
          backgroundMediaBlockData1.push(h6);
        }

      }

      if (i == 1) {
        const headline = title.querySelector('.cmp-title__text')?.textContent;
        const para = document.createElement("p");
        const node = document.createTextNode(headline);
        para.appendChild(node);
        backgroundMediaBlockData1.push(para);
        const h2 = document.createElement('h2');
        h2.textContent = "small";
        backgroundMediaBlockData1.push(h2);
        backgroundMediaBlockData.push(backgroundMediaBlockData1);

      }

      if (i == 2) {
        copyText = title.querySelector('.cmp-title__text')?.textContent;
        subBrandIconType = title.querySelector('.cmp-title__image-branding')?.getAttribute('title');
        if (subBrandIconType && subBrandIconType.toLowerCase() == 'bmw i') {
          subBrandIconType = 'subbrandi';
        } else if (subBrandIconType && subBrandIconType.toLowerCase() == 'bmw m') {
          subBrandIconType = 'subbrandm';
        } else {
          subBrandIconType = 'noicon';
        }
       
	  }
    });
		if (copyText){
          backgroundMediaBlockData.push(subBrandIconType);
			const h3 = document.createElement("h3");
			h3.textContent = copyText;
			backgroundMediaBlockData.push(h3);      
		}else{
			backgroundMediaBlockData.push("noicon");
			const para = document.createElement("p");
			backgroundMediaBlockData.push(para); 
		}
	}
    let mediaImagetitle;
    let mediaImageDescription;
	let mediaImageEyebrow;


    if (mediaImageCmp) {
	mediaImageEyebrow = bgmedia.querySelector('.title');
	const hasEyebrowClass = Array.from(mediaImageEyebrow.classList).some(className =>
        className.startsWith('style-title__text--eyebrow')
      );
	if(mediaImageEyebrow&& hasEyebrowClass){
		const eyebrowText = mediaImageEyebrow.querySelector('.cmp-title__text')?.textContent;
        let eyeBrowType = '';
		
        if (mediaImageEyebrow.classList.contains('style-title__text--eyebrow2-bold')) {
          eyeBrowType = "Eyebrow Bold 2 (h5)";
          const h5 = document.createElement('h5');
          h5.textContent = eyebrowText;
          backgroundMediaBlockData1.push(h5);
        } else if (mediaImageEyebrow.classList.contains('style-title__text--eyebrow1-bold')) {
          eyeBrowType = "Eyebrow Bold 1 (h4)";
          const h4 = document.createElement('h4');
          h4.textContent = eyebrowText;
          backgroundMediaBlockData1.push(h4);
        } else {
          eyeBrowType = 'Iconization (h6)';
          const h6 = document.createElement('h6');
          h6.textContent = eyebrowText;
          backgroundMediaBlockData1.push(h6);
        }
      }else{
		const eyebrow = document.createElement('p');
		eyebrow.textContent='&nbsp;';
        backgroundMediaBlockData1.push(eyebrow);
	  }
      mediaImagetitle = bgmedia.querySelector('.title');
	  const hasTitleClass = Array.from(mediaImagetitle.classList).some(className =>
        className.startsWith('style-title--headline')
      );
      if (hasTitleClass) {
       const headline = mediaImagetitle.querySelector('.cmp-title__text')?.textContent;
        const para = document.createElement("p");
        const node = document.createTextNode(headline);
        para.appendChild(node);
        backgroundMediaBlockData1.push(para);
        const h2 = document.createElement('h2');
        h2.textContent = "small";
        backgroundMediaBlockData1.push(h2);
      }else{
        const title = document.createElement('p');
		title.textContent='&nbsp;';
        backgroundMediaBlockData1.push(title);
		backgroundMediaBlockData1.push("small");
      }
	  backgroundMediaBlockData.push(backgroundMediaBlockData1);

      mediaImageDescription = bgmedia.querySelector('.cmp-text .cmp-text__paragraph')?.textContent;
      if (mediaImageDescription) {
          backgroundMediaBlockData.push("noicon");
			const h3 = document.createElement("h3");
			h3.textContent = mediaImageDescription;
			backgroundMediaBlockData.push(h3);      
		}else{
			backgroundMediaBlockData.push("noicon");
			const para = document.createElement("p");
			para.textContent = 'copytext';
			backgroundMediaBlockData.push(para); 
		}

    }

    const backgroundMediaBlockData2 = [];
    const para = document.createElement("p");
    const node = document.createTextNode("dark,left");
    para.appendChild(node);
    backgroundMediaBlockData2.push(para);
    const h3 = document.createElement('h3');
    h3.textContent = "central-left";
    backgroundMediaBlockData2.push(h3);
    backgroundMediaBlockData.push(backgroundMediaBlockData2);

    if (bgmedia.querySelector('.cmp-video__video-player')) {
      const backgroundMediaVideoBlockData = [];

      const videoTitle = bgmedia.querySelector('.cmp-video__video-player').getAttribute('aria-label');
      const paraTitle = document.createElement("p");
      const nodeTitle = document.createTextNode(videoTitle);
      if (videoTitle)
        paraTitle.appendChild(nodeTitle);
      const videoDescription = bgmedia.querySelector('.cmp-video__video-player').getAttribute('aria-description');
      const paraDesc = document.createElement("p");
      const nodeDesc = document.createTextNode(videoDescription);
      if (videoDescription)
        paraDesc.appendChild(nodeDesc);
      const dsktpPosterImgPath = bgmedia.querySelector('.cmp-video__video img')?.getAttribute('src');
      const pictureDesk = document.createElement('picture');
      const paraDeskImg = document.createElement("p");
      const el = document.createElement('img');
      el.src = dsktpPosterImgPath;
      pictureDesk.appendChild(el);
      paraDeskImg.appendChild(pictureDesk);

      const mblPosterImgPath = bgmedia.querySelector('.cmp-video__video img')?.getAttribute('src');
      const pictureMob = document.createElement('picture');

      const paraMobImg = document.createElement("p");
      const e2 = document.createElement('img');
      e2.src = mblPosterImgPath;
      if (mblPosterImgPath)
        pictureMob.appendChild(e2);
      paraMobImg.appendChild(pictureMob);

      const desktopVideoPath = bgmedia.querySelector('.cmp-video__video-player').getAttribute('data-src-large');
      const paraVideoPath = document.createElement("p");
      const aTag1 = document.createElement('a');
      aTag1.setAttribute('href', desktopVideoPath);
      aTag1.innerText = desktopVideoPath;
      paraVideoPath.appendChild(aTag1);

      let mobileVideoPath = bgmedia.querySelector('.cmp-video__video-player').getAttribute('data-src-medium');
      if (!mobileVideoPath) {
        mobileVideoPath = bgmedia.querySelector('.cmp-video__video-player').getAttribute('src');
      }
      const paraMobVideoPath = document.createElement("p");
      const aTag2 = document.createElement('a');
      aTag2.setAttribute('href', desktopVideoPath);
      aTag2.innerText = desktopVideoPath;
      paraMobVideoPath.appendChild(aTag2);

      const h1 = document.createElement('h1');
      h1.textContent = "true";
      const h2 = document.createElement('h2');
      h2.textContent = "true";
      backgroundMediaVideoBlockData.push(paraTitle, paraDesc, paraVideoPath, paraMobVideoPath, paraDeskImg, paraMobImg, h1, h2);
      backgroundMediaBlockData.push(backgroundMediaVideoBlockData);


    }

    let imgSrc;
    let imgAlt



    const mediaImage = bgmedia.querySelector('.cmp-image .cmp-image__image');
    if (mediaImage) {
      imgSrc = bgmedia.querySelector('.cmp-image .cmp-image__image')?.getAttribute('src');
      imgAlt = bgmedia.querySelector('.cmp-image .cmp-image__image')?.getAttribute('alt');
      const el = document.createElement('img');
      el.src = imgSrc;
      el.alt = imgAlt;
      if (imgSrc)
        backgroundMediaBlockData.push(el);
    }

    function isAbsoluteUrl(url) {
      return /^https?:\/\//i.test(url);
    }

    const linkLabel1 = bgmedia.querySelector('.button .cmp-button[data-tracking-linkid*="primary button"]')?.textContent;
    const linkLabel2 = bgmedia.querySelector('.button .cmp-button[data-tracking-linkid*="ghost button"]')?.textContent;
    let linkurl1 = bgmedia.querySelector('.button .cmp-button[data-tracking-linkid*="primary button"]')?.getAttribute('href');
    let linkurl2 = bgmedia.querySelector('.button .cmp-button[data-tracking-linkid*="ghost button"]')?.getAttribute('href');

    if (linkLabel1 && linkurl1) {
      if (linkurl1 && !isAbsoluteUrl(linkurl1)) {
        var currentDomain = window.location.origin;
        linkurl1 = currentDomain + linkurl1;
      }
      const backgroundMediaLinkData1 = [];
      const aTag = document.createElement('a');
      aTag.setAttribute('href', linkurl1);
      aTag.innerText = linkLabel1;
      const para = document.createElement("p");
      const node = document.createTextNode("money-btn money-btn-flex");
      para.appendChild(node);
      backgroundMediaLinkData1.push(aTag, para);
      backgroundMediaBlockData.push(backgroundMediaLinkData1);
    } else {
      const para = document.createElement("p");
      const node = document.createTextNode("money-btn money-btn-flex");
      para.appendChild(node);
      backgroundMediaBlockData.push(para);

    }
    if (linkLabel2 && linkurl2) {
      if (linkurl2 && !isAbsoluteUrl(linkurl2)) {
        var currentDomain = window.location.origin;
        linkurl2 = currentDomain + linkurl2;
      }
      const backgroundMediaLinkData2 = [];
      const aTag = document.createElement('a');
      aTag.setAttribute('href', linkurl2);
      aTag.innerText = linkLabel2;
      const para = document.createElement("p");
      const node = document.createTextNode("ghost-img-btn ghost-img-flex-btn");
      para.appendChild(node);
      backgroundMediaLinkData2.push(aTag, para);
      backgroundMediaBlockData.push(backgroundMediaLinkData2);

    } else {
      const paraBtn2 = document.createElement("p");
      const node2 = document.createTextNode("ghost-img-btn ghost-img-flex-btn");
      paraBtn2.appendChild(node2);
      backgroundMediaBlockData.push(paraBtn2);
    }
    const para3 = document.createElement("p");
    const node3 = document.createTextNode("");
    para3.appendChild(node3);
    backgroundMediaBlockData.push(para3);
    backgroundMediaBlockData.push(para3);
    backgroundMediaBlock.push(backgroundMediaBlockData);

    const backgroundMediaTable = WebImporter.DOMUtils.createTable(backgroundMediaBlock, document);
    bgmedia.replaceWith(backgroundMediaTable);
  });

};

const createAccordion = (main, document) => {
  const listOfAccordian = document.querySelectorAll('.accordion');
  listOfAccordian.forEach((accordion) => {
    const accordianBlock = [];
    const name = ['Accordion'];
    accordianBlock.push(name);
    const listOfAccordianItem = document.querySelectorAll('.cmp-accordion__item');
    listOfAccordianItem.forEach((accordionItem) => {
      const accordianData = [];
      const heading = accordionItem.querySelector('.cmp-accordion__title').textContent;
      accordianData.push(heading);
      const detail = accordionItem.querySelector('.cmp-text').textContent;
      accordianData.push(detail);
      accordianData.push(false);
      accordianBlock.push(accordianData);
    });
    const accordianTable = WebImporter.DOMUtils.createTable(accordianBlock, document);
    accordion.replaceWith(accordianTable);


  });

};

const createTextWithMediaLeft = (main, document) => {
  const elements1 = document.querySelectorAll('[data-tracking-regionid*="item-image-text-teaser-left"]');
  elements1.forEach(element => {
    const textWithMediaBlock = [];
    const name = ['Text With Media'];
    textWithMediaBlock.push(name);
    const textWithMediaBlockData = [];
    textWithMediaBlockData.push("left");
    const textWithMediaBlockData1 = [];

    const titles = element.querySelectorAll('.title');
    let hasEybrow = false;
    let hasTitle = false;
    titles.forEach(title => {
      const titleText = title.querySelector('.cmp-title').textContent;
      let titleStyle = '';
      if (title.classList.contains('style-title__text--eyebrow2-bold')) {
        titleStyle = 'Eyebrow Bold 2';
        const eyebrow = document.createElement('h4');
        eyebrow.textContent = titleText;
        textWithMediaBlockData1.push(eyebrow);
        hasEybrow = true;
      } else if (title.classList.contains('style-title__text--eyebrow1-bold')) {
        titleStyle = 'Eyebrow Bold 1';
        const eyebrow = document.createElement('h4');
        eyebrow.textContent = titleText;
        textWithMediaBlockData1.push(eyebrow);
        hasEybrow = true;
      } else if (title.classList.contains('style-title--iconization-1')) {
        titleStyle = 'Iconization';
        const eyebrow = document.createElement('h4');
        eyebrow.textContent = titleText;
        textWithMediaBlockData1.push(eyebrow);
        hasEybrow = true;
      } else if (title.classList.contains('style-title--headline-1')) {
        const h1 = document.createElement('h2');
        h1.textContent = titleText;
        textWithMediaBlockData1.push(h1);
        hasTitle = true;
      } else if (title.classList.contains('style-title--headline-2')) {
        const h2 = document.createElement('h2');
        h2.textContent = titleText;
        textWithMediaBlockData1.push(h2);
        hasTitle = true;
      } else if (title.classList.contains('style-title--headline-3')) {
        const h3 = document.createElement('h2');
        h3.textContent = titleText;
        textWithMediaBlockData1.push(h3);
        hasTitle = true;
      } else {
        const h4 = document.createElement('h2');
        h4.textContent = titleText;
        textWithMediaBlockData1.push(h4);
        hasTitle = true;
      }
    });

    if (!hasEybrow) {
      const eyebrow = document.createElement('p');
      eyebrow.textContent = '&nbsp;';
      textWithMediaBlockData1.unshift(eyebrow);
    }
    if (!hasTitle) {
      const title = document.createElement('p');
      title.textContent = '&nbsp;';
      textWithMediaBlockData1.splice(1, 0, title); 
    }

    const description = element.querySelector('.cmp-text').textContent;
    const para = document.createElement('p');
    para.textContent = description;
    textWithMediaBlockData1.push(para);
	  const para3 = document.createElement("p");
    const node3 = document.createTextNode("&nbsp;");
    para3.appendChild(node3);
    textWithMediaBlockData1.push(para3);

    textWithMediaBlockData.push(textWithMediaBlockData1);
    const image = element.querySelector('.cmp-image .cmp-image__image');
    const imageSrc = element.querySelector('.cmp-image .cmp-image__image').getAttribute('src');
    const imageAltTxt = element.querySelector('.cmp-image .cmp-image__image').getAttribute('alt');
    const pictureTag = document.createElement('picture');
    pictureTag.appendChild(image);
    textWithMediaBlockData.push(pictureTag);

    const link = element.querySelector('.cmp-button')?.getAttribute('href');
    const linkLabel = element.querySelector('.cmp-button .cmp-button__text')?.textContent;
    const aTag = document.createElement('a');
    aTag.setAttribute('href', link);
    aTag.innerText = linkLabel;
    textWithMediaBlockData.push(aTag);
    const paraAnaly = document.createElement('p');
    paraAnaly.textContent = "Analytics Details";
    textWithMediaBlockData.push(paraAnaly);

    textWithMediaBlock.push(textWithMediaBlockData);

    const textWithMediaTableLeft = WebImporter.DOMUtils.createTable(textWithMediaBlock, document);
    element.replaceWith(textWithMediaTableLeft);

  });



};
const createTextWithMediaRight = (main, document) => {
  const elements = document.querySelectorAll('[data-tracking-regionid*="item-image-text-teaser-right"]');
  elements.forEach(element => {
    const textWithMediaBlock = [];
    const name = ['Text With Media'];
    textWithMediaBlock.push(name);
    const textWithMediaBlockData = [];
    textWithMediaBlockData.push("right");
    const textWithMediaBlockData1 = [];

    const titles = element.querySelectorAll('.title');
    let hasEybrow = false;
    let hasTitle = false;
    titles.forEach(title => {
      const titleText = title.querySelector('.cmp-title').textContent;
      let titleStyle = '';
      if (title.classList.contains('style-title__text--eyebrow2-bold')) {
        titleStyle = 'Eyebrow Bold 2';
        const eyebrow = document.createElement('h4');
        eyebrow.textContent = titleText;
        textWithMediaBlockData1.push(eyebrow);
        hasEybrow = true;
      } else if (title.classList.contains('style-title__text--eyebrow1-bold')) {
        titleStyle = 'Eyebrow Bold 1';
        const eyebrow = document.createElement('h4');
        eyebrow.textContent = titleText;
        textWithMediaBlockData1.push(eyebrow);
        hasEybrow = true;
      } else if (title.classList.contains('style-title--iconization-1')) {
        titleStyle = 'Iconization';
        const eyebrow = document.createElement('h4');
        eyebrow.textContent = titleText;
        textWithMediaBlockData1.push(eyebrow);
        hasEybrow = true;
      } else if (title.classList.contains('style-title--headline-1')) {
        const h1 = document.createElement('h2');
        h1.textContent = titleText;
        textWithMediaBlockData1.push(h1);
        hasTitle = true;
      } else if (title.classList.contains('style-title--headline-2')) {
        const h2 = document.createElement('h2');
        h2.textContent = titleText;
        textWithMediaBlockData1.push(h2);
        hasTitle = true;
      } else if (title.classList.contains('style-title--headline-3')) {
        const h3 = document.createElement('h2');
        h3.textContent = titleText;
        textWithMediaBlockData1.push(h3);
        hasTitle = true;
      } else {
        const h4 = document.createElement('h2');
        h4.textContent = titleText;
        textWithMediaBlockData1.push(h4);
        hasTitle = true;
      }
    });

    if (!hasEybrow) {
      const eyebrow = document.createElement('p');
      eyebrow.textContent = '&nbsp;';
      textWithMediaBlockData1.unshift(eyebrow);
    }
    if (!hasTitle) {
      const title = document.createElement('p');
      title.textContent = '&nbsp;';
      textWithMediaBlockData1.splice(1, 0, title); 
    }

    const description = element.querySelector('.cmp-text').textContent;
    const para = document.createElement('p');
    para.textContent = description;
    textWithMediaBlockData1.push(para);
	const para3 = document.createElement("p");
    const node3 = document.createTextNode("&nbsp;");
    para3.appendChild(node3);
    textWithMediaBlockData1.push(para3);


    textWithMediaBlockData.push(textWithMediaBlockData1);
    const image = element.querySelector('.cmp-image .cmp-image__image');
    const imageSrc = element.querySelector('.cmp-image .cmp-image__image').getAttribute('src');
    const imageAltTxt = element.querySelector('.cmp-image .cmp-image__image').getAttribute('alt');
    const pictureTag = document.createElement('picture');
    pictureTag.appendChild(image);
    textWithMediaBlockData.push(pictureTag);

    const link = element.querySelector('.cmp-button')?.getAttribute('href');
    const linkLabel = element.querySelector('.cmp-button .cmp-button__text')?.textContent;
    const aTag = document.createElement('a');
    aTag.setAttribute('href', link);
    aTag.innerText = linkLabel;
    textWithMediaBlockData.push(aTag);

    const paraAnaly = document.createElement('p');
    paraAnaly.textContent = "Analytics Details";
    textWithMediaBlockData.push(paraAnaly);

    textWithMediaBlock.push(textWithMediaBlockData);

    const textWithMediaTable = WebImporter.DOMUtils.createTable(textWithMediaBlock, document);
    element.replaceWith(textWithMediaTable);

  });

};

const createVideo = (main, document) => {
  const videoDivs = document.querySelectorAll('.video');
  const filteredVideoDivs = Array.from(videoDivs).filter((div) => !div.closest('.cmp-multi-content, .carousel, [data-tracking-regionid*="item-image-text-teaser-right"], [data-tracking-regionid*="item-image-text-teaser-left"] ,[data-tracking-regionid*=standalone-highlight-feature-video]'));
  filteredVideoDivs.forEach((video) => {
    const videoElem = video.querySelector('.cmp-video__video-player');
    const videoTitle = videoElem.getAttribute('aria-label');
    const videoDesc = videoElem.getAttribute('aria-description');
    let deskVideoPath;
    let mobVideoPath;
    if (videoElem.hasAttribute('data-src-large')) {
      deskVideoPath = videoElem.getAttribute('data-src-large');
    } else {
      deskVideoPath = videoElem.getAttribute('src');
    }
    const paraDeskVideoPath = document.createElement("p");
    const aTag1 = document.createElement('a');
    aTag1.setAttribute('href', deskVideoPath);
    aTag1.innerText = deskVideoPath;
    paraDeskVideoPath.appendChild(aTag1);

    if (videoElem.hasAttribute('data-src-medium')) {
      mobVideoPath = videoElem.getAttribute('data-src-medium');
    } else {
      mobVideoPath = videoElem.getAttribute('src');
    }
    const paraMobVideoPath = document.createElement("p");
    const aTag2 = document.createElement('a');
    aTag2.setAttribute('href', deskVideoPath);
    aTag2.innerText = deskVideoPath;
    paraMobVideoPath.appendChild(aTag2);

    const imgPath = video.querySelector('.cmp-video__video');
    const img = imgPath.querySelector('img');
    const deskPosterImgPath = img.getAttribute('src');
    const mobPosterImgPath = img.getAttribute('src');
    const pictureDesk = document.createElement('picture');
    const paraDeskImg = document.createElement("p");
    const el = document.createElement('img');
    el.src = deskPosterImgPath;
    pictureDesk.appendChild(el);
    paraDeskImg.appendChild(pictureDesk);

    const pictureMob = document.createElement('picture');
    const paraMobImg = document.createElement("p");
    const e2 = document.createElement('img');
    e2.src = mobPosterImgPath;
    pictureMob.appendChild(e2);
    paraMobImg.appendChild(pictureMob);
    const loopVideo = 'TRUE';
    const autoplay = 'TRUE';
    const videoControls = 'FALSE';
    const videoMuted = 'TRUE';

    const videoCell = [
      ["Video"],
      [videoTitle],
      [videoDesc],
      [paraDeskVideoPath],
      [paraMobVideoPath],
      [paraDeskImg],
      [paraMobImg],
      [loopVideo],
      [autoplay],
      [videoControls],
      [videoMuted]
    ];

    const videoTable = WebImporter.DOMUtils.createTable(videoCell, document);
    video.replaceWith(videoTable);
  });
};

const createDefaultContent = (main, document) => {

  const copyText = document.querySelectorAll('.cmp-text');
  const descArr = [];
  const defaultCopytext = Array.from(copyText).filter((div) => !div.closest('.cmp-multi-content, .backgroundmedia, .carousel, .cmp-globalnavigation,[data-tracking-regionid*="item-image-text-teaser-right"],.style-text--disclaimer-1,[data-tracking-regionid*="standalone-disclaimer"],[data-tracking-regionid*="drivetrain switch"],[data-tracking-regionid*="item-image-text-teaser-left"],[data-tracking-regionid*="footer"],[data-tracking-regionid*="modeloverview"],[data-tracking-regionid*="standalone-drivetrain-switch"]'));
  defaultCopytext.forEach((desc) => {
    const description = desc?.textContent;
    const para = document.createElement('p');
    para.textContent = description;
	desc.replaceWith(para);
	
  });


  const titles = document.querySelectorAll('.title');
  const defaultTitles = Array.from(titles).filter((div) => !div.closest('.cmp-multi-content, .backgroundmedia, .carousel, .cmp-globalnavigation,[data-tracking-regionid*="item-image-text-teaser-right"],.style-text--disclaimer-1,[data-tracking-regionid*="standalone-disclaimer"],[data-tracking-regionid*="drivetrain switch"],[data-tracking-regionid*="item-image-text-teaser-left"],[data-tracking-regionid*="footer"],[data-tracking-regionid*="modeloverview"],[data-tracking-regionid*="standalone-drivetrain-switch"]'));
  defaultTitles.forEach((title) => {

    const titleText = title.querySelector('.cmp-title')?.textContent;
    let titleStyle = '';
    let headlineStyle = '';
    if (title.classList.contains('style-title__text--eyebrow2-bold')) {
      titleStyle = 'Eyebrow Bold 2';
      const eyebrow = document.createElement('p');
      eyebrow.textContent = titleText;
      title.replaceWith(eyebrow)
    } else if (title.classList.contains('style-title__text--eyebrow1-bold')) {
      titleStyle = 'Eyebrow Bold 1';
      const eyebrow = document.createElement('p');
      eyebrow.textContent = titleText;
      title.replaceWith(eyebrow)
    } else if (title.classList.contains('style-title--iconization-1')) {
      titleStyle = 'Iconization';
      const eyebrow = document.createElement('p');
      eyebrow.textContent = titleText;
      title.replaceWith(eyebrow)
    } else if (title.classList.contains('style-title--headline-1')) {
      headlineStyle = 'Headline 1';
      const h1 = document.createElement('h1');
      h1.textContent = titleText;
      title.replaceWith(h1)
    } else if (title.classList.contains('style-title--headline-2')) {
      headlineStyle = 'Headline 2';
      const h2 = document.createElement('h2');
      h2.textContent = titleText;
      title.replaceWith(h2)
    } else if (title.classList.contains('style-title--headline-3')) {
      headlineStyle = 'Headline 3';
      const h3 = document.createElement('h3');
      h3.textContent = titleText;
      title.replaceWith(h3)
    }

  });

  // default buttons
  const buttons = document.querySelectorAll('.button');
  const defaultButtons = Array.from(buttons).filter((div) => !div.closest('.cmp-multi-content, .backgroundmedia, .carousel, .cmp-globalnavigation,[data-tracking-regionid*="item-image-text-teaser-right"],.style-text--disclaimer-1,[data-tracking-regionid*="standalone-disclaimer"],[data-tracking-regionid*="drivetrain switch"],[data-tracking-regionid*="item-image-text-teaser-left"],[data-tracking-regionid*="footer"],[data-tracking-regionid*="modeloverview"],[data-tracking-regionid*="standalone-drivetrain-switch"]'));
  defaultButtons.forEach((button) => {
    const link = button.querySelector('.cmp-button')?.getAttribute('href');
    const linkLabel = button.querySelector('.cmp-button .cmp-button__text')?.textContent;
    const aTag = document.createElement('a');
    aTag.setAttribute('href', link);
    aTag.innerText = linkLabel;
    const strongTag = document.createElement('strong');
    const para3 = document.createElement("p");
    para3.appendChild(strongTag);
    strongTag.appendChild(aTag);
    button.replaceWith(aTag)

  });
  
  
  const images = document.querySelectorAll('.cmp-image .cmp-image__image');
  const defaultImg = Array.from(images).filter((div) => !div.closest('.cmp-multi-content, .backgroundmedia, .carousel, .cmp-globalnavigation,[data-tracking-regionid*="item-image-text-teaser-right"],.style-text--disclaimer-1,[data-tracking-regionid*="standalone-disclaimer"],[data-tracking-regionid*="drivetrain switch"],[data-tracking-regionid*="item-image-text-teaser-left"],[data-tracking-regionid*="footer"],[data-tracking-regionid*="modeloverview"],[data-tracking-regionid*="standalone-drivetrain-switch"]'));
  defaultImg.forEach((img) => {
    const imageSrc = img?.getAttribute('src');
    const imageAltTxt = img?.getAttribute('alt');
    const pictureTag = document.createElement('picture');
    pictureTag.appendChild(img);
    const para3 = document.createElement("p");
    para3.appendChild(pictureTag);
    // img.replaceWith(para3);

  });

};

const createCarousel = (main, document) => {
  const listOfMediaCarousel = document.querySelectorAll('.carousel .cmp-carousel');
  listOfMediaCarousel.forEach((mediaCarousel) => {
    let isMediaCarousel = true;
    if (!mediaCarousel.querySelectorAll('.cmp-text').length > 0) {
      isMediaCarousel = false;
    }
    const carouselBlock = [];
    const videoGalleryBlock = [];
    let name;
    if (isMediaCarousel) {
      name = ['Media Carousel'];
      carouselBlock.push(name);
    } else {
      name = ['Video Gallery'];
      videoGalleryBlock.push(name)
    }
    const mediaCarouselContent = mediaCarousel.querySelector('.cmp-carousel__content');
    const mediaSlides = mediaCarouselContent.querySelectorAll('.swiper-slide.swiper-slide--slide');
    if (mediaSlides) {
      mediaSlides.forEach((slide) => {
        let carouselType = '';
        const carouselVideoData = [];
        const carouselRow = [];
        const videoGalleryData = [];
        const videoGalleryRow = [];

        if (slide.querySelector('.cmp-video__video-player')) {
          carouselType = 'video-carousel';
          carouselRow.push(carouselType);

        }
        if (slide.querySelector('.cmp-image .cmp-image__image')) {
          carouselType = 'image-carousel';
          carouselRow.push(carouselType);
        }
        const headline = slide.querySelector('.title .cmp-title')?.textContent || '';
        const copyText = slide.querySelector('.text .cmp-text')?.textContent || '';

        const h2 = document.createElement('h2');
        h2.textContent = headline;
        const p = document.createElement('p');
        p.textContent = copyText;

        const contentArray = [];
        if (headline) {
          contentArray.push(h2);
          if (!isMediaCarousel) {
            const h4 = document.createElement('h4');
            h4.textContent = headline;
            videoGalleryData.push(h4);
          }
        }
        if (copyText)
          contentArray.push(p);
        if (contentArray.length > 0)
          carouselRow.push(contentArray);
        if (slide.querySelector('.cmp-video__video-player')) {
          const videoTitle = slide.querySelector('.cmp-video__video-player')?.getAttribute('aria-label');
          const paraTitle = document.createElement("p");
          const nodeTitle = document.createTextNode(videoTitle);
          if (videoTitle)
            paraTitle.appendChild(nodeTitle);
          const videoDescription = slide.querySelector('.cmp-video__video-player')?.getAttribute('aria-description');
          const paraDesc = document.createElement("p");
          const nodeDesc = document.createTextNode(videoDescription);
          if (videoDescription)
            paraDesc.appendChild(nodeDesc);
          const dsktpPosterImgPath = slide.querySelector('.cmp-video__video img')?.getAttribute('src');
          const para3 = document.createElement("p");
		const pictureDesk = document.createElement('picture');

          const el = document.createElement('img');
          el.src = dsktpPosterImgPath;
          if (dsktpPosterImgPath)
			pictureDesk.appendChild(el);
            para3.appendChild(pictureDesk);
		
		
          const mblPosterImgPath = slide.querySelector('.cmp-video__video img')?.getAttribute('src');
          const para4 = document.createElement("p");
		  const pictureMob = document.createElement('picture');
          const e2 = document.createElement('img');
          e2.src = mblPosterImgPath;
          if (mblPosterImgPath)
			pictureMob.appendChild(e2);
            para4.appendChild(pictureMob);
		
		
          const desktopVideoPath = slide.querySelector('.cmp-video__video-player')?.getAttribute('data-src-large');
          const paraVideoPath = document.createElement("p");
			const aTag1 = document.createElement('a');
			aTag1.setAttribute('href', desktopVideoPath);
			aTag1.innerText = desktopVideoPath;
		 
          if (desktopVideoPath)
			paraVideoPath.appendChild(aTag1);
		
          const mobileVideoPath = slide.querySelector('.cmp-video__video-player').getAttribute('src') || slide.querySelector('.cmp-video__video-player').getAttribute('data-src-medium');
           const paraMobVideoPath = document.createElement("p");
			const aTag2 = document.createElement('a');
			aTag2.setAttribute('href', desktopVideoPath);
			aTag2.innerText = desktopVideoPath;
				paraMobVideoPath.appendChild(aTag2);
			
          const h1 = document.createElement('h1');
          h1.textContent = "true";
          const h2 = document.createElement('h2');
          h2.textContent = "true";
          const h3 = document.createElement('h1');
          h3.textContent = "true";
          if (!isMediaCarousel) {
            h3.textContent = "false";
          }
          const h4 = document.createElement('h4');
          h4.textContent = "true";
          // Log video details if needed
			const h5 = document.createElement('h5');
          h5.textContent = "false";
		  const h6 = document.createElement('h6');
          h6.textContent = "true";
          carouselVideoData.push(paraTitle, paraDesc, paraVideoPath, paraMobVideoPath, para3, para4, h1, h2, h3, h4);
          carouselRow.push(carouselVideoData);
          if (!isMediaCarousel) {
            videoGalleryData.push(paraTitle, paraDesc, paraVideoPath, paraMobVideoPath, para3, para4, h1, h2, h5, h6);
          //  console.log(videoGalleryData)
          }
        }

        if (slide.querySelector('.cmp-image .cmp-image__image')) {
          const imgSrc = slide.querySelector('.cmp-image .cmp-image__image').getAttribute('src');
          const imgAlt = slide.querySelector('.cmp-image .cmp-image__image').getAttribute('alt');
          // Log image details if needed
          if (imgSrc) {
			const picture = document.createElement('picture');
            const el = document.createElement('img');
            el.src = imgSrc;

            if (imgAlt)
            el.alt = imgAlt;
			picture.appendChild(el);
            carouselRow.push(picture);
          }
        }

        const link = slide.querySelector('.button .cmp-button')?.getAttribute('href');
        const linkLabel = slide.querySelector('.cmp-button .cmp-button__text')?.textContent;
        if (link && linkLabel) {
          const aTag = document.createElement('a');
          aTag.setAttribute('href', link);
          aTag.innerText = linkLabel;
          carouselRow.push(aTag);
        }

        if (carouselRow.length > 0) {
          carouselBlock.push(carouselRow);
        }
        if (!isMediaCarousel) {
          videoGalleryRow.push(videoGalleryData)
          videoGalleryBlock.push(videoGalleryRow)
        }
      });
    }
    if (isMediaCarousel) {
      const carouselTable = WebImporter.DOMUtils.createTable(carouselBlock, document);
      mediaCarousel.replaceWith(carouselTable);
    } else {
      const videoGalleryTable = WebImporter.DOMUtils.createTable(videoGalleryBlock, document);
      mediaCarousel.replaceWith(videoGalleryTable)
    }

  });
};



const createSection = (main, document) => {
const root = document.querySelector('.root, #main, [role="main"]');
const sectionDivs = root.querySelectorAll('.container.responsivegrid.aem-GridColumn--default--12 > div[data-tracking-regionid]');
const sectionArr = [...sectionDivs].filter((a)=>{
    const flexibleWidthSection = a.querySelector('div[data-tracking-regionid*="section intro full"], div[data-tracking-regionid*="standalone-frequently-asked-questions"], div.accordion, div.contentnavigation,div.drivetrainswitch,div.modelnavigation,div.technicaldata,div.tabs,div.cmp-globalnavigation,div[data-tracking-regionid*="drivetrain switch"]')
    return !flexibleWidthSection
})
const arr = [];
sectionArr.forEach(sec=>{
  arr.push(sec.parentElement)
})
//console.log(arr)
arr.forEach(s=>{
  const cells = [
          ['Section Metadata'],
          ['style', 'alignment-center'],
		  ['sectionbgcolor', 'white'],
		  ['fixedsectiontopmargin', true]
        ];
        const table = WebImporter.DOMUtils.createTable(cells, document);
        s.append(table);
        const hr = document.createElement('hr');
        s.append(hr);
})
};

const createColumns = (main, document) => {
  const root = document.querySelector('.root, #main, [role="main"]');
const a = root.querySelectorAll('.aem-Grid.aem-Grid--12.aem-Grid--small--12.aem-Grid--default--12')
const defaultCol = Array.from(a).filter((div) => !div.closest('.cmp-multi-content, .backgroundmedia, .carousel,.accordion,.tabs,.cmp-globalnavigation,[data-tracking-regionid*="item-image-text-teaser-right"], [data-tracking-regionid*="item-image-text-teaser-left"],[data-tracking-regionid*="footer"],[data-tracking-regionid*="drivetrain switch"],[data-tracking-regionid*="modeloverview"]'))
const arr = [];
defaultCol.forEach((c)=>{
    const d = c.querySelector('.cmp-multi-content,.accordion,.tabs, .backgroundmedia, .carousel, .cmp-globalnavigation, [data-tracking-regionid*="item-image-text-teaser-left"],[data-tracking-regionid*="footer"],[data-tracking-regionid*="drivetrain switch"],[data-tracking-regionid*="modeloverview"]')
    const columnDirect = c.querySelector('div > .aem-GridColumn--default--3, div > .aem-GridColumn--default--4, div > .aem-GridColumn--default--6')
    if(columnDirect && !d) {
        arr.push(columnDirect.parentElement);
    }
})
const columns = [...new Set(arr)];
columns.forEach((column)=>{
  const columnBlock = [];
  const columnTitle = ['Columns (center)'];
  const ColumnTable = [];
  columnBlock.push(columnTitle);
  const columnDivs = column.children;
  [...columnDivs].forEach((div)=>{
    const divArr = [];
    const copyText = div.querySelector('.text')?.textContent;
    const titles = div.querySelectorAll('.title');
    const image = div.querySelector('.cmp-image .cmp-image__image');
    const pictureTag = document.createElement('picture');
    pictureTag.append(image);
    const para2 = document.createElement("p");
    para2.appendChild(pictureTag);
    const link = div.querySelector('.cmp-button')?.getAttribute('href');
    const linkLabel = div.querySelector('.cmp-button')?.textContent;
    const aTag = document.createElement('a');
    aTag.setAttribute('href', link);
    aTag.innerText = linkLabel;
    const para3 = document.createElement('p');
    para3.appendChild(aTag);
    if(image) {
      divArr.push(para2);
    }
    [...titles].forEach(t => {
      const title = t.querySelector('.cmp-title')?.textContent;
      if (t.classList.contains('style-title--headline-1')) {
        const h1 = document.createElement('h2');
        h1.textContent = title
        divArr.push(h1);
      } else if(t.classList.contains('style-title--headline-2')) {
        const h2 = document.createElement('h2');
        h2.textContent = title
        divArr.push(h2);
      } else if(t.classList.contains('style-title--headline-3')) {
        const h3 = document.createElement('h2');
        h3.textContent = title
        divArr.push(h3);
      } else {
        const para1 = document.createElement('p');
        para1.textContent = title;
        divArr.push(para1);
      }
    })
    const copyTextPara = document.createElement('p');
    copyTextPara.textContent = copyText;
    divArr.push(copyTextPara);
   
    if(link != null) {
      divArr.push(para3);
    }
    ColumnTable.push(divArr);
  })
  columnBlock.push(ColumnTable);  
    const table = WebImporter.DOMUtils.createTable(columnBlock, document);
    column.replaceWith(table);
})
};

const createflexibleWidthSection = (main, document) => {
  const root = document.querySelector('.root, #main, [role="main"]');
  const flexibleWidthSections = root.querySelectorAll('div[data-tracking-regionid*="section intro full"], div[data-tracking-regionid*="standalone-frequently-asked-questions"], div.cmp-accordion ');
  const flexibleSectionArr = [];
  if(flexibleWidthSections){
    flexibleWidthSections.forEach(flexibleSection=>{
    flexibleSectionArr.push(flexibleSection.parentElement);
    })
  }
  flexibleSectionArr.forEach(s=>{
    //table creation 
    const cells = [
        ['Section Metadata'],
		['name', 'Flexible Width Section'],
		['model', 'flexible-width-section'],
		['filter', 'flexible-width-section'],
        ['sectionwidth', 'grid-10'],
        ['sectionalignment', 'center'],
		['sectionbgcolor', 'white'],
		['sectiontopmargin', true]
      ];
      const table = WebImporter.DOMUtils.createTable(cells, document);
      s.append(table);
      const hr = document.createElement('hr');
      s.append(hr);
  })
};


const createMultiContentGallery = (main, document) => {
	const multicontentgallery = document.querySelectorAll('.multicontentgallery .cmp-multi-content');
[...multicontentgallery].forEach((slide) => {
  const mediaArr = slide.querySelector('.cmp-multi-content__slider--media').children;
  const contentArr = slide.querySelector('.cmp-multi-content__slider--content').children;
	const mcgBlock = [];
    const name = ['Multicontent Gallery'];
    mcgBlock.push(name);
  const p = [...contentArr].map((e, i) => {
	    const carouselVideoData = [];
        const carouselRow = [];
		const carouselContentData = [];

	const headline = e.querySelector('.cmp-title')?.textContent;
	const h4 = document.createElement("h4");
	h4.textContent = headline;
	carouselContentData.push(h4);
    const copyText = e.querySelector('.cmp-text__paragraph')?.textContent;
	const para = document.createElement("p");
    const node = document.createTextNode(copyText);
	para.appendChild(node);
	carouselContentData.push(para);

	carouselVideoData.push(carouselContentData);

    const videoPlayer = mediaArr[i].querySelector('.cmp-video__video-player');
	 const mcgVideoBlockData = [];
    const videoTitle = videoPlayer?.getAttribute('aria-label');
	const paraTitle = document.createElement("p");
      const nodeTitle = document.createTextNode(videoTitle);
      if (videoTitle)
        paraTitle.appendChild(nodeTitle);
	
    const videoDesc = videoPlayer?.getAttribute('aria-description');
	  const paraDesc = document.createElement("p");
      const nodeDesc = document.createTextNode(videoDesc);
      if (videoDesc)
        paraDesc.appendChild(nodeDesc);
	
    const deskVideoPath = videoPlayer?.getAttribute('data-src-large');
	const paraVideoPath = document.createElement("p");
      const aTag1 = document.createElement('a');
      aTag1.setAttribute('href', deskVideoPath);
	   aTag1.setAttribute('title', videoTitle);
      aTag1.innerText = videoDesc;
      paraVideoPath.appendChild(aTag1);
	  
    let mobVideoPath;
    let buttonStyle;
    if (videoPlayer?.hasAttribute('data-src-medium')) {
      mobVideoPath = videoPlayer?.getAttribute('data-src-medium');
    } else {
      mobVideoPath = videoPlayer?.getAttribute('src')?.replace('blob:', '');
    }
	  const paraMobVideoPath = document.createElement("p");
      const aTag2 = document.createElement('a');
      aTag2.setAttribute('href', deskVideoPath);
      aTag2.innerText = deskVideoPath;
      paraMobVideoPath.appendChild(aTag2);
	
    const ImgPath = mediaArr[i].querySelector('.cmp-video__video');
    const img = ImgPath?.querySelector('img');
    const deskPosterImgPath = img?.getAttribute('src');
	const pictureDesk = document.createElement('picture');
      const paraDeskImg = document.createElement("p");
      const el = document.createElement('img');
      el.src = deskPosterImgPath;
      pictureDesk.appendChild(el);
      paraDeskImg.appendChild(pictureDesk);
    
	const mobPosterImgPath = img?.getAttribute('src');
	const pictureMob = document.createElement('picture');
	const paraMobImg = document.createElement("p");
    const e2 = document.createElement('img');
    e2.src = mobPosterImgPath;
    if (mobPosterImgPath)
    pictureMob.appendChild(e2);
    paraMobImg.appendChild(pictureMob);
	
	const p1 = document.createElement('p');
      p1.textContent = "true";
      const p2 = document.createElement('p');
      p2.textContent = "true";  
  mcgVideoBlockData.push(paraVideoPath, paraMobVideoPath, paraDeskImg, paraMobImg, p1, p2);
    carouselVideoData.push(mcgVideoBlockData);
		
    const link = e.querySelector('.cmp-button')?.getAttribute('href');
    const linkLabel = e.querySelector('.cmp-button__text')?.textContent;
	if(link && linkLabel){
     const aTag = document.createElement('a');
    aTag.setAttribute('href', link);
    aTag.innerText = linkLabel;
    const strongTag = document.createElement('strong');
    strongTag.appendChild(aTag);
	carouselVideoData.push(strongTag);
	}else{
		carouselVideoData.push("<p></p>")
	}
    mcgBlock.push(carouselVideoData);
  });
  const mcgTable = WebImporter.DOMUtils.createTable(mcgBlock, document);
	slide.replaceWith(mcgTable);
});
};

