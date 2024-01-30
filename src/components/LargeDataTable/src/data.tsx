import XEUtils from 'xe-utils'; //函式庫文件：https://x-extends.gitee.io/xe-utils/#/

export function getFooterCellColorClass($columnIndex, footerList) {
  //月總表(關帳結算) 表尾顏色
  if (footerList.length > 0) {
    const num = XEUtils.toNumber(footerList[0][$columnIndex]);
    if (num === 0) {
    } else if (num > 0) {
      return 'positive-number-text-color';
    } else {
      return 'negative-number-text-color';
    }
  }
}
