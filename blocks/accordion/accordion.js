export default async function decorate(block) {
  const panels = [...block.children];
  const accordionContainer = document.createElement('div');
  accordionContainer.classList.add('accordion-container');
  // loop through all children blocks
  [...panels]?.forEach((panel) => {
    const [accordionLabel, copyText, accorCollapes] = panel.children;
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(accordionLabel);
    const body = copyText;
    body.className = 'accordion-item-body';
    const details = document.createElement('details');
    details.className = 'accordion-item';
    const collapse = accorCollapes.textContent.trim() === 'true';
    // collapse by default if toggle is on
    if (collapse) {
      details.setAttribute('open', '');
    }
    panel.textContent = '';
    details.append(summary, body);
    panel.append(details);
  });
}
