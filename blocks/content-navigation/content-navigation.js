export default function decorate(block) {
  const props = [...block.children].map((row) => row.firstElementChild);
  console.log(props);
}
