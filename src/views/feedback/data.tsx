import { FormSchema } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export const schemas: FormSchema[] = [
  {
    field: 'member',
    label: t('component.feedback.member'),
    component: 'Input',
    componentProps: {
      placeholder: t('common.inputText'),
      allowClear: true,
    },
    colProps: { span: 6 },
  },
  {
    field: 'date',
    label: t('component.feedback.date'),
    component: 'RangePicker',
    componentProps: {
      allowClear: true,
      format: 'YYYY-MM-DD ',
      valueFormat: 'YYYY-MM-DD',
      placeholder: [t('common.startDate'), t('common.endDate')],
    },
    colProps: { span: 6 },
  },
];

export const columns: BasicColumn[] = [
  { title: t('component.feedback.date'), dataIndex: 'createdAt', width: 200 },
  { title: t('component.feedback.member'), dataIndex: 'createdBy', width: 200 },
  { title: t('component.feedback.phone'), dataIndex: 'createdBy', width: 200 },
  { title: t('component.feedback.question'), dataIndex: 'createdBy', width: 200 },
  // { title: t('component.feedback.title'), dataIndex: 'title' },
  { title: t('component.feedback.content'), dataIndex: 'content' },
  { title: t('component.feedback.email'), dataIndex: 'mail' },
  { title: t('common.action'), dataIndex: 'action', width: 100 },
];
