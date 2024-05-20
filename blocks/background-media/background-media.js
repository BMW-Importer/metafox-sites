import { generatebgImgDom } from "../background-image/background-image.js";
import { generatebgVideoDom } from "../background-video/background-video.js";

export default function decorate(block) {
    // get children blocks
    const bgMediaChildrens = [...block.children];
    block.textContent = '';

    // loop through each children block to extract props of it
    bgMediaChildrens.forEach((childrenBlock) => {
        const [generalProps, vidOrImgPros, cta1, cta2] = childrenBlock.children;
        childrenBlock.textContent = '';
        childrenBlock.classList.add('background-media-item');

        generalProps.classList.add("background-media-item-text");
        vidOrImgPros.classList.add("background-media-item-vidImg");
        cta1.classList.add("background-media-item-cta-money");
        cta2.classList.add("background-media-item-cta-ghost");

        // checking whether current childBlock is background-image or background-video
        if (vidOrImgPros?.children?.length === 1) {
            vidOrImgPros.classList.add('image');
            vidOrImgPros.append(generatebgImgDom(vidOrImgPros));
            childrenBlock.append(vidOrImgPros);
        }
        else {
            vidOrImgPros.classList.add('video');
            generatebgVideoDom(vidOrImgPros);
            childrenBlock.append(vidOrImgPros);
        }

        // fetching eyebrow, headline, class list details
        const [eyebrowText, headlineText, subBrancdIcon, copytext, classes] = generalProps.children;
        generalProps.textContent = '';
        const listOfClasses = classes.textContent.split(',');

        // adding class names to eyebrow and headline
        if(eyebrowText) eyebrowText.classList.add('background-media-item-text-eyebrow');
        if(headlineText) headlineText.classList.add('background-media-item-text-headline');
        if(copytext) copytext.classList.add('background-media-item-text-copytext');

        // if gradient is authored, then add it as classnames to image or video div
        if (listOfClasses) {
            listOfClasses.forEach((className) => {
                vidOrImgPros.classList.add(className);
            });
        }

        generalProps.append(eyebrowText || '');
        generalProps.append(headlineText || '');

        const detailAndBrandDiv = document.createElement('div');
        detailAndBrandDiv.classList.add('background-media-item-details');

        // if subrand icon is selected then add it as class
        if (subBrancdIcon) detailAndBrandDiv.classList.add(subBrancdIcon.textContent);
        detailAndBrandDiv.append(copytext || '');

        // append copyText detail
        generalProps.append(detailAndBrandDiv);

        // appending buttons
        generalProps.append(cta1);
        generalProps.append(cta2);

        childrenBlock.append(generalProps);

        // appending back child block back to main container
        block.append(childrenBlock);
    });
  }