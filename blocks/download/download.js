function getFileExtension(linkURL) {
  // Function to extract file extension from URL
  const lastDotIndex = linkURL.lastIndexOf('.');
  if (lastDotIndex === -1) return ''; // No file extension found
  return linkURL.substring(lastDotIndex + 1).toLowerCase();
}
function getSubCategory(fileExtension) {
  // Determine subCategory based on file extension
  switch (fileExtension) {
    case 'pdf':
      return 'PDF';
    case 'xls':
    case 'xlsx':
      return 'Excel';
    case 'doc':
    case 'docx':
      return 'Word';
    case 'svg':
      return 'SVG';
    case 'jpg':
    case 'jpeg':
      return 'JPEG';
    case 'png':
      return 'PNG';
    case 'mp4':
      return 'MP4';
    default:
      return 'Other'; // Default subcategory if file extension doesn't match
  }
}
function extractLinkName(anchorEle) {
  // Function to extract the link name (file name) from the anchor element
  const textContent = anchorEle.textContent.trim(); // Trim to remove leading/trailing spaces

  // Check if there's text content; otherwise, use href as the fallback
  return textContent.length > 0 ? textContent : anchorEle.href;
}
export default function decorate(block) {
  const anchorEle = block.querySelector('a');
  if (anchorEle) {
    const linkURL = anchorEle.href.toLowerCase();
    const fileExtension = getFileExtension(linkURL);
    const subCategory = getSubCategory(fileExtension);
    const linkName = extractLinkName(anchorEle);

    const blockNameElement = anchorEle.closest('.block');
    const blockName = blockNameElement ? blockNameElement.dataset.blockName : '';

    const eventInfo = { category: { linkURL } };
    anchorEle.target = '_blank';
    anchorEle.dataset.analyticsLabel = '';
    anchorEle.dataset.analyticsCategory = 'download';
    anchorEle.dataset.analyticsSubCategory = subCategory.toLowerCase();
    anchorEle.dataset.analyticsCustomClick = 'true';
    anchorEle.dataset.analyticsBlockName = blockName;
    anchorEle.dataset.analyticsSectionId = anchorEle.closest('.section').dataset.analyticsLabel;
    anchorEle.dataset.analyticsLinkName = linkName;
    anchorEle.dataset.analyticsLinkURL = linkURL;
    anchorEle.dataset.eventInfo = JSON.stringify(eventInfo);
    console.log('eventType:', 'custom.link');
    console.log('eventInfo.category.linkURL:', linkURL);
    console.log('subCategory:', subCategory);
    console.log('block:', blockName);
    console.log('section:', anchorEle.dataset.analyticsSectionId);
    console.log('linkName:', linkName);
    console.log('linkURL:', linkURL);
  }
}
