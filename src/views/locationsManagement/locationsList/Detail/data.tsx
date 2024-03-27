import { FormSchema } from '/@/components/Form/index';
import { Tinymce } from '/@/components/Tinymce/index';
import { useMessage } from '/@/hooks/web/useMessage';
import { getUtf8mb4Length } from '/@/utils/set';
import { statusOptions, categoryOptions } from '/@/utils/options';
import { useI18n } from '/@/hooks/web/useI18n';
import { filterOptionLabel } from '/@/utils/set';
import dayjs from 'dayjs';

const { notification } = useMessage();
import { h, ref } from 'vue';
const { t } = useI18n();

export const tinymceRef = ref();

export const schemas_step1: FormSchema[] = [
  {
    field: 'type',
    label: t('component.locationsManagement.type'),
    component: 'Select',
    required: true,
    componentProps: ({}) => {
      return {
        options: categoryOptions,
        filterOption: filterOptionLabel,
      };
    },
    colProps: { xs: 24, sm: 6, md: 6, lg: 4 },
  },
  {
    field: 'title',
    label: t('component.articleManagement.articleTitle'),
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: t('common.inputText'),
      allowClear: true,
      maxlength: 255,
      showCount: true,
    },
    colProps: { xs: 24, sm: 24, md: 24, lg: 24 },
  },
  {
    field: 'regions',
    label: t('component.locationsManagement.regions'),
    component: 'Select',
    required: true,
    componentProps: ({}) => {
      return {
        options: categoryOptions,
        filterOption: filterOptionLabel,
      };
    },
    colProps: { xs: 24, sm: 6, md: 6, lg: 4 },
  },
  {
    field: 'address',
    label: t('component.locationsManagement.address'),
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: t('common.inputText'),
      allowClear: true,
      maxlength: 100,
      showCount: true,
    },
    colProps: { xs: 24, sm: 24, md: 12, lg: 12 },
  },
  {
    field: 'business_hours',
    label: t('component.locationsManagement.business_hours'),
    component: 'Input',
    required: false,
    componentProps: {
      placeholder: t('common.inputText'),
      allowClear: true,
      maxlength: 100,
      showCount: true,
    },
    colProps: { xs: 24, sm: 24, md: 12, lg: 12 },
  },
  {
    field: 'phone',
    label: t('component.locationsManagement.phpone'),
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: t('common.inputText'),
      allowClear: true,
      maxlength: 100,
      showCount: true,
    },
    colProps: { xs: 24, sm: 24, md: 12, lg: 12 },
  },
  {
    field: 'latitude',
    label: t('component.locationsManagement.latitude'),
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: t('common.inputText'),
      allowClear: true,
      maxlength: 100,
      showCount: true,
    },
    colProps: { xs: 24, sm: 24, md: 12, lg: 12 },
  },
  {
    field: 'longitude',
    label: t('component.locationsManagement.longitude'),
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: t('common.inputText'),
      allowClear: true,
      maxlength: 100,
      showCount: true,
    },
    colProps: { xs: 24, sm: 24, md: 12, lg: 12 },
  },

  // {
  //   field: 'publishDate',
  //   label: t('component.articleManagement.publicationDate'),
  //   component: 'DatePicker',
  //   required: true,
  //   defaultValue: dayjs().format('YYYY-MM-DD'),
  //   componentProps: {
  //     placeholder: t('common.chooseText'),
  //     valueFormat: 'YYYY-MM-DD',
  //     disabled: true,
  //   },
  //   colProps: { xs: 24, sm: 6, md: 6, lg: 4 },
  // },
  // {
  //   field: 'sort',
  //   label: t('common.sort'),
  //   component: 'InputNumber',
  //   componentProps: {
  //     min: 1,
  //   },
  //   colProps: { xs: 24, sm: 6, md: 6, lg: 4 },
  // },
  // {
  //   field: 'isLatest',
  //   label: t('component.articleManagement.latest'),
  //   component: 'Select',
  //   defaultValue: 0,
  //   componentProps: {
  //     allowClear: false,
  //     placeholder: t('common.chooseText'),
  //     options: statusOptions,
  //   },
  //   colProps: { xs: 24, sm: 6, md: 6, lg: 4 },
  // },
  // {
  //   field: 'isFeatured',
  //   label: t('component.articleManagement.featured'),
  //   component: 'Select',
  //   defaultValue: 0,
  //   componentProps: {
  //     allowClear: false,
  //     placeholder: t('common.chooseText'),
  //     options: statusOptions,
  //   },
  //   colProps: { xs: 24, sm: 6, md: 6, lg: 4 },
  // },
  // {
  //   field: 'isTop',
  //   label: t('component.articleManagement.pinToTop'),
  //   component: 'Select',
  //   defaultValue: 0,
  //   componentProps: {
  //     allowClear: false,
  //     placeholder: t('common.chooseText'),
  //     options: statusOptions,
  //   },
  //   colProps: { xs: 24, sm: 6, md: 6, lg: 4 },
  // },
  // {
  //   field: 'isPublish',
  //   label: t('component.articleManagement.post'),
  //   component: 'Select',
  //   defaultValue: 0,
  //   componentProps: {
  //     allowClear: false,
  //     placeholder: t('common.chooseText'),
  //     options: statusOptions,
  //   },
  //   colProps: { xs: 24, sm: 6, md: 6, lg: 4 },
  // },
  // {
  //   field: 'divider',
  //   label: '',
  //   component: 'Input',
  //   slot: 'customSlot',
  //   colProps: { span: 24 },
  // },
  // {
  //   field: 'listImg',
  //   label: t('component.articleManagement.uploadListImages'),
  //   component: 'Input',
  //   required: false,
  //   slot: 'customSlot',
  //   colProps: { xs: 24, sm: 12, md: 8, lg: 8 },
  // },
  // {
  //   field: 'detailImg',
  //   label: t('component.articleManagement.uploadInnerPageImages'),
  //   component: 'Input',
  //   required: false,
  //   slot: 'customSlot',
  //   colProps: { xs: 24, sm: 12, md: 8, lg: 8 },
  // },
  // {
  //   field: 'thumbnailImg',
  //   label: t('component.articleManagement.pageThumbnailSettings'),
  //   component: 'Input',
  //   required: false,
  //   slot: 'customSlot',
  //   colProps: { xs: 24, sm: 12, md: 8, lg: 8 },
  // },
  // {
  //   field: 'divider',
  //   label: '',
  //   component: 'Input',
  //   slot: 'customSlot',
  //   colProps: { span: 24 },
  // },
  // {
  //   field: 'content',
  //   component: 'Input',
  //   label: t('component.articleManagement.contentDescription'),
  //   required: true,
  //   render: ({ model, field }) => {
  //     return h(Tinymce, {
  //       menubar: false,
  //       options: {},
  //       plugins: ['link lists image table media code'],
  //       toolbar: [
  //         'formatselect | bold italic link bullist numlist | outdent indent | image blockquote table media code undo redo',
  //       ],
  //       customSkin: 'oxide-dark',
  //       content_style: `blockquote {
  //         overflow: hidden;
  //         padding-right: 1.5em;
  //         padding-left: 1.5em;
  //         margin-left: 0;
  //         margin-right: 0;
  //         font-style: italic;
  //         border-left: 5px solid #ccc;
  //       }`,
  //       value: model[field],
  //       onChange: (value: string) => {
  //         model[field] = value;
  //         getChangeValue(value);
  //       },
  //       height: 290,
  //       ref: tinymceRef,
  //     });
  //   },
  //   colProps: { span: 24 },
  // },
];
export const schemas_step2: FormSchema[] = [
  // {
  //   field: 'gameSettings',
  //   label: t('component.articleManagement.relatedEventSettings'),
  //   component: 'Select',
  //   componentProps: {
  //     placeholder: t('common.chooseText'),
  //     options: [
  //       { value: 'Alaska', label: 'Alaska' },
  //       { value: 'Hawaii', label: 'Hawaii' },
  //       { value: 'Nevada', label: 'Nevada' },
  //     ],
  //     mode: 'multiple',
  //     filterOption: filterOptionLabel,
  //   },
  //   colProps: { span: 24 },
  // },
  // {
  //   field: 'keywordSettings',
  //   label: t('component.articleManagement.hotKeywordTagSettings'),
  //   component: 'Select',
  //   componentProps: {
  //     placeholder: t('common.chooseText'),
  //     options: [],
  //     mode: 'multiple',
  //     filterOption: filterOptionLabel,
  //   },
  //   colProps: { span: 24 },
  // },
  // {
  //   field: 'articleSettings',
  //   label: t('component.articleManagement.relatedArticleSettings'),
  //   component: 'Select',
  //   componentProps: {
  //     placeholder: t('common.chooseText'),
  //     options: [],
  //     mode: 'multiple',
  //     filterOption: filterOptionLabel,
  //   },
  //   colProps: { span: 24 },
  // },
];
export const schemas_step3: FormSchema[] = [
  {
    field: 'title',
    label: 'META:TITLE/OG:TITLE',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    field: 'keyword',
    label: 'META:KEYWORDS',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    field: 'description',
    label: 'META:DESCRIPTION/OG:DESCRIPTION',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    field: 'html',
    label: 'HEADER JS/HTML CODE',
    component: 'InputTextArea',
    componentProps: {
      rows: 4,
      maxlength: 6,
    },
    colProps: { span: 24 },
  },
];
export const schemas_step4: FormSchema[] = [
  {
    field: 'upload',
    label: '',
    component: 'Input',
    slot: 'customSlot',
    colProps: { span: 24 },
  },
];

function getChangeValue(value: any) {
  const characters = ref(0); //會議內容(編輯器)字數
  const charactersLimit = ref(3000000);

  if (typeof value == 'string') {
    // 過濾字串中的base64
    const doc = new DOMParser().parseFromString(value, 'text/html');
    const imgs = doc.getElementsByTagName('img');

    for (let i = 0; i < imgs.length; i++) {
      if (imgs[i].src.startsWith('data:image')) {
        imgs[i].src = `fakeSrc-${i}`;
      }
    }

    //  console.log('字數', getUtf8mb4Length(doc.body.innerHTML));
    //characters.value = editorWords;
    const submitDisable = ref(false); //新增按鈕Disable
    characters.value = getUtf8mb4Length(doc.body.innerHTML);
    if (characters.value > charactersLimit.value) {
      // 超過字數上限時出現提醒框
      notification.error({
        key: 'notification',
        message: '已超過字元數上限',
        description: '請重新編輯內容!',
        duration: null,
      });
      // 鎖住新增按鈕
      submitDisable.value = true;
    } else {
      notification.close('notification');
      submitDisable.value = false;
    }
  }
}
