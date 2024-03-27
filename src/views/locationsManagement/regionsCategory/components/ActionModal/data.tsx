import { FormSchema } from '/@/components/Form/index';
// import { Tinymce } from '/@/components/Tinymce/index';
// import { useMessage } from '/@/hooks/web/useMessage';
// import { getUtf8mb4Length } from '/@/utils/set';
// import { statusOptions, categoryOptions } from '/@/utils/options';
import { useI18n } from '/@/hooks/web/useI18n';
// import { filterOptionLabel } from '/@/utils/set';
// import dayjs from 'dayjs';

// const { notification } = useMessage();
import { h, ref } from 'vue';
const { t } = useI18n();

export const tinymceRef = ref();

export const schemas_step1: FormSchema[] = [
  {
    field: 'name',
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
    field: 'sort',
    label: t('common.sort'),
    component: 'InputNumber',
    componentProps: {
      min: 1,
    },
    colProps: { xs: 24, sm: 6, md: 6, lg: 4 },
  },

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

  {
    field: 'divider',
    label: '',
    component: 'Input',
    slot: 'customSlot',
    colProps: { span: 24 },
  },
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
