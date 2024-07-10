const createMetadata = (main, document) => {
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
        accordion.append(table);
    });


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
        element.append(table);

    });

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

    });


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
            '.accordion',
            '.container'
        ]);

        return main;
    },
};