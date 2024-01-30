//設定回傳的value(含判斷數值是否為空)
export function setValue(value) {
  let result = '';
  value ? (result = value) : (result = '');
  return result;
}
//---*ant-select 下拉選項搜尋 ( label= 'text')
export const filterOption = (input: string, option: any) => {
  return option.text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
//---*ant-select 下拉選項搜尋 ( label= 'text')
export const filterOptionText = (input: string, option: any) => {
  return option.text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
//---*ant-select 下拉選項搜尋 ( label= 'label')
export const filterOptionLabel = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

//Utf8mb4計算字元數
export function getUtf8mb4Length(str) {
  let count = 0;

  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);

    if (code <= 0x7f) {
      count++;
    } else if (code <= 0x7ff) {
      count += 2;
    } else if (code <= 0xffff) {
      count += 3;
    } else {
      count += 4;
    }
  }

  return count;
}
