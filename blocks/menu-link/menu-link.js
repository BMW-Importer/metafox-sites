export function geenerateMenulink(props) {
  const [linkLabel, linkTitle, link] = props;
  const logoDOM = document.createRange().createContextualFragment(`
     <a href="${link.textContent}" aria-label="${linkLabel.textContent}">
        ${linkTitle.textContent}
     </a>
    `);
  return logoDOM;
}

export default function decorate(block) {
  const props = [...block.children].map((row) => row.firstElementChild);
  const logoDOM = geenerateMenulink(props);
  block.textContent = '';
  block.append(logoDOM);
}
