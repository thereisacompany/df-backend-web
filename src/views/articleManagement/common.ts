import XEUtils from 'xe-utils';
import { deleteNullInParams } from '/@/utils/parameters';
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

// 整合篩選參數
export function integrateParams(value, currentPage, pageSize) {
  const params = {
    beginDate: checkParams('beginDate', value.dateTime),
    endDate: checkParams('endDate', value.dateTime),
    keyword: checkParams('keyword', value.keyword),
    currentPage: currentPage - 1,
    pageSize: pageSize,
  };
  deleteNullInParams(params);
  return params;
}

// 檢查參數是否為null或undefined
function checkParams(key, value) {
  if (XEUtils.isNull(value) || XEUtils.isUndefined(value)) {
    return null;
  } else {
    if (key === 'beginDate') return dayjs(value[0]).format('YYYY-MM-DD');
    else if (key === 'endDate') return dayjs(value[1]).format('YYYY-MM-DD');
    else return value;
  }
}

// 共用篩選器
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

// 過濾編輯參數 只留下有編輯的欄位
export function checkEditFields(key, value, type, currentInfo) {
  // type.value 0新增 1編輯
  if (type === 0) {
    if (XEUtils.isNull(value) || XEUtils.isUndefined(value)) return null;
    else return value;
  } else {
    if (currentInfo[key] === value || XEUtils.isNull(value) || XEUtils.isUndefined(value))
      return null;
    else return value;
  }
}
