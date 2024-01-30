import { FormSchema } from '/@/components/Form/index';
import { useI18n } from '/@/hooks/web/useI18n';
// import { userInfo } from '/@/utils/commonly';
import dayjs from 'dayjs';

//data
import { option } from '../../data';

const { t } = useI18n();
const theOption = [...option.types];
theOption.shift();
const addNewsType = theOption;
console.log('addNewsType', addNewsType);
export function schemas(disabled): FormSchema[] {
  return [
    {
      field: 'createdBy',
      label: t('component.news.publisher'),
      component: 'Input',
      // defaultValue: userInfo.realName,
      componentProps: {
        disabled: true,
      },
      colProps: { span: 12 },
    },
    {
      field: 'visibleAt',
      label: t('common.date'),
      required: true,
      component: 'DatePicker',
      defaultValue: dayjs().format('YYYY-MM-DD'),
      componentProps: {
        allowClear: false,
        valueFormat: 'YYYY-MM-DD',
        disabled: disabled,
      },
      colProps: { span: 12 },
    },
    {
      field: 'type',
      label: t('component.news.type'),
      required: true,
      defaultValue: 1,
      component: 'RadioButtonGroup',
      componentProps: {
        allowClear: false,
        maxlength: 1000,
        options: addNewsType,
        disabled: disabled,
      },
      colProps: { span: 12 },
    },
    {
      field: 'visible',
      label: t('component.news.publishStatus'),
      required: true,
      component: 'Switch',
      defaultValue: true,
      colProps: { span: 12 },
      componentProps: { disabled: disabled },
    },
    {
      field: 'title',
      label: t('component.member.title'),
      // required: true,
      component: 'Input',
      componentProps: {
        allowClear: false,
        showCount: true,
        maxlength: 100,
        disabled: disabled,
      },
      colProps: { span: 24 },
    },
    {
      field: 'content',
      label: t('component.member.textContent'),
      // required: true,
      component: 'InputTextArea',
      componentProps: {
        allowClear: false,
        showCount: true,
        maxlength: 1000,
        disabled: disabled,
        autoSize: { minRows: 11, maxRows: 11 },
      },
      colProps: { span: 24 },
    },
  ];
}
