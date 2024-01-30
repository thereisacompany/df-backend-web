import { message } from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';
const { createConfirm, createMessage } = useMessage();

//共用確認視窗: interface
interface WindowData {
  //class
  class?: string;
  //按鈕樣式
  iconType?: 'warning' | 'success' | 'error' | 'info'; //delete
  //標題
  title?: string;
  //內容
  content: string;
  //ok按鈕樣式
  okType?: any; // 'link' | 'default' | 'primary' | 'ghost' | 'dashed' | 'text' | 'danger';
  //是否顯示取消按鈕
  showCancelButton?: boolean;
}

//上方列-提示(key = loading | success | error | warning)
export function showMsg(type: string, msg: string) {
  message[type](msg);
}

//確認視窗(iconType = success | error | warning)
export const showConfirm = createConfirm;

//上方列-提示(key = loading | success | error | warning)
export function loadMessage(type: string, msg: string) {
  switch (type) {
    case 'loading':
      createMessage.loading({ content: msg, duration: 0, key: 'saving' });
      break;
    case 'success':
      createMessage.success({ content: msg, key: 'saving' });
      break;
    case 'warning':
      createMessage.warning({ content: msg, key: 'saving' });
      break;
    case 'error':
      createMessage.error({ content: msg, key: 'saving' });
      break;
  }
}

/* 共用確認視窗(按鈕: 1.確認 2.取消) 
    1.props文件關鍵字 => export interface ModalFuncProps {
    2.詳細內容查看 => 共用確認視窗: interface
*/
export function commonConfirm(data: WindowData, okMethod?, cancelMethod?) {
  createConfirm({
    class: data.class ? data.class : '',
    iconType: data.iconType ? data.iconType : 'warning',
    title: data.title ? data.title : 'Oops',
    content: data.content,
    okType: data.okType ? data.okType : 'primary',
    okCancel: data.showCancelButton === null || undefined ? true : data.showCancelButton, //是否顯示取消按鈕
    onOk: async () => {
      if (okMethod) okMethod();
    },
    onCancel: async () => {
      if (cancelMethod) cancelMethod();
    },
  });
}
