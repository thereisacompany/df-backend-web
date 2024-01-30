import { withInstall } from '/@/utils';
import customUpload from './src/CustomUploadFile.vue'; //自訂上傳附件樣式
import basicUpload from './src/UploadFile.vue'; //antdv預設上傳附件樣式

export const CustomUpload = withInstall(customUpload);
export const BasicUpload = withInstall(basicUpload);
