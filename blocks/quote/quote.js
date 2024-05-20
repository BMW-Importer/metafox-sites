export default function decorate(block) {
  const [quote, source] = block.children;
  quote.className = 'quote';
  source.className = 'source';
}
