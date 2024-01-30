export function getEmojis() {
  const list: any = [];
  for (let index = 0; index < 38; index++) {
    list.push(`http://192.168.3.11/photo/emoji/${index + 1}.png`);
  }
  return list;
}
