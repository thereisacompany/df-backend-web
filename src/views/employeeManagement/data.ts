import { ref } from 'vue';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { Switch } from 'ant-design-vue';
import { showMsg } from '/@/utils/globalTips';
import { useI18n } from '/@/hooks/web/useI18n';
import { h } from 'vue';
import XEUtils from 'xe-utils';

import { positionOptions } from '/@/utils/options';

const { t } = useI18n();

export const roleId = ref('');
export const columns: BasicColumn[] = [
  { title: t('component.backend.jobId'), dataIndex: 'JobId' },
  { title: t('component.backend.name'), dataIndex: 'Name' },
  {
    title: t('component.backend.position'),
    dataIndex: 'PositionId',
    customRender: ({ record }) => {
      const array = XEUtils.filter(positionOptions, (item) => item.value === record.PositionId);
      const value = array.length > 0 ? array[0].label : '';
      return h('span', value);
    },
  },
  {
    title: t('component.backend.accountStatus'),
    dataIndex: 'status',
    customRender: ({ record }) => {
      return h(Switch, {
        checked: record.status === 1,
        checkedChildren: t('common.enable'),
        unCheckedChildren: t('common.disable'),
        loading: record.pendingStatus,
        async onChange() {
          record.status === 1 ? (record.status = 0) : (record.status = 1);
          showMsg('success', t('common.success'));
        },
      });
    },
  },
  { title: t('common.action'), dataIndex: 'action' },
];

export const filterSchemas: FormSchema[] = [
  {
    field: 'keywordType',
    component: 'Select',
    label: t('common.keyword'),
    colProps: {
      span: 3,
    },
    componentProps: ({}) => {
      return {
        options: [
          { label: t('component.backend.jobId'), value: 1 },
          { label: t('component.backend.name'), value: 2 },
        ],
      };
    },
  },
  {
    field: 'keyword',
    component: 'Input',
    label: '     ',
    colProps: {
      span: 4,
    },
    componentProps: {
      placeholder: t('common.inputText'),
      allowClear: true,
    },
  },
  {
    field: 'roleid',
    component: 'Select',
    label: t('component.backend.position'),
    colProps: {
      span: 7,
    },
    componentProps: {
      showSearch: true,
      options: options,
    },
  },
];
