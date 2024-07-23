// eslint-disable-next-line import/no-cycle

const event_tracking = {
    event: "custom.link",
    eventInfo: {
      id: "",
      category: {
        primaryCategory: "",
        subCategory: "",
        linkName: "",
        linkURL: "",
        subCategory2: "",
      },
      section: {
        sectionInfo: {
          sectionName: "",
          sectionID: "",
        },
      },
      block: {
        blockInfo: {
          blockName: "",
          blockDetails: "",
        },
      },
    },
  };

  function removeEmptyObjectKeys(obj) {
    for (const key in obj) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          removeEmptyObjectKeys(obj[key]);
            if (Object.keys(obj[key]).length === 0) {
                delete obj[key];
            }
        } else if (obj[key] === "") {
            delete obj[key];
        }
    }
  }
  
  export function pushCustomLinkAnalyticData(prop) {
    const [
      analyticsLabel,
      primaryCategory,
      subCategory,
      blockName,
      sectionId,
      linkURL,
      linkName,
      subCategory2,
    ] = prop;
  
    const randomNum = 100000 + Math.random() * 900000;
    event_tracking.eventInfo.id = Math.floor(randomNum).toString();
  
    if (primaryCategory) {
      event_tracking.eventInfo.category.primaryCategory = primaryCategory;
    }
  
    if (subCategory) {
      event_tracking.eventInfo.category.subCategory = subCategory;
    }

    if (subCategory2) {
      event_tracking.eventInfo.category.subCategory2 = subCategory2;
    }
  
    if (analyticsLabel) {
      event_tracking.eventInfo.block.blockInfo.blockDetails = analyticsLabel;
    }

    if(linkName) {
      event_tracking.eventInfo.category.linkName = linkName;
    }
  
    if (linkURL) {
      event_tracking.eventInfo.category.linkURL = linkURL;
    }
  
    if (blockName) {
      event_tracking.eventInfo.block.blockInfo.blockName = blockName;
    }
  
    if (sectionId) {
      event_tracking.eventInfo.section.sectionInfo.sectionID = sectionId;
    }

    removeEmptyObjectKeys(event_tracking);
  
    window.adobeDataLayer.push(event_tracking);
  }
  
