import type { Rule } from 'ant-design-vue/es/form';
import { FormSchema } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table';
import { cloneDeep } from 'lodash-es';
import { useI18n } from '/@/hooks/web/useI18n';
import { isIP } from '/@/utils/is';
const { t } = useI18n();

const validatePass = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject(t('component.whitelist.enterIP'));
  } else if (isIP(value) == false) {
    return Promise.reject(t('component.whitelist.enterNumber'));
  } else {
    return Promise.resolve();
  }
};

export const schemas: FormSchema[] = [
  {
    field: 'Name',
    label: t('component.whitelist.officeName'),
    component: 'Input',
    componentProps: { placeholder: t('common.inputText'), allowClear: true },
    colProps: { span: 5 },
  },
  {
    field: 'IP',
    label: t('component.whitelist.address'),
    component: 'Input',
    componentProps: { placeholder: t('common.inputText'), allowClear: true },
    colProps: { span: 5 },
  },
];
export const formOption: any = {
  layout: 'vertical',
  labelWidth: 186,
  schemas: schemas,
  showActionButtonGroup: false,
  baseColProps: { span: 24 },
  baseRowStyle: { alignItems: 'end' },
  wrapperCol: { span: 23 },
};

export const columns: BasicColumn[] = [
  { title: t('component.whitelist.officeName'), dataIndex: 'Name' },
  { title: t('component.whitelist.address'), dataIndex: 'IP' },
  { title: t('common.action'), dataIndex: 'action' },
];
export const tableOption: any = {
  rowKey: 'id',
  columns,
  canResize: false,
  loading: true,
  showIndexColumn: false,
  striped: false,
};

export const modalFormOption: any = {
  layout: 'vertical',
  schemas: cloneDeep(schemas).map((e: any) => {
    e.colProps.span = 24;
    if (e.field === 'IP') {
      e.rules = [{ required: true, validator: validatePass, trigger: 'change' }];
      e.componentProps.showCount = true;
      e.componentProps.maxlength = 30;
    }
    return e;
  }),
  showActionButtonGroup: false,
};
