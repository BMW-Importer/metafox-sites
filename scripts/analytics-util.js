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
  
  export function pushCustomLinkAnalyticData(prop) {
    const [
      analyticsLabel,
      primaryCategory,
      subCategory,
      blockName,
      sectionId,
      linkURL,
      linkName,
    ] = prop;
  
    const randomNum = 100000 + Math.random() * 900000;
    event_tracking.eventInfo.id = Math.floor(randomNum).toString();
  
    if (primaryCategory) {
      event_tracking.eventInfo.category.primaryCategory = primaryCategory;
    }
  
    if (subCategory) {
      event_tracking.eventInfo.category.subCategory = subCategory;
    }
  
    if (analyticsLabel) {
      event_tracking.eventInfo.category.linkName = analyticsLabel;
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
  
    window.adobeDataLayer.push(event_tracking);
  }
  
