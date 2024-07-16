const createMetadata = (main, document) => {
    createBackgroundMedia(main, document);
    createAccordion(main, document);
    createTextWithMediaLeft(main, document);
    createTextWithMediaRight(main, document);
    createVideo(main, document);
	createCarousel(main, document);
    createDefaultContent(main, document);
    const meta = {};
    const title = document.querySelector('title');
    if (title) {
        meta.Title = title.innerHTML.replace(/[\n\t]/gm, '');
    }
    const desc = document.querySelector('meta[name="description"]');
    console.log(desc.content);
    if (desc) {
        meta.Description = desc.content;
    }
    const img = document.querySelector('meta[name="image"]');
    if (img) {
        const el = document.createElement('img');
        el.src = img.content;
        meta.Image = el;
    }
    console.log(meta);
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
            '.accordion',
            '.container',
            '.backgroundmedia',
            '.carousel'
        ]);

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
 
        const titles = bgmedia.querySelectorAll('.title');
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
                } else  {
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
                h2.textContent = "big";
                backgroundMediaBlockData1.push(h2);
                backgroundMediaBlockData.push(backgroundMediaBlockData1);
 
            }
 
            if (i == 2) {
                const copyText = title.querySelector('.cmp-title__text')?.textContent;
                let subBrandIconType = title.querySelector('.cmp-title__image-branding')?.getAttribute('title');
                if (subBrandIconType && subBrandIconType.toLowerCase() == 'bmw i') {
                    subBrandIconType = 'subbrandi';
                } else if (subBrandIconType && subBrandIconType.toLowerCase() == 'bmw m') {
                    subBrandIconType = 'subbrandm';
                } else {
                    subBrandIconType = 'noicon';
                }
                if (copyText)
                    backgroundMediaBlockData.push(subBrandIconType);
                    backgroundMediaBlockData.push(copyText);
            }
        });
 
   
        let mediaImagetitle;
        let mediaImageDescription;
       
 
        const mediaImageCmp = bgmedia.querySelector('.cmp-image .cmp-image__image');
        if (mediaImageCmp) {
            mediaImagetitle = bgmedia.querySelector('.cmp-title .cmp-title__text')?.textContent;
            if(mediaImagetitle) {
                let subBrandIconType = bgmedia.querySelector('.cmp-title__image-branding')?.getAttribute('title');
                if (subBrandIconType && subBrandIconType.toLowerCase() == 'bmw i') {
                        subBrandIconType = 'subbrandi';
                } else if (subBrandIconType && subBrandIconType.toLowerCase() == 'bmw m') {
                    subBrandIconType = 'subbrandm';
                } else {
                    subBrandIconType = 'noicon';
                }
                backgroundMediaBlockData.push(mediaImagetitle);
				backgroundMediaBlockData.push(subBrandIconType);

            }
            mediaImageDescription = bgmedia.querySelector('.cmp-text .cmp-text__paragraph')?.textContent;
            if(mediaImageDescription) {
                backgroundMediaBlockData.push(mediaImageDescription);
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
            if(videoTitle)
            paraTitle.appendChild(nodeTitle);
            const videoDescription = bgmedia.querySelector('.cmp-video__video-player').getAttribute('aria-description');
            const paraDesc = document.createElement("p");
            const nodeDesc = document.createTextNode(videoDescription);
            if(videoDescription)
            paraDesc.appendChild(nodeDesc);
            const dsktpPosterImgPath = bgmedia.querySelector('.cmp-video__video img')?.getAttribute('src');
            const para3 = document.createElement("p");
            const el = document.createElement('img');
            el.src = dsktpPosterImgPath;
            if(dsktpPosterImgPath)
            para3.appendChild(el);
            const mblPosterImgPath = bgmedia.querySelector('.cmp-video__video img')?.getAttribute('src');
            const para4 = document.createElement("p");
            const e2 = document.createElement('img');
            e2.src = mblPosterImgPath;
            if(mblPosterImgPath)
            para3.appendChild(e2);
            const desktopVideoPath = bgmedia.querySelector('.cmp-video__video-player').getAttribute('data-src-large');
            const para5 = document.createElement("p");
            const node5 = document.createTextNode(desktopVideoPath);
            if(desktopVideoPath)
            para5.appendChild(node5);
            let mobileVideoPath = bgmedia.querySelector('.cmp-video__video-player').getAttribute('data-src-medium');
            if (!mobileVideoPath) {
                mobileVideoPath = bgmedia.querySelector('.cmp-video__video-player').getAttribute('src');
            }
 
            const para6 = document.createElement("p");
            const node6 = document.createTextNode(mobileVideoPath);
            if(mobileVideoPath)
            para6.appendChild(node6);
            const h1 = document.createElement('h1');
            h1.textContent = "true";
            const h2 = document.createElement('h2');
            h2.textContent = "true";
            backgroundMediaVideoBlockData.push(paraTitle, paraDesc, para3, para4, para5, para6, h1, h2);
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
            if(imgSrc)
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
 
        }
 
        backgroundMediaBlock.push(backgroundMediaBlockData);
        console.log(backgroundMediaBlock);
        const backgroundMediaTable = WebImporter.DOMUtils.createTable(backgroundMediaBlock, document);
        main.append(backgroundMediaTable);
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
        main.append(accordianTable);

        const accordiancells = [
            ['Section Metadata'],
            ['sectionwidth', 'grid-6'], //replace with query later
            ['sectionalignment', 'left'],
            ['sectiontopmargin', true],
        ];
        const table = WebImporter.DOMUtils.createTable(accordiancells, document); //replace with putting back at the same position
        main.append(table);
        const hr = document.createElement('hr');
        main.append(hr);

    });

};

const createTextWithMediaLeft = (main, document) => {
    const elements1 = document.querySelectorAll('[data-tracking-regionid*="item-image-text-teaser-left"]');
    elements1.forEach(element => {
        const textWithMediaBlock = [];
        const name = ['Text With Media'];
        textWithMediaBlock.push(name);
        const textWithMediaBlockData = [];
        textWithMediaBlockData.push("text-with-image, left");
        const textWithMediaBlockData1 = [];

        const titles = element.querySelectorAll('.title');
        titles.forEach(title => {
            const titleText = title.querySelector('.cmp-title').textContent;
            let titleStyle = '';
            if (title.classList.contains('style-title__text--eyebrow2-bold')) {
                titleStyle = "Eyebrow Bold 2";
            } else if (element.classList.contains('style-title__text--eyebrow1-bold')) {
                titleStyle = "Eyebrow Bold 1";
            } else if (element.classList.contains('style-title--iconization-1')) {
                titleStyle = 'Iconization';
            }

            if (element.classList.contains('style-title--headline')) {
                const h2 = document.createElement('h2');
                h2.textContent = titleText;
                textWithMediaBlockData1.push(h2);
            } else {
                const h4 = document.createElement('h4');
                h4.textContent = titleText;
                textWithMediaBlockData1.push(h4);
            }

        });
        const description = element.querySelector('.cmp-text').textContent;
        const para = document.createElement('p');
        para.textContent = description;
        textWithMediaBlockData1.push(para);


        textWithMediaBlockData.push(textWithMediaBlockData1);
        const image = element.querySelector('.cmp-image .cmp-image__image');
        const imageSrc = element.querySelector('.cmp-image .cmp-image__image').getAttribute('src');
        const imageAltTxt = element.querySelector('.cmp-image .cmp-image__image').getAttribute('alt');
        textWithMediaBlockData.push(image);

        const link = element.querySelector('.cmp-button').getAttribute('href');
        const linkLabel = element.querySelector('.cmp-button .cmp-button__text').textContent;
        const aTag = document.createElement('a');
        aTag.setAttribute('href', link);
        aTag.innerText = linkLabel;
        textWithMediaBlockData.push(aTag);
        textWithMediaBlockData.push('analytics Details');

        textWithMediaBlock.push(textWithMediaBlockData);

        const textWithMediaTableLeft = WebImporter.DOMUtils.createTable(textWithMediaBlock, document);
        main.append(textWithMediaTableLeft);
        const cellsTextLeft = [
            ['Section Metadata'],
            ['style', 'alignment-center'],
            ['fixedsectiontopmargin', true]
        ];
        const tableTextLeft = WebImporter.DOMUtils.createTable(cellsTextLeft, document);
        main.append(tableTextLeft);
        const hr = document.createElement('hr');
        main.append(hr);

    });



};
const createTextWithMediaRight = (main, document) => {
    const elements = document.querySelectorAll('[data-tracking-regionid*="item-image-text-teaser-right"]');
    elements.forEach(element => {
        const textWithMediaBlock = [];
        const name = ['Text With Media'];
        textWithMediaBlock.push(name);
        const textWithMediaBlockData = [];
        textWithMediaBlockData.push("text-with-image, right");
        const textWithMediaBlockData1 = [];

        const titles = element.querySelectorAll('.title');
        titles.forEach(title => {
            const titleText = title.querySelector('.cmp-title').textContent;
            let titleStyle = '';
            if (title.classList.contains('style-title__text--eyebrow2-bold')) {
                titleStyle = "Eyebrow Bold 2";
            } else if (element.classList.contains('style-title__text--eyebrow1-bold')) {
                titleStyle = "Eyebrow Bold 1";
            } else if (element.classList.contains('style-title--iconization-1')) {
                titleStyle = 'Iconization';
            }

            if (element.classList.contains('style-title--headline')) {
                const h2 = document.createElement('h2');
                h2.textContent = titleText;
                textWithMediaBlockData1.push(h2);
            } else {
                const h4 = document.createElement('h4');
                h4.textContent = titleText;
                textWithMediaBlockData1.push(h4);
            }

        });
        const description = element.querySelector('.cmp-text').textContent;
        const para = document.createElement('p');
        para.textContent = description;
        textWithMediaBlockData1.push(para);


        textWithMediaBlockData.push(textWithMediaBlockData1);
        const image = element.querySelector('.cmp-image .cmp-image__image');
        const imageSrc = element.querySelector('.cmp-image .cmp-image__image').getAttribute('src');
        const imageAltTxt = element.querySelector('.cmp-image .cmp-image__image').getAttribute('alt');
        textWithMediaBlockData.push(image);

        const link = element.querySelector('.cmp-button').getAttribute('href');
        const linkLabel = element.querySelector('.cmp-button .cmp-button__text').textContent;
        const aTag = document.createElement('a');
        aTag.setAttribute('href', link);
        aTag.innerText = linkLabel;
        textWithMediaBlockData.push(aTag);
        textWithMediaBlockData.push('analytics Details');

        textWithMediaBlock.push(textWithMediaBlockData);

        const textWithMediaTable = WebImporter.DOMUtils.createTable(textWithMediaBlock, document);
        main.append(textWithMediaTable);
        const cells = [
            ['Section Metadata'],
            ['style', 'alignment-center'],
            ['fixedsectiontopmargin', true]
        ];
        const table = WebImporter.DOMUtils.createTable(cells, document);
        main.append(table);
        const hr = document.createElement('hr');
        main.append(hr);


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
			deskVideoPath = videoElem.getAttribute('src')?.replace('blob:', '');
        }
        if (videoElem.hasAttribute('data-src-medium')) {
            mobVideoPath = videoElem.getAttribute('data-src-medium');
        } else {
            mobVideoPath = videoElem.getAttribute('src')?.replace('blob:', '');
        }
        const imgPath = video.querySelector('.cmp-video__video');
        const img = imgPath.querySelector('img');
        const deskPosterImgPath = img?.getAttribute('src');
		const mobPosterImgPath = img?.getAttribute('src');
        const loopVideo = 'TRUE';
        const autoplay = 'TRUE';
        const videoControls = 'FALSE';
        const videoMuted = 'TRUE';

        const videoCell = [
            ["Video"],
            [videoTitle],
            [videoDesc],
            [deskVideoPath],
            [mobVideoPath],
            [mobPosterImgPath],
            [img],
            [loopVideo],
            [autoplay],
            [videoControls],
            [videoMuted]
        ];

        const videoTable = WebImporter.DOMUtils.createTable(videoCell, document);
        main.append(videoTable);
    });
};

const createDefaultContent = (main, document) => {

    const copyText = document.querySelectorAll('.cmp-text');
    const descArr = [];
    const defaultCopytext = Array.from(copyText).filter((div) => !div.closest('.cmp-multi-content, .backgroundmedia, .carousel, .cmp-globalnavigation,[data-tracking-regionid*="item-image-text-teaser-right"], [data-tracking-regionid*="item-image-text-teaser-left"],[data-tracking-regionid*="footer"],[data-tracking-regionid*="modeloverview"]'));
    defaultCopytext.forEach((desc) => {
        const description = desc?.textContent;
        const para = document.createElement('p');
        para.textContent = description;
        main.append(para);
    });


    const titles = document.querySelectorAll('.title');
    const defaultTitles = Array.from(titles).filter((div) => !div.closest('.cmp-multi-content, .backgroundmedia, .carousel, .cmp-globalnavigation,[data-tracking-regionid*="item-image-text-teaser-right"], [data-tracking-regionid*="item-image-text-teaser-left"],[data-tracking-regionid*="footer"],[data-tracking-regionid*="modeloverview"]'));
    defaultTitles.forEach((title) => {

        const titleText = title.querySelector('.cmp-title')?.textContent;
        let titleStyle = '';
        let headlineStyle = '';
        if (title.classList.contains('style-title__text--eyebrow2-bold')) {
            titleStyle = 'Eyebrow Bold 2';
            const eyebrow = document.createElement('p');
            eyebrow.textContent = titleText;
            main.append(eyebrow);

        } else if (title.classList.contains('style-title__text--eyebrow1-bold')) {
            titleStyle = 'Eyebrow Bold 1';
            const eyebrow = document.createElement('p');
            eyebrow.textContent = titleText;
            main.append(eyebrow);
        } else if (title.classList.contains('style-title--iconization-1')) {
            titleStyle = 'Iconization';
            const eyebrow = document.createElement('p');
            eyebrow.textContent = titleText;
            main.append(eyebrow);
        } else if (title.classList.contains('style-title--headline-1')) {
            headlineStyle = 'Headline 1';
            const h1 = document.createElement('h1');
            h1.textContent = titleText;
            main.append(h1);
        } else if (title.classList.contains('style-title--headline-2')) {
            headlineStyle = 'Headline 2';
            const h2 = document.createElement('h2');
            h2.textContent = titleText;
            main.append(h2);
        } else if (title.classList.contains('style-title--headline-3')) {
            headlineStyle = 'Headline 3';
            const h3 = document.createElement('h3');
            h3.textContent = titleText;
            main.append(h3);
        }

    });

    // default buttonsmodeloverview
    const buttons = document.querySelectorAll('.button');
    const defaultButtons = Array.from(buttons).filter((div) =>!div.closest('.cmp-multi-content, .backgroundmedia, .carousel, .cmp-globalnavigation,[data-tracking-regionid*="item-image-text-teaser-right"], [data-tracking-regionid*="item-image-text-teaser-left"],[data-tracking-regionid*="footer"],[data-tracking-regionid*="modeloverview"]'));
    defaultButtons.forEach((button) => {
        const link = button.querySelector('.cmp-button')?.getAttribute('href');
        const linkLabel = button.querySelector('.cmp-button .cmp-button__text')?.textContent;
        const aTag = document.createElement('a');
        aTag.setAttribute('href', link);
        aTag.innerText = linkLabel;
        const para3 = document.createElement("p");
        para3.appendChild(aTag);
        main.append(aTag);

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
                    const el = document.createElement('img');
                    el.src = dsktpPosterImgPath;
                    if (dsktpPosterImgPath)
                        para3.appendChild(el);
                    const mblPosterImgPath = slide.querySelector('.cmp-video__video img')?.getAttribute('src');
                    const para4 = document.createElement("p");
                    const e2 = document.createElement('img');
                    e2.src = mblPosterImgPath;
                    if (mblPosterImgPath)
                        para4.appendChild(e2);
                    const desktopVideoPath = slide.querySelector('.cmp-video__video-player')?.getAttribute('data-src-large');
                    const para5 = document.createElement("p");
                    const node5 = document.createTextNode(desktopVideoPath);
                    if (desktopVideoPath)
                        para5.appendChild(node5);
                    const mobileVideoPath = slide.querySelector('.cmp-video__video-player').getAttribute('src') || slide.querySelector('.cmp-video__video-player').getAttribute('data-src-medium');
                    const para6 = document.createElement("p");
                    const e4 = document.createElement('img');
                    e4.src = mobileVideoPath;
                    if (mobileVideoPath && !mobileVideoPath.startsWith('blob:'))
                        para6.appendChild(e4);
                    const h1 = document.createElement('h1');
                    h1.textContent = "true";
                    const h2 = document.createElement('h2');
                    h2.textContent = "true";
                    const h3 = document.createElement('h1');
                    h3.textContent = "true";
                    if (!isMediaCarousel) {
                        h3.textContent = "false";
                    }
                    const h4 = document.createElement('h2');
                    h4.textContent = "true";
                    // Log video details if needed
                    if (videoTitle) console.log('videoTitle:' + videoTitle);
                    if (videoDescription) console.log('videoDescp:' + videoDescription);
                    if (desktopVideoPath) console.log('videoDesktopPath:' + desktopVideoPath);
                    if (mobileVideoPath) console.log('videomobilepath:' + mobileVideoPath);
                    if (dsktpPosterImgPath) console.log('desktopPosterimg:' + dsktpPosterImgPath);
                    if (mblPosterImgPath) console.log('mobileposterimg:' + mblPosterImgPath);
                    carouselVideoData.push(paraTitle, paraDesc, para5, para6, para3, para4, h1, h2, h3, h4);
                    carouselRow.push(carouselVideoData);
                    if (!isMediaCarousel) {
                        videoGalleryData.push(paraTitle, paraDesc, para5, para6, para3, para4, h1, h2, h3, h4);
                        console.log(videoGalleryData)
                    }
                }
 
                if (slide.querySelector('.cmp-image .cmp-image__image')) {
                    const imgSrc = slide.querySelector('.cmp-image .cmp-image__image').getAttribute('src');
                    const imgAlt = slide.querySelector('.cmp-image .cmp-image__image').getAttribute('alt');
                    // Log image details if needed
                    if (imgSrc) {
                        const el = document.createElement('img');
                        el.src = imgSrc;
                        if (imgAlt)
                            el.alt = imgAlt;
                        carouselRow.push(el);
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
            main.append(carouselTable);
        } else {
            const videoGalleryTable = WebImporter.DOMUtils.createTable(videoGalleryBlock, document);
            main.append(videoGalleryTable);
        }
 
    });
};
 