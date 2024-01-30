import { BasicColumn } from '/@/components/Table/src/types/table';
import { FormSchema } from '/@/components/Form';
import { useI18n } from '/@/hooks/web/useI18n';
import dayjs, { Dayjs } from 'dayjs';

const { t } = useI18n();
//---* 日期區間快選
type RangeValue = [Dayjs, Dayjs];
const yesterday = dayjs().subtract(1, 'day');
const firstDay = dayjs().startOf('month');
const lastDay = dayjs().endOf('month');
const tomorrow = dayjs().add(1, 'day');
// 上個月第一天
const lastMonthStart = dayjs().subtract(1, 'month').startOf('month');
// 上個月最後一天
const lastMonthEnd = dayjs().subtract(1, 'month').endOf('month');

// table欄位
export function tableColumns(): BasicColumn[] {
  return [
    {
      title: 'id',
      dataIndex: 'id',
      fixed: 'left',
      width: 30,
    },
    {
      title: `${t('component.articleManagement.keyword')} ${t(
        'component.articleManagement.tag',
      )}${t('common.name2')}`,
      dataIndex: 'name',
      width: 180,
      // align: 'left',
      editComponent: 'Input',
      editRow: true,
    },
    // {
    //   title: t('common.sort'),
    //   dataIndex: 'sort',
    //   width: 60,
    //   editComponent: 'Input',
    //   editRow: true,
    // },
    {
      title: t('common.createTime'),
      dataIndex: 'createdAt',
      width: 60,
    },
    // {
    //   title: t('component.articleManagement.articleCounts'),
    //   dataIndex: 'count',
    //   width: 80,
    // },
    {
      title: t('common.action'),
      key: 'action',
      dataIndex: 'action',
      width: 60,
    },
  ];
}

// 篩選器
export const filterSchema: FormSchema[] = [
  {
    field: 'keyword',
    component: 'Input',
    label: t('component.articleManagement.keyword'),
    colProps: {
      span: 5,
    },
    componentProps: {
      allowClear: true,
      maxlength: 50,
      showCount: true,
    },
  },
  {
    field: 'dateTime',
    component: 'RangePicker',
    label: t('component.chatRoom.dateRange'),
    // defaultValue: [yesterday, tomorrow] as RangeValue,
    // defaultValue: ['2023-08-01', '2023-08-31'],
    colProps: {
      span: 5,
    },
    componentProps: {
      allowClear: true,
      showTime: false,
      format: 'YYYY-MM-DD',
      onChange: () => {
        // handelChange();
      },
      ranges: {
        [t('common.today')]: [dayjs(), dayjs()] as RangeValue,
        [t('common.yesterday')]: [yesterday, yesterday] as RangeValue,
        [t('common.nearlyThreeDays')]: [yesterday, tomorrow] as RangeValue,
        [t('common.thisMonth')]: [firstDay, lastDay] as RangeValue,
        [t('common.lastMonth')]: [lastMonthStart, lastMonthEnd] as RangeValue,
      },
    },
    required: true,
  },
];

// modal form
export function schemas(disabled): FormSchema[] {
  return [
    {
      field: 'name',
      label: `${t('component.articleManagement.keyword')} ${t(
        'component.articleManagement.tag',
      )}${t('common.name2')}`,
      component: 'Input',
      required: true,
      componentProps: {
        disabled: disabled,
        maxlength: 255,
        showCount: true,
      },
      colProps: { span: 24 },
    },
    // {
    //   field: 'sort',
    //   label: t('common.sort'),
    //   component: 'InputNumber',
    //   required: true,
    //   componentProps: {
    //     disabled: disabled,
    //     min: 0,
    //     max: 99999,
    //     range: true,
    //   },
    //   colProps: { span: 12 },
    // },
    // {
    //   field: 'count',
    //   label: t('component.articleManagement.articleCounts'),
    //   component: 'InputNumber',
    //   componentProps: {
    //     disabled: true,
    //     min: 0,
    //     max: 99999,
    //     range: true,
    //   },
    //   colProps: { span: 12 },
    //   show: disabled,
    // },
  ];
}
