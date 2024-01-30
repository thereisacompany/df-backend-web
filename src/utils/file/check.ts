export function checkIsImg(url) {
  return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
}
